package controller

import (
	"YoruPlayer/entity/Db"
	"YoruPlayer/models"
	"YoruPlayer/service"
	"YoruPlayer/service/query"
	"context"
	"github.com/cloudwego/hertz/pkg/app"
	"net/http"
	"strconv"
)

func AddTagForSang(c context.Context, req *app.RequestContext) {
	Sid := req.Query("sid")
	tag := req.Query("tag")
	sid, err := strconv.ParseInt(Sid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans Sid" + err.Error(),
		})
		return
	}
	count, err := query.SangToTag.WithContext(c).Where(query.SangToTag.Sid.Eq(sid)).Where(query.SangToTag.Tag.Eq(tag)).Count()
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "Db Error" + err.Error(),
		})
		return
	}
	if count != 0 {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg: "Tag have exist" + err.Error(),
		})
		return
	} else {
		flakeId, err := service.GenSnowFlakeId(9)
		if err != nil {
			req.JSON(http.StatusBadRequest, models.BaseResponse{
				Msg: "Gen New Id failed" + err.Error(),
			})
			return
		}
		err = query.SangToTag.WithContext(c).Save(&Db.SangToTag{
			Id:  *flakeId,
			Tag: tag,
			Sid: sid,
		})
		if err != nil {
			req.JSON(http.StatusBadRequest, models.BaseResponse{
				Msg: "Save Tag to Db failed" + err.Error(),
			})
		}
	}

	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: count,
	})
}

func CreateNewTag(c context.Context, req *app.RequestContext) {
	name := req.Query("name")
	flakeId, err := service.GenSnowFlakeId(10)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Gen id failed" + err.Error(),
			Data: nil,
		})
		return
	}
	err = query.Tag.WithContext(c).Save(&Db.Tag{
		Id:   *flakeId,
		Name: name,
	})
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Save failed" + err.Error(),
			Data: nil,
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Ac",
	})

}

func GetTags(c context.Context, req *app.RequestContext) {
	tags, err := query.Tag.WithContext(c).Find()
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "query Db failed" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: tags,
	})

}
func GetSingleTags(c context.Context, req *app.RequestContext) {
	Sid := req.Query("sid")
	sid, err := strconv.ParseInt(Sid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans Sid" + err.Error(),
		})
		return
	}
	tags, err := service.GetSingleTag(c, sid)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "Service err" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: tags,
	})
}
func DropTagFromSang(c context.Context, req *app.RequestContext) {
	Sid := req.Query("sid")
	tag := req.Query("tag")
	sid, err := strconv.ParseInt(Sid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans Sid" + err.Error(),
		})
		return
	}

	_, err = query.SangToTag.WithContext(c).
		Where(query.SangToTag.Sid.Eq(sid)).
		Where(query.SangToTag.Tag.Eq(tag)).Delete()
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to drop tag-sang record" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Ac",
	})

}
func EraseTag(c context.Context, req *app.RequestContext) {
	tag := req.Query("tag")
	_, err := query.SangToTag.WithContext(c).
		Where(query.SangToTag.Tag.Eq(tag)).
		Delete()
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to drop tag-sang record" + err.Error(),
		})
		return
	}
	_, err = query.Tag.WithContext(c).Where(query.Tag.Name.Eq(tag)).Delete()
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to delete tag in tag-table" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Ac",
	})

}
