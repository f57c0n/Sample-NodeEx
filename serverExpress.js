//https://i.pinimg.com/736x/5d/d5/35/5dd5353a11972f2d140c2a889cee26da.jpg
//https://i.pinimg.com/originals/2a/76/0a/2a760a9c09fe9f7ed7391749b27dc012.jpg

//npm install -g npm => to update
//npm init => install json files
//npm install nodemon --save-dev  => install node modules & package-lock.json and add dependencies
//npm install express
const express = require('express');
//npm install body-parser => to use req.body, req.params, etc ...
const bodyParser = require('body-parser');
//npm install brcypt-nodejs => for encryption
const bcrypt = require('bcrypt-nodejs');
//npm install cors => allows Access Control to react-app from localhost
const cors = require('cors'); 
//npm install knex
//npm install pg => for postgreSQL
const knex = require('knex');


const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const pgdb = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : '',
      password : '',
      database : 'DBNode'
    }
  });

  //https://knexjs.org/#Builder  => for syntax
  //TEST IF CONNECTED
  //pg.select('*').from('users');
  //.then(whatever => {}) => to get the data from the promise.  not json format.
  
//   pgdb.select('*').from('users')
//     .then(data => {
//       console.log(data);
//   });

const app = express();

//extended => to see on terminal what is in Postman body by using app.post
//use postman, x-www.form-urlencoded option to test how the vaues in the form gets submitted to server
app.use(bodyParser.urlencoded({extended: false}))
//use postman, raw - json to get the json objects
app.use(bodyParser.json());
app.use(cors());

// used before implementing DB
// const db = {
//     //users => array of user objects
//     users: [
//         {
//         id : '123',
//         name : 'John',
//         email : 'john@gmail.com',
//         entries : 0,
//         joined : new Date()
//         },
//         {
//         id : '124',
//         name : 'Sally',
//         email : 'sally@gmail.com',
//         entries : 0,
//         joined : new Date()
//         }
//     ],
//     //to hash passwords
//     login: [
//         {
//         id : '123',
//         hash : '',
//         password: 'apple'
//         },
//         {
//         id : '124',
//         hash : '',
//         password: 'banana' 
//         }

//     ]
// }

app.get('/', (req, res)=> {
    //how to do multiple send ???
    res.send(db.users);
    //res.send(db.login);
})

//SIGN-IN
app.post('/signin', (req, res) => {signin.handleSignin(req,res, pgdb, bcrypt)});
//Can also do it this way => runs the first function, then runs the req, res
//app.post('/signin', signin.handleSignin(pgdb, bcrypt); the same as => app.post('/signin', signin.handleSignin(pgdb, bcrypt)(req,res));

// MOVE TO CONTROLLER
//     // if (req.body.email === db.users[0].email &&
//     //     req.body.password === db.login[0].password) {
//     //     //res.json("Signed-in Successfully");
//     //     res.json(db.users[0]);
//     // } else {
//     //     res.status(400).json('ERROR SIGNING IN')
//     // }
//     pgdb.select('email', 'hash').from('login')
//         .where('email', '=', req.body.email)
//         .then(data => {
//             const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
//             if (isValid) {
//                 return pgdb.select('*').from('users')  // don't forget return
//                 .where('email', '=', req.body.email)
//                 .then(user => {
//                     res.json(user[0])
//                 })
//                 .catch(err => res.status(400).json('unable to get user'))
//             } else {
//                 res.status(400).json('wrong password')
//             }
//         })
//         .catch(err => res.status(400).json('wrong credentials'))
// });

//REGISTER
//app.post('/register', register.handleRegister);

//syntax for dependency injection
app.post('/register', (req, res) => {register.handleRegister(req, res, pgdb, bcrypt)});

//  MOVE TO CONTROLLER
//app.post('/register', (req, res) => {
//     const {name, email, password} = req.body
//     // db.users.push({
//     //     id : '125',
//     //     name : name,
//     //     email : email,
//     //     entries : 0,
//     //     joined : new Date()
//     // });
//     //Synchronous
//     const hash = bcrypt.hashSync(password);
//     //knex transaction
//     pgdb.transaction(trx => {
//         trx.insert({
//             hash: hash,
//             email: email
//         })
//         .into('login')
//         .returning('email')
//         .then(loginEmail => {     //=> note that this returns an array
//             return trx('users')   // don't forget return
//             .returning('*')       // knex syntax to return/select (view/query) the response in .then
//             .insert({
//                 name: name,
//                 email: loginEmail[0],  //to only return the entry, not the array of objects
//                 joined: new Date()
//             })
//             .then(user => {
//             res.json(user[0]);   //[0] so it only returns 1
//             })
//         })
//         .then(trx.commit)
//         .catch(trx.rollback)
//     })
//         // move up ***
//         // return pgdb('users')
//         // .returning('*')     //knex syntax to return/select (view/query) the response in .then
//         // .insert({
//         //     name: name,
//         //     email: email,
//         //     joined: new Date()
//         // })
        
//         // .then(user => {
//         //     res.json(user[0]);   //[0] so it only returns 1
//         // })
//     .catch(err => res.status(400).json('unable to register')) //json(err) => will provide details of the error

//     // db.login.push({
//     //     id: '125',
//     //     password: password
//     // })
//     // pgdb('login').insert({
//     //     hash: 'aghh',
//     //     email: email,
//     // }).then(console.log); //need console.log to get data
//     //res.json(db.users[db.users.length-1]);
//     //res.json(db.login[db.login.length-1]);
// });

// //NOTE:  this could be incorporated with update, so users can view profile and/or update it at the same time if so wishes
// //DISPLAY PROFILE
app.get('/profile/:userID', (req, res) => {profile.handleProfileGet(req, res, pgdb)});

// MOVE TO CONTROLLERS
//     const {userID} = req.params;
//     //let found = false;
//     // db.users.forEaresch(user => {
//     //     if (user.id === userID) {
//     //         found = true;
//     //         //use return so that it can continue to loop if found is false otherwise it will exit
//     //         return res.json(user);
//     //     }
//     // });
//     pgdb.select('*').from('users').where({
//         id: userID  //remember that if both the property and value is the same u can remove the :, where({id})
//       })
//     .then(user => {
//         //=> can't use just catch(err =>) because above return an empty [] which is boolean true, need below conditional
//         if (user.length){
//             res.json(user[0])
//         } else {
//             res.status(400).json('id not found')
//         }
//     })
//     .catch(err => res.status(400).json('error getting user'))  
//     // if (!found) {
//     //     res.status(400).json('No Such User');
//     // }
// });

//Could create function for any redundant codes
//UPDATE IMAGE
app.put('/image', (req, res) => {image.handleImage(req, res, pgdb)});
app.post('/imageUrl', (req, res) => {image.handleAPICall(req, res)});

//  MOVE TO CONTROLLERS    
//     const {id} = req.body;
//     // let found = false;
//     // db.users.forEach(user => {
//     //     if (user.id === id) {
//     //         found = true;
//     //         user.entries++;
//     //         return res.json(user.entries);
//     //     }      
//     // })
//     // if (!found) {
//     //     res.status(400).json('No Such User Found');
//     // }
//     //can't use .update and do calculations to assign value to it, look for built-in functions for what you need, ie increment
//     pgdb('users').where('id', '=', id)
//     .increment('entries', 1)
//     .returning('entries')
//     .then(entries => {
//         res.json(entries[0]);
//     })
//     .catch(err => res.status(400).json('unable to get entries'))
// })

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
});

