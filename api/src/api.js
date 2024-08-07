const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const auth = require('./auth');

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.get('/', auth.authenticateToken, (req, res) => {
  //do something based on user
  console.log(req.user)
  res.send("in the main page")
})

app.post('/verify', (req, res) => {
  console.log(req.body);
  let {username, password} = req.body;
  knex('user_table').where({username:username}).select("password")
    .then((data) => {
      if (data.length!==0){
        let hash = data[0].password;
        auth.validate(password, hash, username, res)
      } else {
        res.status(401).send("Password and/or username incorrect");
      }
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