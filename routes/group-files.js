const express = require('express');

const router = express.Router();

const controller = require('../controllers/files');
const userauthentication = require("../middleware/auth");

router.post('/filestored/:groupId',userauthentication.authenticate,controller.downloadFiles);

router.get('/getfiles/:groupId',userauthentication.authenticate,controller.getAllFiles);

module.exports = router;