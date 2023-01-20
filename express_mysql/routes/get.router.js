const express = require("express")
const router = express.Router()

const getController = require("../controller/get.controller")

//GET ------------------------------------------------------------------

// GAME별 USER들 정보 가져오기   
// RANK--

router.get("/getgamescore", getController.getUsersWithRankByGameName) /* Game별 score */
router.get("/getuserscore", getController.getUsersWithRankByName) /* User별 score */
router.get("/gettotalscore", getController.getUsersWithTotalRank) /* total score */

// LIST --
router.get("/user", getController.getUser) /* User 리스트 가져오기 */
router.get("/game", getController.getGame) /* Game 리스트 가져오기 */
router.get("/score", getController.getScore) /* http://localhost:3000/api/v1/gets/Score*/

//UserByGame --
router.get("/userbygame", getController.getUserbyGame) 

//ID --
router.get("/:id", getController.getByUserId) /* http://localhost:3000/api/v1/posts/{id} ( User data )*/

module.exports = router;