package controller

import (
	"YoruPlayer/initial"
	"YoruPlayer/models"
	"YoruPlayer/models/kafkaMessage"
	"YoruPlayer/service"
	"context"
	"fmt"
	"github.com/cloudwego/hertz/pkg/app"
	"net/http"
	"strconv"
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

func CreateSangList(c context.Context, req *app.RequestContext) {
	Uid := req.FormValue("uid")
	title := req.FormValue("title")
	uid, err := strconv.Atoi(string(Uid))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Trans uid failed:" + err.Error(),
			Data: nil,
		})
		return
	}
	err = service.CreateSangList(c, int64(uid), string(title))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "service err:" + err.Error(),
			Data: nil,
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: nil,
	})

}

func AddSingleToSangList(c context.Context, req *app.RequestContext) {
	Sid := req.Query("sid")
	Lid := req.Query("lid")
	sid, err := strconv.Atoi(Sid)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Trans sid failed:" + err.Error(),
			Data: nil,
		})
		return
	}
	lid, err := strconv.Atoi(Lid)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Trans lid failed:" + err.Error(),
			Data: nil,
		})
		return
	}

	message := kafkaMessage.AddSangListMessage{
		Sid: int64(sid),
		Lid: int64(lid),
	}

	initial.SendMessageQueue("add-sang-list", message, "useless", c)
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Has sent",
	})

}
