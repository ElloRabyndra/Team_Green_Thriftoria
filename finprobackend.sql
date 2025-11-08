-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 07, 2025 at 11:12 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `finprobackend`
--

-- --------------------------------------------------------

--
-- Table structure for table `cartitem`
--

CREATE TABLE `cartitem` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `product_id` bigint UNSIGNED DEFAULT NULL,
  `quantity` bigint DEFAULT NULL,
  `price` double DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cartitem`
--

INSERT INTO `cartitem` (`id`, `user_id`, `product_id`, `quantity`, `price`, `created_at`) VALUES
(31, 9, 2, 1, 420000, '2025-11-08 01:30:23.948'),
(47, 3, 6, 1, 35000, '2025-11-08 05:24:22.905'),
(48, 9, 7, 1, 1200000, '2025-11-08 05:56:02.353'),
(49, 9, 6, 1, 35000, '2025-11-08 05:56:18.520');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `shop_id` bigint UNSIGNED DEFAULT NULL,
  `status_shipping` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_general_ci,
  `proof_payment` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `recipient` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cancel_by` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `user_id`, `shop_id`, `status_shipping`, `total_price`, `telephone`, `address`, `note`, `proof_payment`, `created_at`, `deleted_at`, `recipient`, `cancel_by`) VALUES
(11, 9, 4, 'cancelPending', 80000, '08123456789', 'Jalan Sekojo No 5', 'Hati Hati', 'http://127.0.0.1:3000/assets/payments/1762552731081188400.jpeg', '2025-11-08 04:58:51.101', NULL, 'Alex Burton', 'buyer'),
(13, 9, 4, 'cancelPending', 75000, '08123456789', 'Jalan Sekojo No 5', 'Hati Hati', 'http://127.0.0.1:3000/assets/payments/1762553099347635000.jpg', '2025-11-08 05:04:59.354', NULL, 'Alex Burton', 'seller'),
(14, 4, 4, 'cancelled', 35000, '085423413321', 'Jalan Kenten ', 'Rumah warna putih', 'http://127.0.0.1:3000/assets/payments/1762556641873748100.jpg', '2025-11-08 06:04:01.880', NULL, 'Steven', 'seller');

-- --------------------------------------------------------

--
-- Table structure for table `orderitem`
--

