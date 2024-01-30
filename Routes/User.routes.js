const { getAllUsers, addUser, AuthLogin, DeleteUserById, UpdateUserByID, searchUser, changePassword } = require("../Controllers/User.controller");
const Authentication = require("../Middlewares/Authentication.middleware");
const Authorization = require("../Middlewares/Authorization.middleware");

const UserRouter = require("express").Router();


UserRouter.get("/", (req, res) => res.send({ message: "Welcome to User Route" }));
UserRouter.post("/create", addUser);
UserRouter.post("/login", AuthLogin);
UserRouter.get("/get-all-users", Authentication, Authorization(["Admin"]), getAllUsers);
UserRouter.post("/search-user", Authentication, Authorization(["Admin"]), searchUser);
UserRouter.delete("/delete/:id", DeleteUserById);
UserRouter.patch("/update/:id", UpdateUserByID);
UserRouter.patch("/change-password", Authentication, changePassword);


module.exports = UserRouter;