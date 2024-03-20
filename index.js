const inquirer = require ("inquirer")
const pool = require("./server")

const questions = [
    {
        type: "list",
        name: "actions",
        message: "What would you like to do?",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role", "quit"]
    }
]

function promptQuestions(){
    inquirer.prompt(questions)
    .then(answer => {
        if(answer.actions === "view all departments"){
            viewDepartments()
        }
        else if(answer.actions === "view all roles"){
            viewRoles()
        }
        else if(answer.actions === "view all employees"){
            viewEmployees()
        }
        else if(answer.actions === "add a department"){
            addDepartment()
        } 
        else if(answer.actions === "add a role"){
            addRole()
        }
        else if(answer.actions === "add an employee"){
            addEmployee()
        }
        else if(answer.actions === "update an employee role"){
            updateEmployeeRole()
        }
        else if(answer.actions === "quit"){
            process.exit()
        }

    })
}

function viewDepartments(){
    pool.query("SELECT * FROM Department", (err, res) => {
        if (err) throw err;
        console.log(res.rows)
        promptQuestions()
    })
}

function viewRoles(){
    pool.query("SELECT Role.title, Department.name AS Department, Role.salary FROM Role JOIN Department On Role.department_id = Department.id", (err, res) => {
        if (err) throw err;
        console.log(res.rows)
        promptQuestions()
    })
}

function viewEmployees(){
    pool.query("SELECT Employee.first_name, Employee.last_name, Role.title, Role.salary, Department.name AS department, Employee.manager_id AS manager FROM Employee JOIN Role on Employee.role_id = Role.id Join Department on Role.department_id = Department.id", (err, res) => {
        if (err) throw err;
        console.log(res.rows)
        promptQuestions()
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
        pool.query("INSERT INTO Department SET ?", {
            name: data.newDepartment
        })

        console.log("New Department added.")
        promptQuestions()
    })
}

function addRole(){
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
            // choices: //ask how to populate a choices list from sql
        }
    ]).then(data =>{
        pool.query("INSERT INTO ROLE SET ?", {
            title: data.newRole
        }) .then (data => {
            pool.query("INSERT INTO ROLE SET ?", {
                salary: data.newSalary
            }) .then (data => {
                //ask how to assign a VARCHAR department name when it should be department id
            })
        })
        console.log("New Role added.")
        promptQuestions()
    })
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
        },
        {
            type: "list",
            name: "newRole",
            message: "What is the employee's role?",
            // choices: //ask how to populate a choices list from sql
        },
        {
            type: "list",
            name: "newManager",
            message: "Who is this employee's manager?",
            // choices: //ask how to populate a choices list from sql
        }
    ]).then(data =>{
        pool.query("INSERT INTO EMPLOYEE SET ?", {
            first_name: data.firstName
        }) .then (data => {
            pool.query("INSERT INTO EMPLOYEE SET ?", {
                salary: data.lastName
            }) .then (data => {
                //ask how to assign a VARCHAR role name when it should be role id
            }) .then (data => {
                 //ask how to assign a VARCHAR manager name when it should be manager id
            })
        })
        console.log("New Employee added.")
        promptQuestions()
    })
}
//write update function

promptQuestions()