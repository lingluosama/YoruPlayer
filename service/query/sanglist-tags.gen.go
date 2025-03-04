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

func newSangListToTag(db *gorm.DB, opts ...gen.DOOption) sangListToTag {
	_sangListToTag := sangListToTag{}

	_sangListToTag.sangListToTagDo.UseDB(db, opts...)
	_sangListToTag.sangListToTagDo.UseModel(&Db.SangListToTag{})

	tableName := _sangListToTag.sangListToTagDo.TableName()
	_sangListToTag.ALL = field.NewAsterisk(tableName)
	_sangListToTag.Id = field.NewInt64(tableName, "id")
	_sangListToTag.Tag = field.NewString(tableName, "tag")
	_sangListToTag.Lid = field.NewInt64(tableName, "lid")

	_sangListToTag.fillFieldMap()

	return _sangListToTag
}

type sangListToTag struct {
	sangListToTagDo

	ALL field.Asterisk
	Id  field.Int64
	Tag field.String
	Lid field.Int64

	fieldMap map[string]field.Expr
}

func (s sangListToTag) Table(newTableName string) *sangListToTag {
	s.sangListToTagDo.UseTable(newTableName)
	return s.updateTableName(newTableName)
}

func (s sangListToTag) As(alias string) *sangListToTag {
	s.sangListToTagDo.DO = *(s.sangListToTagDo.As(alias).(*gen.DO))
	return s.updateTableName(alias)
}

func (s *sangListToTag) updateTableName(table string) *sangListToTag {
	s.ALL = field.NewAsterisk(table)
	s.Id = field.NewInt64(table, "id")
	s.Tag = field.NewString(table, "tag")
	s.Lid = field.NewInt64(table, "lid")

	s.fillFieldMap()

	return s
}

func (s *sangListToTag) GetFieldByName(fieldName string) (field.OrderExpr, bool) {
	_f, ok := s.fieldMap[fieldName]
	if !ok || _f == nil {
		return nil, false
	}
	_oe, ok := _f.(field.OrderExpr)
	return _oe, ok
}

func (s *sangListToTag) fillFieldMap() {
	s.fieldMap = make(map[string]field.Expr, 3)
	s.fieldMap["id"] = s.Id
	s.fieldMap["tag"] = s.Tag
	s.fieldMap["lid"] = s.Lid
}

func (s sangListToTag) clone(db *gorm.DB) sangListToTag {
	s.sangListToTagDo.ReplaceConnPool(db.Statement.ConnPool)
	return s
}

func (s sangListToTag) replaceDB(db *gorm.DB) sangListToTag {
	s.sangListToTagDo.ReplaceDB(db)
	return s
}

type sangListToTagDo struct{ gen.DO }

type ISangListToTagDo interface {
	gen.SubQuery
	Debug() ISangListToTagDo
	WithContext(ctx context.Context) ISangListToTagDo
	WithResult(fc func(tx gen.Dao)) gen.ResultInfo
	ReplaceDB(db *gorm.DB)
	ReadDB() ISangListToTagDo
	WriteDB() ISangListToTagDo
	As(alias string) gen.Dao
	Session(config *gorm.Session) ISangListToTagDo
	Columns(cols ...field.Expr) gen.Columns
	Clauses(conds ...clause.Expression) ISangListToTagDo
	Not(conds ...gen.Condition) ISangListToTagDo
	Or(conds ...gen.Condition) ISangListToTagDo
	Select(conds ...field.Expr) ISangListToTagDo
	Where(conds ...gen.Condition) ISangListToTagDo
	Order(conds ...field.Expr) ISangListToTagDo
	Distinct(cols ...field.Expr) ISangListToTagDo
	Omit(cols ...field.Expr) ISangListToTagDo
	Join(table schema.Tabler, on ...field.Expr) ISangListToTagDo
	LeftJoin(table schema.Tabler, on ...field.Expr) ISangListToTagDo
	RightJoin(table schema.Tabler, on ...field.Expr) ISangListToTagDo
	Group(cols ...field.Expr) ISangListToTagDo
	Having(conds ...gen.Condition) ISangListToTagDo
	Limit(limit int) ISangListToTagDo
	Offset(offset int) ISangListToTagDo
	Count() (count int64, err error)
	Scopes(funcs ...func(gen.Dao) gen.Dao) ISangListToTagDo
	Unscoped() ISangListToTagDo
	Create(values ...*Db.SangListToTag) error
	CreateInBatches(values []*Db.SangListToTag, batchSize int) error
	Save(values ...*Db.SangListToTag) error
	First() (*Db.SangListToTag, error)
	Take() (*Db.SangListToTag, error)
	Last() (*Db.SangListToTag, error)
	Find() ([]*Db.SangListToTag, error)
	FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*Db.SangListToTag, err error)
	FindInBatches(result *[]*Db.SangListToTag, batchSize int, fc func(tx gen.Dao, batch int) error) error
	Pluck(column field.Expr, dest interface{}) error
	Delete(...*Db.SangListToTag) (info gen.ResultInfo, err error)
	Update(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	Updates(value interface{}) (info gen.ResultInfo, err error)
	UpdateColumn(column field.Expr, value interface{}) (info gen.ResultInfo, err error)
	UpdateColumnSimple(columns ...field.AssignExpr) (info gen.ResultInfo, err error)
	UpdateColumns(value interface{}) (info gen.ResultInfo, err error)
	UpdateFrom(q gen.SubQuery) gen.Dao
	Attrs(attrs ...field.AssignExpr) ISangListToTagDo
	Assign(attrs ...field.AssignExpr) ISangListToTagDo
	Joins(fields ...field.RelationField) ISangListToTagDo
	Preload(fields ...field.RelationField) ISangListToTagDo
	FirstOrInit() (*Db.SangListToTag, error)
	FirstOrCreate() (*Db.SangListToTag, error)
	FindByPage(offset int, limit int) (result []*Db.SangListToTag, count int64, err error)
	ScanByPage(result interface{}, offset int, limit int) (count int64, err error)
	Scan(result interface{}) (err error)
	Returning(value interface{}, columns ...string) ISangListToTagDo
	UnderlyingDB() *gorm.DB
	schema.Tabler
}

