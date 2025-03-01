package service

import (
	"YoruPlayer/entity/Db"
	"YoruPlayer/models/response"
	"YoruPlayer/service/query"
	"context"
	"strconv"
)

func QuerySingle(c context.Context, begin int, size int, keyword *string) ([]*response.Single, int32, error) {

	db := query.Single.WithContext(c)

	if keyword != nil && *keyword != "" {
		db = db.Where(query.Single.Title.Like("%" + *keyword + "%"))
	}

	find, err := db.Limit(int(size)).Offset(int(begin)).Find()
	if err != nil {
		return nil, 0, err
	}
	count, err := db.Count()
	if err != nil {
		return nil, 0, err
	}
	return ConvertSingleToResponse(find), int32(count), nil
}
func ConvertSingleToResponse(singles []*Db.Single) []*response.Single {
	var responseSingles []*response.Single
	for _, single := range singles {
		responseSingles = append(responseSingles, &response.Single{
			Id:       strconv.FormatInt(single.Id, 10),
			Resource: single.Resource,
			Cover:    single.Cover,
			Title:    single.Title,
			Author:   single.Author,
			Length:   single.Length,
			AlbumId:  strconv.FormatInt(single.AlbumId, 10),
		})
	}
	return responseSingles
}

func QueryAlbum(c context.Context, begin int, size int, keyword *string) ([]*response.Album, int32, error) {
	db := query.Album.WithContext(c)

	if keyword != nil && *keyword != "" {
		db = db.Where(query.Album.Title.Like("%" + *keyword + "%"))
	}
	find, err := db.Limit(int(size)).Offset(int(begin)).Find()
	if err != nil {
		return nil, 0, err
	}
	count, err := db.Count()
	if err != nil {
		return nil, 0, err
	}

	responseAlbums := convertAlbumToResponse(find)
	return responseAlbums, int32(count), nil
}

func convertAlbumToResponse(albums []*Db.Album) []*response.Album {
	var responseAlbums []*response.Album
	for _, album := range albums {
		responseAlbums = append(responseAlbums, &response.Album{
			Id:          strconv.FormatInt(album.Id, 10),
			Title:       album.Title,
			Cover:       album.Cover,
			Author:      album.Author,
			Description: album.Description,
		})
	}
	return responseAlbums
}

func QuerySangList(c context.Context, begin int, size int, keyword *string) ([]*response.SangList, int32, error) {
	db := query.SangList.WithContext(c)

	if keyword != nil && *keyword != "" {
		db = db.Where(query.SangList.Title.Like("%" + *keyword + "%"))
	}
	find, err := db.Limit(int(size)).Offset(int(begin)).Find()
	if err != nil {
		return nil, 0, err
	}
	count, err := db.Count()
	if err != nil {
		return nil, 0, err
	}

	responseSangLists := convertSangListToResponse(find)
	return responseSangLists, int32(count), nil
}
func convertSangListToResponse(sangLists []*Db.SangList) []*response.SangList {
	var responseSangLists []*response.SangList
	for _, sangList := range sangLists {
		responseSangLists = append(responseSangLists, &response.SangList{
			Id:      strconv.FormatInt(sangList.Id, 10),
			Cover:   sangList.Cover,
			Creater: strconv.FormatInt(sangList.Creater, 10),
			Title:   sangList.Title,
		})
	}
	return responseSangLists
}

func convertTagsToResponse(tags []*Db.Tag) []*response.Tag {
	var responseTags []*response.Tag
	for _, tag := range tags {
		responseTags = append(responseTags, &response.Tag{
			Id:   strconv.FormatInt(tag.Id, 10),
			Name: tag.Name,
		})
	}
	return responseTags
}
func convertUserToResponse(users []*Db.User) []*response.User {
	var responseUsers []*response.User
	for _, user := range users {
		responseUsers = append(responseUsers, &response.User{
			Id:        strconv.FormatInt(user.Id, 10),
			Name:      user.Name,
			Avatar:    user.Avatar,
			Signature: user.Signature,
			Email:     user.Email,
			Authority: user.Authority,
		})
	}
	return responseUsers
}

func QueryTagList(c context.Context, begin int, size int, keyword *string) ([]*response.Tag, int32, error) {
	db := query.Tag.WithContext(c)
	if keyword != nil && *keyword != "" {
		db = db.Where(query.Tag.Name.Like("%" + *keyword + "%"))
	}
	find, err := db.Limit(size).Offset(begin).Find()
	if err != nil {
		return nil, 0, err
	}
	count, err := db.Count()
	if err != nil {
		return nil, 0, err
	}

	tagsToResponse := convertTagsToResponse(find)
	return tagsToResponse, int32(count), nil

}

