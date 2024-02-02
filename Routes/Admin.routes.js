const AdminController = require("../Controllers/Admin.controller.js");
const Authentication = require("../Middlewares/Authentication.middleware.js");
const Authorization = require("../Middlewares/Authorization.middleware.js");

const AdminRouter = require("express").Router();


AdminRouter.get("/", (req, res) => res.send({ message: "Welcome to Admin Work Route" }));
AdminRouter.post("/get-all", AdminController.getAllUsers);
AdminRouter.post("/create-user", Authentication, Authorization(["Admin"]), AdminController.adminCreateUser);
AdminRouter.post("/invite-user/:id", AdminController.adminInviteUser);
AdminRouter.delete("/delete-user/:id", Authentication, Authorization(["Admin"]), AdminController.DeleteUserById);

// AdminRouter.post("/login", AuthLogin);
// AdminRouter.get("/get-all-users", Authentication, Authorization(["Admin"]), getAllUsers);
// AdminRouter.post("/search-user", Authentication, Authorization(["Admin"]), searchUser);
// AdminRouter.patch("/update/:id", UpdateUserByID);
// AdminRouter.patch("/change-password", Authentication, changePassword);


module.exports = AdminRouter;