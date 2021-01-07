const User = require('./userModel');

// The below functions will be used in the userRoutes.js file which will verify all info is correct; and if so, query the server.
// Add functionality to save a user in the DB
exports.createUser = async ({ email, password, firstName, lastName }) => {
    try {
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
        });
        // When we call the mongoose save() method, the pre save function we wrote in userModel.js will get automatically called and will has our passwords for us.
        const user = await newUser.save();
        return user;
    } catch (ex) {
        throw ex;
    }
};

// Function to check if email already exists before saving it in the DB.
exports.findUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email });
        return user;
    } catch (ex) {
        throw ex;
    }
}

// Function to look up a user in the DB based on the ID that is provided in the token.
exports.findUserByID = async (id) => {
    try {
        const user = await User.findById(id);
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };
    } catch (ex) {
        throw ex;
    }
};


