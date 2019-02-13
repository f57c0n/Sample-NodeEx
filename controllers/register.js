

const handleRegister = (req, res, pgdb, bcrypt) => {
    const {name, email, password} = req.body
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect Form Submission') // don't forget return so that it can exit from here, else it continues down
    }
    const hash = bcrypt.hashSync(password);
    //knex transaction
    pgdb.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {     //=> note that this returns an array
            return trx('users')   // don't forget return
            .returning('*')       // knex syntax to return/select (view/query) the response in .then
            .insert({
                name: name,
                email: loginEmail[0],  //to only return the entry, not the array of objects
                joined: new Date()
            })
            .then(user => {
            res.json(user[0]);   //[0] so it only returns 1
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register')) //json(err) => will provide details of the error
};

module.exports = {
    handleRegister: handleRegister
};