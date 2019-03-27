
const handleSignin = (req, res, pgdb, bcrypt) => {
//or below syntax to match the other option of calling from server
//const handleSignin = (pgdb, bcrypt) => (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('Incorrect Form Submission') 
        // don't forget return so that it can exit from here, else it continues down
    }
    pgdb.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash)
            if (isValid) {
                return pgdb.select('*').from('users')  // don't forget return
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong password')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
};

module.exports = {
    handleSignin: handleSignin
}