func QueryAuthor(c context.Context, begin int, size int, keyword *string) ([]*response.Author, int32, error) {
	db := query.Author.WithContext(c)
	if keyword != nil && *keyword != "" {
		db = db.Where(query.Author.Name.Like("%" + *keyword + "%"))
	}

	find, err := db.Limit(int(size)).Offset(int(begin)).Find()
	if err != nil {
		return nil, 0, err
	}
	count, err := db.Count()
	if err != nil {
		return nil, 0, err
	}

	responseAuthors := convertAuthorToResponse(find)
	return responseAuthors, int32(count), nil
}
func QueryUser(c context.Context, begin int, size int, keyword *string) ([]*response.User, int32, error) {
	db := query.User.WithContext(c)
	if keyword != nil && *keyword != "" {
		db = db.Where(query.User.Name.Like("%" + *keyword + "%"))
	}

	find, err := db.Limit(int(size)).Offset(int(begin)).Find()
	if err != nil {
		return nil, 0, err
	}
	count, err := db.Count()
	if err != nil {
		return nil, 0, err
	}

	responseAuthors := convertUserToResponse(find)
	return responseAuthors, int32(count), nil

}
func convertAuthorToResponse(authors []*Db.Author) []*response.Author {
	var responseAuthors []*response.Author
	for _, author := range authors {
		responseAuthors = append(responseAuthors, &response.Author{
			Id:     strconv.FormatInt(author.Id, 10),
			Name:   author.Name,
			Avatar: author.Avatar,
		})
	}
	return responseAuthors
}

func QueryAlbumMessage(c context.Context, aid int64) (*response.AlbumDetail, error) {
	album, err := query.Album.WithContext(c).Where(query.Album.Id.Eq(aid)).First()
	if err != nil {
		return nil, err
	}
	find, err := query.Single.WithContext(c).Where(query.Single.AlbumId.Eq(aid)).Find()
	if err != nil {
		return nil, err
	}
	detail := &response.AlbumDetail{
		Album: response.Album{
			Id:          strconv.FormatInt(album.Id, 10),
			Title:       album.Title,
			Cover:       album.Cover,
			Author:      album.Author,
			Description: album.Description,
		},
		Singles: ConvertSingleToResponse(find),
	}
	return detail, nil

}

func GetSangListInfoById(c context.Context, lid int64) (*response.SangListDetailResponse, error) {
	SangList, err := query.SangList.WithContext(c).Where(query.SangList.Id.Eq(lid)).First()
	if err != nil {
		return nil, err
	}
	sangToLists, err := query.SangToList.Where(query.SangToList.LID.Eq(lid)).Find()
	if err != nil {
		return nil, err
	}

	sids := make([]int64, len(sangToLists))
	for i, sangToList := range sangToLists {
		sids[i] = sangToList.SID
	}
	singles, err := query.Single.Where(query.Single.Id.In(sids...)).Find()
	if err != nil {
		return nil, err
	}

	return &response.SangListDetailResponse{
		Singles: ConvertSingleToResponse(singles),
		SangList: response.SangList{
			Id:          strconv.FormatInt(SangList.Id, 10),
			Cover:       SangList.Cover,
			Creater:     strconv.FormatInt(SangList.Creater, 10),
			Title:       SangList.Title,
			Description: SangList.Description,
		},
	}, nil
}

func GetAuthorInfoByName(c context.Context, name string) (*response.Author, error) {
	first, err := query.Author.WithContext(c).Where(query.Author.Name.Eq(name)).First()
	if err != nil {
		return nil, err
	}
	author := response.Author{
		Id:     strconv.FormatInt(first.Id, 10),
		Name:   first.Name,
		Avatar: first.Avatar,
	}

	return &author, nil

}

func QueryAlbumNameWithIds(c context.Context, ids []*int64) ([]*string, error) {
	var res []*string
	for _, id := range ids {
		first, err := query.Album.WithContext(c).Where(query.Album.Id.Eq(*id)).First()
		var defaultTitle = "未知专辑"

		if err != nil {
			if err.Error() == "record not found" {
				res = append(res, &defaultTitle)
			} else {
				return nil, err
			}
		} else {
			if first != nil && &first.Title != nil {
				res = append(res, &first.Title)
			} else {
				res = append(res, &defaultTitle)
			}
		}
	}
	return res, nil
}

func GetAuthorPage(c context.Context, name string) (res *response.AuthorPageRes, err error) {
	author, err := query.Author.WithContext(c).Where(query.Author.Name.Eq(name)).First()
	if err != nil {
		return nil, err
	}
	Author := response.Author{
		Id:     strconv.FormatInt(author.Id, 10),
		Name:   author.Name,
		Avatar: author.Avatar,
	}
	singles, err := query.Single.WithContext(c).Where(query.Single.Author.Eq(name)).Offset(0).Limit(10).Find()
	if err != nil {
		return nil, err
	}
	Singles := ConvertSingleToResponse(singles)
	albums, err := query.Album.WithContext(c).Where(query.Album.Author.Eq(name)).Limit(5).Find()
	if err != nil {
		return nil, err
	}
	Albums := convertAlbumToResponse(albums)
	pageRes := response.AuthorPageRes{
		Author:    Author,
		SangList:  Singles,
		AlbumList: Albums,
	}
	return &pageRes, nil
}
