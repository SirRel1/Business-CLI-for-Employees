INSERT INTO employees (first_name, last_name, manager_id, role_id ) VALUES (
    "Terrell", "Hudson", 2, 1
),
(
    "Resario", "Clayton", 2, 1
),
(
    "Meagan", "Riverty", 3, 1
),
(
    "June", "Collins", 3, 1
),
(
    "Fredreana", "Jackson", 1, 1
),
(
    "Maximillian", "Schmedtmann", 1, 1
);


INSERT INTO roles (title, salary, department_id) 
VALUES ("Entry Level Developer", 65000, 1),
 ("Engineer", 85000, 3),
 ("Quality Assurance", 75000, 2),
 ("Sales Manager", 80000, 4);


INSERT INTO department (dept_name) 
VALUES ("Engineering"),
 ("Sales"),
 ("Human Resources"),
 ("Services");


INSERT INTO managers (manager_name) 
VALUES ("Curtis Lee"),
 ("Brenda Marie"),
 ("Lydia Lewis"),
 ("Cayla Daniel");

