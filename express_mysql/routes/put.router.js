const express = require("express")
const router = express.Router()

const putsController = require("../controller/put.controller")


// - PUT
router.put("/updategame", putsController.updategame) /* 게임정보 수정 */

module.exports = router;
