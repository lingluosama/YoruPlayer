package service

import (
	"YoruPlayer/configs"
	"YoruPlayer/entity/Db"
	"YoruPlayer/service/query"
	"context"
	"mime/multipart"
	"path/filepath"
	"strconv"
	"strings"
)

func UploadSingleSang(title string, author string, c context.Context, audio *multipart.FileHeader, cover *multipart.FileHeader) error {
	ext := strings.ToLower(filepath.Ext(audio.Filename))
	if ext == "" {
		ext = ".mp3"
	}
	id, err := GenSnowFlakeId(2)
	if err != nil {
		return err
	}
	objectname := strconv.FormatInt(*id, 10) + ext
	open, err := audio.Open()
	if err != nil {
		return err
	}
	err = MinioUtils.PutFile(c, "sangs", objectname, open, audio)
	if err != nil {
		return err
	}
	resource := configs.MinIOEndPoint + "/sangs/" + objectname
	coverUrl, err := UploadCoverForSang(*id, c, cover)
	if err != nil {
		return err
	}
	err = query.Single.Save(&Db.Single{
		Id:       *id,
		Resource: resource,
		Cover:    *coverUrl,
		Title:    title,
		Author:   author,
		Length:   0,
		AlbumId:  0,
	})
	return err
}

func UpdateSingleInfo(c context.Context, sid int64, title string, author string, cover *multipart.FileHeader) error {
	first, err := query.Single.WithContext(c).Where(query.Single.Id.Eq(sid)).First()
	if err != nil {
		return err
	}
	if cover != nil {
		coverUrl, err := UploadCoverForSang(first.Id, c, cover)
		if err != nil {
			return err
		}
		_, err = query.Single.WithContext(c).Where(query.Single.Id.Eq(sid)).Updates(Db.Single{
			Cover:  *coverUrl,
			Title:  title,
			Author: author,
		})
		if err != nil {
			return err
		}
	} else {
		_, err = query.Single.WithContext(c).Where(query.Single.Id.Eq(sid)).Updates(Db.Single{
			Title:  title,
			Author: author,
		})
		if err != nil {
			return err
		}
	}
	return nil
}

func UploadCoverForSang(id int64, c context.Context, header *multipart.FileHeader) (*string, error) {
	ext := filepath.Ext(header.Filename)
	if ext == "" {
		ext = ".png"
	}
	objectName := strconv.FormatInt(id, 10) + ext
	open, err := header.Open()
	if err != nil {
		return nil, err
	}
	err = MinioUtils.PutFile(c, "cover-sangs", objectName, open, header)
	if err != nil {
		return nil, err
	}
	AccessUrl := configs.MinIOEndPoint + "/cover-sangs/" + objectName
	return &AccessUrl, nil

}

func CreateNewAlbum(title string, description string, author string, c context.Context, header *multipart.FileHeader) error {
	id, err := GenSnowFlakeId(3)
	if err != nil {
		return err
	}
	ext := filepath.Ext(header.Filename)
	if ext == "" {
		ext = ".png"
	}
	open, err := header.Open()
	if err != nil {
		return err
	}
	objectName := strconv.FormatInt(*id, 10) + ext
	err = MinioUtils.PutFile(c, "cover-album", objectName, open, header)
	if err != nil {
		return err
	}
	AccessUrl := configs.MinIOEndPoint + "/cover-album/" + objectName
	err = query.Album.Save(&Db.Album{
		Id:          *id,
		Title:       title,
		Cover:       AccessUrl,
		Author:      author,
		Description: description,
	})
	if err != nil {
		return err
	}
	return nil
}

func UpdateAlbumInfo(aid int64, title string, description string, author string, c context.Context, header *multipart.FileHeader) error {
	db := query.Album.WithContext(c)
	if header != nil {
		ext := filepath.Ext(header.Filename)
		if ext == "" {
			ext = ".png"
		}
		open, err := header.Open()
		if err != nil {
			return err
		}
		objectName := strconv.FormatInt(aid, 10) + ext
		err = MinioUtils.PutFile(c, "cover-album", objectName, open, header)
		if err != nil {
			return err
		}
		AccessUrl := configs.MinIOEndPoint + "/cover-album/" + objectName
		_, err = db.Where(query.Album.Id.Eq(aid)).Updates(Db.Album{
			Title:       title,
			Cover:       AccessUrl,
			Author:      author,
			Description: description,
		})
		if err != nil {
			return err
		}
	} else {
		_, err := db.Where(query.Album.Id.Eq(aid)).Updates(Db.Album{
			Title:       title,
			Author:      author,
			Description: description,
		})
		if err != nil {
			return err
		}
	}
	return nil
}

func AddSingleToAlbum(aid int64, sid int64, c context.Context) error {
	_, err := query.Single.WithContext(c).Where(query.Single.Id.Eq(sid)).Updates(Db.Single{AlbumId: aid})
	if err != nil {
		return err
	}
	return nil
}
func DeleteSingleFormAlbum(sid int64, c context.Context) error {
	_, err := query.Single.WithContext(c).Where(query.Single.Id.Eq(sid)).Updates(Db.Single{AlbumId: 114514})
	return err
}

func CreateAuthor(c context.Context, name string, header *multipart.FileHeader) error {
	id, err := GenSnowFlakeId(6)
	if err != nil {
		return err
	}
	ext := filepath.Ext(header.Filename)
	if ext == "" {
		ext = ".png"
	}
	objectname := strconv.FormatInt(*id, 10) + ext
	open, err := header.Open()
	if err != nil {
		return err
	}
	err = MinioUtils.PutFile(c, "author-avatar", objectname, open, header)
	if err != nil {
		return err
	}
	avatar := configs.MinIOEndPoint + "/author-avatar/" + objectname
	err = query.Author.Save(&Db.Author{
		Id:     *id,
		Name:   name,
		Avatar: avatar,
	})
	if err != nil {
		return err
	}
	return nil

}

func UpdateAuthor(c context.Context, name string, id int64, header *multipart.FileHeader) error {
	Oriauthor, err := query.Author.WithContext(c).Where(query.Author.Id.Eq(id)).First()
	if err != nil {
		return err
	}

	var Avatar *string
	Avatar = nil
	if header != nil {
		ext := filepath.Ext(header.Filename)
		if ext == "" {
			ext = ".png"
		}
		open, err := header.Open()
		if err != nil {
			return err
		}
		objectName := strconv.FormatInt(id, 10) + ext
		err = MinioUtils.PutFile(c, "author-avatar", objectName, open, header)
		if err != nil {
			return err
		}
		avatar := configs.MinIOEndPoint + "/author-avatar/" + objectName
		Avatar = &avatar
	}

	updateData := map[string]interface{}{
		"Name": name,
	}
	if Avatar != nil {
		updateData["Avatar"] = *Avatar
	}

	_, err = query.Author.WithContext(c).Where(query.Author.Id.Eq(id)).Updates(updateData)
	if err != nil {
		return err
	}

	_, err = query.Album.WithContext(c).Where(query.Album.Author.Eq(Oriauthor.Name)).Updates(Db.Album{Author: name})
	if err != nil {
		return err
	}

	_, err = query.Single.WithContext(c).Where(query.Single.Author.Eq(Oriauthor.Name)).Updates(Db.Single{Author: name})
	if err != nil {
		return err
	}

	return nil
}
