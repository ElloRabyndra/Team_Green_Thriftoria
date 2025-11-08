# Thriftoria – GDGOC Unsri Final Project (Team Green)

This repository contains the final project of GDGoC Unsri, developed by Team Green.
The project is a marketplace website for thrifting (second-hand items), built with collaboration between Frontend and Backend development.

---

## Team Members

- **M. Rabyndra Janitra Binello**
- **Steven**

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Database Setup](#2-database-setup)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Frontend Setup](#4-frontend-setup)
- [Running the Application](#running-the-application)
- [Features & User Guide](#features--user-guide)
  - [Public Pages](#public-pages)
  - [Buyer Features](#buyer-features)
  - [Seller Features](#seller-features)
  - [Admin Features](#admin-features)

---

## 🎯 About the Project

**Thriftoria** is a comprehensive e-commerce platform designed specifically for the thrifting market (second-hand goods). The platform supports three distinct user roles—**Buyer**, **Seller**, and **Admin**—each with tailored features and dashboards to create a complete marketplace ecosystem.

### Key Highlights:

- 🛍️ **Multi-role System**: Buyers can shop, Sellers can manage shops and products, Admins oversee the platform
- 🔐 **Secure Authentication**: JWT-based authentication with role-based access control
- 📦 **Complete Order Flow**: From cart to checkout, payment verification, to delivery tracking
- 🏪 **Shop Management**: Sellers can register shops and manage their inventory
- 📱 **Responsive Design**: Modern UI built with React and Tailwind CSS

---

## 🚀 Tech Stack

### Backend

- **Go (Golang)** - Core programming language
- **Fiber** - Web framework
- **Gorm** - ORM for database interactions
- **MySQL** - Database
- **JWT** - Authentication

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Router** - Routing
- **React Hook Form & Zod** - Form handling and validation

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software:

- **Go** (version 1.19 or higher) - [Download](https://go.dev/dl/)
- **Node.js** (version 16 or higher) and **npm** - [Download](https://nodejs.org/)
- **MySQL** (version 8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/downloads)

### Optional but Recommended:

- **MySQL Workbench** or any MySQL client for database management
- **Postman** or similar tool for API testing

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ElloRabyndra/Team_Green_Thriftoria.git
cd Team_Green_Thriftoria
```

---

### 2. Database Setup

#### Step 1: Create Database

Open your MySQL client (MySQL Workbench, command line, or any other tool) and create a new database:

```sql
CREATE DATABASE thriftoria_db;
```

#### Step 2: Import Database Schema

If a SQL file (`finprobackend.sql`) is provided in the root directory:

```bash
mysql -u your_username -p thriftoria_db < finprobackend.sql
```

Or, if you prefer to use MySQL Workbench:

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Select **Server** → **Data Import**
4. Choose **Import from Self-Contained File**
5. Select the `finprobackend.sql` file
6. Choose `thriftoria_db` as the target schema
7. Click **Start Import**

#### Step 3: Verify Database

Check that all tables have been created successfully:

```sql
USE thriftoria_db;
SHOW TABLES;
```

You should see tables like: `users`, `shops`, `products`, `carts`, `orders`, `order_items`, etc.

---

### 3. Backend Setup

#### Step 1: Navigate to Backend Directory

```bash
cd backend
```

#### Step 2: Install Go Dependencies

```bash
go mod tidy
```

#### Step 3: Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Or create a new `.env` file with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=thriftoria_db

# Server Configuration
BASE_URL=http://127.0.0.1:3000

# JWT Secret (use a strong random string)
JWT_SECRET=your_very_secure_secret_key_here
```

**Important**: Replace the placeholder values with your actual MySQL credentials and generate a strong JWT secret.

#### Step 4: Verify Backend Setup

Test that the backend can connect to the database:

```bash
go run main.go
```

If successful, you should see a message indicating the server is running on `http://localhost:3000`.

---

### 4. Frontend Setup

#### Step 1: Navigate to Frontend Directory

Open a new terminal window/tab and navigate to the frontend directory:

```bash
cd frontend
```

#### Step 2: Install Node Dependencies

```bash
npm install
```

Or if you use yarn:

```bash
yarn install
```

Or if you use pnpm:

```bash
pnpm install
```

#### Step 3: Configure Environment Variables (if needed)

If the frontend requires environment configuration, create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

#### Step 4: Verify Frontend Setup

Start the development server:

```bash
npm run dev
```

The application should now be accessible at `http://localhost:5173`.

---

## 🚀 Running the Application

### Starting the Backend Server

In the `backend` directory:

```bash
go run main.go
```

The API will be available at `http://localhost:3000/api/v1`

### Starting the Frontend Development Server

In the `frontend` directory:

```bash
npm run dev
```

The web application will be available at `http://localhost:5173`

### Default Admin Account

To access admin features, you may need to manually create an admin user in the database or use the provided seed data. Check with your team for admin credentials.

---

## 📱 Features & User Guide

### Public Pages

#### 🏠 Home / Product Listings (`/`)

- **Description**: Landing page displaying all available products from various shops
- **Features**:
  - View all products in a grid/card layout
  - Filter products by category (Fashion or Others)
  - Search products by name
  - View product images, prices, and basic details
  - Click on products to view detailed information
- **How to Use**:
  1. Browse products on the home page
  2. Use the category filter buttons to narrow down results
  3. Use the search bar to find specific items
  4. Click on any product card to see full details

#### 📦 Product Detail (`/product/:id`)

- **Description**: Detailed view of a single product
- **Features**:
  - View high-resolution product images
  - See complete product description, price, stock, and category
  - View product label/condition
  - See which shop is selling the product
  - Add product to cart (requires login)
- **How to Use**:
  1. Click "Add to Cart" button to add the product
  2. Click on the shop name to view the shop's profile and other products

#### 🏪 Shop View (`/shop/:shopId`)

- **Description**: Public profile page for a specific shop
- **Features**:
  - View shop information (name, description, QRIS payment)
  - See all products offered by this shop
  - View shop owner's contact information
- **How to Use**:
  1. Browse all products from this specific shop
  2. Click on any product to view details
  3. Note the QRIS code for payment during checkout

#### 🔐 Login & Registration (`/login`, `/register`)

- **Description**: User authentication pages
- **Features**:
  - Register new account (creates a Buyer account by default)
  - Login with email and password
  - Secure JWT-based authentication
- **How to Use**:
  1. New users: Click "Register" and fill in username, email, and password
  2. Existing users: Enter email and password to login
  3. After login, you'll be redirected to the home page with access to user features

---

### Buyer Features

#### 🛒 Shopping Cart (`/cart`)

- **Description**: View and manage items added to cart
- **Features**:
  - View all cart items grouped by shop
  - Update quantities for each item
  - Remove items from cart
  - Select multiple items from the same shop for checkout
  - See total price for selected items
- **How to Use**:
  1. Check the boxes next to items you want to purchase (must be from the same shop)
  2. Adjust quantities using the +/- buttons
  3. Remove unwanted items with the delete button
  4. Click "Checkout" to proceed to payment

#### 💳 Checkout (`/checkout`)

- **Description**: Complete order placement with payment proof
- **Features**:
  - Review selected items and total price
  - Enter recipient information (name, phone, address)
  - Upload proof of payment (QRIS payment to shop)
  - Add optional order notes
- **How to Use**:
  1. Fill in recipient details (can be different from your profile)
  2. Scan the shop's QRIS code and make payment
  3. Upload screenshot/photo of payment proof (max 1MB)
  4. Add any special instructions in the notes field
  5. Click "Place Order" to submit

#### 📋 My Orders (`/dashboard/orders`)

- **Description**: View all active orders
- **Features**:
  - See list of ongoing orders
  - View order status (awaiting payment verification, prepared, shipped, delivered)
  - Click on orders to view details
  - Track order progress
- **How to Use**:
  1. Browse your active orders
  2. Click on any order to see detailed tracking information
  3. Wait for seller to verify payment and update shipping status

#### 📦 Order Detail (`/dashboard/order/:orderId`)

- **Description**: Detailed tracking for a specific order
- **Features**:
  - View complete order information (items, quantities, prices)
  - See recipient details and shipping address
  - Check current order status
  - View payment proof that was uploaded
  - Request order cancellation (if needed)
- **How to Use**:
  1. Monitor order status updates
  2. If needed, click "Request Cancellation" to cancel the order
  3. Wait for seller's response on cancellation request

#### 📜 Order History (`/dashboard/order-history`)

- **Description**: Archive of completed and cancelled orders
- **Features**:
  - View all past orders
  - Filter by completed or cancelled status
  - Review order details
- **How to Use**:
  1. Browse your order history
  2. Click on any order to see full details

#### 🏪 Register as Seller (`/dashboard/register-shop`)

- **Description**: Apply to become a seller by registering a shop
- **Features**:
  - Fill in shop details (name, description)
  - Upload QRIS payment code for receiving payments
  - Submit application for admin approval
- **How to Use**:
  1. Fill in all shop information
  2. Upload your QRIS code image (this is how buyers will pay you)
  3. Submit application
  4. Wait for admin approval (status will be "Pending")
  5. Once approved, your role changes to Seller

#### 👤 Profile (`/profile`)

- **Description**: Manage your account information
- **Features**:
  - View current profile details
  - Update username, email, address, phone number
  - Change password
  - Upload/update profile picture
- **How to Use**:
  1. Click on any field to edit
  2. Upload a new profile picture (max 1MB, .png/.jpg/.jpeg)
  3. To change password, enter new password
  4. Click "Save Changes" to update

---

### Seller Features

> **Note**: All Buyer features are also available to Sellers (shopping, cart, orders, etc.)

#### 🏪 My Shop (`/dashboard/my-shop`)

- **Description**: Manage your shop profile
- **Features**:
  - View current shop information
  - Edit shop name and description
  - Update QRIS payment code
  - View shop status (pending/approved)
- **How to Use**:
  1. Click "Edit Shop" to modify information
  2. Update details as needed
  3. Save changes

#### 📦 My Products (`/dashboard/my-products`)

- **Description**: Inventory management page
- **Features**:
  - View all products listed in your shop
  - See product status (in stock, out of stock)
  - Add new products
  - Edit existing products
  - Delete products
- **How to Use**:
  1. Click "Add Product" to list a new item
  2. Fill in product details (name, category, price, stock, image, description)
  3. Click on any product to edit or delete
  4. Products must have stock > 0 to be visible to buyers

#### ✏️ Edit Product (`/edit-product/:id`)

- **Description**: Update product information
- **Features**:
  - Modify product name, category, price, stock
  - Update product image
  - Change description and label
- **How to Use**:
  1. Update any fields you want to change
  2. Upload a new image if needed (max 1MB)
  3. Click "Update Product" to save changes

#### 💰 My Sales (`/dashboard/sales`)

- **Description**: View all orders received by your shop
- **Features**:
  - See incoming orders from buyers
  - View order status and payment status
  - Click on orders to process them
  - Track sales performance
- **How to Use**:
  1. Review new orders regularly
  2. Click on orders to verify payment and update status
  3. Process orders by updating shipping status

#### 📦 Sale Detail (`/dashboard/sale/:saleId`)

- **Description**: Process and manage a specific order
- **Features**:
  - View complete order details and buyer information
  - See proof of payment uploaded by buyer
  - Accept or reject payment
  - Update order status (prepared, shipped, delivered)
  - Handle cancellation requests
- **How to Use**:
  1. **Verify Payment**: Review the payment proof image
     - Click "Accept Payment" if valid
     - Click "Reject Payment" if invalid/suspicious
  2. **Update Shipping Status**:
     - Mark as "Prepared" when you're packing the items
     - Mark as "Shipped" when you've sent the package
     - Mark as "Delivered" when buyer confirms receipt
  3. **Handle Cancellations**:
     - If buyer requests cancellation, review the request
     - Accept or reject based on your shop policy

---

### Admin Features

> **Note**: Admins have access to all platform management features

#### 👥 Buyers List (`/dashboard/buyers`)

- **Description**: Manage all registered users
- **Features**:
  - View list of all users (Buyers and Sellers)
  - See user details (username, email, role)
  - Search users by name or email
  - View detailed user information
- **How to Use**:
  1. Browse the list of all registered users
  2. Use search to find specific users
  3. Click on any user to view detailed profile

#### 👤 User Detail (`/dashboard/user/:userId`)

- **Description**: View detailed information about a specific user
- **Features**:
  - See complete user profile
  - View user's role (Buyer/Seller)
  - See registration date and activity
- **How to Use**:
  1. Review user information
  2. Monitor user activity and compliance

#### 🏪 Shops List (`/dashboard/shops`)

- **Description**: Manage all approved/active shops
- **Features**:
  - View list of all approved shops
  - See shop details (name, owner, status)
  - Access shop profiles
  - Monitor shop activity
- **How to Use**:
  1. Browse all active shops on the platform
  2. Click on any shop to view its profile and products
  3. Monitor shop compliance and activity

#### ⏳ Pending Shops (`/dashboard/shops/pending`)

- **Description**: Review and process shop registration applications
- **Features**:
  - View all pending shop applications
  - See shop details and QRIS information
  - Approve or reject applications
  - Review applicant information
- **How to Use**:
  1. **Review Application**:
     - Check shop name and description
     - Verify QRIS code image is valid
     - Review applicant's profile
  2. **Make Decision**:
     - Click "Approve" to accept the shop (user becomes a Seller)
     - Click "Reject" to decline the application
  3. **Result**:
     - Approved: Shop becomes active, user role changes to Seller
     - Rejected: Application is removed, user remains a Buyer

---

## 🔒 Security Notes

- All passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication and stored in HTTP-only cookies
- File uploads are validated for type and size
- Role-based access control prevents unauthorized access to features
- Payment proofs and QRIS codes are securely stored on the server

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the backend and frontend README files for detailed API documentation
3. Contact the development team:
   - M. Rabyndra Janitra Binello
   - Steven

---

## 📄 License

This project is developed as a final project for GDGoC Unsri by Team Green.

---
