const express = require("express")
const router = express.Router()

const deleteController = require("../controller/delete.controller")

//DELETE -------------------------------------------
router.delete("/deleteuser/:id", deleteController.deleteuser) /* 사용자 정보 삭제 */
router.delete("/deletegame", deleteController.deletegame) /* game 정보 삭제 */


module.exports = router;