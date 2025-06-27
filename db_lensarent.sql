-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 16, 2025 at 09:19 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_lensarent`
--

-- --------------------------------------------------------

--
-- Table structure for table `camera`
--

CREATE TABLE `camera` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` int(12) NOT NULL,
  `availability` enum('Tersedia','Tidak Tersedia') NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `camera`
--

INSERT INTO `camera` (`id`, `name`, `description`, `price`, `availability`, `image`) VALUES
(1, 'Canon EOS 80D', 'Kamera DSLR yang kuat dengan fitur serbaguna.', 225000, 'Tersedia', 'Canon_EOS_80D.png'),
(2, 'Nikon D3500', 'Kamera DSLR yang ringkas dan mudah digunakan.', 200000, 'Tidak Tersedia', 'Nikon_D3500.png'),
(3, 'Sony Alpha a6000', 'Kamera mirrorless dengan autofocus cepat.', 250000, 'Tersedia', 'Sony_Alpha_a6000.png'),
(4, 'Fujifilm X-T30', 'Kamera mirrorless bergaya dengan fitur canggih.', 275000, 'Tersedia', 'Fujifilm_X-T30.png'),
(5, 'Panasonic Lumix G7', 'Kamera mirrorless serbaguna dengan video 4K.', 230000, 'Tersedia', 'Panasonic_Lumix_G7.png'),
(6, 'Olympus OM-D E-M10 Mark III', 'Kamera mirrorless ringkas dengan stabilisasi 5-sumbu.', 240000, 'Tersedia', 'Olympus_OM-D_E-M10 Mark_III.png'),
(7, 'Canon EOS M50', 'Kamera mirrorless dengan kualitas gambar yang luar biasa.', 260000, 'Tersedia', 'Canon_EOS_M5o.png'),
(8, 'Nikon Z50', 'Kamera mirrorless dengan desain ringkas.', 280000, 'Tersedia', 'Nikon_Z50.png'),
(9, 'Sony Alpha a7 III', 'Kamera mirrorless full-frame dengan performa mengesankan.', 300000, 'Tersedia', 'Sony_Alpha_a7.png'),
(10, 'Fujifilm X-T4', 'Kamera mirrorless kelas atas dengan fitur canggih.', 320000, 'Tidak Tersedia', 'Fujifilm_X-T4.png');

-- --------------------------------------------------------

--
-- Table structure for table `rent`
--

CREATE TABLE `rent` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `camera_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `qr_code` varchar(255) NOT NULL,
  `status` enum('Menunggu Pembayaran','Sudah Bayar','Sedang Menyewa','Sudah Dikembalikan','Dibatalkan') DEFAULT 'Menunggu Pembayaran',
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rent`
--

INSERT INTO `rent` (`id`, `user_id`, `camera_id`, `start_date`, `end_date`, `qr_code`, `status`, `token`) VALUES
(14, 11, 2, '2025-01-07', '2025-01-08', '', 'Menunggu Pembayaran', ''),
(15, 11, 2, '2025-01-07', '2025-01-08', '', 'Menunggu Pembayaran', ''),
(16, 11, 3, '2025-01-07', '2025-01-08', '', 'Sedang Menyewa', ''),
(17, 11, 2, '2025-01-07', '2025-01-30', '', 'Sudah Dikembalikan', ''),
(18, 11, 1, '2025-01-07', '2025-01-26', '', 'Sedang Menyewa', ''),
(19, 11, 9, '2025-01-07', '2025-01-08', '', 'Sudah Bayar', ''),
(20, 11, 2, '2025-01-07', '2025-01-08', '', 'Sedang Menyewa', ''),
(21, 11, 10, '2025-01-07', '2025-01-08', '', 'Sudah Bayar', ''),
(22, 11, 8, '2025-01-07', '2025-01-08', '{\"order_id\":\"22\",\"transaction_status\":\"settlement\"}', 'Sudah Dikembalikan', ''),
(49, 11, 2, '2025-01-15', '2025-01-16', '{\"order_id\":\"49\",\"transaction_status\":\"settlement\"}', 'Sudah Bayar', ''),
(50, 11, 10, '2025-01-16', '2025-01-24', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAklEQVR4AewaftIAAAdlSURBVO3BQY4cSRLAQDLR//8yV0c/BZCoaq0m4Gb2B2td4mGtizysdZGHtS7ysNZFHta6yMNaF3lY6yIPa13kYa2LPKx1kYe1LvKw1kUe1rrIw1oXeVjrIj98SOVvqphUpopvUvmmiknlExUnKlPFpDJVTCp/U8UnHta6y', 'Menunggu Pembayaran', '');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(11) NOT NULL,
  `rent_id` int(12) NOT NULL,
  `total` int(12) NOT NULL,
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `kabupaten` varchar(255) NOT NULL,
  `alamat` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `phone` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `kabupaten`, `alamat`, `password`, `role`, `phone`) VALUES
