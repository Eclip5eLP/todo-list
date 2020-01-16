# ToDoList

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.21.

## Info

`English`
With this ToDo-List you can write down and save things and tasks you have to finish, those can also be marked as finished or important. All tasks are saved with a due date, if any task approaches said date it will be marked as urgent. On the Dashboard you can see the three most important tasks so you neither miss or forget them.

`Deutsch`
Mit der ToDo-List kann man sich Dinge einspeichern die man noch erledigen muss, diese können außerdem als erledigt oder wichtig markiert werden. Alle Aufgaben werden mit einem Enddatum belegt, falls ein Eintrag sich diesem Datum nähert wird er automatisch als dringend markiert. Außerdem werden im Dashboard die drei wichtigsten Aufgaben, damit man sie nicht vergisst, angezeigt und hervorgehoben.

## Usage

Please run `npm install express mongodb body-parser --save` and `npm install bcrypt` inside this directory to install the needed dependencies.
No further prerequisites needed.

## API

All valid API Calls

/                           Base
/api                        Base
/api/:id                    Get/Update/Remove Entry by ID
/api/u/:user                Get all Lists of User

/api/login                  Login Request
/api/login/key              Login Request via Key

/api/entries                Get all Entries

/api/lists                  Get all Lists
/api/lists/e/:id            Get all Entries of List
/api/lists/u/:id            Update Lists by ID
/api/lists/r/:id            Remove Lists by ID
/api/lists/o/:id            Get Lists by ID
/api/lists/p/:id            Parse any received Data
/api/lists/a/:id            Add Entry to List

/api/users                  Add Users
/api/users/:id              Get/Remove User by ID