package response

type SangListProviderRes struct {
	List []*SangListProviderRow `json:"list"`
}

type SangListProviderRow struct {
	SangList SangList `json:"sangList"`
	IsIn     bool     `json:"isIn"`
}
