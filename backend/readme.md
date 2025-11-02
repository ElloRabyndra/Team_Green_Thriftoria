#### DOKUMENTASI APLIKASI

#### BASE URL

http://localhost:3000/api/v1/

#### 1. Jalankan Aplikasi

go run main.go

#### 2. Dokumentasi API

#### Register

POST http://localhost:3000/api/v1/register
Request Body:
`json
      {
        "username": "steven",
        "email": "steven@gmail.com",
        "password": "123456"
      }
      `

    Response (201 Created):
      ```json
      {
        "message": "Register success",
        "user": {
          "id": 1,
          "username": "steven",
          "email": "steven@gmail.com",
          "address": "",
          "telephone": "",
          "role": "buyer",
          "profile_picture": "https://i.pravatar.cc/150",
          "shop": null
        }
      }
      ```

#### Login

POST http://localhost:3000/api/v1/login
Request Body:
`json
      {
        "email": "steven@gmail.com",
        "password": "123456"
      } 
      `

    Response (200 OK):
      ```json
      {
        "message": "Login success",
        "user": {
          "id": 1,
          "username": "steven",
          "email": "steven@gmail.com",
          "role": "buyer",
          "profile_picture": "https://i.pravatar.cc/150",
          "shop": null
        }
      }
      ```

Token JWT akan disimpan otomatis di cookie bernama token.

#### Logout

POST http://localhost:3000/api/v1/logout
Response:
{
"message": "Logout success"
}

#### Get Profile

GET http://localhost:3000/api/v1/user/profile
Response (200 OK):

```json
 {
"data": {
"id": 1,
"username": "steven",
"email": "steven@gmail.com",
"address": "",
"telephone": "",
"role": "seller",
"profile_picture": "https://i.pravatar.cc/150",
"Shop": null
},
"status": "success"
}

#### Update Profile

Patch http://localhost:3000/api/v1/user/profile
Request Body (multipart/form-data):
username (string, opsional)
email (string, opsional)
address (string, opsional)
telephone (string, opsional)
password (string, opsional - jika ingin mengganti password)
profile_picture (file, opsional - Maks 1MB, format: .png, .jpg, .jpeg)

    Response (200 OK):
      {
          "data": {
              "id": 7,
              "username": "steven2",
              "email": "steven2@gmail.com",
              "address": "plaju",
              "telephone": "08123123123",
              "role": "pembeli",
              "profile_picture": "http://127.0.0.1:3000/assets/1761885237869533800.jpg",
              "Shop": null
          },
          "message": "Profile updated successfully",
          "status": "success"
      }

#### Create SHOP
Post http://localhost:3000/api/v1/shop (buyer)

Request Body (multipart/form-data):
shop_name (string)
shop_telephone (string, opsional)
shop_address (string)
account_number (string, opsional)
qris_picture (string, (.png, .jpg, .jpeg, .webp, max 1MB))

Response (200 OK):
{
    "data": {
        "id": 5,
        "user_id": 1,
        "shop_name": "HalalMart",
        "shop_telephone": "081278632253",
        "shop_address": "Plaju no 15",
        "account_number": "12312312312",
        "qris_picture": "http://127.0.0.1:3000/assets/qris/1_1762096113955846000.png",
        "status_admin": "pending",
        "created_at": "2025-11-02T22:08:33.959+07:00"
    },
    "message": "Shop created successfully, waiting for admin approval",
    "status": "success"
}


#### Get Detail SHOP
Get http://localhost:3000/api/v1/shop/:id (seller, admin)

Response (200 OK):
{
    "data": {
        "account_number": "12312312312",
        "created_at": "2025-11-02T22:08:33.959+07:00",
        "email": "steven@gmail.com",
        "id": 5,
        "qris_picture": "http://127.0.0.1:3000/assets/qris/1_1762096113955846000.png",
        "shop_address": "Plaju no 15",
        "shop_name": "HalalMart",
        "shop_telephone": "081278632253",
        "status_admin": "pending",
        "user_id": 1,
        "username": "steven"
    },
    "message": "Shop details retrieved successfully",
    "status": "success"
}

#### Edit SHOP
Patch http://localhost:3000/api/v1/shop/:id (seller, admin)

Request Body (multipart/form-data):
shop_name (string, opsional)
shop_telephone (string, opsional)
shop_address (string, opsional)
account_number (string, opsional)
qris_picture (string, opsional, (.png, .jpg, .jpeg, .webp, max 1MB))

Response (200 OK):
{
    "data": {
        "id": 5,
        "user_id": 1,
        "shop_name": "HalalMart",
        "shop_telephone": "081278632253",
        "shop_address": "Plaju no 15",
        "account_number": "12312312312",
        "qris_picture": "http://127.0.0.1:3000/assets/qris/1_1762109769226320600.jpg",
        "status_admin": "pending",
        "created_at": "2025-11-02T22:08:33.959+07:00"
    },
    "message": "Shop updated successfully",
    "status": "success"
}
```
