package controller

import (
	"YoruPlayer/models"
	"YoruPlayer/service/query"
	"context"
	"github.com/cloudwego/hertz/pkg/app"
	"net/http"
	"strconv"
)

func DeleteHandler(c context.Context, req *app.RequestContext) {
	Id := req.Query("id")
	id, err := strconv.ParseInt(Id, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to trans int in id:" + err.Error(),
		})
		return
	}
	target := req.Query("target")
	switch target {
	case "single":
		{
			_, err := query.SangToList.WithContext(c).Where(query.SangToList.SID.Eq(id)).Delete()
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg: "failed to delete in table sangToList:" + err.Error(),
				})
				return
			}
			_, err = query.SangToTag.WithContext(c).Where(query.SangToTag.Sid.Eq(id)).Delete()
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg: "failed to delete in table SangToTag:" + err.Error(),
				})
				return
			}
			_, err = query.Single.WithContext(c).Where(query.Single.Id.Eq(id)).Delete()
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg: "failed to delete in table single:" + err.Error(),
				})
				return
			}
		}
	case "album":
		{
			_, err := query.Single.WithContext(c).Where(query.Single.AlbumId.Eq(id)).Update(query.Single.AlbumId, 0)
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg: "failed to update in table album:" + err.Error(),
				})
				return
			}
			_, err = query.Album.WithContext(c).Where(query.Album.Id.Eq(id)).Delete()
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg: "failed to delete in table album:" + err.Error(),
				})
				return
			}
		}
	case "sanglist":
		{
			_, err := query.SangToList.WithContext(c).Where(query.SangToList.LID.Eq(id)).Delete()
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg: "failed to delete in table sangToList:" + err.Error(),
				})
				return
			}
			_, err = query.SangListToTag.WithContext(c).Where(query.SangListToTag.Lid.Eq(id)).Delete()
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg: "failed to delete in table sanglistToTang:" + err.Error(),
				})
				return
			}
			_, err = query.SangList.WithContext(c).Where(query.SangList.Id.Eq(id)).Delete()
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg: "failed to delete in table sanglist:" + err.Error(),
				})
				return
			}
		}
	case "user":
		{
			_, err := query.User.WithContext(c).Where(query.User.Id.Eq(id)).Delete()
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg: "failed to delete in table user:" + err.Error(),
				})
				return
			}
		}
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Ac",
	})

}

func GrantAdmin(c context.Context, req *app.RequestContext) {
	Id := req.Query("id")
	remove := req.Query("remove")
	id, err := strconv.ParseInt(Id, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to trans int in id:" + err.Error(),
		})
		return
	}
	_, err = query.User.WithContext(c).Where(query.User.Id.Eq(id)).Update(query.User.Authority, remove == "false")
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to update in table user:" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Ac",
	})

}
