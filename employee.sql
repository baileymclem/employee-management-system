DROP DATABASE IF EXISTS employee_db;
-- Creates the "animals_db" database --
CREATE DATABASE employee_db;

-- Makes it so all of the following code will affect animals_db --
USE employee_db;

-- Creates the table "people" within animals_db --
CREATE TABLE employee (
  id INTEGER Auto_Increment NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

CREATE TABLE department (
  id INTEGER Auto_Increment NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
);

CREATE TABLE role (
    id INTEGER Auto_Increment NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);