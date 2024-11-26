package entity

type SangList struct {
	Id      int64  `gorm:"primaryKey;column:id" json:"id"`
	Cover   string `grom:"column:id" json:"cover"`
	Creater int64  `gorm:"column:creater" json:"creater"`
}

func (SangList) TableName() string {

	return "sang-list"

}
