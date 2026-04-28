
CREATE DATABASE IF NOT EXISTS `sd2-db`;
USE `sd2-db`;
SET FOREIGN_KEY_CHECKS = 0;

-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 27, 2026 at 01:15 PM
-- Server version: 9.6.0
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `borrow_requests`
--

CREATE TABLE `borrow_requests` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `kit_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `note` text,
  `rejection_reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `returned_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `borrow_requests`
--

INSERT INTO `borrow_requests` (`id`, `user_id`, `kit_id`, `start_date`, `end_date`, `status`, `note`, `rejection_reason`, `created_at`, `returned_at`) VALUES
(1, 1, 1, '2026-03-20', '2026-03-22', 'Returned', 'Weekend camping trip', NULL, '2026-03-23 10:50:23', '2026-04-13 20:24:29'),
(2, 2, 2, '2026-03-21', '2026-03-25', 'Returned', 'Group camping trip', NULL, '2026-03-23 10:50:23', '2026-04-13 20:25:33'),
(3, 5, 4, '2026-03-22', '2026-03-26', 'Rejected', 'Outdoor survival practice', NULL, '2026-03-23 10:50:23', NULL),
(4, 6, 3, '2026-03-23', '2026-03-24', 'Returned', 'Hiking in national park', NULL, '2026-03-23 10:50:23', '2026-04-26 22:03:35'),
(5, 7, 5, '2026-03-24', '2026-03-27', 'Returned', 'Navigation training', NULL, '2026-03-23 10:50:23', '2026-04-26 22:08:58'),
(6, 8, 6, '2026-03-25', '2026-03-28', 'Rejected', 'Cooking outdoors event', NULL, '2026-03-23 10:50:23', NULL),
(7, 9, 7, '2026-03-26', '2026-03-29', 'Returned', 'Solo camping trip', NULL, '2026-03-23 10:50:23', '2026-04-26 22:11:55'),
(8, 10, 8, '2026-03-27', '2026-03-30', 'Returned', 'Exploration trip', NULL, '2026-03-23 10:50:23', '2026-04-26 22:11:57'),
(9, 11, 1, '2026-03-28', '2026-04-01', 'Returned', 'Camping with friends', NULL, '2026-03-23 10:50:23', '2026-04-26 22:03:33'),
(10, 12, 4, '2026-03-29', '2026-04-02', 'Rejected', 'Survival training', NULL, '2026-03-23 10:50:23', NULL),
(11, 13, 3, '2026-03-30', '2026-04-03', 'Returned', 'Mountain hiking', NULL, '2026-03-23 10:50:23', '2026-04-26 22:03:36'),
(12, 14, 5, '2026-03-31', '2026-04-04', 'Returned', 'Navigation course', NULL, '2026-03-23 10:50:23', '2026-04-26 22:11:53'),
(13, 4, 2, '2026-05-01', '2026-05-20', 'Rejected', 'is this available?', 'nope not available?', '2026-04-26 22:03:59', NULL),
(14, 5, 1, '2026-04-30', '2026-05-10', 'Returned', 'aaaaaaaaaaa', NULL, '2026-04-26 22:09:51', '2026-04-26 22:10:57'),
(15, 5, 1, '2026-04-29', '2026-05-08', 'Returned', NULL, NULL, '2026-04-26 22:15:13', '2026-04-26 22:15:46');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Camping'),
(2, 'Hiking'),
(3, 'Survival'),
(4, 'Navigation'),
(5, 'Cooking');

-- --------------------------------------------------------

--
-- Table structure for table `kits`
--

CREATE TABLE `kits` (
  `id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `availability_status` varchar(50) NOT NULL DEFAULT 'Available',
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kits`
--

INSERT INTO `kits` (`id`, `name`, `short_description`, `description`, `availability_status`, `category_id`) VALUES
(1, 'Beginner Camping Kit', 'Perfect starter kit for first-time campers', 'Tent, sleeping bag and basic camping essentials for beginners', 'Available', 1),
(2, 'Advanced Camping Kit', 'Full kit for experienced campers', 'Large tent, sleeping mats and cooking equipment for groups', 'Available', 1),
(3, 'Hiking Kit', 'Everything you need for a day hike', 'Backpack, water bottles and hiking poles for trail adventures', 'Available', 2),
(4, 'Survival Kit', 'Emergency tools for outdoor survival', 'Emergency tools, fire starter and water purifier', 'Available', 3),
(5, 'Navigation Kit', 'Find your way anywhere', 'Compass, GPS device and physical maps for navigation', 'Available', 4),
(6, 'Cooking Kit', 'Cook anywhere outdoors', 'Portable stove, utensils and cooking gear', 'Available', 5),
(7, 'Wild Camping Kit', 'Lightweight gear for wild camping', 'Lightweight tent and compact sleeping gear', 'Available', 1),
(8, 'Explorer Kit', 'All-in-one for extended trips', 'All-in-one kit for extended outdoor trips', 'Available', 3);

-- --------------------------------------------------------

--
-- Table structure for table `kit_items`
--

CREATE TABLE `kit_items` (
  `id` int NOT NULL,
  `item_name` varchar(150) NOT NULL,
  `quantity` int DEFAULT '1',
  `kit_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kit_items`
--

INSERT INTO `kit_items` (`id`, `item_name`, `quantity`, `kit_id`) VALUES
(1, 'Tent', 1, 1),
(2, 'Sleeping Bag', 1, 1),
(3, 'Camping Light', 1, 1),
(4, 'Large Tent', 1, 2),
(5, 'Sleeping Mat', 2, 2),
(6, 'Camping Stove', 1, 2),
(7, 'Backpack', 1, 3),
(8, 'Hiking Poles', 2, 3),
(9, 'Water Bottle', 2, 3),
(10, 'Fire Starter', 1, 4),
(11, 'Multi-tool', 1, 4),
(12, 'Water Purifier', 1, 4),
(13, 'Compass', 1, 5),
(14, 'GPS Device', 1, 5),
(15, 'Maps', 3, 5),
(16, 'Portable Stove', 1, 6),
(17, 'Cooking Utensils', 1, 6),
(18, 'Gas Canister', 2, 6),
(19, 'Lightweight Tent', 1, 7),
(20, 'Compact Sleeping Bag', 1, 7),
(21, 'All-purpose Backpack', 1, 8),
(22, 'Survival Tools Set', 1, 8),
(23, 'Flashlight', 1, 8);

-- --------------------------------------------------------

--
-- Table structure for table `kit_reviews`
--

CREATE TABLE `kit_reviews` (
  `id` int NOT NULL,
  `kit_id` int NOT NULL,
  `user_id` int NOT NULL,
  `request_id` int DEFAULT NULL,
  `stars` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kit_reviews`
