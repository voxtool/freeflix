const { User, Token } = require('../models');
const config = require('../config/config');
const authCookieName = config.authCookieName;
const utils = require('../utils');


async function register(req, res, next) {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            res.status(409)
                .send({ message: 'The email is already registered!' });
            return
        }
        let newUser = await User.create({ email, password });
        const token = utils.jwt.createToken({ id: newUser._id });
        if (process.env.NODE_ENV === 'production') {
            res.cookie(authCookieName, token, { httpOnly: true, sameSite: '', secure: true });
        } else {
            res.cookie(authCookieName, token, { httpOnly: true });
        }
        res.status(200).send(newUser);
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            let field = err.message.split("index: ")[1];
            field = field.split(" dup key")[0];
            field = field.substring(0, field.lastIndexOf("_"));

            res.status(409)
                .send({ message: `This ${field} is already registered!` });
            return;
        }
        next(err);
    }
}


async function login(req, res, next) {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            res.status(401)
                .send({ message: 'Wrong email or password' });
            return
        }
        const match = await user.matchPassword(password);
        if (!match) {
            res.status(401)
                .send({ message: 'Wrong email or password' });
            return
        }
        const token = utils.jwt.createToken({ id: user._id });
        if (process.env.NODE_ENV === 'production') {
            res.cookie(authCookieName, token, { httpOnly: true, sameSite: '', secure: true });
        } else {
            res.cookie(authCookieName, token, { httpOnly: true });
        }
        res.status(200).send(user);
    } catch (err) {
        next(err);
    }
}


async function logout(req, res) {
    const token = req.cookies[authCookieName];
    try {
        const blackListToken = await Token.create({ token });
        res.clearCookie(authCookieName).status(200).send({ message: 'Logged out!' });
    } catch (error) {
        res.send(err);
    }
}


async function getProfileInfo(req, res, next) {
    const { _id: userId } = req.user;
    try {
        const user = await User.findOne({ _id: userId }).select(['email', 'movies']);
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

// async function getAllUsers(req, res, next) {
//     const { _id: userId } = req.user;
//     try {
//         const users = await User.find({ _id: { $nin: [userId] } }).sort({ created_at: -1 }).select(['_id', 'username']);
//         res.status(200).json(users);
//     } catch (err) {
//         next(err);
//     }
// }

// async function getUserById(req, res, next) {
//     const { userId } = req.params;
//     try {
//         const user = await User.findById(userId).select(['images', 'followed', 'comments', 'username', 'created_at', 'updatedAt']).populate('images');
//         res.json(user);
//     } catch (err) {
//         next(err);
//     }
// }


module.exports = {
    login,
    register,
    logout,
    getProfileInfo,
    // getAllUsers,
    // getUserById
}