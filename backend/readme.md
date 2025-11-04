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

#### Get All User

GET http://localhost:3000/api/v1/user
Response (200 OK):

```json
{
  "data": [
    {
      "id": 1,
      "username": "steven",
      "email": "steven@gmail.com",
      "address": "",
      "telephone": "",
      "role": "seller",
      "profile_picture": "https://i.pravatar.cc/150",
      "Shop": null
    },
    {
      "id": 3,
      "username": "steven2",
      "email": "steven2@gmail.com",
      "address": "",
      "telephone": "",
      "role": "seller",
      "profile_picture": "https://i.pravatar.cc/150",
      "Shop": null
    }
  ],
  "status": "success"
}
```

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
Get http://localhost:3000/api/v1/shop/:id (buyer, seller, admin)

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

#### Get All Shop Approve (admin)

GET http://localhost:3000/api/v1/shop/approve
Response (200 OK):

```json
{
  "data": [
    {
      "id": 5,
      "user_id": 1,
      "shop_name": "HalalMart",
      "shop_telephone": "081278632253",
      "shop_address": "Plaju no 15",
      "account_number": "12312312312",
      "qris_picture": "http://127.0.0.1:3000/assets/qris/1_1762109769226320600.jpg",
      "status_admin": "approve",
      "created_at": "2025-11-02T22:08:33.959+07:00"
    },
    {
      "id": 8,
      "user_id": 3,
      "shop_name": "toko 2",
      "shop_telephone": "081278632253",
      "shop_address": "Plaju no 15",
      "account_number": "12312312312",
      "qris_picture": "http://127.0.0.1:3000/assets/qris/3_1762161995987024700.jpg",
      "status_admin": "approve",
      "created_at": "2025-11-03T16:26:35.989+07:00"
    }
  ],
  "status": "success"
}
```

#### Get All Shop Pending (admin)

GET http://localhost:3000/api/v1/shop/pending
Response (200 OK):

```json
{
  "data": [
    {
      "id": 8,
      "user_id": 3,
      "shop_name": "toko 2",
      "shop_telephone": "081278632253",
      "shop_address": "Plaju no 15",
      "account_number": "12312312312",
      "qris_picture": "http://127.0.0.1:3000/assets/qris/3_1762161995987024700.jpg",
      "status_admin": "pending",
      "created_at": "2025-11-03T16:26:35.989+07:00"
    }
  ],
  "status": "success"
}
```

#### Accpet Request Shop (admin)

GET http://localhost:3000/api/v1/shop/accept
Request Body:

```json
{
  "shop_id": 8,
  "status": true
}
```

Response (200 Created):

```json
{
  "data": {
    "role": "seller",
    "shop_id": 8,
    "user_id": 3
  },
  "message": "Shop has been accepted and user role updated to seller",
  "status": "success"
}
```

#### Get All Products (Public)

GET http://localhost:3000/api/v1/products

Response (200 OK):

```JSON
{
"status": "success",
"data": [
    {
    "id": 1,
    "shop_id": 5,
    "name": "Baju Kemeja Pria",
    "category": "Fashion",
    "label": "Best Seller",
    "description": "Baju kemeja lengan panjang bahan katun.",
    "image": "http://127.0.0.1:3000/assets/products/123456789.jpg",
    "price": 150000,
    "stock": 50,
    "created_at": "2025-11-04T15:00:00+07:00",
    "updated_at": "2025-11-04T15:00:00+07:00"
    },
    {
    "id": 2,
    "shop_id": 5,
    "name": "Celana Jeans",
    "category": "Fashion",
    "label": "",
    "description": "Celana jeans pria.",
    "image": "http://127.0.0.1:3000/assets/products/123456790.jpg",
    "price": 250000,
    "stock": 30,
    "created_at": "2025-11-04T15:01:00+07:00",
    "updated_at": "2025-11-04T15:01:00+07:00"
    }
  ]
}
```

#### Get Product By Category (Public)

GET http://localhost:3000/api/v1/products/category/:category
Keterangan: Ganti :category dengan Fashion atau Others.

