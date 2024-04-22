DROP DATABASE IF EXISTS cms;
CREATE DATABASE cms;

\c cms

CREATE TABLE Department (
id SERIAL PRIMARY KEY,
name VARCHAR(30)
);

CREATE TABLE Role (
id SERIAL PRIMARY KEY,
title VARCHAR(30),
salary DECIMAL,
department_id INTEGER,
FOREIGN KEY (department_id)
REFERENCES Department(id)
);


CREATE TABLE Employee(
id SERIAL PRIMARY KEY,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INTEGER,
FOREIGN KEY (role_id)
REFERENCES Role(id),
manager_id INTEGER,
FOREIGN KEY (manager_id)
REFERENCES Employee(id)
);


