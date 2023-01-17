const pool = require('../database/index')
const dataprocess = require("../DataProcess/data.process")


const postsController = {

    // POST ------------------------------------------------------------------------------------------------------

    postgamename: async (req, res) => {
        try {
            const { game_name } = req.body
            //console.log(game_name)

            let { rows, fields } = "";

            let [game,] = await pool.query("select id from Game where game_name = ?", [game_name])

            const sql = "insert into study_db.Game (game_name) values (?)"
            //console.log(game[0])
            /* game table에 해당 정보가 없을 경우*/
            if (!(game[0])) {

                [rows, fields] = await pool.query(sql, [game_name])
                res.json({
                    data: rows
                })

            } else {
                res.json({
                    status: "해당 정보 존재"
                })
            }



        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },

    postuser: async (req, res) => {
        try {
            const { name, age, sex, game_name } = req.body

            let [game_id,] = await pool.query("select id from Game where game_name = ? ", [game_name])
            // console.log(name, age, sex, game_id);
            const sql = "insert into study_db.User (name, age, sex, game_id) values (?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [name, age, sex, game_id[0]["id"]])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error);
            res.json({
                status: "error"
            })
        }
    },


    postscore: async (req, res) => {
        try {


            let { game_name, user1_name, user2_name, user1_score, user2_score, date } = req.body

            let [game_id,] = await pool.query("select id from Game where game_name = ? ", [game_name])

            let user1 = await pool.query("select * from User where name = ? and  game_id = ? ", [user1_name, game_id[0]["id"]])
            let user2 = await pool.query("select * from User where name = ? and  game_id = ? ", [user2_name, game_id[0]["id"]])

            /* User1 table에 해당 정보가 없을 경우*/
            if (dataprocess.isEmptyArr(user1[0])) {

                user1 = await dataprocess.InsertandSelectUser(user1_name, game_id[0]["id"]);

            }

            /* User2 table에 해당 정보가 없을 경우*/
            if (dataprocess.isEmptyArr(user2[0])) {

                user2 = await dataprocess.InsertandSelectUser(user2_name, game_id[0]["id"]);

            }

            const sql = "insert into study_db.Score (game_ID, user_ID1, user_ID2, score1, score2, date) values (?, ?, ?, ?, ?, ?)"

            /* win, lose data를 User table에 업데이트 하기 */
            dataprocess.UpdateWinorLose(user1[0], user2[0], user1_score, user2_score)

            const [rows, fields] = await pool.query(sql, [game_id[0]["id"], user1[0][0]["id"], user2[0][0]["id"], user1_score, user2_score, date])

            res.json({
                data: rows
            })


        } catch (error) {
            console.log(error);
            res.json({
                status: "error"
            })
        }
    },


}


module.exports = postsController;
