// const GroupFiles = require("../model/GroupFiles");
// const Message = require("../model/Chat");
const Chat = require("../models/Chat");

const S3Service = require("../services/s3-services");
const downloadFiles = async (req, res) => {
  try {
    console.log("file********", req.file);
    const file = req.file.buffer;
    console.log(req.user.dataValues.name);
    const id = req.user.dataValues.id;
    const name = req.user.dataValues.name;
    const groupId = req.params.groupId;

    // const userId = req.user.id;
    const fileName = `${req.file.originalname}`;

    console.log(fileName, "****************************");
    const fileUrl = await S3Service.uploadToS3(file, fileName);

    console.log(fileUrl);
    // await GroupFiles.create({ url: fileUrl, groupId: groupId });
    const msg = await Chat.create({
      message: fileUrl,
      authId: id,
      groupId: groupId,
    });

    res.status(200).json({msg, fileName, success: true});
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: "", success: false, err: err });
  }
};

const getAllFiles = async (req, res) => {
  try {
    // console.log(req.params.groupId)
    // const allFiles = await GroupFiles.findAll({where:{groupId:req.params.groupId}});
    // //const urls = allDownloads.map(download => download.url);
    // //console.log("all downloads====>>>",urls);
    // res.status(200).json(allFiles);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  downloadFiles,
  getAllFiles,
};
