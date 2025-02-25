package cache

import (
	"YoruPlayer/entity/Db"
	"YoruPlayer/models/response"
)

type HistoryMessage struct {
	Single Db.Single
	Count  int64
	Tags   []*string
}

type PlayHistory struct {
	Uid      int64 `json:"uid"`
	Messages []*HistoryMessage
}
type ResHistoryMessage struct {
	Single response.Single
	Count  int64
	Tags   []*string
}
