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
