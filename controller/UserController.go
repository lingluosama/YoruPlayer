package controller

import (
	"YoruPlayer/models"
	"YoruPlayer/service"
	"context"
	"fmt"
	"github.com/cloudwego/hertz/pkg/app"
	"net/http"
)

func Login(c context.Context, req *app.RequestContext) {
	name := req.Query("username")
	password := req.Query("password")
	fmt.Println("param:", name, password)
	Id, err := service.UserLogin(c, name, password)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "failed login:" + err.Error(),
			Data: nil,
		})
		return
	}
	req.JSON(200, models.BaseResponse{
		Msg:  "Ac",
		Data: Id,
	})
	return

}

func GetUserInfo(c context.Context, req *app.RequestContext) {
	uid := req.Query("uid")
	userInfo, err := service.GetUserInfo(c, uid)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "filed get user info" + err.Error(),
			Data: nil,
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: userInfo,
	})
	return

}

func UserRegister(c context.Context, req *app.RequestContext) {
	name := req.Query("username")
	password := req.Query("password")
	email := req.Query("email")
	err := service.UserRegister(c, name, password, email)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Didn't Save UserInfo:" + err.Error(),
			Data: nil,
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: nil,
	})
}
