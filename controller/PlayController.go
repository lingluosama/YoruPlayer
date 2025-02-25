package controller

import (
	"YoruPlayer/entity/Db"
	"YoruPlayer/entity/cache"
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

func GetUserPlayHistory(c context.Context, req *app.RequestContext) {
	Uid := req.Query("uid")
	uid, err := strconv.ParseInt(Uid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to trans int in uid:" + err.Error(),
		})
		return
	}
	history, err := service.QueryHistory(c, uid)
	var historyMessage []*cache.ResHistoryMessage
	if history != nil {
		for _, message := range history.Messages {
			historyMessage = append(historyMessage, &cache.ResHistoryMessage{
				Single: response.Single{
					Id:       strconv.FormatInt(message.Single.Id, 10),
					Resource: message.Single.Resource,
					Cover:    message.Single.Cover,
					Title:    message.Single.Title,
					Author:   message.Single.Author,
					Length:   message.Single.Length,
					AlbumId:  strconv.FormatInt(message.Single.AlbumId, 10),
				},
				Count: message.Count,
				Tags:  message.Tags,
			})
		}
	}

	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "service err:" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: historyMessage,
	})

}

func ReplacePlayQueue(c context.Context, req *app.RequestContext) {
	target := req.Query("target")
	Uid := req.Query("uid")
	uid, err := strconv.ParseInt(Uid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to trans int in uid:" + err.Error(),
		})
		return
	}
	Id := req.Query("id")
	id, err := strconv.ParseInt(Id, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to trans int in replace target id:" + err.Error(),
		})
		return
	}
	err = service.ReplaceQueue(c, uid, id, target)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "service error:" + err.Error(),
			Data: nil,
		})
		return
	} else {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg:  "Ac",
			Data: nil,
		})
	}

}
