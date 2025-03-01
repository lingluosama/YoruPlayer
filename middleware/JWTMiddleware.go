package middleware

import (
	"YoruPlayer/models"
	"YoruPlayer/service"
	"YoruPlayer/service/query"
	"context"
	"github.com/cloudwego/hertz/pkg/app"
	"net/http"
	"strconv"
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

func AdminAuth() app.HandlerFunc {
	return func(c context.Context, req *app.RequestContext) {
		target := req.Query("target")
		if target == "sanglist" {
			req.Next(c)
			return
		}
		Uid := req.Query("uid")
		uid, err := strconv.ParseInt(Uid, 10, 64)
		if err != nil {
			req.JSON(http.StatusUnauthorized, &models.BaseResponse{
				Msg:  "Invalid Token",
				Data: nil,
			})
			req.Abort()
			return
		}
		first, err := query.User.WithContext(c).Where(query.User.Id.Eq(uid)).First()
		if err != nil {
			req.JSON(http.StatusUnauthorized, &models.BaseResponse{
				Msg:  "middleware err:" + err.Error(),
				Data: nil,
			})
			req.Abort()
			return
		}
		if first.Authority == false {

			req.JSON(http.StatusUnauthorized, &models.BaseResponse{
				Msg:  "Wa",
				Data: nil,
			})
			req.Abort()
			return
		}
		req.Next(c)

	}

}
