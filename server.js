const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

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
	//res.send('Welcome to my page!')
	res.json(database.users)
})

//Sign in route
app.post('/signin', (req, res) => {
	db.select('email','hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
			if(isValid){
				db.select('*').from('users').where('email','=',req.body.email)
				.then(user => {
					res.json(user[0])
				})
				.catch(err => res.status(400).json('Unable to get user'))
			}else {
				res.status(400).json('wrong credentials')
			}
		})
		.catch(err => res.status(400).json('wrong credentials'))
})

//Register
app.post('/register', (req, res) => {
	const { email, password, name } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					email: loginEmail[0],
					name: name,
					joined: new Date()
				})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})	
		
		.catch(err => res.status(404).json('Unable to register'))
})

//Profile
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	
	db.select('*').from('users').where({id})
	.then(user => {
		if(user.length){
			res.json(user[0])
		}else {
			res.status(400).json('User not found')
		}
	})
	.catch(err => res.status(404).json('Unable to get users'))
})

//Image route
app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users')
	.where('id','=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		if(entries.length > 0) {
			res.json(entries[0])
		}else {
			res.status(400).json('Unable to get entries')
		}
	})
	.catch(err => {res.status(400).json('Unable to get any data')})
})




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