const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const opts = {
  maxAge: 900000,
  httpOnly: true,
  sameSite: 'strict',
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['cookie']
  
  const token = authHeader && authHeader.split('=')[1]
  console.log(token)
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, function (err, user){
    console.log(err)
    
    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET);
}

const generateHash = async (first_name, last_name, username, password, res) => {
  bcrypt.hash(password, saltRounds, function(err, hash){
    knex("user_table").insert({first_name:first_name,  last_name:last_name, username:username, password:hash })
              .then((data) => {
                console.log(data.rowCount)
                if(data.rowCount===1){
                  let token = generateAccessToken(username)
                      console.log(token)
                      res.cookie('token', token, opts);
                      res.send('user created');
                } else {
                  res.status(404).json({
                    message:
                      'error creating user'
                  })
                }
              })
  });
}

const validate = async (thePlaintextPassword, usersHash, res) => {
  bcrypt.compare(thePlaintextPassword, usersHash)
  .then( (result) => {
    // result will be true if it matches, false otherwise.
    if (result) {
      // user is authenticated!
      console.log('authenticated')
    }
    else {
      res.status(401).send("Password and/or username incorrect");
    }
  }
);
}

module.exports = {generateHash, validate, authenticateToken};