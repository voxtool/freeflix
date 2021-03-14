const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = Number(process.env.SALTROUNDS) || 10;


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'The email should be at least 5 characters long.'],
        validate: {
            validator: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
            },
            message: 'Please fill a valid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'The password should be at least 6 characters long.'],
        validate: {
            validator: function (password) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/g.test(password);
            },
            message: props => `${props.value} must contain at least one uppercase letter, one lowercase letter and one number.`
        },
    },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    }]
}, { timestamps: { createdAt: 'created_at' } });

userSchema.methods = {
    matchPassword: function (password) {
        return bcrypt.compare(password, this.password);
    }
}

userSchema.pre('save', function (next) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            next(err);
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                next(err);
            }
            this.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', userSchema);