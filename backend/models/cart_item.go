package models

import "time"

type CartItem struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID    uint      `json:"user_id"`
	ProductID uint      `json:"product_id"`
	Quantity  int       `json:"quantity"`
	Price     float64   `json:"price"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	User    User    `gorm:"foreignKey:UserID" json:"user"`
	Product Product `gorm:"foreignKey:ProductID" json:"product"`
}

func (*CartItem) TableName() string {
	return "cartitem"
}
