cmake_minimum_required(VERSION 3.10)
project(music_recommender)

set(CMAKE_CXX_STANDARD 17)

include_directories(include)
include_directories(lib)

add_executable(recommender
    src/main.cpp
    src/tag_analyzer.cpp
    src/author_recommender.cpp
)

target_link_libraries(recommender
    pthread
) 