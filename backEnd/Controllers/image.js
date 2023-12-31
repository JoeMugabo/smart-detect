const Clarifai = require ('clarifai');

const app = new Clarifai.App({
  apiKey: 'e391552cf63245cd91a43b97168d54c7'
 });
 const handleApiCall = (req, res) => {
   app.models.predict({
      id: 'face-detection',
      name: 'face-detection',
      version: '6dc7e46bc9124c5c8824be4822abe105',
      type: 'visual-detector',
    }, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('Unable to interact with the API'))
 }

const handleImage = (db) => (req, res) => {
  const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
  .catch(err => res.status(400).json('No user found dear!'))
}

module.exports = {
  handleImage,
  handleApiCall
}