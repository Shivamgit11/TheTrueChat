const express = require("express");

const grouphandler = require("../controllers/group");
const userauthentication = require("../middleware/auth");

const router = express.Router();
router.post(
  "/addgroup",
  userauthentication.authenticate,
  grouphandler.AddGroup
); //allgroups

router.get(
  "/allgroups",
  userauthentication.authenticate,
  grouphandler.GetGroups
); //allusers

router.get(
  "/allusers",
  userauthentication.authenticate,
  grouphandler.GetUsers
);  //adduserTogroup


router.post(
  "/adduserTogroup",
  userauthentication.authenticate,
  grouphandler.AddUserToGroup
);  //deleteuser

router.post(
  "/deleteuser",
  userauthentication.authenticate,
  grouphandler.DeleteUserFromGroup
)
module.exports = router;
