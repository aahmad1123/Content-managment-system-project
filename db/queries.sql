SELECT Role.title, Department.name, Role.salary FROM Role
JOIN on Role.department_id = Department.id

SELECT Employee.first_name, Employee.last_name, Role.title, Role.salary, Department.name, CONCAT(Employee.first_name, ' ', Employee.last_name) AS manager FROM Employee
JOIN Role on Employee.role_id = Role.id
Join Department on Role.department_id = Department.id