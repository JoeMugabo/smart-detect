const handleRegister = (db, bcrypt) => (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('Fill out the empty gaps!')
  }
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
              email: loginEmail[0].email,
              name: name,
              joined: new Date()
          })
          .then(user => {
             res.json(user[0])
          })
      })
      .then(trx.commit)
      .catch(trx.rollback);
    })  
      .catch(err => res.status(400).json('Sorry, this user already existed dear!'))
  }

  module.exports = {
    handleRegister
  }