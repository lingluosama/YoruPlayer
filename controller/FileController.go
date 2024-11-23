package controller

import (
	"YoruPlayer/models"
	"YoruPlayer/service"
	"context"
	"github.com/cloudwego/hertz/pkg/app"
	"net/http"
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
