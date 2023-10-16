const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const signin = require('./Controllers/signin')
const register = require('./Controllers/register')
const profile = require('./Controllers/profile')
const image = require('./Controllers/image')

var db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : '1824',
      database : 'My_LazyEyes_Database'
    }
  });  

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', ( req, res ) => {
res.send('Success');
});
app.post('/signin', signin.handleSignin(db, bcrypt)); 
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfile(db));
app.put('/image', image.handleImage(db)); 
app.post('/imageurl', image.handleApiCall);

app.listen(3000)


/*
    / --> GET --> res = this is working !
    /Signing --> POST =   Login successfully/ Failed to login!
    /Register --> POST = Registered successfully.
    /Profile/userId --> GET = user
    /Image --> PUT = Ranking user

*/