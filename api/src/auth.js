const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const opts = {
  httpOnly: true
}

// Function to generate an access token for the username
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET);
}

// function to generate a hash for the password
const generateHash = async (first_name, last_name, username, password, res) => {
  // Generate the hash
  bcrypt.hash(password, saltRounds, function(err, hash){
    // Insert the hash into the user table with the other registration params
    knex("user_table").insert({first_name:first_name,  last_name:last_name, username:username, password:hash })
      .then((data) => {
        // If user was created
        if(data.rowCount===1){
          // Generate an access token for current session and send to the user
          let token = generateAccessToken(username)
          res.cookie('token', token, opts);
          res.status(200).json({
            message:
              'Authenticated'
          })
        } else {
          res.status(404).json({
            // Notify the client there was an issue creating the user
            message:
              'error creating user'
          })
        }
      })
  });
}

// Compare the users hash to the submitted password
const validate = async (thePlaintextPassword, usersHash, username, res) => {
  bcrypt.compare(thePlaintextPassword, usersHash)
  .then( (result) => {
    // Check the result of the comparison
    if (result) {
      // Let the client know the user is authenticated and send them their token
      let token = generateAccessToken(username)
      res.cookie('token', token, opts);
      res.status(200).json({
        message:
          'Authenticated'
      })
    }
    else {
      // Generic response for auth issue
      res.status(401).json({
        message:
          'Password and/or username incorrect'
      })
    }
  }
);
}

module.exports = {generateHash, validate};