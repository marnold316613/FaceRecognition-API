const handleImage = (req,res,db) => {
  const {id} = req.body;

  db.increment({entries:1}).from('users').where('id', '=',id).returning('entries')
  .then(response => {
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
 
};

module.exports = {
  handleImage: handleImage
};