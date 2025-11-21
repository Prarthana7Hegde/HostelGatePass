CREATE DATABASE IF NOT EXISTS hostel;
USE hostel;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  role ENUM('student','parent','warden','admin') DEFAULT 'student',
  phone VARCHAR(30),
  password VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY,
  roll_no VARCHAR(50) UNIQUE,
  room VARCHAR(50),
  parent_user_id INT,
  FOREIGN KEY (id) REFERENCES users(id),
  FOREIGN KEY (parent_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS gate_passes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  purpose TEXT,
  destination VARCHAR(255),
  start_time DATETIME,
  end_time DATETIME,
 
  parent_confirmed TINYINT DEFAULT 0,

  warden_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  warden_id INT,
  qr_token TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (warden_id) REFERENCES users(id)

);

CREATE TABLE IF NOT EXISTS movement_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pass_id INT,
  event ENUM('checkin','checkout'),
  gate_id VARCHAR(100),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pass_id) REFERENCES gate_passes(id) ON DELETE CASCADE
);
