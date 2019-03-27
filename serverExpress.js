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
      connectionString : process.env.DATABASE_URL,
      ssl: true,
    }
  });

const app = express();

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res)=> {
    res.send('TESTING TESTING');
})

app.post('/signin', (req, res) => {signin.handleSignin(req,res, pgdb, bcrypt)});
app.post('/register', (req, res) => {register.handleRegister(req, res, pgdb, bcrypt)});
app.get('/profile/:userID', (req, res) => {profile.handleProfileGet(req, res, pgdb)});
app.put('/image', (req, res) => {image.handleImage(req, res, pgdb)});
app.post('/imageUrl', (req, res) => {image.handleAPICall(req, res)});

app.listen(process.env.PORT || 3000, ()=> {
    console.log('app is running on port ${process.env.PORT}');
});

