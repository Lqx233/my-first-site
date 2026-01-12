-- Auth schema migration (MySQL compatible)
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  country_code VARCHAR(8) NOT NULL,
  local_number VARCHAR(32) NOT NULL,
  full_phone_index VARCHAR(32) NOT NULL,
  phone_encrypted VARBINARY(255) NOT NULL,
  phone_hash CHAR(64) NOT NULL,
  status VARCHAR(16) DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  UNIQUE KEY uq_users_full_phone (full_phone_index),
  UNIQUE KEY uq_users_phone_hash (phone_hash)
);

CREATE TABLE roles (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(32) NOT NULL,
  UNIQUE KEY uq_roles_name (name)
);

CREATE TABLE user_roles (
  user_id CHAR(36) NOT NULL,
  role_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE merchant_profiles (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  merchant_name VARCHAR(128) NOT NULL,
  status VARCHAR(16) DEFAULT 'PENDING',
  invite_code VARCHAR(32) NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  UNIQUE KEY uq_merchant_user (user_id)
);

CREATE TABLE login_logs (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  login_channel VARCHAR(16) NOT NULL,
  client_type VARCHAR(16) NOT NULL,
  ip VARCHAR(64) NULL,
  device_id VARCHAR(64) NULL,
  user_agent VARCHAR(255) NULL,
  success TINYINT(1) NOT NULL,
  failure_reason VARCHAR(128) NULL,
  created_at DATETIME NOT NULL
);
