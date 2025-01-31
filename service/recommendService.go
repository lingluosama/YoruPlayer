package service

import (
	"YoruPlayer/models/cppBlockResponse"
	"YoruPlayer/models/response"
	"YoruPlayer/service/query"
	"context"
)

func GetSingleTag(c context.Context, sid int64) ([]*string, error) {
	records, err := query.SangToTag.WithContext(c).Where(query.SangToTag.Sid.Eq(sid)).Find()
	if err != nil {
		return nil, err
	}
	var tags []*string
	for i := range records {
		tags = append(tags, &records[i].Tag)
	}
	return tags, nil
}
func GetSangListTag(c context.Context, lid int64) ([]*string, error) {
	records, err := query.SangListToTag.WithContext(c).Where(query.SangListToTag.Lid.Eq(lid)).Find()
	if err != nil {
		return nil, err
	}
	var tags []*string
	for i := range records {
		tags = append(tags, &records[i].Tag)
	}
	return tags, nil
}

func GenRecommendTag(c context.Context, uid int64) ([]*string, []*string, error) {
	history, err := QueryHistory(c, uid)
	if err != nil {
		return nil, nil, err
	}
	var res cppBlockResponse.RecommendData
	err = HttpUtils.DoPost(c, "http://localhost:4399/recommend", &history, &res)
	if err != nil {
		return nil, nil, err
	}
	return res.TopTags, res.RecommendedAuthors, nil

}

func GetRecommendSangs(c context.Context, uid int64) ([]*response.Single, error) {
	tags, _, err := GenRecommendTag(c, uid)
	if err != nil {
		return nil, err
	}

	tagstrings := convertPointersToStrings(tags)
	sangToTags, err := query.SangToTag.WithContext(c).
		Select(query.SangToTag.Sid, query.SangToTag.Tag.Count().As("tag_count")).
		Where(query.SangToTag.Tag.In(tagstrings...)).
		Group(query.SangToTag.Sid).
		Order(query.SangToTag.Tag.Count().Desc()).Find()
	if err != nil {
		return nil, err
	}
	var ids []int64
	for i := range sangToTags {
		ids = append(ids, sangToTags[i].Sid)
	}
	singles, err := query.Single.WithContext(c).Where(query.Single.Id.In(ids...)).Find()
	if err != nil {
		return nil, err
	}
	singleToResponse := ConvertSingleToResponse(singles)
	return singleToResponse, nil
}

func GetRecommendSangList(c context.Context, uid int64) ([]*response.SangList, error) {
	tags, _, err := GenRecommendTag(c, uid)
	if err != nil {
		return nil, err
	}
	tagstrings := convertPointersToStrings(tags)
	sangListToTags, err := query.SangListToTag.WithContext(c).Select(query.SangListToTag.Lid, query.SangListToTag.Tag.Count().As("tag_count")).
		Where(query.SangListToTag.Tag.In(tagstrings...)).
		Group(query.SangListToTag.Lid).
		Order(query.SangListToTag.Tag.Count().Desc()).Find()
	if err != nil {
		return nil, err
	}
	var ids []int64
	for i := range sangListToTags {
		ids = append(ids, sangListToTags[i].Lid)
	}
	sangLists, err := query.SangList.WithContext(c).Where(query.SangList.Id.In(ids...)).Find()
	if err != nil {
		return nil, err
	}
	res := convertSangListToResponse(sangLists)
	return res, nil

}

func GetRecommendAuthor(c context.Context, uid int64) ([]*response.Author, error) {
	_, Authors, err := GenRecommendTag(c, uid)
	if err != nil {
		return nil, err
	}

	authors := convertPointersToStrings(Authors)
	DbAuthor, err := query.Author.WithContext(c).Where(query.Author.Name.In(authors...)).Find()
	if err != nil {
		return nil, err
	}
	authorToResponse := convertAuthorToResponse(DbAuthor)
	return authorToResponse, nil

}
func convertPointersToStrings(tags []*string) []string {
	result := make([]string, len(tags))
	for i, tag := range tags {
		if tag != nil {
			result[i] = *tag
		}
	}
	return result
}

func HandleSearchTag(c context.Context, keyword string, offset int64, size int64) ([]*string, error) {
	find, err := query.Tag.WithContext(c).
		Where(query.Tag.Name.Like("%" + keyword + "%")).
		Offset(int(offset)).
		Limit(int(size)).Find()
	if err != nil {
		return nil, err
	}
	var tags []*string
	for _, tag := range find {
		tags = append(tags, &tag.Name)
	}
	return tags, nil

}
