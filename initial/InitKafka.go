package initial

import (
	"YoruPlayer/entity"
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
		var album entity.Album
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

func InitAllListener() {
	go QueryAllSongListener()
}