Response (200 OK):

```JSON
{
"status": "success",
"data": [
    {
    "id": 1,
    "shop_id": 5,
    "name": "Baju Kemeja Pria",
    "category": "Fashion",
    "label": "Best Seller",
    "description": "Baju kemeja lengan panjang bahan katun.",
    "image": "http://127.0.0.1:3000/assets/products/123456789.jpg",
    "price": 150000,
    "stock": 50,
    "created_at": "2025-11-04T15:00:00+07:00",
    "updated_at": "2025-11-04T15:00:00+07:00"
    }
  ]
}
```

##### Search Product (Public)

GET http://localhost:3000/api/v1/products/search?q=kemeja
Keterangan: Menggunakan query param q untuk mencari berdasarkan nama produk.

Response (200 OK):

```JSON
{
"status": "success",
"data": [
    {
    "id": 1,
    "shop_id": 5,
    "name": "Baju Kemeja Pria",
    "category": "Fashion",
    "label": "Best Seller",
    "description": "Baju kemeja lengan panjang bahan katun.",
    "image": "http://127.0.0.1:3000/assets/products/123456789.jpg",
    "price": 150000,
    "stock": 50,
    "created_at": "2025-11-04T15:00:00+07:00",
    "updated_at": "2025-11-04T15:00:00+07:00"
    }
  ]
}
```

#### Get Detail Product (Public)

GET http://localhost:3000/api/v1/products/1

Response (200 OK):

```JSON
{
  "status": "success",
  "data": {
    "id": 1,
    "shop_id": 5,
    "name": "Baju Kemeja Pria",
    "category": "Fashion",
    "label": "Best Seller",
    "description": "Baju kemeja lengan panjang bahan katun.",
    "image": "http://127.0.0.1:3000/assets/products/123456789.jpg",
    "price": 150000,
    "stock": 50,
    "created_at": "2025-11-04T15:00:00+07:00",
    "updated_at": "2025-11-04T15:00:00+07:00"
  }
}
```

#### Add Product (Seller)

POST http://localhost:3000/api/v1/products

Request Body (multipart/form-data):
name (string, required)
category (string, required - "Fashion" atau "Others")
price (number, required)
stock (number, required)
label (string, opsional)
description (string, opsional)
image (file, required - Maks 1MB, format: .png, .jpg, .jpeg, .webp)

Response (201 Created):

```JSON

{
  "status": "success",
  "message": "Product added successfully",
  "data": {
    "id": 1,
    "shop_id": 5,
    "name": "Baju Kemeja Pria",
    "category": "Fashion",
    "label": "Best Seller",
    "description": "Baju kemeja lengan panjang bahan katun.",
    "image": "http://127.0.0.1:3000/assets/products/1762234033104689200.jpg",
    "price": 150000,
    "stock": 50,
    "created_at": "2025-11-04T15:07:13.104+07:00",
    "updated_at": "2025-11-04T15:07:13.104+07:00"
  }
}
```

#### Edit Product (Seller)

PATCH http://localhost:3000/api/v1/products/:id

Request Body (multipart/form-data):
name (string, opsional)
category (string, opsional - "Fashion" atau "Others")
price (number, opsional)
stock (number, opsional)
label (string, opsional)
description (string, opsional)
image (file, opsional - Maks 1MB, format: .png, .jpg, .jpeg, .webp)

Response (200 OK):

```JSON
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "shop_id": 5,
    "name": "Baju Kemeja Pria (Edited)",
    "category": "Fashion",
    "label": "New",
    "description": "Baju kemeja lengan panjang bahan katun premium.",
    "image": "http://127.0.0.1:3000/assets/products/1_1762234200123456700.jpg",
    "price": 155000,
    "stock": 45,
    "created_at": "2025-11-04T15:07:13.104+07:00",
    "updated_at": "2025-11-04T15:10:00.123+07:00"
  }
}
```

#### Delete Product (Seller)

DELETE http://localhost:3000/api/v1/products/1

Response (200 OK):

```JSON

{
  "status": "success",
  "message": "Product deleted successfully"
}
```
