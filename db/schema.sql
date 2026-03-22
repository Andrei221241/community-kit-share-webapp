CREATE DATABASE IF NOT EXISTS `sd2_db`;
USE `sd2_db`;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS rejection_reasons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS kits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    availability BOOLEAN NOT NULL DEFAULT TRUE,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS kit_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    kit_id INT NOT NULL,
    FOREIGN KEY (kit_id) REFERENCES kits(id)
);

CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    kit_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    notes TEXT,
    rejection_reason_id INT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (kit_id) REFERENCES kits(id),
    FOREIGN KEY (rejection_reason_id) REFERENCES rejection_reasons(id)
);

INSERT INTO users (name, email, role) VALUES
('Karim Elmenshawy', 'karim.elmenshawy@gmail.com', 'Member'),
('Andrei Moaca', 'andrei.moaca@yahoo.co.uk', 'Member'),
('Raul Pereira', 'raul.pereira@gmail.com', 'Coordinator'),
('Issa Amtot', 'issa.amtot@gmail.com', 'Coordinator'),
('James Carter', 'james.carter@gmail.com', 'Member'),
('Emily Watson', 'emily.watson@yahoo.co.uk', 'Member'),
('Daniel Smith', 'daniel.smith@gmail.com', 'Member'),
('Olivia Brown', 'olivia.brown@gmail.com', 'Member'),
('Noah Johnson', 'noah.johnson@gmail.com', 'Member'),
('Sophia Taylor', 'sophia.taylor@yahoo.co.uk', 'Member'),
('Liam Wilson', 'liam.wilson@gmail.com', 'Coordinator'),
('Ava Davis', 'ava.davis@gmail.com', 'Member'),
('Ethan Miller', 'ethan.miller@gmail.com', 'Member'),
('Mia Anderson', 'mia.anderson@gmail.com', 'Member'),
('Lucas Thomas', 'lucas.thomas@gmail.com', 'Member'),
('Isabella Moore', 'isabella.moore@gmail.com', 'Coordinator'),
('Mason Martin', 'mason.martin@gmail.com', 'Member'),
('Amelia Jackson', 'amelia.jackson@yahoo.co.uk', 'Member'),
('Logan White', 'logan.white@gmail.com', 'Member'),
('Charlotte Harris', 'charlotte.harris@gmail.com', 'Member');

INSERT INTO categories (name) VALUES
('Camping'),
('Hiking'),
('Survival'),
('Navigation'),
('Cooking');

INSERT INTO rejection_reasons (description) VALUES
('Kit already booked for selected dates'),
('Invalid date range selected'),
('Kit currently under maintenance'),
('High demand for this item'),
('Incomplete request details');

INSERT INTO kits (name, description, availability, category_id) VALUES
('Beginner Camping Kit', 'Tent, sleeping bag and basic camping essentials', TRUE, 1),
('Advanced Camping Kit', 'Large tent, sleeping mats and cooking equipment', TRUE, 1),
('Hiking Kit', 'Backpack, water bottles and hiking poles', TRUE, 2),
('Survival Kit', 'Emergency tools, fire starter and water purifier', TRUE, 3),
('Navigation Kit', 'Compass, GPS device and physical maps', TRUE, 4),
('Cooking Kit', 'Portable stove, utensils and cooking gear', TRUE, 5),
('Wild Camping Kit', 'Lightweight tent and compact sleeping gear', TRUE, 1),
('Explorer Kit', 'All-in-one kit for extended outdoor trips', TRUE, 3);

INSERT INTO kit_items (item_name, kit_id) VALUES
('Tent', 1),
('Sleeping Bag', 1),
('Camping Light', 1),
('Large Tent', 2),
('Sleeping Mat', 2),
('Camping Stove', 2),
('Backpack', 3),
('Hiking Poles', 3),
('Water Bottle', 3),
('Fire Starter', 4),
('Multi-tool', 4),
('Water Purifier', 4),
('Compass', 5),
('GPS Device', 5),
('Maps', 5),
('Portable Stove', 6),
('Cooking Utensils', 6),
('Gas Canister', 6),
('Lightweight Tent', 7),
('Compact Sleeping Bag', 7),
('All-purpose Backpack', 8),
('Survival Tools Set', 8),
('Flashlight', 8);

INSERT INTO requests (user_id, kit_id, start_date, end_date, status, notes, rejection_reason_id) VALUES
(1, 1, '2026-03-20', '2026-03-22', 'Pending', 'Weekend camping trip', NULL),
(2, 2, '2026-03-21', '2026-03-25', 'Approved', 'Group camping trip', NULL),
(5, 4, '2026-03-22', '2026-03-26', 'Rejected', 'Outdoor survival practice', 1),
(6, 3, '2026-03-23', '2026-03-24', 'Approved', 'Hiking in national park', NULL),
(7, 5, '2026-03-24', '2026-03-27', 'Pending', 'Navigation training', NULL),
(8, 6, '2026-03-25', '2026-03-28', 'Rejected', 'Cooking outdoors event', 3),
(9, 7, '2026-03-26', '2026-03-29', 'Approved', 'Solo camping trip', NULL),
(10, 8, '2026-03-27', '2026-03-30', 'Pending', 'Exploration trip', NULL),
(11, 1, '2026-03-28', '2026-04-01', 'Approved', 'Camping with friends', NULL),
(12, 4, '2026-03-29', '2026-04-02', 'Rejected', 'Survival training', 2),
(13, 3, '2026-03-30', '2026-04-03', 'Pending', 'Mountain hiking', NULL),
(14, 5, '2026-03-31', '2026-04-04', 'Approved', 'Navigation course', NULL);