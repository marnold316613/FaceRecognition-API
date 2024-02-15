const handleHome = (req,res) => {
  res.json(database.users);
};


module.exports = {
  handleHome: handleHome
};