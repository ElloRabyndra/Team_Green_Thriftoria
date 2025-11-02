package models

import "time"

type OrderItem struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	OrderID   uint      `json:"order_id"`
	ProductID uint      `json:"product_id"`
	Quantity  int       `json:"quantity"`
	Price     float64   `json:"price"`
	SubTotal  float64   `json:"sub_total"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	Order   Order   `gorm:"foreignKey:OrderID" json:"order"`
	Product Product `gorm:"foreignKey:ProductID" json:"product"`
}

func (*OrderItem) TableName() string {
	return "orderitem"
}
