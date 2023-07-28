const express = require("express");

const chathandler = require("../controllers/chat");
const userauthentication = require("../middleware/auth");

const router = express.Router();
router.post("/addchat", userauthentication.authenticate, chathandler.AddChat);

router.get(
  "/chatdetails",

  chathandler.getChat
);

router.get(
  "/allpartgroup",
  userauthentication.authenticate,
  chathandler.getChatGroups
);

router.post(
  "/filestored/:groupId",
  userauthentication.authenticate,
  chathandler.downloadFiles
);
module.exports = router;
