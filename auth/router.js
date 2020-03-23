const bcrypt = require('bcryptjs');

const router = require('express').Router();

const Users = require('../users/users-model');

router.post('/register', (req, res) => {
    const userInfo = req.body;

    const ROUNDS = process.env.HASHING_ROUNDS || 8;
    const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

    userInfo.password = hash;

    Users.add(userInfo)
        .then(user => {
            res.json(user);
        })
        .catch(err => res.send(err));
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    Users.findBy({ username })
        .then(([user]) => {
            // console.log('user', user);
            // console.log('password', password);
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = {
                    id: user.id,
                    username: user.username
                };
                res.status(200).json({user})
            } else {
                res.status(401).json({message: 'Please provide valid credentials.'});
            }
        })
        .catch(err => {
            res.status(500).json({errorMessage: 'Error finding a user by that name.'})
        })
})

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({message: "Could not log you out"});
            } else {
                res.status(200).json({message: "Log out successful"});
            }
        })
    } else {
        res.status(200).json({message: 'You are already logged out'})
    }
})

module.exports = router;