package response

type SangListDetailResponse struct {
	Singles  []*Single `json:"singles"`
	SangList SangList  `json:"sangList"`
}
