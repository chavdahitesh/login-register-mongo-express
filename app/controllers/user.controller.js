const Users = require('../models/user.model');
const Token = require('../models/token.model')
const bcrypt = require('bcryptjs');
const config = require('../config/auth.config')
var jwt = require("jsonwebtoken");

exports.create = (req, res) => {
    if (req.body.email && req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        req.body.status = 'active'
        var userdata = new Users(req.body)
        userdata.save(
            (err, data) => {
                if (err) {
                    return res.status(400).json({ msg: err });
                }
                var tokn = jwt.sign({ _userId: userdata._id }, config.secret)
                var token = new Token(
                    { _userId: userdata._id, token: tokn })
                token.save((err) => {
                    if (err) {
                        return res.status(500).send({ message: err.message });
                    }
                    return res.status(200).send({
                        message: 'user created successfully',
                    })
                })
            }
        )
    }
}

exports.login = async (req, res) => {
    if (req.body.username && req.body.password) {
        await Users
            .findOne({ username: req.body.username })
            .populate("-__v", "-password")
            .exec((err, user) => {
                if (err) {
                    return res.status(500).send({ message: err })
                }
                if (!user) {
                    return res.status(404).send({ message: "user not found !" })
                }

                var pwdIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                )
                if (!pwdIsValid) {
                    return res.status(401).send({
                        token: null,
                        message: 'Invalid password !'
                    })
                }
                var token = jwt.sign({ id: user?.id }, config.secret, {
                    expiresIn: 86400 // 24 hours
                })

                return res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    accessToken: token
                })
            })
    }
}


exports.findAll = (req, res) => {
    Users.find().select("-password")
        .exec((user, err) => {
            if (err) {
                return res.status(500).send(err)
            }
            else if (user.length) {
                return res.status(200).send({ data: user })
            }
            else {
                return res.send({ message: "No data found" })
            }
        })
}

exports.findOne = (req, res) => {
    console.log("Query params:::", req.params.id);
    Users.findById(req.params.id)
        .select("-password")
        .exec((user, err) => {
            if (err) {
                return res.status(500).send(err)
            }
            if (!user.__id) {
                return res.status(404).send({ message: "user not found with this id :" + req.params.id })
            }
            else {
                return res.status(200).send(user)
            }
        })
}

exports.update = (req, res) => {
    const id = req.params.id;

    Users.findByIdAndUpdate(id, { $set: req.body }, { new: true })
        .select("-password").exec((err, usr) => {
            if (err) {
                return res.status(200).send(err);
            }
            return res.status(200).send(usr)
        })
}
exports.delete = (req, res) => {
    const id = req.params.id;
    Users.findByIdAndRemove(id)
        .then(usr => {
            if (!usr) {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(200).send({ message: "User deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Could not delete User with id " + req.params.id
            });
        });
}

