

const handleProfileGet = (req, res, pgdb) => {
        const {userID} = req.params;
        pgdb.select('*').from('users').where({
            id: userID  //remember that if both the property and value is the same u can remove the :, where({id})
          })
        .then(user => {
            //=> can't use just catch(err =>) because above return an empty [] which is boolean true, need below conditional
            if (user.length){
                res.json(user[0])
            } else {
                res.status(400).json('id not found')
            }
        })
        .catch(err => res.status(400).json('error getting user'))  
    };

// with ES6, no need to repeate the value ie) handleProfileGet: handleProfileGet
module.exports = {
    handleProfileGet
}
    