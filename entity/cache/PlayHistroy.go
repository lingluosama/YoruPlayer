package cache

import "YoruPlayer/entity/Db"

type HistoryMessage struct {
	Single Db.Single
	Tags   []*string
}

type PlayHistory struct {
	Uid      int64 `json:"uid"`
	Messages []*HistoryMessage
}
