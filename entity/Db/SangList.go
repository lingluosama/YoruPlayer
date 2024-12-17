package Db

type SangList struct {
	Id      int64  `gorm:"primaryKey;column:id" json:"id"`
	Cover   string `grom:"column:id" json:"cover"`
	Creater int64  `gorm:"column:creater" json:"creater"`
	Title   string `gorm:"column:title" json:"title"`
}

func (SangList) TableName() string {

	return "sang-list"

}
