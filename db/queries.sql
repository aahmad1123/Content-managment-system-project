SELECT Role.title, Department.name, Role.salary FROM Role
JOIN Department On Role.department_id = Department.id

SELECT Employee.first_name, Employee.last_name, Role.title, Role.salary, Department.name AS department, Employee.manager_id AS manager FROM Employee
JOIN Role on Employee.role_id = Role.id
Join Department on Role.department_id = Department.id