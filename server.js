const express = require('express');
const app = express();
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const registerController = require('./controllers/register')
const signinController = require('./controllers/signIn');
const imageController = require('./controllers/image');
const profileController = require('./controllers/profile');
const homeController = require('./controllers/home');
const clarifaiController = require('./controllers/clarifai');


const pool = (() => {
  if (process.env.NODE_ENV !=='productions') 
  {
    return { 
      host : '127.0.0.1',
      port : 5432,
      user : 'smart-brain',
      password : 'Southern1!%',
      database : 'smart-brain'
      
    }
  } else {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
})
console.log(pool());
const db= knex({
  client: 'pg',
  connection: pool()
  }
);





const PORT =process.env.PORT;


// this will test for a valid connection string
db.raw("select 1").then( ()=> {
    console.log("db connected");
}).catch( (e) => {
  console.log("db not connected");
  console.log(e);
})

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//  // res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers");
//   res.header("Access-Control-Allow-Methods", "POST, GET, HEAD ,OPTIONS, PUT, DELETE");
//   next();
// })


app.get('/', (req,res) =>{ homeController.handleHome (req,res)});

app.post('/signin',(req,res) =>{ signinController.handleSignIn(req,res, db, bcrypt)});

app.post('/register', (req,res) =>{ registerController.handleRegister(req,res, db, bcrypt)});

app.get('/profile/:id', (req,res) =>{ profileController.handleProfile (req,res, db)});

app.put('/image', (req,res) =>{ imageController.handleImage(req,res, db)});

app.post('/clarifai', (req,res) => clarifaiController.handleClarifai(req,res));

app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is running on port ${process.env.PORT || 3000}`);
})
