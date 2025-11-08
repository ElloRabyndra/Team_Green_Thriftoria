# Thriftoria - Backend

This is the API documentation for **Thriftoria** backend service, an e-commerce platform focused on _thrifting_ (second-hand goods). This application handles user management, shops, products, carts, and orders.

Built using **Golang** with **Fiber** framework and **Gorm**.

## 🚀 Tech Stack

This backend server is built using a modern and efficient Go ecosystem.

| Technology              | Purpose                                                         |
| :---------------------- | :-------------------------------------------------------------- |
| **Go (Golang)**         | Core programming language for building the API.                 |
| **Fiber**               | Fast and _expressive_ web framework, inspired by Express.js.    |
| **Gorm**                | _Object-Relational Mapper_ (ORM) for easy database interaction. |
| **Gorm (MySQL Driver)** | Specific driver to connect Gorm with MySQL database.            |
| **JWT (golang-jwt)**    | JSON Web Tokens implementation for _stateless_ authentication.  |
| **go-dotenv**           | Loads environment variables from `.env` file.                   |
| **bcrypt (x/crypto)**   | Secure password _hashing_ for storage in database.              |

## ✨ Core Features & User Roles

This application supports three main user roles, each with capabilities managed by the API:

| Role       | API Capabilities                                                                                                  |
| :--------- | :---------------------------------------------------------------------------------------------------------------- |
| **Buyer**  | View products, search/filter, add to cart, checkout, view order history, and register to become a _Seller_.       |
| **Seller** | Manage shop profile, CRUD products (Create, Read, Update, Delete), view sales, and update order shipping status.  |
| **Admin**  | Manage user accounts (List Buyers), manage shop applications (Approve/Reject Shops), and manage registered shops. |

## 🛠️ Installation & Configuration

To run this backend server locally:

1.  **Clone Repository**
    Navigate to the `backend` folder:

    ```bash
    git clone https://github.com/ElloRabyndra/Team_Green_Thriftoria.git
    cd Team_Green_Thriftoria/backend
    ```

2.  **Install Dependencies**
    Download all required Go packages:

    ```bash
    go mod tidy
    ```

3.  **Environment Configuration**
    Copy the `.env.example` file (if available) to `.env`.

    ```bash
    cp .env.example .env
    ```

    Adjust the contents of the `.env` file with your local configuration:

    ```.env
    # Database Configuration
    DB_HOST=your_host_name
    DB_PORT=your_db_port
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_NAME=your_db_name

    # Server Configuration
    BASE_URL=http://127.0.0.1:3000

    # JWT
    JWT_SECRET=YOUR_VERY_SECURE_SECRET
    ```

4.  **Run Application**

    ```bash
    go run main.go
    ```

    The server will run at `http://localhost:3000`.

## 🗺️ API Endpoints Reference

**Base URL**: `http://localhost:3000/api/v1`

---

### 1\. 🔐 Authentication

Endpoints for registration, login, and logout.

| Endpoint    | Method | Authorization | Description                   |
| :---------- | :----- | :------------ | :---------------------------- |
| `/register` | `POST` | (Public)      | Register a new user.          |
| `/login`    | `POST` | (Public)      | Login and get JWT cookie.     |
| `/logout`   | `POST` | (Public)      | Logout and remove JWT cookie. |

#### Register

- **Request Body**:
  ```json
  {
    "username": "steven",
    "email": "steven@gmail.com",
    "password": "123456"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Register success",
    "user": { ... }
  }
  ```

#### Login

- **Request Body**:
  ```json
  {
    "email": "steven@gmail.com",
    "password": "123456"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Login success",
    "user": { ... }
  }
  ```

---

### 2\. 👤 User

Endpoints for managing user data. Requires JWT authentication.

| Endpoint        | Method  | Authorization        | Description                                 |
| :-------------- | :------ | :------------------- | :------------------------------------------ |
| `/user`         | `GET`   | Admin                | Get all user data.                          |
| `/user/:id`     | `GET`   | Admin                | Get user details by ID.                     |
| `/user/profile` | `GET`   | Buyer, Seller, Admin | Get profile of currently logged-in user.    |
| `/user/profile` | `PATCH` | Buyer, Seller, Admin | Update profile of currently logged-in user. |

#### Update Profile

- **Request Body**: `multipart/form-data`
  - `username` (string, optional)
  - `email` (string, optional)
  - `address` (string, optional)
  - `telephone` (string, optional)
  - `password` (string, optional - if you want to change)
  - `profile_picture` (file, optional - Max 1MB, .png, .jpg, .jpeg)
- **Response (200 OK)**:
  ```json
  {
    "data": { ... },
    "message": "Profile updated successfully",
    "status": "success"
  }
  ```

---

### 3\. 🏪 Shop

Endpoints for shop registration and management.

