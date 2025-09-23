# 📌 API Documentation
## Base URL

```
http://127.0.0.1:3000/api/v1
```

---

## 🔑 Authentication

### **Register**

**POST** `/register`

**Request Body (JSON):**

```json
{
  "username": "steven2",
  "email": "steven2@gmail.com",
  "password": "steven2"
}
```

**Response 201 (Created):**

```json
{
  "message": "Register success",
  "user": {
    "id": 1,
    "username": "steven2",
    "email": "steven2@gmail.com",
    "role": "pembeli",
    "profile_picture": "https://i.pravatar.cc/150"
  }
}
```

---

### **Login**

**POST** `/login`

**Request Body (JSON):**

```json
{
  "email": "steven2@gmail.com",
  "password": "steven2"
}
```

**Response 200 (OK):**

```json
{
  "message": "Login success",
  "user": {
    "id": 1,
    "role": "pembeli"
  }
}
```

> Cookie `token` otomatis diset (HttpOnly, Secure, SameSite=Lax).
> Gunakan cookie ini untuk request yang butuh autentikasi.

---

### **Logout**

**POST** `/logout`

**Response 200:**

```json
{
  "message": "Logout success"
}
```
