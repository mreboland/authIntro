const mongoose = require("mongoose");
const { Schema } = mongoose;

// password is currently being stored as a string so we need to use bcrypt in order to has the password before it's saved in the DB.
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.pre("save", async function(next) {
    const user = this;

    try {
        if (user.isModified("password") || user.isNew) {
            const encryptedPassword = await bcrypt.hash(user.password, 10);
            user.password = encryptedPassword;
        }

        next();
    } catch(ex) {
        next(ex);
    }
});

// Compare password method used to check if a pass matches the one saved in the DB
userSchema.methods.comparePasswords = function(password) {
    const user = this;
    return bcrypt.compare(password, user.password);
}

module.exports = mongoose.model("User", userSchema);