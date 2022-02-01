DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

USE business_db;

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30)  NOT NULL,
  role_id INT NOT NULL DEFAULT 1,
  manager_id INT NOT NULL 
);


CREATE TABLE roles (
  role_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary INT NOT NULL,
  department_id INT NOT NULL DEFAULT 3
  
);

CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  dept_name VARCHAR(30) NOT NULL

);

CREATE TABLE managers (
  manager_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  manager_name VARCHAR(30) NOT NULL

);

