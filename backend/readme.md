#### DOKUMENTASI APLIKASI

#### BASE URL
http://localhost:3000/api/v1/

#### 1. Jalankan Aplikasi
go run main.go

#### 2. Dokumentasi API

#### Register 
  POST http://localhost:3000/api/v1/register
    Request Body:
      ```json
      {
        "username": "steven",
        "email": "steven@gmail.com",
        "password": "123456"
      }
      ```
    
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
      ```json
      {
        "email": "steven@gmail.com",
        "password": "123456"
      } 
      ```
    
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