const express = require('express');
const app = express();
const port = 8080;
app.use(express.json());
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const auth = require('./auth');

app.get('/', auth.authenticateToken, (req, res) => {
  console.log(req.user)
})

app.post('/verify', (req, res) => {
  console.log(req.body);
  let {username, password} = req.body;
  knex('user_table').where({username:username}).select("password")
    .then((data) => {
      let hash = data[0].password;
      auth.validate(password, hash, res)
    })
})

app.post('/register', (req, res) => {
  let {first_name, last_name, username, password} = req.body;

  if (!first_name || !last_name || !username || !password){
    res.status(404).json({
      message:
        'missing info'
    })
  } else {
    knex("user_table").where({username:username}).select("*")
    .then((data) => {
      if(data.length!== 0){
        res.status(404).json({
          message:
            'invalid username'
        })
      } else {
        auth.generateHash(first_name, last_name, username, password, res)
      }
    })
  }
})

app.get('/inventory', (req, res) => {
  console.log(req.body);
  knex("item_table").select("item_name", "description", "quantity")
    .then((data) => {
      res.send(data)
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))