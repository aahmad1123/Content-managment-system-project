const inquirer = require ("inquirer")
const pool = require("./server")

const questions = [
    {
        type: "list",
        name: "actions",
        message: "What would you like to do?",
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"]
    }
]

function promptQuestions(){
    inquirer.prompt(questions)
    .then(answer => {
        if(answer.actions === "view all departments"){
            viewDepartments()
        }
        else if(answer.actions === "add a department"){
            addDepartment()
        }

    })
}

function viewDepartments(){
    pool.query("SELECT * FROM Department", (err, res) => {
        if (err) throw err;
        console.table(res)
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