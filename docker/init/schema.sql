CREATE DATABASE IF NOT EXISTS `sd2-db`;
USE `sd2-db`;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    bio TEXT,
    password_hash VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS kits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    short_description VARCHAR(255),
    description TEXT NOT NULL,
    availability_status VARCHAR(50) NOT NULL DEFAULT 'Available',
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS kit_tags (
    kit_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (kit_id, tag_id),
    FOREIGN KEY (kit_id) REFERENCES kits(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS kit_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    quantity INT DEFAULT 1,
    kit_id INT NOT NULL,
    FOREIGN KEY (kit_id) REFERENCES kits(id)
);

CREATE TABLE IF NOT EXISTS borrow_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    kit_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    note TEXT,
    rejection_reason VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (kit_id) REFERENCES kits(id)
);

INSERT INTO users (name, email, role, bio, password_hash) VALUES
('Karim Elmenshawy', 'karim.elmenshawy@gmail.com', 'Member', 'Outdoor enthusiast', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Andrei Moaca', 'andrei.moaca@yahoo.co.uk', 'Member', 'Hiking lover', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Raul Pereira', 'raul.pereira@gmail.com', 'Coordinator', 'Kit coordinator', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Issa Amtot', 'issa.amtot@gmail.com', 'Coordinator', 'Community organiser', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('James Carter', 'james.carter@gmail.com', 'Member', 'Camping fan', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Emily Watson', 'emily.watson@yahoo.co.uk', 'Member', 'Nature lover', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Daniel Smith', 'daniel.smith@gmail.com', 'Member', 'Adventure seeker', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Olivia Brown', 'olivia.brown@gmail.com', 'Member', 'Trail runner', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Noah Johnson', 'noah.johnson@gmail.com', 'Member', 'Wild camper', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Sophia Taylor', 'sophia.taylor@yahoo.co.uk', 'Member', 'Navigation expert', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Liam Wilson', 'liam.wilson@gmail.com', 'Coordinator', 'Senior coordinator', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Ava Davis', 'ava.davis@gmail.com', 'Member', 'Cooking enthusiast', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Ethan Miller', 'ethan.miller@gmail.com', 'Member', 'Survival expert', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Mia Anderson', 'mia.anderson@gmail.com', 'Member', 'Hiking enthusiast', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Lucas Thomas', 'lucas.thomas@gmail.com', 'Member', 'Outdoor photographer', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Isabella Moore', 'isabella.moore@gmail.com', 'Coordinator', 'Kit manager', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Mason Martin', 'mason.martin@gmail.com', 'Member', 'Backpacker', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Amelia Jackson', 'amelia.jackson@yahoo.co.uk', 'Member', 'Rock climber', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Logan White', 'logan.white@gmail.com', 'Member', 'Cyclist', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
('Charlotte Harris', 'charlotte.harris@gmail.com', 'Member', 'Wildlife watcher', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO categories (name) VALUES
('Camping'), ('Hiking'), ('Survival'), ('Navigation'), ('Cooking');

INSERT INTO tags (name) VALUES
('Beginner'), ('Advanced'), ('Lightweight'), ('All-season'), ('Solo'), ('Group');

INSERT INTO kits (name, short_description, description, availability_status, category_id) VALUES
('Beginner Camping Kit', 'Perfect starter kit for first-time campers', 'Tent, sleeping bag and basic camping essentials for beginners', 'Available', 1),
('Advanced Camping Kit', 'Full kit for experienced campers', 'Large tent, sleeping mats and cooking equipment for groups', 'Available', 1),
('Hiking Kit', 'Everything you need for a day hike', 'Backpack, water bottles and hiking poles for trail adventures', 'Available', 2),
('Survival Kit', 'Emergency tools for outdoor survival', 'Emergency tools, fire starter and water purifier', 'Available', 3),
('Navigation Kit', 'Find your way anywhere', 'Compass, GPS device and physical maps for navigation', 'Available', 4),
('Cooking Kit', 'Cook anywhere outdoors', 'Portable stove, utensils and cooking gear', 'Available', 5),
('Wild Camping Kit', 'Lightweight gear for wild camping', 'Lightweight tent and compact sleeping gear', 'Available', 1),
('Explorer Kit', 'All-in-one for extended trips', 'All-in-one kit for extended outdoor trips', 'Available', 3);

INSERT INTO kit_tags (kit_id, tag_id) VALUES
(1, 1), (1, 5), (2, 2), (2, 6), (3, 1), (3, 3),
(4, 2), (4, 5), (5, 2), (5, 5), (6, 1), (6, 6),
(7, 3), (7, 5), (8, 2), (8, 4);

INSERT INTO kit_items (item_name, quantity, kit_id) VALUES
('Tent', 1, 1), ('Sleeping Bag', 1, 1), ('Camping Light', 1, 1),
('Large Tent', 1, 2), ('Sleeping Mat', 2, 2), ('Camping Stove', 1, 2),
('Backpack', 1, 3), ('Hiking Poles', 2, 3), ('Water Bottle', 2, 3),
('Fire Starter', 1, 4), ('Multi-tool', 1, 4), ('Water Purifier', 1, 4),
('Compass', 1, 5), ('GPS Device', 1, 5), ('Maps', 3, 5),
('Portable Stove', 1, 6), ('Cooking Utensils', 1, 6), ('Gas Canister', 2, 6),
('Lightweight Tent', 1, 7), ('Compact Sleeping Bag', 1, 7),
('All-purpose Backpack', 1, 8), ('Survival Tools Set', 1, 8), ('Flashlight', 1, 8);

INSERT INTO borrow_requests (user_id, kit_id, start_date, end_date, status, note) VALUES
(1, 1, '2026-03-20', '2026-03-22', 'Pending', 'Weekend camping trip'),
(2, 2, '2026-03-21', '2026-03-25', 'Approved', 'Group camping trip'),
(5, 4, '2026-03-22', '2026-03-26', 'Rejected', 'Outdoor survival practice'),
(6, 3, '2026-03-23', '2026-03-24', 'Approved', 'Hiking in national park'),
(7, 5, '2026-03-24', '2026-03-27', 'Pending', 'Navigation training'),
(8, 6, '2026-03-25', '2026-03-28', 'Rejected', 'Cooking outdoors event'),
(9, 7, '2026-03-26', '2026-03-29', 'Approved', 'Solo camping trip'),
(10, 8, '2026-03-27', '2026-03-30', 'Pending', 'Exploration trip'),
(11, 1, '2026-03-28', '2026-04-01', 'Approved', 'Camping with friends'),
(12, 4, '2026-03-29', '2026-04-02', 'Rejected', 'Survival training'),
(13, 3, '2026-03-30', '2026-04-03', 'Pending', 'Mountain hiking'),
(14, 5, '2026-03-31', '2026-04-04', 'Approved', 'Navigation course');