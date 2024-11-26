package controller

import (
	"YoruPlayer/models"
	"YoruPlayer/service"
	"context"
	"github.com/cloudwego/hertz/pkg/app"
	"net/http"
	"strconv"
)

func QueryList(c context.Context, req *app.RequestContext) {
	target := req.Query("target")
	keyword := req.Query("keyword")
	begin, err := strconv.Atoi(req.Query("begin"))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "begin trans to int",
			Data: nil,
		})
	}
	size, err := strconv.Atoi(req.Query("size"))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "begin trans to int",
			Data: nil,
		})
		return
	}
	switch target {
	case "single":
		{
			singles, err := service.QuerySingle(c, begin, size, &keyword)
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg:  "service err:" + err.Error(),
					Data: nil,
				})
			} else {
				req.JSON(http.StatusOK, models.BaseResponse{
					Msg:  "Ac",
					Data: singles,
				})
			}
		}
	case "album":
		{
			singles, err := service.QueryAlbum(c, begin, size, &keyword)
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg:  "service err:" + err.Error(),
					Data: nil,
				})
			} else {
				req.JSON(http.StatusOK, models.BaseResponse{
					Msg:  "Ac",
					Data: singles,
				})
			}
		}
	case "author":
		{
			singles, err := service.QueryAuthor(c, begin, size, &keyword)
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg:  "service err:" + err.Error(),
					Data: nil,
				})
			} else {
				req.JSON(http.StatusOK, models.BaseResponse{
					Msg:  "Ac",
					Data: singles,
				})
			}
		}
	}
}

func GetAlbumDetail(c context.Context, req *app.RequestContext) {
	aid, err := strconv.Atoi(req.Query("aid"))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Get params aid to int failed:" + err.Error(),
			Data: nil,
		})
	} else {
		albumDetail, err := service.QueryAlbumMessage(c, aid)
		if err != nil {
			req.JSON(http.StatusBadRequest, models.BaseResponse{
				Msg:  "Service err: " + err.Error(),
				Data: nil,
			})
		} else {
			req.JSON(http.StatusOK, models.BaseResponse{
				Msg:  "Ac",
				Data: albumDetail,
			})
		}
	}
	return

}
