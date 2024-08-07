const express = require('express');
const app = express();
const port = 8080;
app.use(express.json());
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const auth = require('./auth');

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/verify', (req, res) => {
  console.log(req.body);
  let {username, password} = req.body;
  knex('user_table').where({username:username}).select("first_name")
    .then((data)=>console.log(data))
  res.status(404).json({
    message:
      'you have reached to login verification endpoint'
  })
})

app.post('/register', (req, res) => {
  console.log(req.body);
  let {first_name, last_name, username, password} = req.body;
  //first_name: 'john', last_name: 'smith', username:'admin', password:''
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
})

app.get('/inventory', (req, res) => {
  console.log(req.body);
  knex("item_table").select("item_name", "description", "quantity")
    .then((data) => {
      res.send(data)
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))