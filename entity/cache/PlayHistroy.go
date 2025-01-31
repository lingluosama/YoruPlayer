package cache

import "YoruPlayer/entity/Db"

type HistoryMessage struct {
	Single Db.Single
	Count  int64
	Tags   []*string
}

type PlayHistory struct {
	Uid      int64 `json:"uid"`
	Messages []*HistoryMessage
}