| Endpoint        | Method  | Authorization        | Description                                   |
| :-------------- | :------ | :------------------- | :-------------------------------------------- |
| `/shop`         | `POST`  | Buyer                | Register a new shop (status `pending`).       |
| `/shop/:id`     | `GET`   | Buyer, Seller, Admin | Get shop details by ID.                       |
| `/shop/:id`     | `PATCH` | Seller, Admin        | Update shop details.                          |
| `/shop/approve` | `GET`   | Admin                | Get all shops with `approve` status.          |
| `/shop/pending` | `GET`   | Admin                | Get all shops with `pending` status.          |
| `/shop/accept`  | `PATCH` | Admin                | Accept (approve) or reject shop registration. |

#### Accept/Reject Request Shop

- **Request Body**:
  ```json
  {
    "shop_id": 8,
    "status": true
  }
  ```
- **Note**: `status: true` to accept, `status: false` to reject.
- **Response (200 OK)**:
  ```json
  {
    "data": { ... },
    "message": "Shop has been accepted and user role updated to seller",
    "status": "success"
  }
  ```

---

### 4\. 🛍️ Product

Endpoints for viewing and managing products.

| Endpoint                       | Method   | Authorization | Description                                      |
| :----------------------------- | :------- | :------------ | :----------------------------------------------- |
| `/products`                    | `GET`    | (Public)      | Get all products (can be filtered).              |
| `/products/category/:category` | `GET`    | (Public)      | Get products by category (`Fashion` / `Others`). |
| `/products/search`             | `GET`    | (Public)      | Search products by name (`?q=shirt`).            |
| `/products/:id`                | `GET`    | (Public)      | Get product details by ID.                       |
| `/products`                    | `POST`   | Seller        | Add a new product to the shop.                   |
| `/products/:id`                | `PATCH`  | Seller        | Update product details.                          |
| `/products/:id`                | `DELETE` | Seller        | Delete a product from the shop.                  |

#### Add Product

- **Request Body**: `multipart/form-data`
  - `name` (string, required)
  - `category` (string, required - "Fashion" or "Others")
  - `price` (number, required)
  - `stock` (number, required)
  - `image` (file, required - Max 1MB)
  - `label` (string, optional)
  - `description` (string, optional)
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Product added successfully",
    "data": { ... }
  }
  ```

---

### 5\. 🛒 Cart

Endpoints for managing user shopping cart. Requires JWT authentication.

| Endpoint         | Method   | Authorization | Description                              |
| :--------------- | :------- | :------------ | :--------------------------------------- |
| `/cart`          | `GET`    | Buyer         | View all items in cart, grouped by shop. |
| `/cart`          | `POST`   | Buyer         | Add product to cart.                     |
| `/cart/:cart_id` | `PATCH`  | Buyer         | Update quantity of item in cart.         |
| `/cart/:cart_id` | `DELETE` | Buyer         | Remove item from cart.                   |

#### Add to Cart

- **Request Body**:
  ```json
  {
    "product_id": 3
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Product added to cart"
  }
  ```

---

### 6\. 📦 Order

Endpoints for checkout process and order management. Requires JWT authentication.

| Endpoint                          | Method  | Authorization | Description                                                  |
| :-------------------------------- | :------ | :------------ | :----------------------------------------------------------- |
| `/orders`                         | `POST`  | Buyer         | Create a new order (checkout).                               |
| `/orders`                         | `GET`   | Buyer         | Get list of active orders (owned by buyer).                  |
| `/orders/history`                 | `GET`   | Buyer         | Get order history (completed/cancelled).                     |
| `/orders/:id`                     | `GET`   | Buyer, Seller | Get specific order details.                                  |
| `/orders/sales/:shopid`           | `GET`   | Seller        | Get list of sales (incoming orders to shop).                 |
| `/orders/:orderID/accept-payment` | `PATCH` | Seller        | Accept/Reject payment proof from buyer.                      |
| `/orders/:orderID/status`         | `PATCH` | Seller        | Update shipping status (`prepared`, `shipped`, `delivered`). |
| `/orders/:orderID/cancel`         | `PATCH` | Buyer, Seller | Submit order cancellation request.                           |
| `/orders/:orderID/reject-cancel`  | `PATCH` | Buyer, Seller | Reject cancellation request.                                 |
| `/orders/:orderID/accept-cancel`  | `PATCH` | Buyer, Seller | Accept cancellation request (order cancelled).               |

#### Create Order

- **Request Body**: `multipart/form-data`
  - `shop_id` (number, required)
  - `recipient` (string, required)
  - `telephone` (string, required)
  - `address` (string, required)
  - `proof_payment` (file, required - Max 1MB)
  - `cart_ids[]` (array of numbers, required - e.g.: `cart_ids[]=1&cart_ids[]=2`)
  - `note` (string, optional)
- **Response (201 Created)**:
  ```json
  {
    "message": "Order created successfully",
    "order_id": 1
  }
  ```
