package initial

import (
	"YoruPlayer/configs"
	"YoruPlayer/entity"
	"YoruPlayer/service/query"
	"gorm.io/driver/mysql"
	"gorm.io/gen"
	"gorm.io/gorm"
	"log"
)

func InitDB() *gorm.DB {
	g := gen.NewGenerator(gen.Config{
		OutPath: "./service/query",
		Mode:    gen.WithoutContext | gen.WithDefaultQuery | gen.WithQueryInterface, // generate mode
	})
	db, err := gorm.Open(mysql.Open(configs.GetDBInfo()), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	g.UseDB(db)

	g.ApplyBasic(entity.User{}, entity.Album{}, entity.Single{})

	g.Execute()

	query.SetDefault(db)

	if query.User == nil {
		log.Fatal("query.User is nil")
	}

	return db
}