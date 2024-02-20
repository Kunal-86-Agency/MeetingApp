const AgoraController = require("../Controllers/Agora.controller.js");
const AgoraRouter = require("express").Router();


AgoraRouter.get("/", (req, res) => res.send({ message: "Welcome to Agora Route" }));
AgoraRouter.get("/get-token", AgoraController.getToken);

module.exports = AgoraRouter;