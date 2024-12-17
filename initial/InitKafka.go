package initial

import (
	"YoruPlayer/entity/Db"
	"YoruPlayer/models/kafkaMessage"
	"YoruPlayer/service/query"
	"context"
	"encoding/json"
	"errors"
	"github.com/segmentio/kafka-go"
	"log"
	"time"
)

var (
	kafkaBrokers = []string{"localhost:9094"}
)

func SendMessageQueue(topic string, value any, key string, ctx context.Context) {
	w := kafka.Writer{
		Addr:     kafka.TCP(kafkaBrokers...),
		Topic:    topic,
		Balancer: &kafka.Hash{},
		Async:    true,
	}
	defer w.Close()

	ValueBytes, err2 := json.Marshal(value)
	if err2 != nil {
		log.Printf("failed to json marshal message value: %v\n", err2)
		return
	}

	message := kafka.Message{
		Key:   []byte(key),
		Value: ValueBytes,
	}

	err := w.WriteMessages(ctx, message)
	if err != nil {
		log.Printf("failed to send message: %v\n", err)
	} else {
		log.Println("message sent successfully")
	}
}

func QueryAllSongListener() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   kafkaBrokers,
		GroupID:   "all-sangs-group",
		Topic:     "all-sangs",
		Partition: 0,
	})
	defer r.Close()

	for {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		message, err := r.ReadMessage(ctx)
		if err != nil {
			if errors.Is(err, context.DeadlineExceeded) {
				continue
			}
			log.Printf("failed to read message: %v\n", err)
			continue
		}
		var album Db.Album
		err = json.Unmarshal(message.Value, &album)
		if err != nil {
			log.Println("Unmarshal failed in All-sangs Listener")
		}
		log.Printf("Received album: %+v\n", album)
		if err := r.CommitMessages(ctx, message); err != nil {
			log.Printf("commit failed: %v\n", err)
		}
	}

}

func AddToSangListListener() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: kafkaBrokers,
		GroupID: "add-sang-list-group",
		Topic:   "add-sang-list",
	})
	defer r.Close()

	for {
		ctx, cancelFunc := context.WithTimeout(context.Background(), 10*time.Second)
		message, err := r.ReadMessage(ctx)
		cancelFunc()
		if errors.Is(err, context.DeadlineExceeded) {
			continue
		}
		if err != nil {
			log.Printf("AddToSangListListener failed to read message: %v\n", err)
			continue
		}

		var data kafkaMessage.AddSangListMessage
		err = json.Unmarshal(message.Value, &data)
		if err != nil {
			log.Println("Unmarshal failed in AddToSangListListener")
			continue
		}

		_, err = query.SangToList.
			Where(query.SangToList.SID.Eq(data.Sid)).
			Where(query.SangToList.LID.Eq(data.Lid)).
			First()
		if err == nil {
			log.Println("重复添加歌曲")
			continue
		} else if err != nil && err.Error() != "record not found" {
			log.Printf("AddToSangListListener Err: %v\n", err)
			continue
		}

		err = query.SangToList.WithContext(context.Background()).Save(&Db.SangToList{
			LID: data.Lid,
			SID: data.Sid,
		})
		if err != nil {
			log.Printf("AddToSangListListener Err: %v\n", err)
			continue
		}

		sanginfo, err := query.Single.WithContext(context.Background()).Where(query.Single.Id.Eq(data.Sid)).First()
		if err != nil {
			log.Printf("QuerySangMessageErr: %v\n", err)
			continue
		}

		_, err = query.SangList.WithContext(context.Background()).Where(query.SangList.Id.Eq(data.Lid)).Updates(Db.SangList{Cover: sanginfo.Cover})
		if err != nil {
			log.Printf("AddToSangListListener Err: %v\n", err)
		}

		log.Println("成功添加歌曲")
	}
}

func InitAllListener() {
	go QueryAllSongListener()
	go AddToSangListListener()
}
