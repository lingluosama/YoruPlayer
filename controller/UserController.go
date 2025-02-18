package controller

import (
	"YoruPlayer/entity/Db"
	"YoruPlayer/models"
	"YoruPlayer/service"
	"YoruPlayer/service/query"
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
	description := req.FormValue("description")
	formFile, err := req.FormFile("cover")
	if err != nil && err.Error() == "http: no such file" {
		formFile = nil
	}
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Get File Failed:" + err.Error(),
			Data: nil,
		})
		return
	}
	uid, err := strconv.Atoi(string(Uid))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Trans uid failed:" + err.Error(),
			Data: nil,
		})
		return
	}
	err = service.CreateSangList(c, int64(uid), string(title), string(description), formFile)
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
	sid, err := strconv.ParseInt(Sid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Trans sid failed:" + err.Error(),
			Data: nil,
		})
		return
	}
	lid, err := strconv.ParseInt(Lid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Trans lid failed:" + err.Error(),
			Data: nil,
		})
		return
	}
	err = query.SangToList.WithContext(c).Save(&Db.SangToList{
		LID: lid,
		SID: sid,
	})
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Db error:" + err.Error(),
			Data: nil,
		})
		return
	}
	//message := kafkaMessage.AddSangListMessage{
	//	Sid: int64(sid),
	//	Lid: int64(lid),
	//}
	//
	//initial.SendMessageQueue("add-sang-list", message, "useless", c)
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Ac",
	})
}

func DeleteSingleFormSangList(c context.Context, req *app.RequestContext) {
	Lid := req.Query("lid")
	Sid := req.Query("sid")

	lid, err := strconv.ParseInt(Lid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Trans lid failed:" + err.Error(),
			Data: nil,
		})
		return
	}
	sid, err := strconv.ParseInt(Sid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Trans sid failed:" + err.Error(),
			Data: nil,
		})
		return
	}
	_, err = query.SangToList.WithContext(c).
		Where(query.SangToList.SID.Eq(sid)).
		Where(query.SangToList.LID.Eq(lid)).
		Delete()
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Db error:" + err.Error(),
			Data: nil,
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: nil,
	})
}
func UpdateUserInfo(c context.Context, req *app.RequestContext) {
	Uid := req.FormValue("uid")
	uid, err := strconv.ParseInt(string(Uid), 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans uid:" + err.Error(),
		})
		return
	}
	email := req.FormValue("email")
	name := req.FormValue("name")
	signature := req.FormValue("signature")
	file, err := req.FormFile("avatar")
	if err != nil && err.Error() == "http: no such file" {
		file = nil
	} else if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Get file panic: " + err.Error(),
			Data: nil,
		})
		return
	}
	err = service.UpdateUserInfo(
		c,
		uid,
		string(name),
		string(email),
		string(signature),
		file)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "service err" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Ac",
	})
	return
}

func GetUserSangList(c context.Context, req *app.RequestContext) {
	Uid := req.Query("uid")
	uid, err := strconv.ParseInt(Uid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans uid:" + err.Error(),
		})
		return
	}
	sangList, err := service.GetUserSangList(c, uid)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "service err" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: sangList,
	})
}
func AddSangListState(c context.Context, req *app.RequestContext) {
	Sid := req.Query("sid")
	sid, err := strconv.ParseInt(Sid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans sid:" + err.Error(),
		})
		return
	}
	Uid := req.Query("uid")
	uid, err := strconv.ParseInt(Uid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans uid:" + err.Error(),
		})
		return
	}
	sangListSate, err := service.GetAddSangListSate(c, uid, sid)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "service error:" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: sangListSate,
	})

}

func UpdateSangListInfo(c context.Context, req *app.RequestContext) {
	Lid := req.FormValue("lid")
	title := req.FormValue("title")
	description := req.FormValue("description")
	lid, err := strconv.ParseInt(string(Lid), 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans sid:" + err.Error(),
		})
		return
	}
	cover, err := req.FormFile("cover")
	if err != nil && err.Error() == "http: no such file" {
		cover = nil
	} else if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Get file panic: " + err.Error(),
			Data: nil,
		})
		return
	}
	err = service.UpdateSangList(c, cover, lid, string(description), string(title))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "service err" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Ac",
	})

}
