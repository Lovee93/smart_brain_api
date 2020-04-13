const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const image = require('./controllers/image');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');

const app = express();

app.use(express.json())
app.use(cors())

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smart_brain'
  }
});
// db.select('*').from('users').then(data => {
// 	console.log(data)
// })

//Home page
app.get('/', (req, res) => {
	res.send('Welcome to Smart Brain!')
})

//Sign in route
app.post('/signin', signin.handleSignIn(db, bcrypt)) //using advanced functions

//Register
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) //this is called dependency injection

//Profile
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

//Image route
app.put('/image', (req, res) => { image.handleImage(req, res, db) })

//API route in image.js
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })



//Main
app.listen(3000, () => {
	 console.log('App has started on port 3000');
})


/*
1. home ---> GET ---> welcome to my page
2. signin ---> POST(!query) ---> success/fail
3. register ---> POST ---> user{}
4. image ---> PUT ---> rank and stuff
5. profile/:userId ---> GET ---> user{}1
*/