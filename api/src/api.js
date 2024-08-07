const express = require('express');
const app = express();
const port = 8080;
app.use(express.json());
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);

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
        knex("user_table").insert({first_name:first_name,  last_name:last_name, username:username, password:password })
          .then(
            res.status(404).json({
              message:
                'user created'
          }))
      }
    })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))