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


//-- POST 
router.post("/game", postsController.postgamename) /* http://localhost:3000/api/v1/posts/Game/*/
router.post("/user", postsController.postuser) /* 사용자 정보 입력하기 */
router.post("/score", postsController.postscore) /* Score 정보 입력하기 */


// - PUT
router.put("/:id", postsController.updatescore) /* win, lose update */
router.put("/updateuser/:id", postsController.updateuser) /* 사용자 정보 수정 */

// - Delete 
router.delete("/deleteuser/:id", postsController.deleteuser) /* 사용자 정보 삭제 */


//router.put("/:id", postsController.updatescore) /* 사용자 정보 삭제 */
module.exports = router;

