package configs

import "github.com/go-redis/redis/v8"

const (
	DbUser   = "root"
	DbPasswd = "12345"
	DbUrl    = "localhost"
	PORT     = "3306"
	DbName   = "Yoru"
)

func GetDBInfo() string {
	return DbUser + ":" + DbPasswd + "@tcp(" + DbUrl + ":" + PORT + ")/" + DbName + "?charset=utf8mb4&parseTime=True&loc=Local"
}

const (
	MinIOEndPoint  = "localhost:9000"
	MInIOAccessKey = "1145141918"
	MinIOSecretKey = "1145141918"
)

const (
	RedisAddr     = "localhost:6379"
	RedisPassword = "123456"
	RedisDB       = 0
)

func RedisConfig() *redis.Options {
	return &redis.Options{
		Addr:     RedisAddr,
		Password: RedisPassword,
		DB:       RedisDB,
	}
}

// configs/configs.go

var JwtKey = []byte("YuruPlay_Keyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
