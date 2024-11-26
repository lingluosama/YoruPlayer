package response

import "YoruPlayer/entity"

type AlbumDetail struct {
	Album   entity.Album     `json:"album"`
	Singles []*entity.Single `json:"singles"`
}
