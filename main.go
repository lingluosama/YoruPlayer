package main

import (
	"YoruPlayer/controller"
	"YoruPlayer/initial"
	"YoruPlayer/service"
	"net/http"
)

func main() {
	initial.InitDB()

	redis := initial.InitRedis()
	service.RedisUtils = initial.RedisClient{
		R: redis,
	}
	initial.InitAllListener()
	minio := initial.InitMinio()
	Http := &http.Client{}
	service.MinioUtils = initial.MinioClient{
		M: minio,
	}
	service.HttpUtils = initial.HttpClient{H: Http}
	controller.InitController()

}
