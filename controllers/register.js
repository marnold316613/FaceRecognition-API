const handleRegister = async (req,res,db,bcrypt) => {
  const {email, name, password} = req.body;
  if (!email || !name || !password)
  {
    return res.status(400).json('Error');
  }
  
 const result =await checkIfUserExists(email,db);
  if (result)
  {
    return res.status(400).json('Error');
  } else {
    await addUser(name, email, password,db, bcrypt).then(userAddedResult => {
      if (userAddedResult) {
        return  res.json('success');
      } else {
        return res.status(400).json('Error');
      }
    })
  }
}

 async function checkIfUserExists(email,db) {
  const response = await db.select('email').from('login').where({email: email
  })
    return response.length ? true : false }

async function addUser(name, email, password, db, bcrypt) {
  const hash = bcrypt.hashSync(password);
  let success =false;
  const result = await db.transaction(trx =>
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
        success =true;  
        
      })
      .catch( (e) => {
        console.log('Error adding user to database', e);
        success =false;
      })
    })
    .then(trx.commit)
    .catch(trx.rollback);
  })

  return success;
}

module.exports = {
  handleRegister: handleRegister
};