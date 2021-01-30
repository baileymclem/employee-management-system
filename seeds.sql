USE employee_db

INSERT INTO department (name)
VALUES ('Marketing'), ('Finance'), ('Engineering'), ('Operations'), ('Human Resources'), ('Design');

INSERT INTO role (title, salary, department_id)
VALUES ('Email Marketing Specialist', 65000, 1), ('Email Marketing Manager', 90000, 1), ('Marketing Manager', 115000, 1), ('Finance Analyst', 65000, 2), ('Finance Manager', 95000, 2), ('CFO', 175000, 2), ('Software Engineer', 100000, 3), ('Senior Software Engineer', 125000, 3), ('Operations Supervisor', 75000, 4), ('COO', 150000, 4), ('Recruiter', 65000, 5), ('Human Resources Specialist', 85000, 5), ('Chief Designer', 150000, 6);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Chad', 'Chaderson', 3), ('Tom', 'Cruisin', 6), ('Softy', 'McSoftware', 8), ('Opera', 'Operation', 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Brad', 'Braderson', 2, 1), ('Ted', 'Tederson', 1, 5), ('Fin', 'Finacier', 5, 2), ('Dev', 'McDeveloper', 7, 3);