package entity

type Album struct {
	Id          int64  `gorm:"primaryKey;column:id" json:"id"`
	Title       string `gorm:"column:title" json:"title"`
	Cover       string `gorm:"column:cover" json:"cover"`
	Author      string `gorm:"column:author" json:"author"`
	Description string `gorm:"column:description" json:"description"`
}
