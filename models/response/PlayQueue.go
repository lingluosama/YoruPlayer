package response

type PlayQueue struct {
	Uid      string    `json:"uid"`
	SangList []*Single `json:"sang_list"`
}
