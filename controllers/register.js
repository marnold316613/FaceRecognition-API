const handleRegister = (req,res,db,bcrypt) => {
  const {email, name, password} = req.body;
  if (!email || !name || !password)
  {
    return res.status(400).json('Error');
  }
  
  const check =db.select('email').from('login').where({
    email: email
  })
  if (check.length) {
    return res.status(400).json('Error');
  }

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
}

module.exports = {
  handleRegister: handleRegister
};