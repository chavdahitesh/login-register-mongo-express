const db = require('../models/index');

const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    //user
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: 'username is already used!.. please change username' });
            return;
        }
    })

    //email
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return;
        }
        if (user) {
            res.status(400).send({ message: 'email is already in used!' })
            return;
        }
        next();
    })
}


const verifySignUp = {
    checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;