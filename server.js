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
	return makeChoice;
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
			makeChoice();
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
				choices: ['Engineering', 'Finance', 'Legal', 'Sales'],
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
	makeChoice();
}

function viewRoles() {
	const query = `SELECT * FROM roles`;
	connect.query(query, (err, res) => {
		err ? console.error(err) : console.table(res);
	});
	console.log('\n');
	return makeChoice;
}
function viewDepartments() {
	const query = `SELECT * FROM department`;
	connect.query(query, (err, res) => {
		err ? console.error(err) : console.table(res);
	});
	console.log('\n');
	return makeChoice;
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
			makeChoice();
		});
}
// finish update employee function...
function updateEmployee() {
    const query = 'SELECT * FROM employees'
    connect.query(query, (err, res) => {
        let nuList = [];
        let employeeList = [];
        
        let obj = res.map(item =>  {
            let empList = {
                id: item.id,
                first_name: item.first_name,
                last_name: item.last_name
        }
        
        nuList.push(empList)
        console.log("Emp list" , employeeList)
        employeeList.push(nuList.first_name, nuList.last_name)
    
    })
    err ? console.error('There was an error', err) :
    inquirer
    .prompt([
        {
            name: 'selectEmp',
            type: 'list',
            choices: nuList,
            message: "What employee do you want to update?"
        },
    ])
    .then(answers => {
        const nuQuery = 'SELECT * FROM roles'
        connect.query(nuQuery, (err, res) => {
            console.log(res)
        })
    })

        
        
        
    })

}

makeChoice();
