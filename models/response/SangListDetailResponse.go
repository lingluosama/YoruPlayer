package response

import "YoruPlayer/entity/Db"

type SangListDetailResponse struct {
	Singles  []*Db.Single `json:"singles"`
	SangList Db.SangList  `json:"sangList"`
}
