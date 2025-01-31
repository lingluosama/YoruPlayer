#pragma once
#include "types.h"

class TagAnalyzer {
public:
    static tuple<vector<string>, vector<int>, MatrixXd> processJsonData(const json& j);
    static vector<string> findFavoriteSongTags(const MatrixXd& reconstructed_matrix, 
                                             const vector<string>& tags);
    static double calculateConfidence(const MatrixXd& reconstructed_matrix);
    
private:
    static double calculateWeight(int count);
}; 