package Db

type Author struct {
	Id     int64  `gorm:"primaryKey;column:id" json:"id"`
	Name   string `gorm:"column:name" json:"name"`
	Avatar string `gorm:"column:avatar" json:"avatar"`
}