(2, 'Dwiokta', 'Dwikta@gmail.com', 'Padang', 'Padang', '12345678', 'user', ''),
(3, 'Hardi', 'A', 'Padang', 'Jalan', '1', 'user', ''),
(5, 'H', 'H', 'H', 'H', '$2b$10$OlGSJUjmIvM3aANo5bhGwuQWmk6HBWI.rtrgqJVuePXnWn9.EzbeS', 'user', ''),
(6, 'G', 'G', 'G', 'G', '$2b$10$gIJHFIv5KJoUGtLGyAWNz.nXlSZYnNNMS89IOa7bw2TOAbrO56acm', 'admin', ''),
(8, 'Dwiokta hardikha', 'Aoisenko@gmail.com', 'Padang', 'Jalan ', '$2b$10$SPWeciVo7ZCkCbhTFyrO2.TWbYS2tmsivMbURjTFrvmYlHdFTv1Da', 'user', ''),
(9, 'A', 'B', 'C', 'D', '$2b$10$XMBr0YRo5zdPgPyNPbdRmu577C2jOjFfI9c2tmBVNNa5iqxNQLjJ2', 'user', ''),
(10, 'Dehimma Salsabilla', 'Salsabillaa2510@gmail.com', 'Padang', 'Jalan nipah no 27 c', '$2b$10$rxgnRz7adAuRJevu3z/JJOUS/TZ0aLlnyru13kErxmCWv.9hmFgeC', 'user', ''),
(11, 'Dwiokta8118', 'Aoisenko77@gmail.com', 'Padang', 'Jalana', '$2b$10$vGf8bCbul/QNCAVqIYc0IueQAbpN00CCOh6/ePDs86lOp0dG8NLhC', 'user', '0887766'),
(13, 'Admin', 'Admin', 'Admin', 'Admin', '$2b$10$h.fqYZtPwnTiLmp5mihbxOkU0VZUa9ckQ.hlCa7Mtq22GLpbjmLQy', 'admin', '0852367678'),
(14, 'Dwiokta Hardi', 'Test@gmail.com', 'Padang', 'Jalan', '$2b$10$34dtWlfWPow2.H0S9NRym.14oEjahqQYf1S5BgO0hPF/6/XX2RRu2', 'user', '085267676'),
(15, 'budi', 'test23@gmail.com', 'padang', 'jalan', '$2b$10$ws7C7aOt308gbOZWGBApXeGOllU5CMqn8Iarfiu39D9OjOvqBuJ56', 'user', '0866');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `camera`
--
ALTER TABLE `camera`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rent`
--
ALTER TABLE `rent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `camera_id` (`camera_id`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `camera`
--
ALTER TABLE `camera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `rent`
--
ALTER TABLE `rent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `rent`
--
ALTER TABLE `rent`
  ADD CONSTRAINT `rent_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `rent_ibfk_2` FOREIGN KEY (`camera_id`) REFERENCES `camera` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
