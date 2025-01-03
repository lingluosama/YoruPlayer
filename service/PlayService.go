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
		PlayHistory.Messages = append(PlayHistory.Messages, &NewRecord)
		RedisUtils.SetValue(c, key, PlayHistory)
	} else {
		PlayHistory.Uid = uid
		PlayHistory.Messages = make([]*cache.HistoryMessage, 0)
		PlayHistory.Messages = append(PlayHistory.Messages, &NewRecord)

		RedisUtils.SetValue(c, key, PlayHistory)
	}
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
