DROP DATABASE IF EXISTS fetcher;

CREATE DATABASE fetcher;
USE fetcher;

DROP TABLE IF EXISTS repos;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id INT NOT NULL,
  login VARCHAR(255),
  avatar_url VARCHAR(255),
  html_url VARCHAR(255),
  PRIMARY KEY (id)
);

CREATE TABLE repos(
  id INT NOT NULL,
  name VARCHAR(255),
  html_url VARCHAR(255),
  description VARCHAR(255),
  updated_at DATETIME,
  language VARCHAR(255),
  id_owner INT,
  PRIMARY KEY (id),
  CONSTRAINT fk_owner
    FOREIGN KEY (id_owner)
      REFERENCES users (id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);