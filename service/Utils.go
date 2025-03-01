package service

import (
	"YoruPlayer/configs"
	"YoruPlayer/initial"
	"crypto/rand"
	"crypto/sha512"
	"crypto/subtle"
	"errors"
	"github.com/bwmarrin/snowflake"
	"github.com/dgrijalva/jwt-go"
	"github.com/hajimehoshi/go-mp3"
	"golang.org/x/crypto/pbkdf2"
	"log"
	"math"
	"mime/multipart"
)

var (
	RedisUtils initial.RedisClient
	MinioUtils initial.MinioClient
	HttpUtils  initial.HttpClient
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

func GetMP3Length(sang *multipart.FileHeader) (time *int64, err error) {
	temp, err := sang.Open()
	if err != nil {
		return nil, err
	}
	defer temp.Close()

	decoder, err := mp3.NewDecoder(temp)
	if err != nil {
		return nil, err
	}

	sampleRate := decoder.SampleRate()
	totalSamples := decoder.Length()
	durationSeconds := float64(totalSamples) / float64(sampleRate)

	res := int64(math.Ceil(durationSeconds / 4))

	return &res, nil
}

func generateSalt(length int) ([]byte, error) {
	salt := make([]byte, length)
	_, err := rand.Read(salt)
	if err != nil {
		return nil, err
	}
	return salt, nil
}
func hashPassword(password string, salt []byte) []byte {
	iterations := 100000 // 迭代次数
	keyLength := 64      // 生成密钥长度（字节）

	// 将字符串密码转换为字节
	passwordBytes := []byte(password)

	// 使用PBKDF2算法生成密钥
	return pbkdf2.Key(
		passwordBytes,
		salt,
		iterations,
		keyLength,
		sha512.New,
	)
}
func verifyPassword(storedHash []byte, storedSalt []byte, inputPassword string) bool {
	inputHash := hashPassword(inputPassword, storedSalt)
	return subtle.ConstantTimeCompare(storedHash, inputHash) == 1
}
