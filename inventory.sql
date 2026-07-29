-- สร้างฐานข้อมูลและตาราง inventory สำหรับ XAMPP ในเครื่อง
CREATE DATABASE IF NOT EXISTS `it_std6730202343` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `it_std6730202343`;

CREATE TABLE IF NOT EXISTS `inventory` (
  `item_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `price` decimal(10,2) DEFAULT 0.00,
  `image_url` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

TRUNCATE TABLE `inventory`;

INSERT INTO `inventory` (`item_id`, `item_name`, `brand`, `stock_quantity`, `price`, `image_url`, `created_at`) VALUES
(4, 'Sauvage Eau de Parfum 100ml', 'Dior', 12, 6250.00, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&auto=format&fit=crop&q=60', '2026-07-29 18:47:58'),
(5, 'Bleu de Chanel Parfum 100ml', 'Chanel', 8, 7500.00, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=60', '2026-07-29 18:47:58'),
(6, 'Black Opium Eau de Parfum 90ml', 'YSL', 15, 6900.00, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=60', '2026-07-29 18:47:58');
