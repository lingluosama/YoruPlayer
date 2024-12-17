package service

import (
	"YoruPlayer/entity/Db"
	"YoruPlayer/models/response"
	"YoruPlayer/service/query"
	"context"
	"errors"
	"log"
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

func GetUserInfo(c context.Context, uid string) (*Db.User, error) {
	u := query.User
	id, err := strconv.ParseInt(uid, 10, 64)
	if err != nil {
		return nil, err
	}
	first, err := u.WithContext(c).Where(u.Id.Eq(id)).First()
	if err != nil {
		return nil, err
	}
	return first, nil
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
		Avatar:    "",
		Signature: "",
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