func (s sangListToTagDo) Debug() ISangListToTagDo {
	return s.withDO(s.DO.Debug())
}

func (s sangListToTagDo) WithContext(ctx context.Context) ISangListToTagDo {
	return s.withDO(s.DO.WithContext(ctx))
}

func (s sangListToTagDo) ReadDB() ISangListToTagDo {
	return s.Clauses(dbresolver.Read)
}

func (s sangListToTagDo) WriteDB() ISangListToTagDo {
	return s.Clauses(dbresolver.Write)
}

func (s sangListToTagDo) Session(config *gorm.Session) ISangListToTagDo {
	return s.withDO(s.DO.Session(config))
}

func (s sangListToTagDo) Clauses(conds ...clause.Expression) ISangListToTagDo {
	return s.withDO(s.DO.Clauses(conds...))
}

func (s sangListToTagDo) Returning(value interface{}, columns ...string) ISangListToTagDo {
	return s.withDO(s.DO.Returning(value, columns...))
}

func (s sangListToTagDo) Not(conds ...gen.Condition) ISangListToTagDo {
	return s.withDO(s.DO.Not(conds...))
}

func (s sangListToTagDo) Or(conds ...gen.Condition) ISangListToTagDo {
	return s.withDO(s.DO.Or(conds...))
}

func (s sangListToTagDo) Select(conds ...field.Expr) ISangListToTagDo {
	return s.withDO(s.DO.Select(conds...))
}

func (s sangListToTagDo) Where(conds ...gen.Condition) ISangListToTagDo {
	return s.withDO(s.DO.Where(conds...))
}

func (s sangListToTagDo) Order(conds ...field.Expr) ISangListToTagDo {
	return s.withDO(s.DO.Order(conds...))
}

func (s sangListToTagDo) Distinct(cols ...field.Expr) ISangListToTagDo {
	return s.withDO(s.DO.Distinct(cols...))
}

func (s sangListToTagDo) Omit(cols ...field.Expr) ISangListToTagDo {
	return s.withDO(s.DO.Omit(cols...))
}

func (s sangListToTagDo) Join(table schema.Tabler, on ...field.Expr) ISangListToTagDo {
	return s.withDO(s.DO.Join(table, on...))
}

func (s sangListToTagDo) LeftJoin(table schema.Tabler, on ...field.Expr) ISangListToTagDo {
	return s.withDO(s.DO.LeftJoin(table, on...))
}

func (s sangListToTagDo) RightJoin(table schema.Tabler, on ...field.Expr) ISangListToTagDo {
	return s.withDO(s.DO.RightJoin(table, on...))
}

func (s sangListToTagDo) Group(cols ...field.Expr) ISangListToTagDo {
	return s.withDO(s.DO.Group(cols...))
}

func (s sangListToTagDo) Having(conds ...gen.Condition) ISangListToTagDo {
	return s.withDO(s.DO.Having(conds...))
}

func (s sangListToTagDo) Limit(limit int) ISangListToTagDo {
	return s.withDO(s.DO.Limit(limit))
}

