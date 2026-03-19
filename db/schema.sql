CREATE DATABASE IF NOT EXISTS `sd2-db`;
USE `sd2-db`;

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
('Karim Elmenshawy', 'karim@example.com', 'Member'),
('Andrei-Cristian Moaca', 'andrei@example.com', 'Member'),
('Raul Pereira', 'raul@example.com', 'Coordinator'),
('Issa Amtot', 'issa@example.com', 'Coordinator');

INSERT INTO categories (name) VALUES
('Audio'),
('Video'),
('Photography'),
('Lighting');

INSERT INTO rejection_reasons (description) VALUES
('Kit already booked for selected dates'),
('Invalid request dates'),
('Insufficient kit availability');

INSERT INTO kits (name, description, availability, category_id) VALUES
('Podcast Kit', 'Audio kit including microphone, stand and headphones', TRUE, 1),
('Camera Kit', 'DSLR camera kit with tripod and accessories', TRUE, 3),
('Lighting Kit', 'Portable lighting setup for studio and location use', TRUE, 4),
('Video Creator Kit', 'Complete video recording kit with camera and microphone', TRUE, 2);

INSERT INTO kit_items (item_name, kit_id) VALUES
('Microphone', 1),
('Headphones', 1),
('Mic Stand', 1),
('DSLR Camera', 2),
('Tripod', 2),
('Memory Card', 2),
('LED Light Panel', 3),
('Light Stand', 3),
('Softbox', 3),
('4K Camera', 4),
('Shotgun Microphone', 4),
('Tripod', 4);

INSERT INTO requests (user_id, kit_id, start_date, end_date, status, notes, rejection_reason_id) VALUES
(1, 1, '2026-03-20', '2026-03-22', 'Pending', 'Need this for a podcast recording session', NULL),
(2, 2, '2026-03-25', '2026-03-27', 'Approved', 'Photography project submission', NULL),
(1, 3, '2026-03-28', '2026-03-29', 'Rejected', 'Lighting needed for event filming', 1);