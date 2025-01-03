package Db

type SangToTag struct {
	Id  int64  `gorm:"primaryKey;column:id" json:"id"`
	Tag string `gorm:"column:tag" json:"tag"`
	Sid int64  `gorm:"column:sid" json:"sid"`
}

func (SangToTag) TableName() string {
	return "sang-tags"
}
