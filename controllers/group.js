const Group = require("../models/group");
const Auth = require("../models/Auth");
const Usergroup = require("../models/usergroup");
const sequelize = require("../util/database");

const AddGroup = async (req, res, next) => {
  try {
    const CreatedGroupData = await Group.create({
      name: req.body.name,
      GroupName: req.body.groupname,
      authId: req.user.id,
    });

    await Usergroup.create({
      userid: CreatedGroupData.authId,
      groupid: CreatedGroupData.id,
      isAdmin: true,
    });
    res.status(200).json({ message: "Create group and updated" });
  } catch (err) {
    console.log("something went wrong", err);
    return res.status(500).json({ success: false, error: err });
  }
}; //AddUserToGroup

const AddUserToGroup = async (req, res) => {
  try {
    const { groupName, email } = req.body;
    const admin = req.body.admin;

    const user = await Auth.findOne({ where: { email } });
    const group = await Group.findOne({ where: { GroupName: groupName } });
    if (!user) {
      return res.status(400).json({ message: "user or group not found" });
    }

    const userInUserGroup = await Usergroup.findOne({
      where: { userid: user.id, groupid: group.id },
    });
    if (!userInUserGroup) {
      await Usergroup.create({
        userid: user.id,
        groupid: group.id,
        isAdmin: admin,
      });
      return res.status(201).json({ message: "added user to the group" });
    }
    await Usergroup.update(
      { isAdmin: admin },
      { where: { userid: user.id, groupid: group.id } }
    );
    return res.status(201).json({ message: "update user in the group" });
  } catch (err) {
    console.log("something went wrong", err);
    return res.status(500).json({ success: false, error: err });
  }
};

const GetGroups = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const AdminGroup = await Usergroup.findAll({
      where: { userid: req.user.id },
      transaction: t,
    });

    console.log("Admin Group line no 55", AdminGroup);

    let AdminGroupId = [];

    for (let i = 0; i < AdminGroup.length; i++) {
      if (AdminGroup[i].isAdmin) {
        AdminGroupId.push(AdminGroup[i].groupid);
      }
    }

    console.log("line no 78", AdminGroupId);
    let SabhiSamuh = [];

    for (let i = 0; i < AdminGroupId.length; i++) {
      const AllGroups = await Group.findAll({
        where: { id: AdminGroupId[i] },
        transaction: t,
      });

      if (AllGroups) {
        SabhiSamuh.push(AllGroups);
      }
    }

    console.log("sabhi samuh", JSON.stringify(SabhiSamuh));

    const AllGroups = await Group.findAll({
      where: { authId: req.user.id },
      transaction: t,
    });

    res.status(200).json({ SabhiSamuh, success: true });
    await t.commit();
  } catch (err) {
    await t.rollback();
    console.log("something went wrong", err);
    return res.status(500).json({ success: false, error: err });
  }
};

const GetUsers = async (req, res) => {
  try {
    const allusers = await Auth.findAll();

    res.status(200).json({ allusers, success: true });
  } catch (err) {
    console.log("something went wrong", err);
    return res.status(500).json({ success: false, error: err });
  }
};

const DeleteUserFromGroup = async (req, res) => {
  try {
    const { groupName, email } = req.body;

    const { id: groupId } = await Group.findOne({
      where: { GroupName: groupName },
    });

    const userToBeRemoved = await Auth.findOne({ where: { email } });

    const removeUser = await Usergroup.destroy({
      where: { userid: userToBeRemoved.id, groupid: groupId },
    });
    if (removeUser) {
      return res.status(200).json({ message: "removed user" });
    }
    return res
      .status(400)
      .json({ message: "user is not present in the group" });

    // const allusers = await Auth.findAll();

    // console.log(allusers);
    // res.status(200).json({ allusers, success: true });
  } catch (err) {
    console.log("something went wrong", err);
    return res.status(500).json({ success: false, error: err });
  }
};

module.exports = {
  AddGroup,
  GetGroups,
  GetUsers,
  AddUserToGroup,
  DeleteUserFromGroup,
};
