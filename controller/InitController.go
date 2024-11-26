package controller

import (
	"YoruPlayer/middleware"
	"github.com/cloudwego/hertz/pkg/app/server"
	"github.com/hertz-contrib/cors"
	"log"
	"time"
)

func InitController() *server.Hertz {
	h := server.New(server.WithMaxRequestBodySize(100 * 1024 * 1024)) // 将最大请求体大小设置为 10MB
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

	fileGroup := h.Group("/file")
	fileGroup.POST("/single", middleware.JwtAuth(), UploadSingleSang)
	fileGroup.POST("/album", middleware.JwtAuth(), CreateAlbum)

	queryGroup := h.Group("/query")
	queryGroup.GET("/list", QueryList)
	queryGroup.GET("/album/message", GetAlbumDetail)

	err := h.Run()
	if err != nil {
		log.Panicln("fail start controller", err)
	}
	return h
}
