const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const knex = require('knex')(require('../knexfile.js')[process.env.NODE_ENV||'development']);
const auth = require('./auth');

const jwt = require('jsonwebtoken');

const opts = {
  httpOnly: true
}

app.use(express.json());

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));

// Authenticates the JWT token sent to the Client
function authenticateToken(req, res, next) {
  // Checks if the client sent a JWT token with the request
  const authHeader = req.headers['cookie']
  const token = authHeader && authHeader.split('=')[1]
  if (token === null) {
    // If no user is found continue onto the Clients request
    req.user = null;
    next();
  } else {
    // Jwt validation function
    jwt.verify(token, process.env.TOKEN_SECRET, function (err, user){
      // If user is found continue onto the Clients request after appending the user to the req
      req.user = user;
      next()
    })
  }
}

// Validate the user's credentials
app.post('/verify', (req, res) => {
  // Extract credentials from request body
  let {username, password} = req.body;
  // Get matching credentials from db to compare
  knex('user_table').where({username:username}).select("password")
    .then((data) => {
      // Check if username is found
      if (data.length!==0){
        // If user is found validate password matches the hash
        let hash = data[0].password;
        auth.validate(password, hash, username, res)
      } else {
        // Generic user not found return message
        res.status(401).json({
          message:
            "Password and/or username incorrect"
        })
      }
    })
})

// Validates the user's jwt token on refresh, to see if they are already logged in.
app.post('/status', authenticateToken, (req, res) => {
  // Checks the jwt token user exists
  // Can update in future to check if stored JWT token exists on account
  if (req.user){
    knex("user_table").where({username: req.user}).select("id")
      .then((data)=>{
        // If JWT token and user exists, let the client know they are already authenticated
        if (data.length > 0){
          res.status(200).json({
            message:
              "Authenticated"
          })
        } else {
          // Generic response if user is not found, let the client know that user is not authenticated
          res.status(200).json({
            message:
              "Unauthorized"
          })
        }
      })
  } else {
    // Generic response if user is not found, let the client know that user is not authenticated
    res.status(200).json({
      message:
        "Unauthorized"
    })
  }
  
})

// Registration Endpoint
app.post('/register', (req, res) => {
  let {first_name, last_name, username, password} = req.body;
  // Check for all required fields
  if (!first_name || !last_name || !username || !password){
    res.status(404).json({
      message:
        'missing info'
    })
  } else {
    // Check if username exists
    knex("user_table").where({username:username}).select("*")
    .then((data) => {
      if(data.length!== 0){
        // Let the client know the user exists
        res.status(404).json({
          message:
            'invalid username'
        })
      } else {
        // Generate and store a hash for the user
        auth.generateHash(first_name, last_name, username, password, res)
      }
    })
  }
})

// Logout Endpoint
app.post('/logout', (req, res) => {
  let token = '';
  // Empty the clients token to log them out
  res.cookie('token', token, opts);
  res.status(200).json({
    message:
      'Logged Out'
  })
})

// Personal Inventory Endpoint
app.get('/inventory', authenticateToken, (req, res) => {
  // Check if the token returned a user
  if (req.user){
    // Search db for items created by user
    knex("item_table").join('user_table', 'user_table.id', '=', 'item_table.userid').where({username: req.user}).select("item_table.id", "item_name", "description", "quantity")
    .then((data) => {
      // If items are found, send the items to client
      if (data){
        res.send(data)
      } else {
        // Notify the client no items were found
        res.status(200).json({
          message:
            'No items found'
        })
      }
    })
  } else {
    // If token did not return a user, return all items
    knex("item_table").select("id", "item_name", "description", "quantity")
    .then((data) => {
      if (data) {
        // If items are found, send the items to client
        res.send(data)
      } else {
        // Notify the client no items were found
        res.status(200).json({
          message:
            'No items found'
        })
      }
    })
  }
  
})

