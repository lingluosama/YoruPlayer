package response

type AlbumDetail struct {
	Album   Album     `json:"album"`
	Singles []*Single `json:"singles"`
}
