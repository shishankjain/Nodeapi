CREATE DATABASE newapi;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(40),
    dept VARCHAR(40)
);

INSERT INTO users(name, dept)
    VALUES ('Shishank', 'HR'),('Arpit','Technical');
INSERT INTO users(name, dept)
    VALUES ('Hardik', 'HR'),('Nitin','HR');