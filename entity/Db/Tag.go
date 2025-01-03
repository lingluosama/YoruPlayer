package Db

type Tag struct {
	Id   int64  `gorm:"primaryKey;column:id" json:"id"`
	Name string `gorm:"column:name" json:"name"`
}
