const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db= knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'smart-brain',
    password : 'Southern1!%',
    database : 'smart-brain',
    debug:true
  }
});

// this will test for a valid connection string
db.raw("select 1").then( ()=> {
    console.log("db connected");
}).catch( (e) => {
  console.log("db not connected");
  console.log(e);
})

// a wrong table name will generate an error
// db.from('users').then(data => {
//   console.log(data);
// });

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'john',
      email: 'john@some.com',
      password: '1235',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'sally',
      email: 'sally@some.com',
      password: '1234',
      entries: 0,
      joined: new Date()
    }

  ],
  login: [
    {
      id:"",
      email:"",
      hash:""
    }
  ]

}

app.get('/', (req,res) => {
  res.json(database.users);
})

app.post('/signin', (req,res) => {

 const {email, password} = req.body;
 

db.select('email','hash').from('login')
  .where({'email': email})
  .then(response => {
    if(bcrypt.compareSync(password,response[0].hash)){
        db('users').where('email',email)
        .returning('*')
        .then(response => {
          res.json(response[0]);
        })
        .catch(err => {
          res.status('400').json('Error');
        })
    }
    else {
       res.status('400').json('Error');
    }
  }).catch(err => {
    res.status('400').json('Error');
  })
})

app.post('/register', (req,res) => {
  const {email, name, password} = req.body;

  const hash = bcrypt.hashSync(password);
  db.transaction(trx =>
  {
    trx('login').insert({
      email: email,
      hash:hash
    })
    .returning('email')
    .then(loginEmail => {
      trx('users')
      .returning('*')
      .insert({
        email: email,
        name: name,
        joined: new Date()

      }).then(response => {
        res.json('success');
        
      })
      .catch( (e) => {res.status(400).json('error');
        console.log('error posting to database');
      })
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })
     
})

app.get('/profile/:id', (req,res) => {
  const {id} = req.params;
db.select('*').from('users').where({id:id})
.then(response => {
  if (response.length){
    res.json(response);
  }
  else
  {
    res.status(400).json('Error')
  }  
})
.catch(err => {res.status(400).json('Error');
});

})

app.put('/image', (req,res) => {
  const {id} = req.body;

  db.increment({entries:1}).from('users').where('id', '=',id).returning('entries')
  .then(response => {
    console.log(response);
    if (response.length){
      res.json(response[0].entries);
    }
    else
    {
      res.status(400).json('Error')
    }  
  })
  .catch(err => {res.status(400).json('Error');
  });
  
  
 
})


// bcrypt.hash("bacon", null, null, function(err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });



app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})
