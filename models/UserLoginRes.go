package models

type UserLoginRes struct {
	Id    string `json:"uid"`
	Token string `json:"token"`
}
