const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const app = express();

app.use(express.json())
app.use(cors())




const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'fruits',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '968',
			hash: '',
			email: 'john@gmail.com'
		}
	]
}

//Home page
app.get('/', (req, res) => {
	//res.send('Welcome to my page!')
	res.json(database.users)
})

//Sign in route
app.post('/signin', (req, res) => {
	// bcrypt.compare('apples', '$2a$10$u7r5Hi.aW2HUjcbCa0DwN.qLwNI8llSUry9necLIqqAiaCLMR1Vge', function(err, res) {
 //    console.log(true)
	// });
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		//res.json('success')
		res.json(database.users[0])
	}
	else {
		res.status(400).json('Failed to authorize');
	}
})

//Register
app.post('/register', (req, res) => {
	const { email, password, name } = req.body;
	
	// bcrypt.hash(password, null, null, function(err, hash) {
 //    console.log(hash);
	// });

	database.users.push({
		id: '125',
		name: name,
		password: password,
		email: email,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length -1])
})

//Profile
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true
			return res.json(user);
		}
	})
		if(!found) {
			res.status(404).json('User not found')
		}
})

//Image route
app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if(user.id === id){
			found = true;
			user.entries++
			return res.json(user.entries);
		}
	})
	if(!found) {
		res.status(404).json('User not found')
	}
})


// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


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