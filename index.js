// implement your API here

const express = require('express');

const db = require('./data/db');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res)=>{
  res.status(200).json({hello: 'Web25'})
})

server.get('/api/users', (req, res) =>{
  db.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({errorMessage: "The user information could not be retrieved."}))
})

server.get('/api/users/:id', (req, res) =>{
  const userId = req.params.id;

  if(!userId){
    res.status(500).json({errorMessage: "No user specified. Select a user and try again."})
    return null;
  }

  db.findById(userId)
    .then(user =>{
      if(!user){
        res.status(404).json({errorMessage: "The user with the specified id does not exist."})
        return null
      } 
      res.status(200).json(user)
    })
    .catch(err => res.status(500).json({errorMessage: "The user information could not be retrieved"}))
})

server.post('/api/users', (req,res) =>{
  const newUser = req.body;

  if(!newUser.name || !newUser.bio) {
    res.status(400).json({errorMessage: "Please provide name and bio for new user."});
    return null;
  }

  db.insert(newUser)
    .then(user => res.status(201).json(user))
    .catch(err => {
      res.status(500).json({errorMessage: "There was an error while creating new user. please try again, if error presists plase contact api admin."})
    })
})

server.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  if(!userId){
    res.status(500).json({errorMessage: "No user specified. Select a user and try again."})
    return null
  }

  if(!userData.name || !userData.bio) {
    res.status(400).json({errorMessage: 'Please provide name and bio for the user.'});
    return null
  }

  db.update(userId, userData)
    .then(user => {
      if(!user){
        res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
        return null;
      }
      res.status(200).json(user)
    })
    .catch(err => res.status(500).json({ errorMessage: "The user information could not be retrieved." }))
})

server.delete('/api/user/:id', (req, res) =>{
  const userId = req.params.id;

  if(!userId){
    res.status(500).json({errorMessage: "No user specified. Select a user and try again."});
    return null;
  }

  db.remove(userId)
    .then(user => {
      if(!user){
        res.status(404).json({errorMessage:"The user with the specified ID does not exist."})
        return null;
      }
      res.status(200).json(user);
    })
    .catch(err => res.status(500).json({errorMessage: "The user can not be removed"}))
})

const port = 5000;
server.listen(port, ()=>{
  console.log(`\n ** api listening on port ${port} ** \n`)
})