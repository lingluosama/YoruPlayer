package models

type BaseResponse struct {
	Msg  string `json:"msg"`
	Data any    `json:"data"`
}
