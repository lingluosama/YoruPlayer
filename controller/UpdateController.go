package controller

import (
	"YoruPlayer/models"
	"YoruPlayer/service"
	"context"
	"github.com/cloudwego/hertz/pkg/app"
	"net/http"
	"strconv"
)

func UploadSingleSang(c context.Context, req *app.RequestContext) {
	sang, err := req.FormFile("sang")
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Get Sang Form File Failed:" + err.Error(),
			Data: nil,
		})
	}
	cover, err := req.FormFile("cover")
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Get Sang Form File Failed:" + err.Error(),
			Data: nil,
		})
		return
	}
	title := req.FormValue("title")
	author := req.FormValue("author")
	err = service.UploadSingleSang(string(title), string(author), c, sang, cover)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Service Error :" + err.Error(),
			Data: nil,
		})
	} else {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg:  "Ac",
			Data: nil,
		})
	}
}

func CreateAlbum(c context.Context, req *app.RequestContext) {
	file, err := req.FormFile("cover")
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Get Sang Form File Failed:" + err.Error(),
			Data: nil,
		})
		return
	}
	title := req.FormValue("title")
	author := req.FormValue("author")
	description := req.FormValue("description")
	err = service.CreateNewAlbum(string(title), string(description), string(author), c, file)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Service Error :" + err.Error(),
			Data: nil,
		})
	} else {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg:  "Ac",
			Data: nil,
		})
	}
}
func UpdateSingleInfo(c context.Context, req *app.RequestContext) {
	file, err := req.FormFile("cover")
	if err != nil && err.Error() == "http: no such file" {
		file = nil
	} else if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Get file panic: " + err.Error(),
			Data: nil,
		})
		return
	}

	title := req.FormValue("title")
	Sid := req.FormValue("sid")
	sid, err := strconv.Atoi(string(Sid))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Transform sid to int failed: " + err.Error(),
			Data: nil,
		})
		return
	}

	author := req.FormValue("author")
	err = service.UpdateSingleInfo(c, int64(sid), string(title), string(author), file)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "service err: " + err.Error(),
			Data: nil,
		})
	} else {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg:  "Ac",
			Data: nil,
		})
	}
}

func UpdateAlbumInfo(c context.Context, req *app.RequestContext) {
	file, err := req.FormFile("cover")
	if err != nil && err.Error() == "http: no such file" {
		file = nil
	} else if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Get file panic: " + err.Error(),
			Data: nil,
		})
		return
	}
	title := req.FormValue("title")
	Aid := req.FormValue("aid")
	aid, err := strconv.Atoi(string(Aid))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Transform aid to int failed: " + err.Error(),
			Data: nil,
		})
		return
	}
	description := req.FormValue("description")
	author := req.FormValue("author")
	err = service.UpdateAlbumInfo(int64(aid), string(title), string(description), string(author), c, file)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "service err:" + err.Error(),
			Data: nil,
		})
	} else {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg:  "Ac",
			Data: nil,
		})
	}

}

func AddSingleToAlbum(c context.Context, req *app.RequestContext) {
	sid, err := strconv.Atoi(req.Query("sid"))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "transfer sid to int failed:" + err.Error(),
		})
		return
	}
	aid, err := strconv.Atoi(req.Query("aid"))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "transfer aid to int failed:" + err.Error(),
		})
		return
	}
	err = service.AddSingleToAlbum(int64(aid), int64(sid), c)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "Service err:" + err.Error(),
		})
		return
	} else {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg: "Ac",
		})
	}
}
func DeleteSingleFormAlbum(c context.Context, req *app.RequestContext) {
	sid, err := strconv.Atoi(req.Query("sid"))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "transfer sid to int failed:" + err.Error(),
		})
		return
	}
	err = service.DeleteSingleFormAlbum(int64(sid), c)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "Service err:" + err.Error(),
		})
		return
	} else {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg: "Ac",
		})
	}

}

func UploadNewAuthorInfo(c context.Context, req *app.RequestContext) {

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
	name := req.FormValue("name")
	err = service.CreateAuthor(c, string(name), file)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "service err:" + err.Error(),
			Data: nil,
		})
	} else {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg:  "Ac",
			Data: nil,
		})
	}
}

func UpdateAuthorInfo(c context.Context, req *app.RequestContext) {
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
	Id := req.FormValue("id")
	id, err := strconv.ParseInt(string(Id), 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "trans id to int64 failed:" + err.Error(),
			Data: nil,
		})
	}
	name := req.FormValue("name")
	err = service.UpdateAuthor(c, string(name), id, file)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "service err:" + err.Error(),
			Data: nil,
		})
	} else {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg:  "Ac",
			Data: nil,
		})
	}
}
