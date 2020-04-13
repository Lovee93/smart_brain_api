handleProfileGet = (req, res, db) => {
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
}

module.exports = {
	handleProfileGet : handleProfileGet
}