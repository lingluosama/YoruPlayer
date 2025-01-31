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
func DropTagFromSangList(c context.Context, req *app.RequestContext) {
	Lid := req.Query("lid")
	tag := req.Query("tag")
	lid, err := strconv.ParseInt(Lid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans Sid" + err.Error(),
		})
		return
	}

	_, err = query.SangListToTag.WithContext(c).
		Where(query.SangListToTag.Lid.Eq(lid)).
		Where(query.SangListToTag.Tag.Eq(tag)).Delete()
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to drop tag-sanglist record" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg: "Ac",
	})

}
func AddTagForSangList(c context.Context, req *app.RequestContext) {
	Lid := req.Query("lid")
	tag := req.Query("tag")
	lid, err := strconv.ParseInt(Lid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to drop tag-sang record" + err.Error(),
		})
		return
	}
	count, err := query.SangListToTag.WithContext(c).Where(query.SangListToTag.Lid.Eq(lid), query.SangListToTag.Tag.Eq(tag)).Count()
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
		flakeId, err := service.GenSnowFlakeId(10)
		if err != nil {
			req.JSON(http.StatusBadRequest, models.BaseResponse{
				Msg: "Gen New Id failed" + err.Error(),
			})
			return
		}
		err = query.SangListToTag.WithContext(c).Save(&Db.SangListToTag{
			Id:  *flakeId,
			Tag: tag,
			Lid: lid,
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

func GetRecommend(c context.Context, req *app.RequestContext) {
	target := req.Query("target")
	Uid := req.Query("uid")
	uid, err := strconv.ParseInt(Uid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed to delete tag in tag-table" + err.Error(),
		})
		return
	}
	if target == "single" {
		sangs, err := service.GetRecommendSangs(c, uid)
		if err != nil {
			req.JSON(http.StatusBadRequest, models.BaseResponse{
				Msg: "service err" + err.Error(),
			})
			return
		}
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg:  "Ac",
			Data: sangs,
		})
		return
	} else if target == "author" {
		authors, err := service.GetRecommendAuthor(c, uid)
		if err != nil {
			req.JSON(http.StatusBadRequest, models.BaseResponse{
				Msg: "service err" + err.Error(),
			})
			return
		}
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg:  "Ac",
			Data: authors,
		})
		return
	} else if target == "sanglist" {
		sangList, err := service.GetRecommendSangList(c, uid)
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
		return
	}
	req.JSON(http.StatusBadRequest, models.BaseResponse{
		Msg: "not find target",
	})
	return
}
func GetSangListTags(c context.Context, req *app.RequestContext) {
	Lid := req.Query("lid")
	lid, err := strconv.ParseInt(Lid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans Lid" + err.Error(),
		})
		return
	}
	tags, err := service.GetSangListTag(c, lid)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "service err" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: tags,
	})
	return

}

func SearchTag(c context.Context, req *app.RequestContext) {
	keyword := req.Query("keyword")
	Size := req.Query("size")
	size, err := strconv.ParseInt(Size, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans size" + err.Error(),
		})
		return
	}
	Offset := req.Query("offset")
	offset, err := strconv.ParseInt(Offset, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "failed trans offset" + err.Error(),
		})
		return
	}
	tags, err := service.HandleSearchTag(c, keyword, offset, size)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "service err" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: tags,
	})
	return

}
