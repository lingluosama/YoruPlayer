// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.
// Code generated by gorm.io/gen. DO NOT EDIT.

package query

import (
	"context"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/schema"

	"gorm.io/gen"
	"gorm.io/gen/field"

	"gorm.io/plugin/dbresolver"

	"YoruPlayer/entity/Db"
)

func newSingle(db *gorm.DB, opts ...gen.DOOption) single {
	_single := single{}

	_single.singleDo.UseDB(db, opts...)
	_single.singleDo.UseModel(&Db.Single{})

	tableName := _single.singleDo.TableName()
	_single.ALL = field.NewAsterisk(tableName)
	_single.Id = field.NewInt64(tableName, "id")
	_single.Resource = field.NewString(tableName, "resource")
	_single.Cover = field.NewString(tableName, "cover")
	_single.Title = field.NewString(tableName, "title")
	_single.Author = field.NewString(tableName, "author")
	_single.Length = field.NewInt64(tableName, "length")
	_single.AlbumId = field.NewInt64(tableName, "album_id")

	_single.fillFieldMap()

	return _single
}

type single struct {
	singleDo

	ALL      field.Asterisk
	Id       field.Int64
	Resource field.String
	Cover    field.String
	Title    field.String
	Author   field.String
	Length   field.Int64
	AlbumId  field.Int64

	fieldMap map[string]field.Expr
}

func (s single) Table(newTableName string) *single {
	s.singleDo.UseTable(newTableName)
	return s.updateTableName(newTableName)
}

func (s single) As(alias string) *single {
	s.singleDo.DO = *(s.singleDo.As(alias).(*gen.DO))
	return s.updateTableName(alias)
}

func (s *single) updateTableName(table string) *single {
	s.ALL = field.NewAsterisk(table)
	s.Id = field.NewInt64(table, "id")
	s.Resource = field.NewString(table, "resource")
	s.Cover = field.NewString(table, "cover")
	s.Title = field.NewString(table, "title")
	s.Author = field.NewString(table, "author")
	s.Length = field.NewInt64(table, "length")
	s.AlbumId = field.NewInt64(table, "album_id")

	s.fillFieldMap()

	return s
}

func (s *single) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := s.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (s *single) fillFieldMap() {
	s.fieldMap = make(map[string]field.Expr, 7)
	s.fieldMap["id"] = s.Id
	s.fieldMap["resource"] = s.Resource
	s.fieldMap["cover"] = s.Cover
	s.fieldMap["title"] = s.Title
	s.fieldMap["author"] = s.Author
	s.fieldMap["length"] = s.Length
	s.fieldMap["album_id"] = s.AlbumId
}

func (s single) clone(db *gorm.DB) single {
	s.singleDo.ReplaceConnPool(db.Statement.ConnPool)
	return s
}

func (s single) replaceDB(db *gorm.DB) single {
	s.singleDo.ReplaceDB(db)
	return s
}

type singleDo struct{ gen.DO }

