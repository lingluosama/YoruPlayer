package Db

type SangToList struct {
	LID int64 `gorm:"column:lid;primaryKey" json:"lid"`
	SID int64 `gorm:"column:sid;primaryKey" json:"sid"`
}

func (SangToList) TableName() string {
	return "sang-tolist"
}
