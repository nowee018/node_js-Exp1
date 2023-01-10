const express = require("express")
const router = express.Router()

const postsController = require("../controller/posts.controller")
router.get("/", postsController.getUser) /* http://localhost:3000/api/v1/posts ( User data )*/
router.get("/Game", postsController.getGame) /* http://localhost:3000/api/v1/posts ( Game data )*/
router.get("/:id", postsController.getByUserId) /* http://localhost:3000/api/v1/posts/{id} ( User data )*/
router.post("/Game", postsController.postGame_name) /* http://localhost:3000/api/v1/posts/Game/*/
router.post("/", postsController.User)

module.exports = router;

