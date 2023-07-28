const Chat = require("../models/Chat");
const UserGroup = require("../models/usergroup");
const Group = require("../models/group");
const sequelize = require("../util/database");
const { where } = require("sequelize");

const downloadFiles = async (req, res) => {
  try {
    console.log("aage",req.user);
    console.log('file********',req)
    return res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
};

const AddChat = async (req, res, next) => {
  console.log("line no 4 of chat.js");
  console.log("line 9", req.query);
  console.log(req.user);

  try {
    const msg = req.body.msg;
    const Value = await Chat.create({
      message: msg,
      authId: req.user.id,
      groupId: req.query.groupid,
    });

    console.log(req.body);
    return res.status(200).json({ Value: Value });
  } catch (err) {
    console.log("something went wrong", err);
    return res.status(500).json({ success: false, error: err });
  }
};

const getChat = async (req, res) => {
  console.log("line 108", req.query);
  try {
    const Messages = await Chat.findAll({
      where: { groupId: req.query.groupid },
    });
    res.status(200).json({ AllMessages: Messages });
  } catch (error) {
    console.log("get chat is falling", JSON.stringify(error));
    res.status(500).json({ error: error });
  }
};

const getChatGroups = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // const Messages = await Chat.findAll();
    // res.status(200).json({ AllMessages: Messages });
    // console.log(req.user);

    const PartGroup = await UserGroup.findAll({
      where: { userid: req.user.id },
      transaction: t,
    });

    // console.log("partGroup", PartGroup);
    let arr = [];

    for (let i = 0; i < PartGroup.length; i++) {
      // console.log(i, PartGroup[i].groupid);

      try {
        const GroupValue = await Group.findAll({
          where: { id: PartGroup[i].groupid },
          transaction: t,
        });
        // console.log("line 54", GroupValue);
        arr.push(GroupValue);
      } catch (error) {
        console.log(
          `Error retrieving group with id ${PartGroup[i].groupid}:`,
          error
        );
      }
    }

    // console.log("line 48", JSON.stringify(arr));
    res.status(200).json({ AllPartGroup: arr });

    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log("get chat is falling", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  AddChat,
  getChat,
  getChatGroups,
  downloadFiles,
};
