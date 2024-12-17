package Db

type Single struct {
	Id       int64  `gorm:"primaryKey;column:id" json:"id"`
	Resource string `gorm:"column:resource" json:"resource"`
	Cover    string `gorm:"column:cover" json:"cover"`
	Title    string `gorm:"column:title" json:"title"`
	Author   string `gorm:"column:author" json:"author"`
	Length   int64  `gorm:"column:length" json:"length"`
	AlbumId  int64  `gorm:"column:album_id" json:"album_id"`
}
