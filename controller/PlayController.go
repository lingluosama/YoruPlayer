package controller

import (
	"YoruPlayer/entity/Db"
	"YoruPlayer/models"
	"YoruPlayer/models/response"
	"YoruPlayer/service"
	"context"
	"github.com/cloudwego/hertz/pkg/app"
	"net/http"
	"strconv"
)

func QueryQueue(c context.Context, req *app.RequestContext) {
	Uid := req.Query("uid")
	uid, err := strconv.ParseInt(Uid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to trans int in uid:" + err.Error(),
		})
		return
	}
	queue, err := service.QueryQueue(c, uid)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "service err:" + err.Error(),
		})
	}
	var res []*Db.Single
	for i := range queue.SangList {
		res = append(res, &queue.SangList[i])
	}
	singles := service.ConvertSingleToResponse(res)
	playQueue := response.PlayQueue{
		Uid:      strconv.FormatInt(queue.Uid, 10),
		SangList: singles,
	}
	req.JSON(http.StatusOK, response.QueryListRes{
		Msg:  "Ac",
		Data: playQueue,
	})

}

func AddPlayListQueue(c context.Context, req *app.RequestContext) {
	Uid := req.Query("uid")
	Sid := req.Query("sid")
	target := req.Query("target")
	uid, err := strconv.ParseInt(Uid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to trans int in uid:" + err.Error(),
		})
		return
	}
	sid, err := strconv.ParseInt(Sid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to trans int in sid:" + err.Error(),
		})
		return
	}

	err = service.AddToQueue(c, uid, sid, target)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "service err:" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Ac",
	})
}

func DeleteFormQueue(c context.Context, req *app.RequestContext) {
	Uid := req.Query("uid")
	Sid := req.Query("sid")
	uid, err := strconv.ParseInt(Uid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to trans int in uid:" + err.Error(),
		})
		return
	}
	sid, err := strconv.ParseInt(Sid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to trans int in sid:" + err.Error(),
		})
		return
	}
	err = service.DeleteFromQueue(c, uid, sid)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "service err:" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Ac",
	})

}
