const pool = require('../database/index')
const dataprocess = require("../DataProcess/data.process")

const putsController = {


    updategame: async (req, res) => {
        try {
            const { game_name_before, game_name_after } = req.body

            let [game_id_before,] = await pool.query("select * from Game where game_name = ?", [game_name_before])

            let [game_id_after,] = await pool.query("select * from Game where game_name = ?", [game_name_after])


            let rows = "";

            /*update할 정보가 해당 테이블에 없을 경우 등록 */
            if (dataprocess.isEmptyArr(game_id_after)) {

                // console.log(name, age, sex, game_id);
                const sql = "update scoreboard.Game SET game_name = ?  where id = ? "
                rows = await pool.query(sql, [game_name_after, game_id_before[0]["id"]])

            } else {
                rows += `해당 게임 테이블에 ${game_name_after}은 이미 등록되어 있습니다.`
            }

            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
        }
    },

    updatescore: async (req, res) => {
        try {
            const {user1_score,user2_score,Score_Table_Id} = req.body
            
            const [ScoreBefore,] = await pool.query("select * from Score where id = ?",[Score_Table_Id])
            const[user1,] = await pool.query("select * from User where id = ? and game_id =?", [ScoreBefore[0].user_ID1,ScoreBefore[0].game_ID])
            const[user2,] = await pool.query("select * from User where id = ? and game_id =?", [ScoreBefore[0].user_ID2,ScoreBefore[0].game_ID])

        

            /* 전 꺼를 돌아가기 전으로 초기화를 해야 한다. */
            
            if (ScoreBefore[0].score1 < ScoreBefore[0].score2){
                if (user1[0].lose > 0) {
                    user1[0].lose -= 1 
                }
                if (user2[0].win > 0) {
                    user2[0].win -= 1 
                }
               
            }else if (ScoreBefore[0].score1 > ScoreBefore[0].score2){
                if (user1[0].win > 0) {
                    user1[0].win -= 1 
                }
                if (user2[0].lose > 0) {
                    user2[0].lose -= 1 
                }

            }

            if (user1_score > user2_score){
                user1[0].win += 1 
                user2[0].lose += 1 
            }else if(user1_score < user2_score){
                user1[0].lose += 1 
                user2[0].win += 1 
            }

            // console.log(name, age, sex, game_id);
            const sql_Score = "update scoreboard.Score SET score1=?, score2=? where id = ? "
            let rows = await pool.query(sql_Score, [user1_score, user2_score, Score_Table_Id])

            const sql_User= "update scoreboard.User SET win=?, lose=? where id = ? and game_id =?"
            rows = await pool.query(sql_User, [user1[0].win, user1[0].lose, ScoreBefore[0].user_ID1, ScoreBefore[0].game_ID])

            rows = await pool.query(sql_User, [user2[0].win, user2[0].lose,  ScoreBefore[0].user_ID2, ScoreBefore[0].game_ID])

            res.json({
                data: rows 
            })


        } catch (error) {
            console.log(error)
        }
    }



}



module.exports = putsController;