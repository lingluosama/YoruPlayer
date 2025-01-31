package cppBlockResponse

type RecommendData struct {
	Confidence         float64   `json:"confidence"`
	Status             string    `json:"status"`
	TopTags            []*string `json:"top_tags"`
	RecommendedAuthors []*string `json:"recommended_authors"`
}
