const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const bcrypt = require('bcrypt');
const saltRounds = 10;

const generateHash = async (first_name, last_name, username, password, res) => {
  bcrypt.hash(password, saltRounds, function(err, hash){
    knex("user_table").insert({first_name:first_name,  last_name:last_name, username:username, password:hash })
              .then((data) => {
                console.log(data.rowCount)
                if(data.rowCount===1){
                  res.status(200).json({
                    message:
                      'user created'
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

module.exports = {generateHash, validate};