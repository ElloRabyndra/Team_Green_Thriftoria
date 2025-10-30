package models

import "time"

type Product struct {
	ID        	int       `json:"id"    gorm:"primaryKey"`
	ShopID    	int       `json:"shop_id"`
	Name      	string    `json:"name" gorm:"type:varchar(100)"`
	Category  	string    `json:"category" gorm:"type:varchar(100)"`
	Label		string    `json:"label" gorm:"type:varchar(100)"`
	Description string    `json:"description" gorm:"type:varchar(300)"`
	Image     	string    `json:"image" gorm:"type:varchar(100)"`
	Price     	float64   `json:"price" gorm:"type:decimal(10)"`
	Stock     	int       `json:"stock" gorm:"type:int"`
	CreatedAt 	time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt 	time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

func (*Product) TableName() string {
	return "products"
}