type ISingleDo interface {
	gen.SubQuery
	Debug() ISingleDo
	WithContext(ctx context.Context) ISingleDo
	WithResult(fc func(tx gen.Dao)) gen.ResultInfo
	ReplaceDB(db *gorm.DB)
	ReadDB() ISingleDo
	WriteDB() ISingleDo
	As(alias string) gen.Dao
	Session(config *gorm.Session) ISingleDo
	Columns(cols ...field.Expr) gen.Columns
	Clauses(conds ...clause.Expression) ISingleDo
	Not(conds ...gen.Condition) ISingleDo
	Or(conds ...gen.Condition) ISingleDo
	Select(conds ...field.Expr) ISingleDo
	Where(conds ...gen.Condition) ISingleDo
	Order(conds ...field.Expr) ISingleDo
	Distinct(cols ...field.Expr) ISingleDo
	Omit(cols ...field.Expr) ISingleDo
	Join(table schema.Tabler, on ...field.Expr) ISingleDo
	LeftJoin(table schema.Tabler, on ...field.Expr) ISingleDo
	RightJoin(table schema.Tabler, on ...field.Expr) ISingleDo
	Group(cols ...field.Expr) ISingleDo
	Having(conds ...gen.Condition) ISingleDo
	Limit(limit int) ISingleDo
	Offset(offset int) ISingleDo
	Count() (count int64, err error)
	Scopes(funcs ...func(gen.Dao) gen.Dao) ISingleDo
	Unscoped() ISingleDo
	Create(values ...*Db.Single) error
	CreateInBatches(values []*Db.Single, batchSize int) error
	Save(values ...*Db.Single) error
	First() (*Db.Single, error)
	Take() (*Db.Single, error)
	Last() (*Db.Single, error)
	Find() ([]*Db.Single, error)
	FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*Db.Single, err error)
	FindInBatches(result *[]*Db.Single, batchSize int, fc func(tx gen.Dao, batch int) error) error
	Pluck(column field.Expr, dest interface{}) error
	Delete(...*Db.Single) (info gen.ResultInfo, err error)
	Update(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	Updates(value interface{}) (info gen.ResultInfo, err error)
	UpdateColumn(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateColumnSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	UpdateColumns(value interface{}) (info gen.ResultInfo, err error)
	UpdateFrom(q gen.SubQuery) gen.Dao
	Attrs(attrs ...field.AssignExpr) ISingleDo
	Assign(attrs ...field.AssignExpr) ISingleDo
	Joins(fields ...field.RelationField) ISingleDo
	Preload(fields ...field.RelationField) ISingleDo
	FirstOrInit() (*Db.Single, error)
	FirstOrCreate() (*Db.Single, error)
	FindByPage(offset int, limit int) (result []*Db.Single, count int64, err error)
	ScanByPage(result interface{}, offset int, limit int) (count int64, err error)
	Scan(result interface{}) (err error)
	Returning(value interface{}, columns ...string) ISingleDo
	UnderlyingDB() *gorm.DB
	schema.Tabler
}

func (s singleDo) Debug() ISingleDo {
	return s.withDO(s.DO.Debug())
}

func (s singleDo) WithContext(ctx context.Context) ISingleDo {
	return s.withDO(s.DO.WithContext(ctx))
}

func (s singleDo) ReadDB() ISingleDo {
	return s.Clauses(dbresolver.Read)
}

func (s singleDo) WriteDB() ISingleDo {
	return s.Clauses(dbresolver.Write)
}

func (s singleDo) Session(config *gorm.Session) ISingleDo {
	return s.withDO(s.DO.Session(config))
}

func (s singleDo) Clauses(conds ...clause.Expression) ISingleDo {
	return s.withDO(s.DO.Clauses(conds...))
}

func (s singleDo) Returning(value interface{}, columns ...string) ISingleDo {
	return s.withDO(s.DO.Returning(value, columns...))
}

func (s singleDo) Not(conds ...gen.Condition) ISingleDo {
	return s.withDO(s.DO.Not(conds...))
}

func (s singleDo) Or(conds ...gen.Condition) ISingleDo {
	return s.withDO(s.DO.Or(conds...))
}

func (s singleDo) Select(conds ...field.Expr) ISingleDo {
	return s.withDO(s.DO.Select(conds...))
}

func (s singleDo) Where(conds ...gen.Condition) ISingleDo {
	return s.withDO(s.DO.Where(conds...))
}

func (s singleDo) Order(conds ...field.Expr) ISingleDo {
	return s.withDO(s.DO.Order(conds...))
}

func (s singleDo) Distinct(cols ...field.Expr) ISingleDo {
	return s.withDO(s.DO.Distinct(cols...))
}

func (s singleDo) Omit(cols ...field.Expr) ISingleDo {
	return s.withDO(s.DO.Omit(cols...))
}

func (s singleDo) Join(table schema.Tabler, on ...field.Expr) ISingleDo {
	return s.withDO(s.DO.Join(table, on...))
}

func (s singleDo) LeftJoin(table schema.Tabler, on ...field.Expr) ISingleDo {
	return s.withDO(s.DO.LeftJoin(table, on...))
}

func (s singleDo) RightJoin(table schema.Tabler, on ...field.Expr) ISingleDo {
	return s.withDO(s.DO.RightJoin(table, on...))
}

func (s singleDo) Group(cols ...field.Expr) ISingleDo {
	return s.withDO(s.DO.Group(cols...))
}

func (s singleDo) Having(conds ...gen.Condition) ISingleDo {
	return s.withDO(s.DO.Having(conds...))
}

func (s singleDo) Limit(limit int) ISingleDo {
	return s.withDO(s.DO.Limit(limit))
}

func (s singleDo) Offset(offset int) ISingleDo {
	return s.withDO(s.DO.Offset(offset))
}

func (s singleDo) Scopes(funcs ...func(gen.Dao) gen.Dao) ISingleDo {
	return s.withDO(s.DO.Scopes(funcs...))
}

func (s singleDo) Unscoped() ISingleDo {
	return s.withDO(s.DO.Unscoped())
}

func (s singleDo) Create(values ...*Db.Single) error {
	if len(values) == 0 {
		return nil
	}
	return s.DO.Create(values)
}

func (s singleDo) CreateInBatches(values []*Db.Single, batchSize int) error {
	return s.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (s singleDo) Save(values ...*Db.Single) error {
	if len(values) == 0 {
		return nil
	}
	return s.DO.Save(values)
}

func (s singleDo) First() (*Db.Single, error) {
	if result, err := s.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*Db.Single), nil
	}
}

