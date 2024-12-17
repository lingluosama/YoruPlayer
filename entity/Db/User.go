package Db

type User struct {
	Id        int64  `gorm:"primaryKey;column:id" json:"id"`
	Name      string `gorm:"column:name" json:"name"`
	Password  string `gorm:"column:password" json:"password"`
	Avatar    string `gorm:"column:avatar" json:"avatar"`
	Signature string `gorm:"column:signature" json:"signature"`
	Email     string `gorm:"column:email" json:"email"`
}
