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

console.log(`
             -------     ---   ---
             |          /   ^ ^   ^
             |----     /     ^     ^
             |         |     |     |
             ------- . :     :     : .`);
// Function for starting the prompt for selections to be made.
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
                    'Look Up by Manager',
					'Add A New Role',
					'View All Departments',
					'Add A Department',
					'Delete',
					'Finish',
				],
			},
		])
		// Switch statement to determine what function to run based on user choice.
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
				
                    case 'Look Up by Manager':
					console.log('\n');
					byManagerSelect();
					break;

				case 'Delete':
					console.log('\n');
					deleteData();
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
	const query = 'SELECT * FROM employees';
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
							`\n New employee ${answers.fName} ${answers.lName} added!`
					  );
			});
			makeChoice();
		});
}
// Look up employees by manager function and selection.
function byManagerSelect() {
    const query = `SELECT * FROM managers`
    const manList = [];
    connect.query(query, (err, res) => {
        err ? console.error("There was an error", err) :
        res.forEach(data => {
            let { manager_name, manager_id } = data
            manList.push(manager_name +' '+ manager_id)
        } )
    })
    return setTimeout(() => toManager(manList), 1100 )
};

function toManager(manager) {
    inquirer
    .prompt([{
        type: 'list',
        name: 'manageSelect',
        message: `What Manager's employees would you like to view?`,
        choices: manager
    }])
    .then(answers => {
        console.log(`${answers.manageSelect} manages:`)
        const manId = answers.manageSelect.charAt(answers.manageSelect.length -1)
        const query = `SELECT * FROM employees
        INNER JOIN managers
        ON employees.manager_id = ${manId} = managers.manager_id = ${manId};`
        connect.query(query, (err, res) => {
            err ? console.error("There was an error", err) :
            console.table(res)
            
        })
        return setTimeout(() => makeChoice(), 2022 )
        
    }) 
    
};

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
		})
		.then(() => makeChoice());
}

function viewRoles() {
	const query = `SELECT * FROM employees
    INNER JOIN roles
    ON employees.role_id = roles.role_id`;
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

// Updating the employee roles using a function that connects to database.

function updateEmployee() {
	const query = 'SELECT * FROM employees';
	connect.query(query, (err, res) => {
		let nuList = [];
		let employeeList = [];
		for (i = 0; i < res.length; i++) {
			const { id, first_name, last_name } = res[i];
			let nuObject = {
				id,
				first_name,
				last_name,
			};
			employeeList.push(nuObject);
			nuList.push(first_name + ' ' + last_name);
		}

		err
			? console.error('There was an error', err)
			: inquirer
					.prompt([
						{
							name: 'selectEmp',
							type: 'list',
							choices: nuList,
							message: "Which employee's role do you want to update?",
						},
					])
					.then((answers) => {
						const nuQuery = 'SELECT * FROM roles';
						connect.query(nuQuery, (err, results) => {
							const nuRole = [];

							for (a = 0; a < results.length; a++) {
								nuRole.push(results[a].title);
							}
							err
								? console.error(err)
								: inquirer
										.prompt([
											{
												type: 'list',
												name: 'selectRole',
												choices: nuRole,
												message: 'What is the the new role?',
											},
										])
										.then((upRole) => {
											// Retrieving an id for the employee role to be updated.
											let theRole = () => {
												for (e = 0; e < results.length; e++) {
                                                    
													let { title, role_id } = results[e];
                                                    console.log("The Results",upRole.selectRole, role_id)
													if (upRole.selectRole == title) {
														return role_id;
													}
												}
											};
											// Iterating thru employee list and getting employee id.
											const theId = () => {
												for (p = 0; p < employeeList.length; p++) {
                                                    console.log("Emp List", employeeList[p])
													let { first_name, last_name, id } = employeeList[p];
													if (
														answers.selectEmp ==
														first_name + ' ' + last_name
													) {
														return id;
													}
												}
											};
											//   Updating employee role in the database.
											const queryAgain = `UPDATE employees SET role_id=? WHERE id=?`;
											connect.query(
												queryAgain,
												[theRole(), theId()],
												(err, res) => {
													console.log(
														`EMPLOYEE ROLE UPDATED TO ${upRole.selectRole}`
													);
													return setTimeout(() => makeChoice(), 3000);
												}
											);
										});
						});
					});
	});
}
// Function to inquirer what data user wants to delete and switch on that choice
// to corresponding funciton.
function deleteData() {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'delChoice',
				message: 'What do you want to delete?',
				choices: ['Employee', 'Role', 'Department', 'Manager'],
			},
		])
		.then((answers) => {
			switch (answers.delChoice) {
				case 'Employee':
					return delEmp();

				case 'Role':
					return delRole();

				case 'Department':
					return delDept();

				case 'Manager':
					return delManager();
			}
		});
}

function delEmp() {

    const delEmpChoice = []
    const delQuery = `SELECT * FROM employees`
    connect.query(delQuery, async (err, res) => {
        
        err ? console.error('There was an error', err) :
        res.forEach(async (data, i) => {
            let {first_name, last_name, id} = data
            let allEmp = await first_name + ' ' + last_name + ' ' + id
            delEmpChoice.push(allEmp)
            
            })
        return setTimeout(() => toDelete(delEmpChoice), 1100 )
    })
}

function toDelete(employee) {
    inquirer
    .prompt([
        {
            type: 'list',
            name:'empChoiceDel',
            message: 'What Employee would you like to delete?',
            choices: employee
        }
    ])
    .then(answers => {
        let theId = answers.empChoiceDel.charAt(answers.empChoiceDel.length-1)

        const query = `DELETE FROM employees WHERE id = ${theId}`
    connect.query(query, async (err, res) => {
        err ? console.error("There was an error", err) :
        await console.log(`You successfully deleted ${answers.empChoiceDel} from the database!`)
    })
        setTimeout(() => findEmployee(), 2000)
    })
    
}

// Function to delete Role.
function delRole() {

    const delRoleChoice = []
    const delRoleQuery = `SELECT * FROM roles`
    connect.query(delRoleQuery, async (err, res) => {
        
        err ? console.error('There was an error', err) :
        res.forEach(async (data) => {
            let {title, role_id} = data
            let allRoles = await title + ' ' + role_id
            delRoleChoice.push(allRoles)
            
            })
        return setTimeout(() => toDeleteRole(delRoleChoice), 1100 )
    })
}

function toDeleteRole(role) {
    inquirer
    .prompt([
        {
            type: 'list',
            name:'roleChoiceDel',
            message: 'What Role would you like to delete?',
            choices: role
        }
    ])
    .then(answers => {
        let theId = answers.roleChoiceDel.charAt(answers.empChoiceDel.length-1)

        const query = `DELETE FROM roles WHERE id = ${theId}`
    connect.query(query, async (err, res) => {
        err ? console.error("There was an error", err) :
        await console.log(`You successfully deleted ${answers.roleChoiceDel} from the database!`)
    })
        setTimeout(() => viewRoles(), 1000)
    })
    
}
function delDept() {
    console.log('Department deleted')
}
function delManager() {
    console.log('Manager deleted')
}

// Exiting the CLI prompts.
function finish() {
	return console.log('Have A Nice Day!'), process.exit(0);
}

makeChoice();

// let obj = res.map(item =>  {
//     let empList = {
//         id: item.id,
//         first_name: item.first_name,
//         last_name: item.last_name
//
