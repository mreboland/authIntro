// We create a route here in order to login our users
// It will require an email and pass. We will get the user using the email. If the user doesn't exist we will send the client back with an error. If they do exist with the email, we will take the provided pass and compare it to the DB pass. If those match, we will generate a JWT token and send it back the the user in a cookie.

const jwt = require("jsonwebtoken");

const KEY = "secret phrase";

exports.createToken = (user) => {
    const token = jwt.sign(user, KEY);
    return token;
}

// A function to verify the token's signature for authenticity
exports.verifyToken = async (token) => {
    let user;
    jwt.verify(token, KEY, (err, decoded) => {
        console.log(err);
        if (err) {
            throw err;
        }

        user = decoded;
    });

    return user;
}