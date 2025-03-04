package service

import (
	"YoruPlayer/entity/Db"
	"YoruPlayer/entity/cache"
	"YoruPlayer/service/query"
	"context"
	"errors"
	"strconv"
)

func GetPlayQueueKey(uid int64) string {
	return "playQueue_" + strconv.FormatInt(uid, 10)
}
func GetPlayHistoryKey(uid int64) string {
	return "playHistory_" + strconv.FormatInt(uid, 10)
}
func AddToHistory(c context.Context, uid int64, sang Db.Single) error {
	key := GetPlayHistoryKey(uid)
	cmd := RedisUtils.R.Exists(c, key)
	exists, err := cmd.Result()
	if err != nil {
		return err
	}
	var NewRecord cache.HistoryMessage
	NewRecord.Single = sang
	tags, err := GetSingleTag(c, sang.Id)
	if err != nil {
		return err
	}
	NewRecord.Single = sang
	NewRecord.Tags = tags
	var PlayHistory cache.PlayHistory
	if exists > 0 {
		err := RedisUtils.GetValue(c, key, &PlayHistory)
		if err != nil {
			return err
		}
		var exist = false
		for _, message := range PlayHistory.Messages {
			if message.Single.Id == sang.Id {
				message.Count++
				RedisUtils.SetValue(c, key, PlayHistory)
				exist = true
			}
		}
		NewRecord.Count = 1
		if !exist {
			PlayHistory.Messages = append(PlayHistory.Messages, &NewRecord)
		}
		//限制100条
		if len(PlayHistory.Messages) > 100 {
			PlayHistory.Messages = PlayHistory.Messages[1:]
		}
	} else {
		PlayHistory.Uid = uid
		NewRecord.Count = 1
		PlayHistory.Messages = make([]*cache.HistoryMessage, 0)
		PlayHistory.Messages = append(PlayHistory.Messages, &NewRecord)
	}

	RedisUtils.SetValue(c, key, PlayHistory)

	return nil
}

func QueryHistory(c context.Context, uid int64) (*cache.PlayHistory, error) {
	key := GetPlayHistoryKey(uid)
	var PlayHistory cache.PlayHistory
	err := RedisUtils.GetValue(c, key, &PlayHistory)
	if err != nil {
		return nil, err
	}
	return &PlayHistory, nil

}

func QueryQueue(c context.Context, uid int64) (*cache.PlayList, error) {
	key := GetPlayQueueKey(uid)
	cmd := RedisUtils.R.Exists(c, key)
	exists, err := cmd.Result()
	if err != nil {
		return nil, err
	}

	list := cache.PlayList{}
	if exists > 0 {
		err := RedisUtils.GetValue(c, key, &list)
		if err != nil {
			return nil, err
		}
		return &list, nil
	} else {
		return nil, nil
	}
}

func AddToQueue(c context.Context, uid int64, sid int64, target string) error {
	playList := cache.PlayList{}
	key := GetPlayQueueKey(uid)

	cmd := RedisUtils.R.Exists(c, key)
	exists, err := cmd.Result()
	if err != nil {
		return err
	}

	single, err := query.Single.WithContext(c).Where(query.Single.Id.Eq(sid)).First()
	if err != nil {
		return err
	}

	var singles []Db.Single
	singles = append(singles, *single)

	if exists > 0 {
		err := RedisUtils.GetValue(c, key, &playList)
		if err != nil {
			return err
		}

		for _, s := range playList.SangList {
			if s.Id == sid {
				return errors.New("already in queue")
			}
		}

		if len(playList.SangList) < 1 {
			playList.SangList = append(playList.SangList, *single)
		} else {
			switch target {
			case "next":
				playList.SangList = append(playList.SangList[:1], append(singles, playList.SangList[1:]...)...)
			case "tail":
				playList.SangList = append(playList.SangList, *single)
			case "replace":
				playList.SangList = playList.SangList[1:]
				playList.SangList = append(singles, playList.SangList...)
			}
		}
		RedisUtils.SetValue(c, key, playList)
	} else {
		playList.Uid = uid
		playList.SangList = singles
		RedisUtils.SetValue(c, key, playList)
	}
	return nil
}

func DeleteFromQueue(c context.Context, uid int64, sid int64) error {
	key := GetPlayQueueKey(uid)
	cmd := RedisUtils.R.Exists(c, key)
	exists, err := cmd.Result()
	if err != nil {
		return err
	}
	list := cache.PlayList{}
	if exists > 0 {
		err := RedisUtils.GetValue(c, key, &list)
		if err != nil {
			return err
		}
		for i, single := range list.SangList {

			if i == 0 {
				err = AddToHistory(c, uid, list.SangList[i])
			}
			if single.Id == sid {
				list.SangList = append(list.SangList[:i], list.SangList[i+1:]...)
			}

		}
		RedisUtils.SetValue(c, key, list)
	} else {
		return errors.New("请先开始播放")
	}
	return err
}
func ReplaceQueue(c context.Context, uid int64, id int64, target string) error {
	key := GetPlayQueueKey(uid)
	list := cache.PlayList{
		Uid:      uid,
		SangList: []Db.Single{},
	}
	if target == "album" {
		singles, err := query.Single.WithContext(c).Where(query.Single.AlbumId.Eq(id)).Find()
		if err != nil {
			return err
		}
		for _, single := range singles {
			list.SangList = append(list.SangList, *single)
		}
	} else if target == "sanglist" {
		singles, err := query.Single.WithContext(c).
			Join(
				query.SangToList,
				query.SangToList.SID.EqCol(query.Single.Id),
				query.SangToList.LID.Eq(id),
			).
			Find()
		if err != nil {
			return err
		}
		for _, single := range singles {
			list.SangList = append(list.SangList, *single)
		}
	}
	RedisUtils.SetValue(c, key, list)
	return nil

}
