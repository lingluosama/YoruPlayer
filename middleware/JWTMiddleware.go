package middleware

import (
	"YoruPlayer/models"
	"YoruPlayer/service"
	"context"
	"github.com/cloudwego/hertz/pkg/app"
	"net/http"
)

func JwtAuth() app.HandlerFunc {
	return func(c context.Context, ctx *app.RequestContext) {
		token := ctx.Request.Header.Get("Authorization")
		if token == "" {
			ctx.JSON(http.StatusUnauthorized, &models.BaseResponse{
				Msg:  "No token provided",
				Data: nil,
			})
			ctx.Abort()
			return
		}
		_, err := service.ParseToken(token)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, &models.BaseResponse{
				Msg:  "Invalid Token",
				Data: nil,
			})
			ctx.Abort()
			return
		}
		ctx.Next(c)
	}
}
