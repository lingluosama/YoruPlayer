#pragma once
#include "types.h"

class AuthorRecommender {
public:
    static vector<AuthorRecommendation> getRecommendedAuthors(
        const vector<string>& preferred_tags,
        const json& history,
        int max_authors = 3
    );
    
private:
    static double calculateWeight(int count);
}; 