const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');
const { listen } = require('express/lib/application');
// const sequelize = require('sequelize');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// sequelize = new Sequelize(process.env.JAWSDB_URL);

const connect = mysql.createConnection(
	{
		host: 'localhost',
		// MySQL username,
		user: 'root',
		// MySQL password
		password: process.env.DB_PASSWORD,
		database: 'business_db',
	},
	console.log(`Connected to the business_db database.`)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const makeChoice = () => {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'choice',
				message: 'What would you like to do?',
				choices: [
					'View All Employees',
					'Add Employee',
					'Update Employee Role',
					'View All Roles',
					'Add A New Role',
					'View All Departments',
					'Add A Department',
					'Finish',
				],
			},
		])
		.then((answer) => {
			switch (answer.choice) {
				case 'View All Employees':
					console.log('\n');
					findEmployee();
					break;

				case 'Add Employee':
					console.log('\n');
					addEmployee();
					break;

				case 'Update Employee Role':
					console.log('\n');
					updateEmployee();
					break;

				case 'View All Roles':
					console.log('\n');
					viewRoles();
					break;

				case 'Add A New Role':
					console.log('\n');
					addRole();
					break;

				case 'View All Departments':
					console.log('\n');
					viewDepartments();
					break;

				case 'Add A Department':
					console.log('\n');
					addDepartment();
					break;

				case 'Finish':
					console.log('\n');
					finish();
					break;

				default:
					console.log('Choose one of the selections...');
			}
		});
};

function findEmployee() {
	const query = `SELECT * FROM employees`;
	connect.query(query, (err, res) => {
		err ? console.error(err) : console.table(res);
	});
	console.log('\n');
	return setTimeout(() => makeChoice(), 3000);
}

function addEmployee() {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'fName',
				message: 'What is the employees first name?',
			},
			{
				type: 'input',
				name: 'lName',
				message: 'What is the employees last name?',
			},
		])
		.then((answers) => {
			const query = `INSERT INTO employees (first_name, last_name) VALUES (?, ?)`;
			connect.query(query, [answers.fName, answers.lName], (err, res) => {
				err
					? console.log(err)
					: console.log(
							`New employee ${answers.fName} ${answers.lName} added.`
					  );
			});
			return setTimeout(() => makeChoice(), 3000);
		});
}

function addRole() {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'role',
				message: 'What is the name of the role?',
			},
			{
				type: 'number',
				name: 'salary',
				message: 'What is the salary of the role?',
			},
			{
				type: 'list',
				name: 'department',
				message: 'Which department does the role belong to?',
				choices: ['Engineering', 'Human Resources', 'Services', 'Sales'],
			},
		])
		.then((answers) => {
			const query = 'INSERT INTO roles (title, salary) VALUES (?, ?)';
			connect.query(query, [answers.role, answers.salary], (err, res) => {
				err
					? console.error('There was an error', err)
					: console.log(
							'You added',
							answers.role,
							'with a salary of',
							answers.salary,
							'to the',
							answers.department,
							'department.'
					  );
			});
		});
	return setTimeout(() => makeChoice(), 3000);
}

function viewRoles() {
	const query = `SELECT * FROM roles`;
	connect.query(query, (err, res) => {
		err ? console.error(err) : console.table(res);
	});
	console.log('\n');
	return setTimeout(() => makeChoice(), 3000);
}
function viewDepartments() {
	const query = `SELECT * FROM department`;
	connect.query(query, (err, res) => {
		err ? console.error(err) : console.table(res);
	});
	console.log('\n');
	return setTimeout(() => makeChoice(), 2000);
}

function addDepartment() {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'department',
				message: 'What is the name of the department?',
			},
		])
		.then((answers) => {
			const query = 'INSERT INTO department (dept_name) VALUES (?)';
			connect.query(query, [answers.department], (err, res) => {
				err
					? console.error('There was an error', err)
					: console.log('You added', answers.department, 'to departments.');
			});
			return setTimeout(() => makeChoice(), 1000);
		});
}

function updateEmployee() {
    const query = 'SELECT * FROM employees'
    connect.query(query, (err, res) => {
        let nuList = [];
        let employeeList = [];
        for (i = 0; i < res.length; i++) {
            const { id, first_name, last_name } = res[i]
            let nuObject = {
                id,
                first_name,
                last_name,
            }
            employeeList.push(nuObject);
            nuList.push(first_name + ' ' + last_name)
            
        }
    
    err ? console.error('There was an error', err) :
    
    inquirer
    .prompt([
        {
            name: 'selectEmp',
            type: 'list',
            choices: nuList,
            message: "Which employee's role do you want to update?"
        }
    ])
    .then(answers => {
        const nuQuery = 'SELECT * FROM roles'
        connect.query(nuQuery, (err, results) => {
            const nuRole = [];

            for(a = 0; a < results.length; a++) {
                nuRole.push(results[a].title)
            }
            err ? console.error(err) :

            inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'selectRole',
                    choices: nuRole,
                    message: 'What is the the new role?'

                }
            ])
            .then(upRole => {

                let theRole = () => {
                    for (e = 0; e < results.length; e++) {
                      if (upRole.roleChoice === results[e].title) {
                        return results[e].id;
                      }
                    }
                  }
                  
                  const theId = () => {
                    for (p = 0; p < employeeList.length; p++) {
                      if (answers.selectRole == (employeeList[p].first_name + ' ' + employeeList[p].last_name)) {
                        return employeeList[p].id;
                      }
                    }
                  }
                  const queryAgain = `UPDATE employees SET role_id=? WHERE id=?`;
                  connect.query(queryAgain, [theRole(), theId()], (err, res) => {
                    console.log(`EMPLOYEE ROLE UPDATED!`)
                    return setTimeout(() => makeChoice(), 3000);
                  })
                })
              })
            })
          })
        }

            

        
        
        
    



makeChoice();



// let obj = res.map(item =>  {
//     let empList = {
//         id: item.id,
//         first_name: item.first_name,
//         last_name: item.last_name
// 