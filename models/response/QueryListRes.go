package response

type QueryListRes struct {
	Msg    string `json:"msg"`
	Data   any    `json:"data"`
	Length int32  `json:"length"`
}

type Album struct {
	Id          string `gorm:"primaryKey;column:id" json:"id"`
	Title       string `gorm:"column:title" json:"title"`
	Cover       string `gorm:"column:cover" json:"cover"`
	Author      string `gorm:"column:author" json:"author"`
	Description string `gorm:"column:description" json:"description"`
}
type SangList struct {
	Id          string `gorm:"primaryKey;column:id" json:"id"`
	Cover       string `grom:"column:id" json:"cover"`
	Creater     string `gorm:"column:creater" json:"creater"`
	Title       string `gorm:"column:title" json:"title"`
	Description string `gorm:"column:description" json:"description"`
}
type Author struct {
	Id     string `gorm:"primaryKey;column:id" json:"id"`
	Name   string `gorm:"column:name" json:"name"`
	Avatar string `gorm:"column:avatar" json:"avatar"`
}
type Single struct {
	Id       string `gorm:"primaryKey;column:id" json:"id"`
	Resource string `gorm:"column:resource" json:"resource"`
	Cover    string `gorm:"column:cover" json:"cover"`
	Title    string `gorm:"column:title" json:"title"`
	Author   string `gorm:"column:author" json:"author"`
	Length   int64  `gorm:"column:length" json:"length"`
	AlbumId  string `gorm:"column:album_id" json:"album_id"`
}
type User struct {
	Id        string `gorm:"primaryKey;column:id" json:"id"`
	Name      string `gorm:"column:name" json:"name"`
	Password  string `gorm:"column:password" json:"password"`
	Avatar    string `gorm:"column:avatar" json:"avatar"`
	Signature string `gorm:"column:signature" json:"signature"`
	Email     string `gorm:"column:email" json:"email"`
}

type Tag struct {
	Id   string `gorm:"primaryKey;column:id" json:"id"`
	Name string `gorm:"column:name" json:"name"`
}
