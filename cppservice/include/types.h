#pragma once
#include <string>
#include <vector>
#include <Eigen/Dense>
#include <nlohmann/json.hpp>

using namespace std;
using namespace Eigen;
using json = nlohmann::json;

// 基础推荐结果结构
struct RecommendationResult {
    vector<string> top_tags;
    double confidence_score;
};

// 推荐配置
struct RecommendConfig {
    int svd_components = 10;
    double similarity_threshold = 0.5;
}; 