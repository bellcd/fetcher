DROP DATABASE IF EXISTS repos;

CREATE DATABASE repos;
USE repos;

DROP TABLE IF EXISTS repos;
DROP TABLE IF EXISTS users;

CREATE TABLE repos (
  id INT NOT NULL PRIMARY KEY,
  name VARCHAR(255),
  html_url VARCHAR(255),
  description VARCHAR(255),
  updated_at DATE,
  language VARCHAR(255),
  id_owner INT,
  CONSTRAINT fk_owner
    FOREIGN KEY (id_owner)
      REFERENCES users (id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

CREATE TABLE users (
  id INT NOT NULL PRIMARY KEY,
  login VARCHAR(255),
  avatar_url VARCHAR(255),
  html_url VARCHAR(255),
);
