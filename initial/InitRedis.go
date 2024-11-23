package initial

import (
	"YoruPlayer/configs"
	"context"
	"encoding/json"
	"github.com/go-redis/redis/v8"
	"log"
)

type RedisClient struct {
	R *redis.Client
}

func InitRedis() *redis.Client {
	rdb := redis.NewClient(configs.RedisConfig())
	return rdb
}
func (r RedisClient) SetValue(ctx context.Context, key string, data any) {
	marshal, err := json.Marshal(data)
	if err != nil {
		log.Fatalln("failed in Json Object", err)
	}
	err = r.R.Set(ctx, key, marshal, 0).Err()
	if err != nil {
		log.Fatal("failed keep in redis", err)
	}

}
func (r RedisClient) GetValue(ctx context.Context, key string, out interface{}) error {
	val, err := r.R.Get(ctx, key).Result()
	if err != nil {
		return err
	}
	err = json.Unmarshal([]byte(val), &out)
	if err != nil {
		return err
	}

	return nil
}