func (s sangListToTagDo) Offset(offset int) ISangListToTagDo {
	return s.withDO(s.DO.Offset(offset))
}

func (s sangListToTagDo) Scopes(funcs ...func(gen.Dao) gen.Dao) ISangListToTagDo {
	return s.withDO(s.DO.Scopes(funcs...))
}

func (s sangListToTagDo) Unscoped() ISangListToTagDo {
	return s.withDO(s.DO.Unscoped())
}

func (s sangListToTagDo) Create(values ...*Db.SangListToTag) error {
	if len(values) == 0 {
		return nil
	}
	return s.DO.Create(values)
}

func (s sangListToTagDo) CreateInBatches(values []*Db.SangListToTag, batchSize int) error {
	return s.DO.CreateInBatches(values, batchSize)
}

// Save : !!! underlying implementation is different with GORM
// The method is equivalent to executing the statement: db.Clauses(clause.OnConflict{UpdateAll: true}).Create(values)
func (s sangListToTagDo) Save(values ...*Db.SangListToTag) error {
	if len(values) == 0 {
		return nil
	}
	return s.DO.Save(values)
}

func (s sangListToTagDo) First() (*Db.SangListToTag, error) {
	if result, err := s.DO.First(); err != nil {
		return nil, err
	} else {
		return result.(*Db.SangListToTag), nil
	}
}

func (s sangListToTagDo) Take() (*Db.SangListToTag, error) {
	if result, err := s.DO.Take(); err != nil {
		return nil, err
	} else {
		return result.(*Db.SangListToTag), nil
	}
}

func (s sangListToTagDo) Last() (*Db.SangListToTag, error) {
	if result, err := s.DO.Last(); err != nil {
		return nil, err
	} else {
		return result.(*Db.SangListToTag), nil
	}
}

func (s sangListToTagDo) Find() ([]*Db.SangListToTag, error) {
	result, err := s.DO.Find()
	return result.([]*Db.SangListToTag), err
}

func (s sangListToTagDo) FindInBatch(batchSize int, fc func(tx gen.Dao, batch int) error) (results []*Db.SangListToTag, err error) {
	buf := make([]*Db.SangListToTag, 0, batchSize)
	err = s.DO.FindInBatches(&buf, batchSize, func(tx gen.Dao, batch int) error {
		defer func() { results = append(results, buf...) }()
		return fc(tx, batch)
	})
	return results, err
}

func (s sangListToTagDo) FindInBatches(result *[]*Db.SangListToTag, batchSize int, fc func(tx gen.Dao, batch int) error) error {
	return s.DO.FindInBatches(result, batchSize, fc)
}

func (s sangListToTagDo) Attrs(attrs ...field.AssignExpr) ISangListToTagDo {
	return s.withDO(s.DO.Attrs(attrs...))
}

func (s sangListToTagDo) Assign(attrs ...field.AssignExpr) ISangListToTagDo {
	return s.withDO(s.DO.Assign(attrs...))
}

func (s sangListToTagDo) Joins(fields ...field.RelationField) ISangListToTagDo {
	for _, _f := range fields {
		s = *s.withDO(s.DO.Joins(_f))
	}
	return &s
}

func (s sangListToTagDo) Preload(fields ...field.RelationField) ISangListToTagDo {
	for _, _f := range fields {
		s = *s.withDO(s.DO.Preload(_f))
	}
	return &s
}

func (s sangListToTagDo) FirstOrInit() (*Db.SangListToTag, error) {
	if result, err := s.DO.FirstOrInit(); err != nil {
		return nil, err
	} else {
		return result.(*Db.SangListToTag), nil
	}
}

func (s sangListToTagDo) FirstOrCreate() (*Db.SangListToTag, error) {
	if result, err := s.DO.FirstOrCreate(); err != nil {
		return nil, err
	} else {
		return result.(*Db.SangListToTag), nil
	}
}

func (s sangListToTagDo) FindByPage(offset int, limit int) (result []*Db.SangListToTag, count int64, err error) {
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

func (s sangListToTagDo) ScanByPage(result interface{}, offset int, limit int) (count int64, err error) {
	count, err = s.Count()
	if err != nil {
		return
	}

	err = s.Offset(offset).Limit(limit).Scan(result)
	return
}

func (s sangListToTagDo) Scan(result interface{}) (err error) {
	return s.DO.Scan(result)
}

func (s sangListToTagDo) Delete(models ...*Db.SangListToTag) (result gen.ResultInfo, err error) {
	return s.DO.Delete(models)
}

func (s *sangListToTagDo) withDO(do gen.Dao) *sangListToTagDo {
	s.DO = *do.(*gen.DO)
	return s
}
