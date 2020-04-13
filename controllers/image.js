const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: "8619f598b3be473b9c7e82741ce5bc91" 
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to work with API'))
}

handleImage = (req, res, db) => {
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
}

module.exports = {
	handleImage : handleImage,
	handleApiCall : handleApiCall 
}