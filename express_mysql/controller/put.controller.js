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
                const sql = "update study_db.Game SET game_name = ?  where id = ? "
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
    }



}



module.exports = putsController;