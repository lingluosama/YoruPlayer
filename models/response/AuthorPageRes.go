package response

type AuthorPageRes struct {
	Author    Author    `json:"author"`
	SangList  []*Single `json:"sang_list"`
	AlbumList []*Album  `json:"album_list"`
}
