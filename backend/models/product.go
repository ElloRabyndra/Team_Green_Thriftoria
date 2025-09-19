package models

import "time"

type Product struct {
	ID        int       `json:"id"    gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"type:varchar(100)"`
	Category  string    `json:"category" gorm:"type:varchar(100)"`
	Image     string    `json:"image" gorm:"type:varchar(100)"`
	Price     float64   `json:"price" gorm:"type:decimal(10)"`
	Stock     int       `json:"stock" gorm:"type:int"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}

func (*Product) TableName() string {
	return "products"
}
