const handleProfile = (req,res, db) => {
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

};

module.exports = {
  handleProfile: handleProfile
};