CREATE TABLE `orderitem` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED DEFAULT NULL,
  `product_id` bigint UNSIGNED DEFAULT NULL,
  `quantity` bigint DEFAULT NULL,
  `price` double DEFAULT NULL,
  `sub_total` double DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderitem`
--

INSERT INTO `orderitem` (`id`, `order_id`, `product_id`, `quantity`, `price`, `sub_total`, `created_at`) VALUES
(13, 11, 11, 1, 80000, 80000, '2025-11-08 04:58:51.117'),
(15, 13, 5, 1, 75000, 75000, '2025-11-08 05:04:59.368'),
(16, 14, 2, 1, 35000, 35000, '2025-11-08 06:04:01.906');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint UNSIGNED NOT NULL,
  `shop_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `label` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(300) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` decimal(10,0) DEFAULT NULL,
  `stock` bigint DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `shop_id`, `name`, `category`, `label`, `description`, `image`, `price`, `stock`, `created_at`, `updated_at`) VALUES
(2, 4, 'Blue & Black Check Shirt', 'Fashion', 'Fashion', 'The Blue & Black Check Shirt is a stylish and comfortable men\'s shirt featuring a classic check pattern. Made from high-quality fabric, it\'s suitable for both casual and semi-formal occasions.', 'http://127.0.0.1:3000/assets/products/1762274351650413400.webp', '35000', 2, '2025-11-04 23:39:11.653', '2025-11-08 06:04:01.896'),
(5, 4, 'Man Short Sleeve Shirtttt', 'Fashion', 'mens-shirts', 'The Man Short Sleeve Shirt is a breezy and stylish option for warm days. With a comfortable fit and short sleeves, it\'s perfect for a laid-back yet polished look.', 'http://127.0.0.1:3000/assets/products/3_1762277217104342600.webp', '75000', 0, '2025-11-05 00:23:33.978', '2025-11-08 05:04:59.364'),
(6, 8, 'Man Plaid Shirt', 'Fashion', 'mens-shirts', 'The Man Plaid Shirt is a timeless and versatile men\'s shirt with a classic plaid pattern. Its comfortable fit and casual style make it a wardrobe essential for various occasions.', 'http://127.0.0.1:3000/assets/products/1762278552058134300.webp', '35000', 78, '2025-11-05 00:49:12.059', '2025-11-08 05:00:59.194'),
(7, 5, 'Oppo A57', 'Others', 'smartphones', 'The Oppo A57 is a mid-range smartphone known for its sleek design and capable features. It offers a balance of performance and affordability, making it a popular choice.', 'http://127.0.0.1:3000/assets/products/1762399271965586400.webp', '1200000', 1, '2025-11-06 10:21:11.969', '2025-11-08 03:58:41.543'),
(8, 5, 'iPhone X', 'Others', 'smartphones', 'The iPhone X is a flagship smartphone featuring a bezel-less OLED display, facial recognition technology (Face ID), and impressive performance. It represents a milestone in iPhone design and innovation.', 'http://127.0.0.1:3000/assets/products/1762401519952174500.webp', '3000000', 3, '2025-11-06 10:58:39.958', '2025-11-08 03:58:58.446'),
(9, 8, 'Knoll Saarinen Executive Conference Chair', 'Others', 'furniture', 'The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.', 'http://127.0.0.1:3000/assets/products/1762402019276717100.webp', '180000', 26, '2025-11-06 11:06:59.278', '2025-11-08 03:52:10.737'),
(11, 4, 'Gigabyte Aorus Men Tshirt', 'Fashion', 'mens-shirts', 'The Gigabyte Aorus Men Tshirt is a cool and casual shirt for gaming enthusiasts. With the Aorus logo and sleek design, it\'s perfect for expressing your gaming style.', 'http://127.0.0.1:3000/assets/products/1762413782480685200.webp', '80000', 3, '2025-11-06 14:23:02.483', '2025-11-08 04:58:51.109'),
(15, 4, 'Sports Sneakers Off White & Red', 'Fashion', 'mens-shoes', 'The Sports Sneakers in Off White and Red combine style and functionality, making them a fashionable choice for sports enthusiasts. The red and off-white color combination adds a bold and energetic touch.', 'http://127.0.0.1:3000/assets/products/1762551662905815400.webp', '225000', 1, '2025-11-08 04:41:02.911', '2025-11-08 04:41:02.911');

-- --------------------------------------------------------

--
-- Table structure for table `shops`
--

CREATE TABLE `shops` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `shop_name` longtext COLLATE utf8mb4_general_ci,
  `shop_telephone` longtext COLLATE utf8mb4_general_ci,
  `shop_address` longtext COLLATE utf8mb4_general_ci,
  `account_number` longtext COLLATE utf8mb4_general_ci,
  `qris_picture` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status_admin` enum('approve','pending') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shops`
--

INSERT INTO `shops` (`id`, `user_id`, `shop_name`, `shop_telephone`, `shop_address`, `account_number`, `qris_picture`, `status_admin`, `created_at`) VALUES
(4, 3, 'Ello Shop\'s', '081364324016', 'Jalan Sako', 'BCA: 123456789', 'http://127.0.0.1:3000/assets/qris/3_1762140805808580600.jpg', 'approve', '2025-11-03 10:33:25.813'),
(5, 8, 'Budi Kapal Laud', '08123456789', 'Kenten Laut', 'BNI: 123456789', 'http://127.0.0.1:3000/assets/qris/8_1762556326572759800.jpg', 'approve', '2025-11-03 12:41:17.760'),
(8, 4, 'Steven Shop\'s', '082451323392', 'Jalan Kenten', 'BNI: 0683453219', 'http://127.0.0.1:3000/assets/qris/4_1762278422399430300.jpg', 'approve', '2025-11-05 00:47:02.404'),
(10, 9, 'Gudang Alex', '08235451324', 'Jalan Sekojo No 5', 'BCA: 14727211982', 'http://127.0.0.1:3000/assets/qris/9_1762551759457517500.jpg', 'pending', '2025-11-08 04:42:39.460');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` longtext COLLATE utf8mb4_general_ci,
  `password` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telephone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `role` enum('admin','seller','buyer') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profile_picture` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `address`, `telephone`, `role`, `profile_picture`) VALUES
(3, 'ElloRabyndra', 'ello@gmail.com', '$2a$10$8it/h8uRqQz1MB/mcJRFHegvtlrCaTGucd7iqff3DeOFRss8a3IYK', 'Poligon Perumahan Bukit Sejahtera BS06', '081364324016', 'seller', 'http://127.0.0.1:3000/assets/1762098041872291800.jpg'),
(4, 'Steven', 'steven@gmail.com', '$2a$10$kWfEVg9g0fMZqH7CTpUM7OAad/dle5GDYSHoAi6R4PotwmNbDNenK', '', '', 'seller', 'http://127.0.0.1:3000/assets/1762013657525867800.jpeg'),
(5, 'Admin_Thriftoria', 'admin@gmail.com', '$2a$10$NLkXke6Tl/OoW95Hz9FqN.kogM2VCTDy9kRNiMOB2zWavWlo7qal.', '', '', 'admin', 'https://i.pravatar.cc/150'),
(8, 'Budiono', 'budiono@gmail.com', '$2a$10$T6Coa2OVnVvRPK7ZzryOJ.AuYWKjqmNXWfZfFedDL46Yt3zRfSApm', 'Kenten Laut', '08123456789', 'seller', 'http://127.0.0.1:3000/assets/1762148442871522500.jpg'),
(9, 'Alex Burton', 'alex@gmail.com', '$2a$10$zdF3cU.XukKUunQQxuhce.gZmXCuuVBiTGsTKFdA21LwPTHpRgfou', '', '', 'buyer', 'https://i.pravatar.cc/150');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cartitem`
--
ALTER TABLE `cartitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_cartitem_user` (`user_id`),
  ADD KEY `fk_cartitem_product` (`product_id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_deleted_at` (`deleted_at`),
  ADD KEY `fk_order_user` (`user_id`),
  ADD KEY `fk_order_shop` (`shop_id`);

--
-- Indexes for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orderitem_product` (`product_id`),
  ADD KEY `fk_order_order_items` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_shops_products` (`shop_id`);

--
-- Indexes for table `shops`
--
ALTER TABLE `shops`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_shop` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cartitem`
--
ALTER TABLE `cartitem`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `orderitem`
--
ALTER TABLE `orderitem`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `shops`
--
ALTER TABLE `shops`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cartitem`
--
ALTER TABLE `cartitem`
  ADD CONSTRAINT `fk_cartitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `fk_cartitem_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `fk_order_shop` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`),
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `fk_order_order_items` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  ADD CONSTRAINT `fk_orderitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_shops_products` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`);

--
-- Constraints for table `shops`
--
ALTER TABLE `shops`
  ADD CONSTRAINT `fk_user_shop` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
