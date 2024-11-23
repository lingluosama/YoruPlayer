package service

import (
	"YoruPlayer/configs"
	"YoruPlayer/initial"
	"errors"
	"github.com/bwmarrin/snowflake"
	"github.com/dgrijalva/jwt-go"
	"log"
)

var (
	RedisUtils initial.RedisClient
	MinioUtils initial.MinioClient
)

type Claims struct {
	UserId string `json:"user_id"`
	jwt.StandardClaims
}

func GenerateToken(Id string) string {
	claims := &Claims{
		UserId:         Id,
		StandardClaims: jwt.StandardClaims{},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedString, err := token.SignedString(configs.JwtKey)
	if err != nil {
		log.Panicln("Wrong In Singed jwtToken:", err)
		return ""
	}
	return signedString
}
func ParseToken(tokenStr string) (*string, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return configs.JwtKey, nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrSignatureInvalid) {
			return nil, err
		}
		return nil, err
	}

	if !token.Valid {
		return nil, jwt.ErrSignatureInvalid
	}

	return &claims.UserId, nil
}
func GenSnowFlakeId(node int64) (*int64, error) {
	newNode, err := snowflake.NewNode(node)
	if err != nil {
		log.Println("SnowFlakeGenErr: ", err)
		return nil, err
	}
	id := newNode.Generate().Int64()
	return &id, nil
}
