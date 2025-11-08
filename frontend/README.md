# Thriftoria - Frontend

This directory contains the entire client-side application for **Thriftoria**, an e-commerce platform specializing in thrifting (second-hand items). The application is a multi-role single-page application (SPA) built to provide a seamless shopping and selling experience.

## 🚀 Tech Stack

The frontend application is built using modern JavaScript technologies and utility-first styling:

| Technology                | Purpose                                                                                                                                 |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **React**                 | Core JavaScript library for building the user interface.                                                                                |
| **Vite**                  | Fast build tool providing a lightning-fast development experience.                                                                      |
| **Tailwind CSS**          | Utility-first CSS framework for rapid and consistent styling.                                                                           |
| **Shadcn UI**             | Reusable UI components built on Radix UI and Tailwind CSS.                                                                              |
| **React Router**          | Declarative routing for navigation between pages.                                                                                       |
| **React Hook Form / Zod** | Robust state management and schema validation for forms.                                                                                |
| **Custom Hooks/Contexts** | Centralized state management for app logic (`useAuth`, `useShop`, `useProducts`, `useOrders`, `useAdmin`) and Theming (`ThemeContext`). |

## ✨ Core Features & User Roles

The application supports three main user roles, each with a tailored dashboard experience:

| Role       | Key Capabilities                                                                                                                                                        |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Buyer**  | View product listings, search/filter products, add to cart, checkout, view current orders, view order history, and register a new shop to become a Seller.              |
| **Seller** | Manage shop profile, add/edit/delete product listings, view sales (orders received), update order shipping status, view own purchase orders, and view purchase history. |
| **Admin**  | Manage user accounts (Buyers List), manage shop applications (Accept/Reject Pending Shops), and manage accepted shops (Shop List).                                      |

## 🗺️ Application Flow & Routes

The entire application structure revolves around protected routes, ensuring only authenticated users can access the content.

### 1. Authentication

| Route           | Component  | Description                                                             |
| :-------------- | :--------- | :---------------------------------------------------------------------- |
| `/login`        | `Login`    | User sign-in page.                                                      |
| `/register`     | `Register` | User registration page.                                                 |
| `/profile`      | `Profile`  | View and edit user profile (email, username, address, phone, password). |
| `/shop/:shopId` | `ViewShop` | Public view of a specific shop and its products.                        |

### 2. General E-commerce (Buyer & Seller)

| Route                       | Component       | Description                                                                                      |
| :-------------------------- | :-------------- | :----------------------------------------------------------------------------------------------- |
| `/products/:category?`      | `ProductList`   | Home page displaying all products (filterable by category: **Fashion** and **Others**).          |
| `/products/search/:query`   | `ProductList`   | Home page displaying all products by search query.                                               |
| `/product/:id`              | `ProductDetail` | Detailed view of a product.                                                                      |
| `/cart`                     | `CartList`      | Displays items added to the cart, allowing multi-item selection from a single shop for checkout. |
| `/checkout`                 | `Checkout`      | Final step for order placement, capturing recipient details, address, and proof of payment.      |
| `/dashboard/orders`         | `MyOrder`       | List of active orders placed by the user (Buyer's perspective).                                  |
| `/dashboard/order/:orderId` | `OrderDetail`   | Detailed view and tracking of a specific order.                                                  |
| `/dashboard/order-history`  | `OrderHistory`  | List of all delivered or cancelled orders.                                                       |

### 3. Seller-Specific Pages

| Route                      | Component       | Description                                                                                                                                        |
| :------------------------- | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/dashboard/register-shop` | `RegisterShop`  | Form for Buyers to apply to become a Seller (requires QRIS payment info).                                                                          |
| `/dashboard/my-shop`       | `MyShop`        | Seller's page to manage their shop profile.                                                                                                        |
| `/dashboard/my-products`   | `MyProductList` | List of products offered by the Seller, with options to view, edit, or delete products.                                                            |
| `/edit-product/:id`        | `EditProduct`   | Form for Seller to update product details, price, stock, etc.                                                                                      |
| `/dashboard/sales`         | `MySales`       | List of all orders received by the shop (Seller's perspective).                                                                                    |
| `/dashboard/sale/:saleId`  | `SaleDetail`    | Detailed view of a specific sale, allowing the Seller to change the shipping status (e.g., `awaitingPayment`, `prepared`, `shipped`, `delivered`). |

### 4. Admin-Specific Pages

| Route                      | Component     | Description                                                     |
| :------------------------- | :------------ | :-------------------------------------------------------------- |
| `/dashboard/buyers`        | `BuyerList`   | List of all registered users (Buyers/Sellers).                  |
| `/dashboard/user/:userId`  | `BuyerList`   | view of a specific user.                                        |
| `/dashboard/shops`         | `ShopsList`   | List of all accepted (active) shops.                            |
| `/dashboard/shops/pending` | `PendingList` | List of new shop registration requests awaiting Admin approval. |

## 🛠️ Installation

To set up the frontend project locally:

1.  **Clone the repository and navigate to the frontend folder:**

    ```bash
    git clone [Your Repository URL]
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

The application will typically be accessible at `http://localhost:5173`.
