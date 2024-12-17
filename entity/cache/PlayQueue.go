package cache

import "YoruPlayer/entity/Db"

type PlayList struct {
	Uid      int64       `json:"uid"`
	SangList []Db.Single `json:"sang_list"`
}
