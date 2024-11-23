package service

import (
	"YoruPlayer/configs"
	"YoruPlayer/entity"
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
	err = query.Single.Save(&entity.Single{
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
