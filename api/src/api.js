const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const auth = require('./auth');
const cookieParser = require('cookie-parser');

const jwt = require('jsonwebtoken');

const opts = {
  httpOnly: true
}

app.use(express.json());

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));
app.use(cookieParser());


function authenticateToken(req, res, next) {
  console.log("cookie?:  " +req.cookie)
  const authHeader = req.headers['cookie']
  console.log("authHeader   " + authHeader);
  const token = authHeader && authHeader.split('=')[1]
  console.log("token   "    +  token)
  if (token === null) {
    req.user = null;
    next();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, user){

      req.user = user;
  
      next()
    })
  }
}


app.post('/verify', (req, res) => {
  console.log(req.body);
  let {username, password} = req.body;
  knex('user_table').where({username:username}).select("password")
    .then((data) => {
      if (data.length!==0){
        let hash = data[0].password;
        auth.validate(password, hash, username, res)
      } else {
        res.status(401).json({
          message:
            "Password and/or username incorrect"
        })
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

app.post('/logout', (req, res) => {
  let token = '';
  console.log(token)
  res.cookie('token', token, opts);
  res.status(200).json({
    message:
      'Authenticated'
  })
})

app.get('/inventory', authenticateToken, (req, res) => {
  //do something based on user
  console.log('req.user  ' + req.user)
  if (req.user){
    console.log("user_inventor")
    knex("item_table").join('user_table', 'user_table.id', '=', 'item_table.userid').where({username: req.user}).select("item_table.id", "item_name", "description", "quantity")
    .then((data) => {
      if (data){
        console.log(data.length)
        res.send(data)
      } else {
        res.status(200).json({
          message:
            'No items found'
        })
      }
    })
  } else {
    console.log("else inventroy")

    knex("item_table").select("id", "item_name", "description", "quantity")
    .then((data) => {
      console.log(data.length)
      if (data) {
        console.log("in data")
        res.send(data)
      } else {
        console.log("in else")
        res.status(200).json({
          message:
            'No items found'
        })
      }
    })
  }
  
})

app.post('/create', authenticateToken, (req, res) => {
  //do something based on user
  console.log('req.user for Create  ' + req.user)
  if (req.user){
    const {item_name, description, quantity} = req.body;
    if (!item_name || !description || !quantity){
      res.status(200).json({
        message:
          'Invalid Entry'
      })
    } else {
      knex("user_table").where({username: req.user}).select("id")
        .then((data) => {
          if (data.length > 0){
            knex("item_table").insert({userid:data[0].id,  item_name:item_name, description:description, quantity:quantity })
              .then((data) => {
                console.log(data.rowCount)
                if(data.rowCount===1){
                  res.status(200).json({
                    message:
                      'Item created'
                  })
                } else {
                  res.status(200).json({
                    message:
                      'Error creating item'
                  })
                }
              })

          } 
        })
    }
  } else {
    res.status(200).json({
      message:
        'Unauthorized'
    })
  }
})

app.get('/inventory/all', (req, res) => {
  knex("item_table").select("id", "item_name", "description", "quantity")
    .then((data) => {
      res.send(data)
    })
})

app.get('/details/:id', authenticateToken, (req, res) => {
  //do something based on user
  const id = req.params.id;
  console.log('req.user for Details  ' + req.user)
  if (req.user){
    if (!id){
      res.status(200).json({
        message:
          'Invalid Entry'
      })
    } else {
      knex("item_table").where({id: id}).select("*")
        .then((data) => {
          if (data.length > 0){
            knex("user_table").where({username: req.user}).select("id")
              .then((userData) => {
                if (userData.length > 0){
                  console.log(userData[0].id)
                  if (userData[0].id === data[0].userid){
                    data[0]["edit"] = true;
                    res.send(data[0]);
                  } else {
                    res.send(data[0])
                  }
                } else {
                  res.send(data);
                }
              })
          } else {
            res.status(200).json({
              message:
                'Item not found'
            })
          }
        })
    }
  } else {
    if (!id){
      res.status(200).json({
        message:
          'Invalid Entry'
      })
    } else {
      knex("item_table").where({id: id}).select("*")
        .then((data) => {
          if (data.length > 0){
            res.send(data[0]);
          } else {
            res.status(200).json({
              message:
                'Item not found'
            })
          }
        })
    }
  }
})


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))