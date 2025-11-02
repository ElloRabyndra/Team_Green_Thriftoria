package models

import "time"

type Shop struct {
	ID          	uint      	`gorm:"primaryKey" json:"id"`
	UserID      	uint      	`json:"user_id"`
	User          	User      `json:"user" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
	ShopName        string    	`json:"shop_name"`
	ShopTelephone   string    	`json:"shop_telephone"`
	ShopAddress     string    	`json:"shop_address"`
	AccountNumber 	string    	`json:"account_number"`
	QrisPicture		string		`json:"qris_picture" gorm:"type:varchar(100)"`
	Products    	[]Product 	`gorm:"foreignKey:ShopID"`
	StatusAdmin		string		`json:"status_admin" gorm:"type:enum('approve','pending');default('buyer')"`
	CreatedAt   	time.Time	`json:"created_at" gorm:"autoCreateTime"`
}

type ShopResponse struct {
	ID            uint   `json:"id"`
	UserID        uint   `json:"user_id"`
	ShopName      string `json:"shop_name"`
	ShopTelephone string `json:"shop_telephone"`
	ShopAddress   string `json:"shop_address"`
	AccountNumber string `json:"account_number"`
	QrisPicture   string `json:"qris_picture"`
	StatusAdmin   string `json:"status_admin"`
	CreatedAt     time.Time `json:"created_at"`
}

func (*Shop) TableName() string {
	return "shops"
}