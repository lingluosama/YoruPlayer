package service

import (
	"YoruPlayer/entity"
	"YoruPlayer/models/response"
	"YoruPlayer/service/query"
	"context"
)

func QuerySingle(c context.Context, begin int, size int, keyword *string) ([]*entity.Single, error) {

	db := query.Single.WithContext(c)

	if keyword != nil && *keyword != "" {
		db = db.Where(query.Single.Title.Like("%" + *keyword + "%"))
	}

	find, err := db.Limit(int(size)).Offset(int(begin)).Find()
	if err != nil {
		return nil, err
	}
	return find, nil
}

func QueryAlbum(c context.Context, begin int, size int, keyword *string) ([]*entity.Album, error) {
	db := query.Album.WithContext(c)

	if keyword != nil && *keyword != "" {
		db = db.Where(query.Album.Title.Like("%" + *keyword + "%"))
	}

	find, err := db.Limit(int(size)).Offset(int(begin)).Find()
	if err != nil {
		return nil, err
	}
	return find, nil

}

func QueryAuthor(c context.Context, begin int, size int, keyword *string) ([]*entity.Author, error) {
	db := query.Author.WithContext(c)
	if keyword != nil && *keyword != "" {
		db = db.Where(query.Author.Name.Like("%" + *keyword + "%"))
	}

	find, err := db.Limit(int(size)).Offset(int(begin)).Find()
	if err != nil {
		return nil, err
	}
	return find, nil

}

func QueryAlbumMessage(c context.Context, aid int) (*response.AlbumDetail, error) {
	album, err := query.Album.WithContext(c).Where(query.Album.Id.Eq(int64(aid))).First()
	if err != nil {
		return nil, err
	}
	find, err := query.Single.WithContext(c).Where(query.Single.Id.Eq(int64(aid))).Find()
	if err != nil {
		return nil, err
	}
	detail := &response.AlbumDetail{
		Album:   *album,
		Singles: find,
	}
	return detail, nil

}
