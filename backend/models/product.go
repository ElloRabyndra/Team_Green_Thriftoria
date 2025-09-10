package models

type Product struct {
	ID          int       `json:"id"    gorm:"primaryKey"`
	Name		string    `json:"name" gorm:"type:varchar(100)"`
}

func (*Product) TableName() string {
	return "products"
}

