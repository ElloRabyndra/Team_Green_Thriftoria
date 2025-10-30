package models

type User struct {
	ID         		int       	`json:"id" gorm:"primaryKey"`
	Username       	string    	`json:"username" gorm:"type:varchar(100)"`
	Email     		string   	`json:"email"`
	Password   		string    	`json:"-" gorm:"type:varchar(100)"`
	Address   		string    	`json:"address" gorm:"type:varchar(200)"`
	Telephone   	string    	`json:"telephone" gorm:"type:varchar(15)"`
	Role			string		`json:"role" gorm:"type:enum('admin','penjual','pembeli');default('pembeli')"`
	ProfilePicture	string		`json:"profile_picture" gorm:"type:varchar(100);default('https://i.pravatar.cc/150')"`
	Shop      		*Shop      	`gorm:"foreignKey:UserID"`
}

type RegisterInput struct {
    Username string `json:"username" validate:"required"`
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required"`
}

type LoginInput struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required"`
}

func (*User) TableName() string {
	return "user"
}