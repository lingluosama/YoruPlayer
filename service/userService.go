package service

import (
	"YoruPlayer/configs"
	"YoruPlayer/entity/Db"
	"YoruPlayer/models/response"
	"YoruPlayer/service/query"
	"context"
	"errors"
	"fmt"
	"gorm.io/gorm"
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
	isValid := verifyPassword([]byte(user.Password), []byte(user.Salt), password)
	if isValid == false {
		return nil, errors.New("wrong password")
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
		Authority: user.Authority,
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
	// 生成用户ID
	id, err := GenSnowFlakeId(1)
	if err != nil {
		log.Panicln("SnowFlakeErr:", err)
	}

	salt, _ := generateSalt(16)
	hashedPassword := hashPassword(password, salt)

	u := query.User

	// 检查是否是第一个用户
	userCount, err := u.WithContext(c).Count()
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return fmt.Errorf("check user count failed: %w", err)
	}

	user := &Db.User{
		Id:        *id,
		Name:      name,
		Password:  string(hashedPassword),
		Avatar:    configs.DefaultUserAvatar,
		Signature: "There is nothing",
		Email:     email,
		Salt:      string(salt),
		Authority: userCount == 0,
	}

	_, err = u.WithContext(c).Where(u.Name.Eq(name)).First()
	if err == nil {
		return errors.New("user existed")
	} else if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}

	if err = u.WithContext(c).Save(user); err != nil {
		log.Println("Save New User failed:", err)
		return err
	}

	return nil
}

func CreateSangList(
	c context.Context,
	uid int64,
	title string,
	description string,
	cover *multipart.FileHeader,
) error {

	id, err := GenSnowFlakeId(5)
	if err != nil {
		log.Panicln("SnowFlakeErr:", err)
	}
	var AccessUrl string
	if cover != nil {
		open, err := cover.Open()
		if err != nil {
			return err
		}
		ext := filepath.Ext(cover.Filename)
		if ext == "" {
			ext = ".png"
		}
		objectName := strconv.FormatInt(*id, 10) + ext
		err = MinioUtils.PutFile(c, "sanglist-cover", objectName, open, cover)
		if err != nil {
			return err
		}
		AccessUrl = configs.MinIOEndPoint + "/sanglist-cover/" + objectName
	} else {
		AccessUrl = "https://th.bing.com/th/id/OIP.OhuY2Kp0lQPML_nCJLyLQAHaE8?rs=1&pid=ImgDetMain"
	}

	list := &Db.SangList{
		Id:          *id,
		Cover:       AccessUrl,
		Creater:     uid,
		Title:       title,
		Description: description,
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

func UpdateSangList(
	c context.Context,
	cover *multipart.FileHeader,
	lid int64,
	description string,
	title string) error {
	if cover != nil {
		open, err := cover.Open()
		if err != nil {
			return err
		}
		ext := filepath.Ext(cover.Filename)
		if ext == "" {
			ext = ".png"
		}
		objectName := strconv.FormatInt(lid, 10) + ext
		err = MinioUtils.PutFile(c, "sanglist-cover", objectName, open, cover)
		if err != nil {
			return err
		}
		AccessUrl := configs.MinIOEndPoint + "/sanglist-cover/" + objectName
		_, err = query.SangList.WithContext(c).Where(query.SangList.Id.Eq(lid)).Updates(Db.SangList{
			Title:       title,
			Cover:       AccessUrl,
			Description: description,
		})
		return err
	} else {
		_, err := query.SangList.WithContext(c).Where(query.SangList.Id.Eq(lid)).Updates(Db.SangList{
			Title:       title,
			Description: description,
		})
		return err
	}
}
func GetAddSangListSate(c context.Context, uid int64, sid int64) (*response.SangListProviderRes, error) {
	userSangList, err := query.SangList.WithContext(c).
		Where(query.SangList.Creater.Eq(uid)).Find()
	if err != nil {
		return nil, err
	}
	var res response.SangListProviderRes
	for i := range userSangList {
		var row response.SangListProviderRow
		count, err := query.SangToList.WithContext(c).
			Where(query.SangToList.LID.Eq(userSangList[i].Id)).
			Where(query.SangToList.SID.Eq(sid)).Count()
		if err != nil {
			return nil, err
		}
		row.SangList = response.SangList{
			Id:          strconv.FormatInt(userSangList[i].Id, 10),
			Cover:       userSangList[i].Cover,
			Creater:     strconv.FormatInt(userSangList[i].Creater, 10),
			Title:       userSangList[i].Title,
			Description: userSangList[i].Description,
		}
		if count > 0 {
			row.IsIn = true
		} else {
			row.IsIn = false
		}
		res.List = append(res.List, &row)
	}
	return &res, nil

}
