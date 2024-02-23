const express = require('express');
const {body,validationResult} = require('express-validator');
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
  if (process.env.NODE_ENV !=='production') 
  {
    return { 
      host : process.env.DBHOST,
      port : process.env.DBPORT,
      user : process.env.DBUSER,
      password : process.env.DBPASSWORD,
      database : process.env.DBDATABASE
    
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

app.post('/signin',[
  body('email', 'Email is not valid')
    .isEmail()
    .normalizeEmail()
    .escape(),
  body('password','Password must be a minimum of 3+ characters')
    .exists()
    .isLength({min:3})
    .escape()  
  
] ,(req,res) =>{ signinController.handleSignIn(req,res, db, bcrypt,validationResult(req))});

app.post('/register',[
  body('email', 'Email is not valid')
    .isEmail()
    .normalizeEmail()
    .escape(),
  body('password','Password must be a minimum of 3+ characters')
    .exists()
    .isLength({min:3})
    .escape(),
  body('name', 'Name cannot be more than 30 characters')
    .exists()
    .escape()
    .isLength({max:30})  
],
(req,res) =>{ registerController.handleRegister(req,res, db, bcrypt,validationResult(req))});

//app.get('/profile/:id', (req,res) =>{ profileController.handleProfile (req,res, db)});

app.put('/image', [
  body('id','Must be a number')
  .exists()
  .escape()
  .isNumeric()
],(req,res) =>{ imageController.handleImage(req,res, db,validationResult(req))});

app.post('/clarifai', [
  body('input','Must be a valid image url')
  .exists()
], (req,res) => clarifaiController.handleClarifai(req,res,validationResult(req)));

app.listen(process.env.PORT || 3000, ()=> {
  console.log(`app is running on port ${process.env.PORT || 3000}`);
})
