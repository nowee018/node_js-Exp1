const pool = require('../database/index')
const dataprocess = require("../DataProcess/data.process")

const deleteController = {
    deleteuser: async (req, res) => {
        try {
            const { id } = req.params
            const sql = "delete from User where id = ? "
            const { rows, fields } = await pool.query(sql, [id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
        }
    },

    deletegame: async (req, res) => {
        try {
            const { game_name } = req.body

            let [game_id,] = await pool.query("select id from Game where game_name = ? ", [game_name])
            //console.log(game_id)
            let rows = "";
            let user_id;
            let score_id;

            if (!dataprocess.isEmptyArr(game_id)) {
                //case 1 Game 이름과 관련된 정보 Game Table 에서 삭제 
                const sql_Game = "delete from Game where id = ? "
                const { Game_rows, fields } = await pool.query(sql_Game, [game_id[0]["id"]])
                user_id = await pool.query("select id from User where game_id = ? ", [game_id[0]["id"]])
                score_id = await pool.query("select id from Score where game_ID = ? ", [game_id[0]["id"]])

                rows += "game table 에서 삭제 "

                if (!dataprocess.isEmptyArr(user_id[0])) {

                    //case 2 Game 이름과 관련된 정보 User Table 에서 삭제 
                    const sql_User = "delete from User where game_id = ? "
                    const { User_rows, } = await pool.query(sql_User, [game_id[0]["id"]])
                    rows += ", user table 에서 삭제 "
                }

                if (!dataprocess.isEmptyArr(score_id[0])) {

                    //case 3 Game 이름과 관련된 정보 Score Table 에서 삭제 
                    const sql_Score = "delete from Score where game_ID = ? "
                    const { Score_rows, } = await pool.query(sql_Score, [game_id[0]["id"]])
                    rows += ", score table 에서 삭제 "
                }
            }

            res.json({
                data: rows
            })

        } catch (error) {
            console.log(error)
        }
    }


}



module.exports = deleteController;