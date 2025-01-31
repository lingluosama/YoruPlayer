#ifndef MY_STRUCT_H
#define MY_STRUCT_H
#include <string>
#include <vector>
#include <nlohmann/json.hpp>
using namespace std;
using json = nlohmann::json;

struct Tag {
    string key;
    string value;
};

struct TagContainer {
    vector<Tag> value;
};

struct Tags {
    vector<TagContainer> tags;
};

void to_json(json& j, const Tag& t);
void from_json(const json& j, Tag& t);

void to_json(json& j, const TagContainer& tc);
void from_json(const json& j, TagContainer& tc);

void to_json(json& j, const Tags& t);
void from_json(const json& j, Tags& t);

#endif // MY_STRUCT_H
