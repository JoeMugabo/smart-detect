const handleSignin = (db, bcrypt) => (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).json('Fill out the empty gaps!')
  }
  db.select('email', 'hash').from('login')
  .where('email', '=', email)
  .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if (isValid) {
          return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
              res.json(user[0])
          })
      } else {
          res.status(400).json('No such user found dear!')
      }
  })
  .catch(err => res.status(400).json('Wrong signIn credentials dear!'))
}

module.exports = {
  handleSignin
}