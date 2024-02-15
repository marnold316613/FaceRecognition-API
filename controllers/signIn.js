const handleSignIn =  (req,res, db, bcrypt) => {
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
 };

 module.exports = {
  handleSignIn: handleSignIn
};