--

INSERT INTO `kit_reviews` (`id`, `kit_id`, `user_id`, `request_id`, `stars`, `comment`, `created_at`) VALUES
(1, 1, 5, 15, 5, NULL, '2026-04-27 13:05:07'),
(2, 1, 5, 14, 1, NULL, '2026-04-27 13:05:33'),
(3, 3, 6, 4, 5, NULL, '2026-04-27 13:09:06');

-- --------------------------------------------------------

--
-- Table structure for table `kit_tags`
--

CREATE TABLE `kit_tags` (
  `kit_id` int NOT NULL,
  `tag_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kit_tags`
--

INSERT INTO `kit_tags` (`kit_id`, `tag_id`) VALUES
(1, 1),
(3, 1),
(6, 1),
(2, 2),
(4, 2),
(5, 2),
(8, 2),
(3, 3),
(7, 3),
(8, 4),
(1, 5),
(4, 5),
(5, 5),
(7, 5),
(2, 6),
(6, 6);

-- --------------------------------------------------------

--
-- Table structure for table `points_history`
--

CREATE TABLE `points_history` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `request_id` int DEFAULT NULL,
  `action_type` varchar(50) NOT NULL,
  `points_change` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `points_history`
--

INSERT INTO `points_history` (`id`, `user_id`, `request_id`, `action_type`, `points_change`, `created_at`, `comment`) VALUES
(15, 2, 2, 'Request Approved', 5, '2026-04-12 23:49:08', NULL),
(16, 2, 2, 'Completed Return', 10, '2026-04-12 23:49:08', NULL),
(17, 6, 4, 'Request Approved', 5, '2026-04-12 23:49:08', NULL),
(18, 6, 4, 'Completed Return', 10, '2026-04-12 23:49:08', NULL),
(19, 9, 7, 'Request Approved', 5, '2026-04-12 23:49:08', NULL),
(20, 9, 7, 'Completed Return', 10, '2026-04-12 23:49:08', NULL),
(21, 11, 9, 'Request Approved', 5, '2026-04-12 23:49:08', NULL),
(22, 11, 9, 'Completed Return', 10, '2026-04-12 23:49:08', NULL),
(23, 14, 12, 'Request Approved', 5, '2026-04-12 23:49:08', NULL),
(24, 14, 12, 'Completed Return', 10, '2026-04-12 23:49:08', NULL),
(25, 1, 1, 'Request Submitted', 2, '2026-04-12 23:52:11', NULL),
(26, 2, 2, 'Request Approved', 5, '2026-04-12 23:52:11', NULL),
(27, 2, 2, 'Completed Return', 10, '2026-04-12 23:52:11', NULL),
(28, 3, NULL, 'Coordinator Review', 4, '2026-04-12 23:52:11', NULL),
(29, 4, NULL, 'Coordinator Approval', 5, '2026-04-12 23:52:11', NULL),
(30, 5, 3, 'Request Submitted', 2, '2026-04-12 23:52:11', NULL),
(31, 6, 4, 'Request Approved', 5, '2026-04-12 23:52:11', NULL),
(32, 6, 4, 'Completed Return', 10, '2026-04-12 23:52:11', NULL),
(33, 7, 5, 'Request Submitted', 2, '2026-04-12 23:52:11', NULL),
(34, 8, 6, 'Request Submitted', 2, '2026-04-12 23:52:11', NULL),
(35, 9, 7, 'Request Approved', 5, '2026-04-12 23:52:11', NULL),
(36, 9, 7, 'Completed Return', 10, '2026-04-12 23:52:11', NULL),
(37, 10, 8, 'Request Submitted', 2, '2026-04-12 23:52:11', NULL),
(38, 11, 9, 'Request Approved', 5, '2026-04-12 23:52:11', NULL),
(39, 11, 9, 'Completed Return', 10, '2026-04-12 23:52:11', NULL),
(40, 12, 10, 'Request Submitted', 2, '2026-04-12 23:52:11', NULL),
(41, 13, 11, 'Request Submitted', 2, '2026-04-12 23:52:11', NULL),
(42, 14, 12, 'Request Approved', 5, '2026-04-12 23:52:11', NULL),
(43, 14, 12, 'Completed Return', 10, '2026-04-12 23:52:11', NULL),
(44, 1, 1, 'Request Approved', 5, '2026-04-13 12:08:52', NULL),
(45, 7, 5, 'Request Approved', 5, '2026-04-13 12:08:55', NULL),
(46, 10, 8, 'Request Approved', 5, '2026-04-13 12:08:56', NULL),
(47, 13, 11, 'Request Approved', 5, '2026-04-13 12:08:57', NULL),
(48, 1, 1, 'Completed Return', 10, '2026-04-13 20:24:29', NULL),
(49, 2, 2, 'Completed Return', 10, '2026-04-13 20:25:33', NULL),
(50, 11, 9, 'Completed Return', 10, '2026-04-26 22:03:33', NULL),
(51, 6, 4, 'Completed Return', 10, '2026-04-26 22:03:35', NULL),
(52, 13, 11, 'Completed Return', 10, '2026-04-26 22:03:36', NULL),
(53, 7, 5, 'Completed Return', 10, '2026-04-26 22:08:58', NULL),
(54, 5, 14, 'Request Approved', 5, '2026-04-26 22:10:56', NULL),
(55, 5, 14, 'Completed Return', 10, '2026-04-26 22:10:57', NULL),
(56, 14, 12, 'Completed Return', 10, '2026-04-26 22:11:53', NULL),
(57, 9, 7, 'Completed Return', 10, '2026-04-26 22:11:55', NULL),
(58, 10, 8, 'Completed Return', 10, '2026-04-26 22:11:57', NULL),
(59, 5, 15, 'Request Approved', 5, '2026-04-26 22:15:44', NULL),
(60, 5, 15, 'Completed Return', 10, '2026-04-26 22:15:46', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ratings`
--

CREATE TABLE `ratings` (
  `id` int NOT NULL,
  `rated_user_id` int NOT NULL,
  `reviewer_user_id` int NOT NULL,
  `request_id` int NOT NULL,
  `stars` int NOT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `request_messages`
--

CREATE TABLE `request_messages` (
  `id` int NOT NULL,
  `request_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `request_messages`
--

INSERT INTO `request_messages` (`id`, `request_id`, `sender_id`, `message`, `created_at`) VALUES
(1, 14, 5, 'hey', '2026-04-26 22:10:01'),
(2, 14, 5, 'is this available?', '2026-04-26 22:10:06'),
(3, 3, 5, 'why rejeect?', '2026-04-26 22:10:15'),
(4, 3, 5, 'respond', '2026-04-27 12:04:26'),
(5, 3, 5, 'respond', '2026-04-27 12:04:38'),
(6, 15, 4, 'hello', '2026-04-27 12:06:11');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(1, 'Beginner'),
(2, 'Advanced'),
(3, 'Lightweight'),
(4, 'All-season'),
(5, 'Solo'),
(6, 'Group');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `role` varchar(50) NOT NULL,
  `bio` text,
  `password_hash` varchar(255) DEFAULT NULL,
  `loyalty_points` int DEFAULT '0',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role`, `bio`, `password_hash`, `loyalty_points`, `reset_token`, `reset_token_expires`) VALUES
(1, 'Karim Elmenshawy', 'karim.elmenshawy@gmail.com', 'Member', 'Outdoor enthusiast', '$2b$10$MP3Qx.DhgpPSgo2N5jBi.OEXxLTndyhzX1Ymd1aoFqMksNIMpRtvC', 17, '1d6b3e07e1d9a8f55fadcfc67bcef1b1797f93c16add62a5f33cdde99ac45ef5', '2026-04-13 14:24:44'),
(2, 'Andrei Moaca', 'andrei.moaca@yahoo.co.uk', 'Coordinator', 'Hiking lover', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 25, NULL, NULL),
(3, 'Raul Pereira', 'raul.pereira@gmail.com', 'Coordinator', 'Kit coordinator', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4, NULL, NULL),
(4, 'Issa Amtot', 'issa.amtot@gmail.com', 'Coordinator', 'Community organiser', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 5, NULL, NULL),
(5, 'James Carter', 'james.carter@gmail.com', 'Member', 'Camping fan', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 32, NULL, NULL),
(6, 'Emily Watson', 'emily.watson@yahoo.co.uk', 'Member', 'Nature lover', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 25, NULL, NULL),
(7, 'Daniel Smith', 'daniel.smith@gmail.com', 'Member', 'Adventure seeker', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 17, NULL, NULL),
(8, 'Olivia Brown', 'olivia.brown@gmail.com', 'Member', 'Trail runner', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, NULL, NULL),
(9, 'Noah Johnson', 'noah.johnson@gmail.com', 'Member', 'Wild camper', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 25, NULL, NULL),
(10, 'Sophia Taylor', 'sophia.taylor@yahoo.co.uk', 'Member', 'Navigation expert', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 17, NULL, NULL),
(11, 'Liam Wilson', 'liam.wilson@gmail.com', 'Coordinator', 'Senior coordinator', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 25, NULL, NULL),
(12, 'Ava Davis', 'ava.davis@gmail.com', 'Member', 'Cooking enthusiast', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, NULL, NULL),
(13, 'Ethan Miller', 'ethan.miller@gmail.com', 'Member', 'Survival expert', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 17, NULL, NULL),
(14, 'Mia Anderson', 'mia.anderson@gmail.com', 'Member', 'Hiking enthusiast', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 25, NULL, NULL),
(15, 'Lucas Thomas', 'lucas.thomas@gmail.com', 'Member', 'Outdoor photographer', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, NULL, NULL),
(16, 'Isabella Moore', 'isabella.moore@gmail.com', 'Coordinator', 'Kit manager', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, NULL, NULL),
(17, 'Mason Martin', 'mason.martin@gmail.com', 'Member', 'Backpacker', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, NULL, NULL),
(18, 'Amelia Jackson', 'amelia.jackson@yahoo.co.uk', 'Member', 'Rock climber', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, NULL, NULL),
(19, 'Logan White', 'logan.white@gmail.com', 'Member', 'Cyclist', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, NULL, NULL),
(20, 'Charlotte Harris', 'charlotte.harris@gmail.com', 'Member', 'Wildlife watcher', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `borrow_requests`
--
ALTER TABLE `borrow_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `kit_id` (`kit_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kits`
--
ALTER TABLE `kits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `kit_items`
--
ALTER TABLE `kit_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kit_id` (`kit_id`);

--
-- Indexes for table `kit_reviews`
--
ALTER TABLE `kit_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kit_id` (`kit_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `kit_tags`
--
ALTER TABLE `kit_tags`
  ADD PRIMARY KEY (`kit_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `points_history`
--
ALTER TABLE `points_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rated_user_id` (`rated_user_id`),
  ADD KEY `reviewer_user_id` (`reviewer_user_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `request_messages`
--
ALTER TABLE `request_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `borrow_requests`
--
ALTER TABLE `borrow_requests`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kits`
--
ALTER TABLE `kits`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `kit_items`
--
ALTER TABLE `kit_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `kit_reviews`
--
ALTER TABLE `kit_reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `points_history`
--
ALTER TABLE `points_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `request_messages`
--
ALTER TABLE `request_messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `borrow_requests`
--
ALTER TABLE `borrow_requests`
  ADD CONSTRAINT `borrow_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `borrow_requests_ibfk_2` FOREIGN KEY (`kit_id`) REFERENCES `kits` (`id`);

--
-- Constraints for table `kits`
--
ALTER TABLE `kits`
  ADD CONSTRAINT `kits_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `kit_items`
--
ALTER TABLE `kit_items`
  ADD CONSTRAINT `kit_items_ibfk_1` FOREIGN KEY (`kit_id`) REFERENCES `kits` (`id`);

--
-- Constraints for table `kit_reviews`
--
ALTER TABLE `kit_reviews`
  ADD CONSTRAINT `kit_reviews_ibfk_1` FOREIGN KEY (`kit_id`) REFERENCES `kits` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kit_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kit_reviews_ibfk_3` FOREIGN KEY (`request_id`) REFERENCES `borrow_requests` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `kit_tags`
--
ALTER TABLE `kit_tags`
  ADD CONSTRAINT `kit_tags_ibfk_1` FOREIGN KEY (`kit_id`) REFERENCES `kits` (`id`),
  ADD CONSTRAINT `kit_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`);

--
-- Constraints for table `points_history`
--
ALTER TABLE `points_history`
  ADD CONSTRAINT `points_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `points_history_ibfk_2` FOREIGN KEY (`request_id`) REFERENCES `borrow_requests` (`id`);

--
-- Constraints for table `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`rated_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`reviewer_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `ratings_ibfk_3` FOREIGN KEY (`request_id`) REFERENCES `borrow_requests` (`id`);

--
-- Constraints for table `request_messages`
--
ALTER TABLE `request_messages`
  ADD CONSTRAINT `request_messages_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `borrow_requests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `request_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
