package service

import (
	"YoruPlayer/configs"
	"YoruPlayer/entity/Db"
	"YoruPlayer/models/response"
	"YoruPlayer/service/query"
	"context"
	"errors"
	"log"
	"mime/multipart"
	"path/filepath"
	"strconv"
)

func UserLogin(c context.Context, name string, password string) (*response.UserLoginRes, error) {
	u := query.User
	user, err := u.WithContext(c).Where(u.Name.Eq(name)).First()
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("can't find user")
	}
	res := &response.UserLoginRes{
		Id:    strconv.FormatInt(user.Id, 10),
		Token: GenerateToken(strconv.FormatInt(user.Id, 10)),
	}
	return res, nil
}

func ConverseUserToResponse(user *Db.User) response.User {
	return response.User{
		Id:        strconv.FormatInt(user.Id, 10),
		Name:      user.Name,
		Password:  user.Password,
		Avatar:    user.Avatar,
		Signature: user.Signature,
		Email:     user.Email,
	}
}

func GetUserInfo(c context.Context, uid string) (*response.User, error) {
	u := query.User
	id, err := strconv.ParseInt(uid, 10, 64)
	if err != nil {
		return nil, err
	}
	first, err := u.WithContext(c).Where(u.Id.Eq(id)).First()
	if err != nil {
		return nil, err
	}
	user := ConverseUserToResponse(first)
	return &user, nil
}

func UserRegister(c context.Context, name string, password string, email string) error {

	id, err := GenSnowFlakeId(1)
	if err != nil {
		log.Panicln("SnowFlakeErr:", err)
	}

	user := &Db.User{
		Id:        *id,
		Name:      name,
		Password:  password,
		Avatar:    configs.DefaultUserAvatar,
		Signature: "There is nothing",
		Email:     email,
	}
	u := query.User
	_, err = u.WithContext(c).Where(u.Name.Eq(name)).First()
	if err == nil {
		return errors.New("user existed")
	} else if err != nil && err.Error() != "record not found" {
		return err
	}

	err = u.WithContext(c).Save(user)
	if err != nil {
		log.Println("Save New User failed:", err)
		return err
	}

	return nil
}

func CreateSangList(c context.Context, uid int64, title string) error {
	id, err := GenSnowFlakeId(5)
	if err != nil {
		log.Panicln("SnowFlakeErr:", err)
	}

	list := &Db.SangList{
		Id:      *id,
		Cover:   "null",
		Creater: uid,
		Title:   title,
	}
	err = query.SangList.WithContext(c).Save(list)
	if err != nil {
		return err
	}
	return nil

}

func UpdateUserInfo(
	c context.Context,
	uid int64,
	name string,
	email string,
	signature string,
	avatar *multipart.FileHeader,
) error {

	if avatar != nil {
		open, err := avatar.Open()
		if err != nil {
			return err
		}
		ext := filepath.Ext(avatar.Filename)
		if ext == "" {
			ext = ".png"
		}
		objectName := strconv.FormatInt(uid, 10) + ext
		err = MinioUtils.PutFile(c, "user-avatar", objectName, open, avatar)
		if err != nil {
			return err
		}
		AccessUrl := configs.MinIOEndPoint + "/user-avatar/" + objectName
		_, err = query.User.WithContext(c).Where(query.User.Id.Eq(uid)).Updates(Db.User{
			Name:      name,
			Avatar:    AccessUrl,
			Signature: signature,
			Email:     email,
		})
		if err != nil {
			return err
		}
	} else {
		_, err := query.User.WithContext(c).Where(query.User.Id.Eq(uid)).Updates(Db.User{
			Name:      name,
			Signature: signature,
			Email:     email,
		})
		if err != nil {
			return err
		}
	}
	return nil
}
func GetUserSangList(c context.Context, uid int64) ([]*response.SangList, error) {
	find, err := query.SangList.WithContext(c).Where(query.SangList.Creater.Eq(uid)).Find()
	if err != nil {
		return nil, err
	}

	sangListResponse := convertSangListToResponse(find)
	return sangListResponse, nil
}
