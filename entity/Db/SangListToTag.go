package Db

type SangListToTag struct {
	Id  int64  `gorm:"primaryKey;column:id" json:"id"`
	Tag string `gorm:"column:tag" json:"tag"`
	Lid int64  `gorm:"column:lid" json:"lid"`
}

func (SangListToTag) TableName() string {
	return "sanglist-tags"
}
