const UserController = require("../Controllers/User.controller");
const UserRouter = require("express").Router();

UserRouter.get("/", (req, res) =>
  res.send({ message: "Welcome to User Route" })
);
UserRouter.post("/login", UserController.AuthLogin);
UserRouter.patch("/update/:id", UserController.UpdateUserByID);
UserRouter.post("/sendOtp", UserController.sendOTP);
UserRouter.post("/reset-password", UserController.resetPassword);
UserRouter.post("/post-feedback", UserController.postFeedback);

// UserRouter.get("/get-all-users", Authentication, Authorization(["Admin"]), UserController.getAllUsers);
// UserRouter.post("/search-user", Authentication, Authorization(["Admin"]), UserController.searchUser);
// UserRouter.patch("/change-password", Authentication, UserController.changePassword);

module.exports = UserRouter;
