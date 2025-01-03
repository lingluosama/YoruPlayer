package service

import (
	"YoruPlayer/service/query"
	"context"
)

func GetSingleTag(c context.Context, sid int64) ([]*string, error) {
	records, err := query.SangToTag.WithContext(c).Where(query.SangToTag.Sid.Eq(sid)).Find()
	if err != nil {
		return nil, err
	}
	var tags []*string
	for i := range records {
		tags = append(tags, &records[i].Tag)
	}
	return tags, nil
}
