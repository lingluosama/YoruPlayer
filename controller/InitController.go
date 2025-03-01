package controller

import (
	"YoruPlayer/middleware"
	"github.com/cloudwego/hertz/pkg/app/server"
	"github.com/hertz-contrib/cors"
	"log"
	"time"
)

func InitController() *server.Hertz {
	h := server.New(server.WithMaxRequestBodySize(100 * 1024 * 1024)) // 将最大请求体大小设置为 100MB
	h.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "POST", "GET", "DELETE"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Type"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		MaxAge: 24 * time.Hour,
	}))

	userGroup := h.Group("/user")
	userGroup.GET("/login", Login)
	userGroup.GET("/info", middleware.JwtAuth(), GetUserInfo)
	userGroup.POST("/register", UserRegister)
	userGroup.POST("/create/sanglist", CreateSangList)
	userGroup.POST("/sanglist/add", AddSingleToSangList)
	userGroup.POST("/update", UpdateUserInfo)
	userGroup.GET("/sanglist", GetUserSangList)
	userGroup.POST("/update/sanglist", UpdateSangListInfo)
	userGroup.POST("/sanglist/delete", DeleteSingleFormSangList)
	userGroup.GET("/sanglist/in", AddSangListState)

	fileGroup := h.Group("/file")
	fileGroup.POST("/single", middleware.JwtAuth(), UploadSingleSang)
	fileGroup.POST("/album", middleware.JwtAuth(), CreateAlbum)
	fileGroup.POST("/update/single", middleware.JwtAuth(), UpdateSingleInfo)
	fileGroup.POST("/update/album", middleware.JwtAuth(), UpdateAlbumInfo)
	fileGroup.POST("/album/add", middleware.JwtAuth(), AddSingleToAlbum)
	fileGroup.POST("/album/delete", middleware.JwtAuth(), DeleteSingleFormAlbum)
	fileGroup.POST("/author", UploadNewAuthorInfo)
	fileGroup.POST("/update/author", UpdateAuthorInfo)

	queryGroup := h.Group("/query")
	queryGroup.GET("/single/message", GetSingleDetail)
	queryGroup.GET("/list", QueryList)
	queryGroup.GET("/album/message", GetAlbumDetail)
	queryGroup.GET("/sanglist/message", GetSangListDetail)
	queryGroup.GET("/author/name", QueryAuthorByName)
	queryGroup.POST("/album/names", QueryAlbumNameWithIds)
	queryGroup.GET("/author/message", GetAuthorDetail)
	queryGroup.GET("/album/bytitle", GetAlbumInfoByTitle)

	playGroup := h.Group("/play")
	playGroup.GET("/query", middleware.JwtAuth(), QueryQueue)
	playGroup.POST("/add", middleware.JwtAuth(), AddPlayListQueue)
	playGroup.POST("/delete", middleware.JwtAuth(), DeleteFormQueue)
	playGroup.GET("/history", GetUserPlayHistory)
	playGroup.GET("/replace", ReplacePlayQueue)

	recGroup := h.Group("/recommend")
	recGroup.POST("/tag/add", AddTagForSang)
	recGroup.GET("/tags", GetTags)
	recGroup.GET("/tag/single", GetSingleTags)
	recGroup.GET("/tag/sanglist", GetSangListTags)
	recGroup.POST("/tag/create", CreateNewTag)
	recGroup.POST("/tag/drop", DropTagFromSang)
	recGroup.POST("/tag/erase", EraseTag)
	recGroup.GET("/result", GetRecommend)
	recGroup.POST("/tag/drop/sanglist", DropTagFromSangList)
	recGroup.POST("/tag/add/sanglist", AddTagForSangList)
	recGroup.GET("/tag/search", SearchTag)

	adminGroup := h.Group("/admin")
	adminGroup.POST("/delete", middleware.AdminAuth(), DeleteHandler)
	adminGroup.POST("/grant", middleware.AdminAuth(), GrantAdmin)
	err := h.Run()
	if err != nil {
		log.Panicln("fail start controller", err)
	}
	return h
}
