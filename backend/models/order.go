package models

import "time"

type Order struct {
	ID             uint       `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID         uint       `json:"user_id"`
	ShopID         uint       `json:"shop_id"`
	StatusShipping string     `json:"status_shipping" gorm:"type:varchar(50)"`
	TotalPrice     float64    `json:"total_price"`
	Telephone      string     `json:"telephone" gorm:"type:varchar(20)"`
	Address        string     `json:"address" gorm:"type:varchar(255)"`
	Note           string     `json:"note" gorm:"type:text"`
	ProofPayment   string     `json:"proof_payment" gorm:"type:varchar(255)"`
	CreatedAt      time.Time  `json:"created_at" gorm:"autoCreateTime"`
	DeletedAt      *time.Time `json:"deleted_at" gorm:"index"`
	User       User        `gorm:"foreignKey:UserID" json:"user"`
	Shop       Shop        `gorm:"foreignKey:ShopID" json:"shop"`
	OrderItems []OrderItem `gorm:"foreignKey:OrderID" json:"order_items"`
}

func (*Order) TableName() string {
	return "order"
}
