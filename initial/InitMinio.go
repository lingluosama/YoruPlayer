package initial

import (
	"YoruPlayer/configs"
	"context"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"log"
	"mime/multipart"
)

type MinioClient struct {
	M *minio.Client
}

func InitMinio() *minio.Client {
	Client, err := minio.New(configs.MinIOEndPoint, &minio.Options{
		Creds:  credentials.NewStaticV4(configs.MInIOAccessKey, configs.MinIOSecretKey, ""),
		Secure: false,
	})
	if err != nil {
		log.Fatal(err)
	}
	return Client
}

func (m MinioClient) PutFile(ctx context.Context, bucketName, objectName string, file multipart.File, fileHeader *multipart.FileHeader) error {
	err := m.M.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
	if err != nil {
		exists, errBucketExists := m.M.BucketExists(ctx, bucketName)
		if errBucketExists == nil && exists {
			log.Printf("Bucket %s already exists\n", bucketName)
		} else {
			return err
		}
	}

	_, err = m.M.PutObject(ctx, bucketName, objectName, file, fileHeader.Size, minio.PutObjectOptions{ContentType: fileHeader.Header.Get("Content-Type")})
	return err
}
