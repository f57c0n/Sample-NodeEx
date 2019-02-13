const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '8bf7c0a62cd94a5c8b667a30546645f4'
});

const handleAPICall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input) //why body.input
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('API not working'))
}
const handleImage = (req, res, pgdb) => {
    const {id} = req.body;
    pgdb('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
};

module.exports = {
    handleImage,
    handleAPICall
}