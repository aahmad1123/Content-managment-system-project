const inquirer = require ("inquirer");
const pool = require("./server");
const cTable = require("console.table");

const questions = [
    {
        type: "list",
        name: "actions",
        message: "What would you like to do?",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "quit", "view Manager"]
    }
];

function promptQuestions(){
    inquirer.prompt(questions)
    .then(answer => {
        if(answer.actions === "view all departments"){
            viewDepartments();
        }
        else if(answer.actions === "view all roles"){
            viewRoles();
        }
        else if(answer.actions === "view all employees"){
            viewEmployees();
        }
        else if(answer.actions === "add a department"){
            addDepartment();
          
        } 
        else if(answer.actions === "add a role"){
           addRole();
          
        }
        else if(answer.actions === "add an employee"){
            addEmployee();
        }
        else if(answer.actions === "update an employee role"){
            updateEmployeeRole();
        }
        else if(answer.actions === "quit"){
            process.exit();
        }  else if(answer.actions === "view Manager"){
            viewManager();
        }
    }
)};

function viewDepartments(){
    pool.query("SELECT * FROM Department", (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        promptQuestions();
    })
}

function viewRoles(){
    pool.query("SELECT Role.title, Department.name AS Department, Role.salary FROM Role JOIN Department On Role.department_id = Department.id", (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        promptQuestions();
    })
}

// function viewEmployees(){
//     pool.query("SELECT Employee.first_name, Employee.last_name, Role.title, Role.salary, Department.name AS department, Employee.manager_id AS manager FROM Employee JOIN Role on Employee.role_id = Role.id Join Department on Role.department_id = Department.id", (err, res) => {
//         if (err) throw err;
//          console.table(res.rows);
//         promptQuestions();
//     })
// }

function viewEmployees(){
    pool.query("SELECT e.first_name AS employee_first_name, e.last_name AS employee_last_name, " +
               "r.title AS role_title, r.salary AS role_salary, " +
               "d.name AS department_name, " +
               "CONCAT(m.first_name, ' ', m.last_name) AS manager_name " +
               "FROM Employee e " +
               "JOIN Role r ON e.role_id = r.id " +
               "JOIN Department d ON r.department_id = d.id " +
               "LEFT JOIN Employee m ON e.manager_id = m.id", (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        promptQuestions();
    });
}

function viewManager(){
    pool.query("SELECT Employee.manager_id FROM Employee", (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        promptQuestions();
    })
}

function addDepartment(){
    
    inquirer.prompt([
        {
        type: "input", 
        name: "newDepartment",
        message: "Please enter the name of the new department."
        }
    ]).then(data =>{
        // insert query here
        pool.query("INSERT INTO Department(name) VALUES($1)", [
             data.newDepartment
        ], function(err){
            if (err) throw err
            console.log("New Department added."); 
            promptQuestions()
        });
    })
}

function addRole(){
    pool.query("SELECt * FROM Department", (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "newRole",
                message: "Please enter the title of the new role."
            },
            {
                type: "input",
                name: "newSalary",
                message: "What is the salary of the new role?"
            },
            {
                type: "list",
                name: "newDepartment",
                message: "What department is this role a part of?",
                choices: res.rows.map(department => department.name)
            },
        ]).then(data =>{

            let chosenDepartment = res.rows.find(department => department.name === data.newDepartment);
            console.log(chosenDepartment);
            pool.query("INSERT INTO Role(title, salary, department_id) VALUES($1, $2, $3)", [data.newRole, data.newSalary, chosenDepartment.id]);
            console.log("New Role added.");
            promptQuestions();
        })
    });
    }
    

function addEmployee(){
  inquirer.prompt([
        {
                        type: "input",
                        name: "firstName",
                        message: "What is the employee's first name?"
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "What is the employee's last name?"
                    }
    ]).then((res, err) => {
        let firstName = res.firstName;
        let lastName = res.lastName;
        var roles = []
        pool.query("SELECT * FROM Role").then((res, err)=> {
            roles = res.rows;
            console.log(roles);
            inquirer.prompt([
               {
                   type: "list",
                   name: "newRole",
                   message: "What is the employee's role?",
                   choices: res.rows.map(role => role.title)
               }
               
           ]).then((res, err)=> {
                let chosenRole = roles.find(role => role.title === res.newRole);
                var manager = []
                pool.query("SELECT CONCAT(first_name, ' ', last_name) AS manager_name, id FROM Employee").then((res, err) => {
                        inquirer.prompt([
                            {
                            type: "list",
                            name: "newManager",
                            message: "Who is this employee's manager?",
                            choices: res.rows.map(manager => manager.manager_name)
                        }
                    ]).then((data) => {
                            manager = res.rows
                            const selectedManager = manager.find(manager => manager.manager_name === data.newManager);
                            const selectedManagerId = selectedManager.id
                            pool.query("INSERT INTO Employee(first_name, last_name, role_id, manager_id) VALUES($1, $2, $3, $4)", [firstName, lastName, chosenRole.id, selectedManagerId]).then((res,err)=>{   
                            })
                            console.log("New Employee Added")
                        }).then((res,err) => {
                            promptQuestions()
                        })
                        
                    })
                })
            }) 
        })
} 
 
//write update function
function updateEmployeeRole(){
    pool.query("SELECT CONCAT(first_name, ' ', last_name) AS name, id FROM Employee", (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        inquirer.prompt([
            {
                type: "list",
                name: "updateEmployee",
                message: "Which employee's role would you like to update?",
                choices: res.rows.map(employee => employee.name)
            }
        ]).then(data => {
            var person = res.rows;
            const selectedPerson = person.find(person => person.name === data.updateEmployee);
            const selectedPersonId = selectedPerson.id;
            console.log(selectedPersonId);

            pool.query("SELECT * FROM ROLE", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                inquirer.prompt([
                    {
                        type: "list",
                        name: "updateRole",
                        message: "What role would you like to give them?",
                        choices: res.rows.map(role => role.title)
                    }
                ]).then(data => {
                    const selectedRole = res.rows.find(role => role.title === data.updateRole);
                    const selectedRoleId = selectedRole.id;
                    
                    // Update the employee's role
                    pool.query("UPDATE Employee SET role_id = $1 WHERE id = $2", [selectedRoleId, selectedPersonId], (err, res) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        
                    });
                }).then((res,err) => {
                    console.log("Employee role updated successfully!");
                    promptQuestions()
                });
            });
        });
    });
}

promptQuestions()