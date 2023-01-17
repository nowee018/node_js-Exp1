const express = require("express")
const router = express.Router()

const putsController = require("../controller/put.controller")


// - PUT
router.put("/:id", putsController.updatescore) /* win, lose update */
router.put("/updateuser/:id", putsController.updateuser) /* 사용자 정보 수정 */



module.exports = router;
