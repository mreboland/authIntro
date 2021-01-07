const express = require('express');
const { createUser, findUserByEmail, findUserByID } = require('./userController');
const { createToken } = require("../../tokens/tokenService.js");
const { verifyToken } = require("../../middleware/verifyToken.js");

const router = express.Router();

router.route("/")
    .post(async (req, res) => {
        const { email, password, firstName, lastName } = req.body;

        if (!email || email === "") {
            res.status(400).json({ message: "email must be provided"});
            return;
        }

        if (!password || password === "") {
            res.status(400).json({ message: "password must be provided "});
            return;
        }

        if (!firstName || firstName === "") {
            res.status(400).json({ message: "firstName must be provided" });
            return;
        }

        if (!lastName || lastName === "") {
            res.status(400).json({ message: "lastName must be provided" });
            return;
        }

        // Search for user before account creation to check for duplicates
        try {
            const foundUser = await findUserByEmail(email);
            if (foundUser) {
                res.status(400).json({
                    message: `email '${email}' already exists` })
                return;
            }
            // if no email is found, create a new user by calling creatUser() in userController
            const user = await createUser({ email, password, firstName, lastName });
            res.json({ data: { id: user._id } });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
        }
    });

router.route("/login")
    .post(async (req, res) => {
        const { email, password } = req.body;

        if (!email || email === "") {
            res.status(400).json({ message: 'email must be provided' });
            return;
        }

        if (!password || password === "") {
            res.status(400).json({ message: 'password must be provided' });
            return;
        }

        try {
            // does the user exist?
            const user = await findUserByEmail(email);
            if(!user) {
                res.status(400).json({ message: "password and email do not match" });
                return;
            }
    
            // does the password match?
            const isMatch = await user.comparePasswords(password);
            if (!isMatch) {
                res.status(400).json({ message: "password and email do not match" });
                return;
            }
    
            const token = createToken({ id: user._id })
            
            // save token in the cookie
            res.cookie("token", token);
            // send an empty response back
            res.status(200).send({});
        } catch (ex) {
            console.log(ex);
            res.status(500).json({ message: "internal server error" });
        }
    });

router.use(verifyToken).route("/me")
    .get(async (req, res) => {

        try {
            const user = await findUserByID(req.user.id);
            res.json({ data: user });

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "internal server error" });
        }
    });


module.exports = router;