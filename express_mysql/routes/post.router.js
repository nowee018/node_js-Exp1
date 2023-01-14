const express = require("express")
const router = express.Router()

const postsController = require("../controller/posts.controller")

//--- GET 
router.get("/", postsController.getScore) /* http://localhost:3000/api/v1/posts/Score*/
router.get("/getgamescore", postsController.getUsersWithRankByGameName) /* Game별 score */
router.get("/getuserscore", postsController.getUsersWithRankByName) /* User별 score */
router.get("/gettotalscore", postsController.getUsersWithTotalRank) /* total score */
router.get("/user", postsController.getUser) /* User 리스트 가져오기 */
router.get("/game", postsController.getGame) /* Game 리스트 가져오기 */
router.get("/:id", postsController.getByUserId) /* http://localhost:3000/api/v1/posts/{id} ( User data )*/


// --GET (RANK)

// router.get("/Rtotal", postsController.getTotalRank) /* http://localhost:3000/api/v1/posts ;(User data )*/
// router.get("/Rgame", postsController.getGameRank) /* http://localhost:3000/api/v1/posts ( Game data )*/



//-- POST 
router.post("/game", postsController.postgamename) /* http://localhost:3000/api/v1/posts/Game/*/
router.post("/user", postsController.postuser) /* 사용자 정보 입력하기 */


// - PUT
router.put("/:id", postsController.updatescore) /* win, lose update */
module.exports = router;

