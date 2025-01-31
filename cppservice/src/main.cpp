#define CROW_MAIN
#include<Eigen/Dense>
#include "crow_all.h"
#include <moduels.h>
#include <nlohmann/json.hpp>

using namespace std;
using namespace Eigen;
using json = nlohmann::json;

// 1. 声明所有函数
tuple<vector<string>, vector<int>, MatrixXd> processJsonData(const json& j);
vector<string> findFavoriteSongTags(const MatrixXd& reconstructed_matrix, const vector<string>& tags);
double calculateConfidence(const MatrixXd& reconstructed_matrix);

// 2. 结构体定义
struct RecommendationResult {
    vector<string> top_tags;
    double confidence_score;
};

struct RecommendConfig {
    int svd_components = 10;
    double similarity_threshold = 0.5;
};

// 添加作者推荐结构体
struct AuthorRecommendation {
    string author;
    vector<string> related_tags;
    int play_count;
    double relevance_score;
};

// 3.getEnhancedRecommendation实现
RecommendationResult getEnhancedRecommendation(const json& jsonData) {
    auto [tags, song_ids, tag_song_matrix] = processJsonData(jsonData);
    
    // 检查矩阵维度
    if (tag_song_matrix.rows() == 0 || tag_song_matrix.cols() == 0) {
        throw runtime_error("Empty matrix: No valid tags or songs found");
    }
    
    // SVD分解
    JacobiSVD<MatrixXd> svd(tag_song_matrix, ComputeThinU | ComputeThinV);
    
    // 降维处理
    int k = min(10, min(static_cast<int>(tag_song_matrix.rows()), 
                       static_cast<int>(tag_song_matrix.cols())));
    
    if (k == 0) {
        throw runtime_error("Invalid matrix dimensions for SVD");
    }
    
    MatrixXd U_k = svd.matrixU().leftCols(k);
    MatrixXd S_k = svd.singularValues().head(k).asDiagonal();
    MatrixXd V_k = svd.matrixV().leftCols(k);
    
    MatrixXd reconstructed_matrix = U_k * S_k * V_k.transpose();
    
    return RecommendationResult{
        .top_tags = findFavoriteSongTags(reconstructed_matrix, tags),
        .confidence_score = calculateConfidence(reconstructed_matrix)
    };
}

// 4. 最后是其他函数的实现
// processJsonData实现
// findFavoriteSongTags实现
// calculateConfidence实现

// 封装矩阵分解过程的函数
tuple<vector<string>, vector<int>, MatrixXd> processJsonData(const json& j) {
    if (j["Messages"].empty()) {
        throw runtime_error("No messages provided in input");
    }
    
    vector<string> tags;
    vector<int> song_ids;
    map<string, int> tag_indices;  // 用于记录标签索引
    
    // 第一次遍历：收集所有唯一标签和歌曲ID
    for (const auto& message : j["Messages"]) {
        if (!message["Tags"].is_null()) {
            for (const auto& tag : message["Tags"]) {
                if (tag_indices.find(tag) == tag_indices.end()) {
                    tag_indices[tag] = tags.size();
                    tags.push_back(tag);
                }
            }
        }
        // 只添加未添加过的歌曲ID
        int song_id = message["Single"]["id"];
        if (find(song_ids.begin(), song_ids.end(), song_id) == song_ids.end()) {
            song_ids.push_back(song_id);
        }
    }

    // 创建标签-歌曲矩阵
    MatrixXd tag_song_matrix = MatrixXd::Zero(tags.size(), song_ids.size());
    
    // 计算播放次数的权重
    auto calculateWeight = [](int count) -> double {
        if (count <= 1) return 1.0;
        if (count >= 10) return 0.0173;  // 约等于 1.0 * (2/3)^9
        
        // 计算(2/3)的count-1次方
        double weight = 1.0;
        for(int i = 1; i < count; i++) {
            weight *= (2.0/3.0);
        }
        return weight;
    };
    
    // 第二次遍历：填充矩阵，考虑播放次数
    for (const auto& message : j["Messages"]) {
        if (!message["Tags"].is_null()) {
            int song_index = distance(song_ids.begin(), 
                find(song_ids.begin(), song_ids.end(), (int)message["Single"]["id"]));
            int count = message["Count"];
            
            // 根据播放次数计算权重
            double weight = calculateWeight(count);
            
            for (const auto& tag : message["Tags"]) {
                int tag_index = tag_indices[tag];
                tag_song_matrix(tag_index, song_index) += weight;
            }
        }
    }

    if (tags.empty()) {
        throw runtime_error("No tags found in input");
    }
    
    if (song_ids.empty()) {
        throw runtime_error("No songs found in input");
    }
    
    return make_tuple(tags, song_ids, tag_song_matrix);
}