func (s singleDo) Take() (*Db.Single, error) {
	if result, err := s.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*Db.Single), nil
	}
}

func (s singleDo) Last() (*Db.Single, error) {
	if result, err := s.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*Db.Single), nil
	}
}

func (s singleDo) Find() ([]*Db.Single, error) {
	result, err := s.DO.Find()
	return result.([]*Db.Single), err
}

func (s singleDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*Db.Single, err error) {
	buf := make([]*Db.Single, 0, batchSize)
	err = s.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (s singleDo) FindInBatches(result *[]*Db.Single, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return s.DO.FindInBatches(result, batchSize, fc)
}

func (s singleDo) Attrs(attrs ...field.AssignExpr) ISingleDo {
	return s.withDO(s.DO.Attrs(attrs...))
}

func (s singleDo) Assign(attrs ...field.AssignExpr) ISingleDo {
	return s.withDO(s.DO.Assign(attrs...))
}

func (s singleDo) Joins(fields ...field.RelationField) ISingleDo {
	for _, _f := range fields {
		s = *s.withDO(s.DO.Joins(_f))
	}
	return &s
}

func (s singleDo) Preload(fields ...field.RelationField) ISingleDo {
	for _, _f := range fields {
		s = *s.withDO(s.DO.Preload(_f))
	}
	return &s
}

func (s singleDo) FirstOrInit() (*Db.Single, error) {
	if result, err := s.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*Db.Single), nil
	}
}

func (s singleDo) FirstOrCreate() (*Db.Single, error) {
	if result, err := s.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*Db.Single), nil
	}
}

func (s singleDo) FindByPage(offset int, limit int) (result []*Db.Single, count int64, err error) {
	result, err = s.Offset(offset).Limit(limit).Find()
	if err != nil {
		return
	}

	if size := len(result); 0 < limit && 0 < size && size < limit {
		count = int64(size + offset)
		return
	}

	count, err = s.Offset(-1).Limit(-1).Count()
	return
}

func (s singleDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = s.Count()
	if err != nil {
		return
	}

	err = s.Offset(offset).Limit(limit).Scan(result)
	return
}

func (s singleDo) Scan(result interface{}) (err error) {
	return s.DO.Scan(result)
}

func (s singleDo) Delete(models ...*Db.Single) (result gen.ResultInfo, err error) {
	return s.DO.Delete(models)
}

func (s *singleDo) withDO(do gen.Dao) *singleDo {
	s.DO = *do.(*gen.DO)
	return s
}
