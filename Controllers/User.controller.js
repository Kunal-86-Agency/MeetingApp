const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../Models/User.model");


require("dotenv").config();

exports.AuthLogin = async (req, res) => {

    const { email, password } = req.body;
    const test = { email, password }
    for (const key in test) {
        if (!test[key]) return res.status(401).send({ message: `Please Provide ${key}, Mandatory field missing: ${key}` })
    }
    try {
        let user = await UserModel.findOne({ email })
        if (!user) return res.status(404).send({ message: "Email Not Found, Please check entered email" });
        if (user.working_status == "disabled") return res.status(400).send({ message: "Account on Hold", status: "info", desc: "Your account has been under survey, Please wait we will contact you soon!", });

        bcrypt.compare(password, user?.password).then(async (result) => {
            if (!result) {
                return res.status(404).send({ message: "Wrong Credentials" });
            } else {
                const token = jwt.sign({ id: user?._id, role: user?.role }, process.env.JSON_SECRET);
                let instance = await UserModel.findOne({ email }).select({ password: 0 })
                res.send({ message: "Login Successful", token, user: instance });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went Wrong" });
    }
};
exports.getAllUsers = async (req, res) => {
    let limit = req.query.limit || 10
    let page = req.query.page || 1
    page = page > 0 ? page : 1
    let skip = (page - 1) * limit || 0
    try {
        const Users = await UserModel.find().sort({ createdAt: -1 }).limit(limit).skip(skip).populate(["address"]).select({ password: 0 })
        const TotalUsers = await UserModel.find().count()
        res.send({ message: `All Users Page ${page}`, Count: Users.length, Users, TotalUsers });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went Wrong" });
    }
};

exports.UpdateUserByID = async (req, res) => {
    let id = req.params.id
    let payload = req.body

    try {
        let updatedUser = await UserModel.findByIdAndUpdate(id, payload, { new: true })
        return res.status(200).send({ message: "Updated The User with ID : " + id, updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error?.message || "Server Error 500" })
    }
}

exports.searchUser = async (req, res) => {
    const query = req.body
    try {
        let Users = await UserModel.find(query).sort({ createdAt: -1 }).populate(["address"]).select({ password: 0 })
        res.status(200).send({ message: "Searched Users", count: Users.length, Users: Users })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error?.message || "Server Error 500" })
    }
}
exports.changePassword = async (req, res) => {

    let { newPass, userID } = req.body

    try {
        let user = await UserModel.findById(userID)
        if (!user) return res.status(404).send({ message: "Email Not Found, Please check entered email" });
        const Hash = await bcrypt.hash(newPass, 5);
        await UserModel.findByIdAndUpdate(userID, { password: Hash })
        let instance = await UserModel.findById(userID).populate(["address"]).select({ password: 0 })
        return res.status(200).send({ message: "Changed the password of user with user ID :" + userID, UpdatedUser: instance });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error?.message || "Server Error 500" })
    }
}