// 寻找最能代表用户喜好的歌曲标签
vector<string> findFavoriteSongTags(const MatrixXd& reconstructed_matrix, const vector<string>& tags) {
    if (tags.size() <= 3) {
        return tags;
    }
    
    // 1. 计算标签共现矩阵
    MatrixXd cooccurrence = reconstructed_matrix * reconstructed_matrix.transpose();
    
    // 2. 计算每个标签的频率得分
    VectorXd frequency_scores = reconstructed_matrix.rowwise().sum();
    double max_freq = frequency_scores.maxCoeff();  // 用于归一化
    
    // 3. 计算每个标签的总分数
    vector<pair<double, string>> tag_score_pairs;
    for(int i = 0; i < tags.size(); ++i) {
        // 计算与其他标签的共现得分
        double cooccurrence_score = 0;
        for(int j = 0; j < tags.size(); ++j) {
            if (i != j) {
                cooccurrence_score += cooccurrence(i, j);
            }
        }
        
        // 归一化频率得分
        double normalized_freq = frequency_scores(i) / max_freq;
        
        // 结合频率和共现关系
        double total_score = normalized_freq * 0.6 +  // 频率权重
                           (cooccurrence_score / (tags.size() - 1)) * 0.4;  // 共现权重
        
        tag_score_pairs.push_back({total_score, tags[i]});
    }
    
    // 按分数排序
    sort(tag_score_pairs.rbegin(), tag_score_pairs.rend());
    
    // 返回前3个最相关的标签
    vector<string> top_tags;
    int num_tags = min(3, static_cast<int>(tag_score_pairs.size()));
    for(int i = 0; i < num_tags; ++i) {
        top_tags.push_back(tag_score_pairs[i].second);
    }
    
    return top_tags;
}

// 计算推荐结果的置信度
double calculateConfidence(const MatrixXd& reconstructed_matrix) {
    // 基于矩阵的非零元素比例计算置信度
    double sparsity = reconstructed_matrix.count() / 
                     static_cast<double>(reconstructed_matrix.rows() * reconstructed_matrix.cols());
    
    // 如果标签数量很少，降低置信度
    double tag_penalty = (reconstructed_matrix.rows() < 3) ? 0.5 : 1.0;
    
    return min(0.95, sparsity * 2.0 * tag_penalty);  // 将置信度限制在0.95以内
}

// 获取推荐作者
vector<string> getRecommendedAuthors(
    const vector<string>& preferred_tags,
    const json& history,
    int max_authors = 3
) {
    // 作者统计信息
    struct AuthorStats {
        int total_plays = 0;
        map<string, int> tag_counts;
        double relevance_score = 0.0;
    };
    map<string, AuthorStats> author_stats;
    
    // 计算播放次数的权重
    auto calculateWeight = [](int count) -> double {
        if (count <= 1) return 1.0;
        if (count >= 10) return 0.0173;  // 约等于 1.0 * (2/3)^9
        
        // 计算(2/3)的count-1次方
        double weight = 1.0;
        for(int i = 1; i < count; i++) {
            weight *= (2.0/3.0);
        }
        return weight;
    };
    
    // 1. 统计每个作者的播放次数和标签
    for (const auto& message : history["Messages"]) {
        if (message["Tags"].is_null()) continue;
        
        string author = message["Single"]["author"];
        int count = message["Count"];
        
        // 更新播放次数
        author_stats[author].total_plays += count;
        
        // 计算当前播放记录的权重
        double weight = calculateWeight(count);
        
        // 更新标签统计
        for (const auto& tag : message["Tags"]) {
            author_stats[author].tag_counts[tag] += weight;
        }
    }
    
    // 2. 计算作者与偏好标签的相关性得分
    vector<pair<double, string>> author_scores;
    for (auto& [author, stats] : author_stats) {
        double tag_match_score = 0.0;
        
        for (const auto& preferred_tag : preferred_tags) {
            if (stats.tag_counts.count(preferred_tag) > 0) {
                tag_match_score += stats.tag_counts[preferred_tag];
            }
        }
        
        if (tag_match_score > 0) {
            author_scores.push_back({tag_match_score, author});
        }
    }
    
    // 3. 排序并选择top N
    sort(author_scores.rbegin(), author_scores.rend());
    
    // 4. 只返回作者名字
    vector<string> recommended_authors;
    int num_authors = min(max_authors, static_cast<int>(author_scores.size()));
    for (int i = 0; i < num_authors; ++i) {
        recommended_authors.push_back(author_scores[i].second);
    }
    
    return recommended_authors;
}

int main() {
    crow::SimpleApp app;

    CROW_ROUTE(app, "/recommend")
    .methods("POST"_method)
    ([&](const crow::request& req) {
        try {
            auto jsonData = json::parse(req.body);
            
            // 获取标签推荐
            auto result = getEnhancedRecommendation(jsonData);
            
            // 基于推荐标签获取作者推荐
            auto author_recommendations = getRecommendedAuthors(result.top_tags, jsonData);
            
            // 构建响应
            json response = {
                {"status", "success"},
                {"top_tags", result.top_tags},
                {"confidence", result.confidence_score},
                {"recommended_authors", author_recommendations}  // 直接使用字符串数组
            };
            
            return crow::response(200, response.dump());
        } catch (const exception& e) {
            json error_response = {
                {"status", "error"},
                {"message", e.what()}
            };
            return crow::response(500, error_response.dump());
        }
    });

    app.port(4399).multithreaded().run();
    return 0;
}
