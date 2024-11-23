package main

import (
	"YoruPlayer/controller"
	"YoruPlayer/initial"
	"YoruPlayer/service"
)

func main() {
	initial.InitDB()

	redis := initial.InitRedis()
	service.RedisUtils = initial.RedisClient{
		R: redis,
	}

	minio := initial.InitMinio()
	service.MinioUtils = initial.MinioClient{
		M: minio,
	}

	initial.InitAllListener()
	controller.InitController()
}
