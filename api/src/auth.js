const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const cookieParser = require('cookie-parser');
const opts = {
  httpOnly: true
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
                      res.status(200).json({
                        message:
                          'Authenticated'
                      })
                } else {
                  res.status(404).json({
                    message:
                      'error creating user'
                  })
                }
              })
  });
}

const validate = async (thePlaintextPassword, usersHash, username, res) => {
  bcrypt.compare(thePlaintextPassword, usersHash)
  .then( (result) => {
    // result will be true if it matches, false otherwise.
    if (result) {
      // user is authenticated!
      let token = generateAccessToken(username)
                      console.log(token)
                      res.cookie('token', token, opts);
                      res.status(200).json({
                        message:
                          'Authenticated'
                      })
    }
    else {
      res.status(401).json({
        message:
          'Password and/or username incorrect'
      })
    }
  }
);
}

module.exports = {generateHash, validate};