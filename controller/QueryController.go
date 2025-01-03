package controller

import (
	"YoruPlayer/models"
	"YoruPlayer/models/response"
	"YoruPlayer/service"
	"YoruPlayer/service/query"
	"context"
	"github.com/cloudwego/hertz/pkg/app"
	"net/http"
	"strconv"
	"strings"
)

func QueryList(c context.Context, req *app.RequestContext) {
	target := req.Query("target")
	keyword := req.Query("keyword")
	begin, err := strconv.Atoi(req.Query("begin"))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "begin trans to int failed:" + err.Error(),
			Data: nil,
		})
	}
	size, err := strconv.Atoi(req.Query("size"))
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "size trans to int failed:" + err.Error(),
			Data: nil,
		})
		return
	}
	switch target {
	case "single":
		{
			singles, count, err := service.QuerySingle(c, begin, size, &keyword)
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg:  "service err:" + err.Error(),
					Data: nil,
				})
			} else {
				req.JSON(http.StatusOK, response.QueryListRes{
					Msg:    "Ac",
					Data:   singles,
					Length: count,
				})
			}
		}
	case "album":
		{
			singles, count, err := service.QueryAlbum(c, begin, size, &keyword)
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg:  "service err:" + err.Error(),
					Data: nil,
				})
			} else {
				req.JSON(http.StatusOK, response.QueryListRes{
					Msg:    "Ac",
					Data:   singles,
					Length: count,
				})
			}
		}
	case "author":
		{
			singles, count, err := service.QueryAuthor(c, begin, size, &keyword)
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg:  "service err:" + err.Error(),
					Data: nil,
				})
			} else {
				req.JSON(http.StatusOK, response.QueryListRes{
					Msg:    "Ac",
					Data:   singles,
					Length: count,
				})
			}
		}
	case "sanglist":
		{
			sanglists, count, err := service.QuerySangList(c, begin, size, &keyword)
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg:  "service err:" + err.Error(),
					Data: nil,
				})
			} else {
				req.JSON(http.StatusOK, response.QueryListRes{
					Msg:    "Ac",
					Data:   sanglists,
					Length: count,
				})
			}

		}
	case "tag":
		{
			tags, count, err := service.QueryTagList(c, begin, size, &keyword)
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg:  "service err:" + err.Error(),
					Data: nil,
				})
			} else {
				req.JSON(http.StatusOK, response.QueryListRes{
					Msg:    "Ac",
					Data:   tags,
					Length: count,
				})
			}
		}
	}
}
func GetAlbumInfoByTitle(c context.Context, req *app.RequestContext) {
	title := req.Query("title")
	Album, err := query.Album.WithContext(c).Where(query.Album.Title.Eq(title)).First()
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "query err:" + err.Error(),
		})
	}
	album := response.Album{
		Id:          strconv.FormatInt(Album.Id, 10),
		Title:       Album.Title,
		Cover:       Album.Cover,
		Author:      Album.Author,
		Description: Album.Description,
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: album,
	})

}

func GetAlbumDetail(c context.Context, req *app.RequestContext) {
	aid, err := strconv.ParseInt(req.Query("aid"), 10, 64)
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

func GetSingleDetail(c context.Context, req *app.RequestContext) {
	aid, err := strconv.ParseInt(req.Query("sid"), 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "Transfer aid to int failed:" + err.Error(),
		})
		return
	}
	single, err := query.Single.WithContext(c).Where(query.Single.Id.Eq(aid)).First()
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "QueryDB err:" + err.Error(),
		})
	} else {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "Ac",
			Data: single,
		})
	}

}
func GetSangListDetail(c context.Context, req *app.RequestContext) {
	Lid := req.Query("lid")
	lid, err := strconv.ParseInt(Lid, 10, 64)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "Transfer lid to int failed:" + err.Error(),
		})
		return
	}
	ListInfo, err := service.GetSangListInfoById(c, lid)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "QueryDB err:" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: ListInfo,
	})
}

func QueryAuthorByName(c context.Context, req *app.RequestContext) {
	name := req.Query("name")
	author, err := service.GetAuthorInfoByName(c, name)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg:  "service err:" + err.Error(),
			Data: nil,
		})
	} else {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg:  "Ac",
			Data: author,
		})
	}

}

func QueryAlbumNameWithIds(c context.Context, req *app.RequestContext) {
	Ids, b := req.GetPostFormArray("ids")
	if !b {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg: "empty query",
		})
		return
	}

	var ids []*int64
	for _, strId := range Ids {
		idStrs := strings.Split(strId, ",")
		for _, idStr := range idStrs {
			Iid, err := strconv.ParseInt(idStr, 10, 64)
			if err != nil {
				req.JSON(http.StatusBadRequest, models.BaseResponse{
					Msg: "Ac" + err.Error(),
				})
				return
			}
			ids = append(ids, &Iid)
		}
	}

	names, err := service.QueryAlbumNameWithIds(c, ids)
	if err != nil {
		req.JSON(http.StatusOK, models.BaseResponse{
			Msg: "Service err:" + err.Error(),
		})
		return
	}

	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: names,
	})
}

func GetAuthorDetail(c context.Context, req *app.RequestContext) {
	name := req.Query("name")
	res, err := service.GetAuthorPage(c, name)
	if err != nil {
		req.JSON(http.StatusBadRequest, models.BaseResponse{
			Msg: "Service err:" + err.Error(),
		})
		return
	}
	req.JSON(http.StatusOK, models.BaseResponse{
		Msg:  "Ac",
		Data: res,
	})

}