// Creation endpoint
app.post('/create', authenticateToken, (req, res) => {
  // Check if user exists
  if (req.user){
    // Check that item has required properties
    const {item_name, description, quantity} = req.body;
    if (!item_name || !description || !quantity){
      // Notify client about missing info
      res.status(200).json({
        message:
          'Invalid Entry'
      })
    } else {
      // Check if the user exists
      knex("user_table").where({username: req.user}).select("id")
        .then((data) => {
          // If the user exists create the item in the db
          if (data.length > 0){
            knex("item_table").insert({userid:BigInt(data[0].id),  item_name:item_name, description:description, quantity:quantity })
              .then((data) => {
                // Check if item creation is successful
                if(data.rowCount===1){
                  // Let the client know the item was created
                  res.status(200).json({
                    message:
                      'Item created'
                  })
                } else {
                  // Let the client know there was an issue creating the item
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
    // Let the client know they are not authorized to perform this action
    res.status(200).json({
      message:
        'Unauthorized'
    })
  }
})

// Update Endpoint
app.put('/update', authenticateToken, (req, res) => {
  // Check if user exists
  if (req.user){
    // Check that item has required properties
    const {item_name, description, quantity, item_id} = req.body;
    if (!item_name || !description || !quantity || !item_id){
      res.status(200).json({
        message:
          'Invalid Entry'
      })
    } else {
      // Validate that the user is allowed to update the item
      knex("user_table").where({username: req.user}).select("id")
        .then((data) => {
          // If the user is authorized
          if (data.length > 0){
            // Update the item in the item table
            knex("item_table")
              .update({item_name:item_name, description:description, quantity:quantity })
              .where('id', '=', item_id)
                .then(() => {
                  // Check that the item is properly updated
                  knex("item_table").where({id:item_id}).select("*")
                    .then((data)=>{
                      // If the item in the table matches the updated values
                      if(data[0].description === description && data[0].quantity===quantity && data[0].item_name===item_name){
                        // Let the client know the update went through
                        res.status(200).json({
                          message:
                            'Item updated'
                        })
                      } else {
                        // Let the client know there was an issue updating the item
                          res.status(200).json({
                            message:
                              'Error updating item'
                          })
                        }
                    })
                })
          } 
        })
    }
  } else {
    // Notify the client that they are not authorized to access this endpoint
    res.status(200).json({
      message:
        'Unauthorized'
    })
  }
})

// Deletion endpoint
app.delete('/delete', authenticateToken, (req, res) => {
  // Check the user exists
  if (req.user){
    // Check item id is in the request
    const {item_id} = req.body;
    if (!item_id){
      // Let the client know there was an issue
      res.status(200).json({
        message:
          'Invalid Entry'
      })
    } else {
      // Validate that the user exists in the table
      knex("user_table").where({username: req.user}).select("id")
        .then((data) => {
          // If the user exists
          if (data.length > 0){
            // Validate that the user is the creator and the item exists, then delete the item
            knex("item_table")
            .where({id:item_id, userid:data[0].id}).del()
              .then(() => {
                // Validate that the item is deleted
                knex("item_table").where({id:item_id}).select("*")
                  .then((data)=>{
                    if(data.length === 0){
                      // Notify the client of the item deletion
                      res.status(200).json({
                        message:
                        'Item deleted'
                      })
                    } else {
                      // Notify the client of an issue with item deletion
                        res.status(200).json({
                          message:
                            'Error deleting item'
                        })
                      }
                  })
              })
          } 
        })
    }
  } else {
    // Notify the client that they are not authorized to access this endpoint
    res.status(200).json({
      message:
        'Unauthorized'
    })
  }
})

// Full inventory endpoint
app.get('/inventory/all', (req, res) => {
  // Get all items from db and send to Client
  knex("item_table").select("id", "item_name", "description", "quantity")
    .then((data) => {
      res.send(data)
    })
})

// Item details endpoint
app.get('/details/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  // Check if user exists for detail
  if (req.user){
    // Check if param was properly passed
    if (!id){
      // Let client know missing param
      res.status(200).json({
        message:
          'Invalid Entry'
      })
    } else {
      // Check user authorization on item
      knex("item_table").where({id: id}).select("*")
        .then((data) => {
          if (data.length > 0){
            knex("user_table").where({username: req.user}).select("id")
              .then((userData) => {
                if (userData.length > 0){
                  if (userData[0].id === Number(data[0].userid)){
                    // If user is creator, let client know user can edit
                    data[0]["edit"] = true;
                    res.send(data[0]);
                  } else {
                    // If user is not creator, send client only the data
                    res.send(data[0])
                  }
                } else {
                  // User not found send only the data
                  res.send(data);
                }
              })
          } else {
            // Let client know item wasn't found
            res.status(200).json({
              message:
                'Item not found'
            })
          }
        })
    }
  } else {
    if (!id){
      // Let client know missing param
      res.status(200).json({
        message:
          'Invalid Entry'
      })
    } else {
      // Find the item details and send to client
      knex("item_table").where({id: id}).select("*")
        .then((data) => {
          if (data.length > 0){
            res.send(data[0]);
          } else {
            // Let client know item not found
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