const pool = require('../database/index')
const dataprocess = require("../DataProcess/data.process")

const getController = {
    /* Score 별 리스트 가져오기 */
    getScore: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from Score")
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                state: "error"
            })
        }
    },

    /*User 별 리스트 가져오기 */
    getUser: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from User")
            /* Unique Users로 생성 */
            uniqueusers = dataprocess.UniqueUsers(rows)

            res.json({
                data: uniqueusers
            })
        } catch (error) {
            console.log(error)
        }
    },

    /*User별 ID로 해당 리스트 가져오기 */
    getByUserId: async (req, res) => {
        try {


            const { id } = req.params
            const [rows, fields] = await pool.query("select * from User where id = ?", [id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                state: "error"
            })
        }
    },
    /*Game 리스트 가져오기*/
    getGame: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from Game")
            /*null 값이 들어갈 경우 제외한 리스트만 반환 */
            uniquegame = dataprocess.UniqueGame(rows)
            res.json({
                data: uniquegame
            })
        } catch (error) {
            console.log(error)
            res.json({
                state: "error"
            })
        }
    },

    getUsersWithRankByGameName: async (req, res) => {
        try {

            const { game_name } = req.body

            let [game_id, field] = await pool.query("select * from Game where game_name = ?", [game_name])

            const [Userrows, Userfields] = await pool.query("select * from User where game_id = ? order by win DESC", [game_id[0]["id"]])

            /*game 별 Rank 생성 */
            rankbygamename = dataprocess.RankbyGameName(Userrows, game_name)
            res.json({
                data: rankbygamename
            })

        } catch (error) {
            console.log(error)
        }
    },

    /* name 별 랭크 가져오기 */
    getUsersWithRankByName: async (req, res) => {
        try {

            const { name } = req.body
            //console.log(game_name)

            let [Userrows, Userfields] = await pool.query("select * from User where name = ? order by win DESC", [name])

            /* Users들 이름별 Rank 순위 */
            for (var i = 0; i < Userrows.length; i++) {

                let game_name = await pool.query("select game_name from Game where id = ?", [Userrows[i].game_id])
                //console.log(game_name)
                Userrows[i].rank = i + 1;
                Userrows[i].game_name = game_name[0][game_name];
                //console.log(Userrows[i].game_name = game_name[0][0]["game_name"])
            }
            res.json({
                data: Userrows
            })
        } catch (error) {
            console.log(error)
        }
    },

    /* total 링크 가져오기 */
    getUsersWithTotalRank: async (req, res) => {
        try {

            const [rows, Userfields] = await pool.query("select * from User")
            totalrank = dataprocess.TotalRank(rows)
            res.json({
                data: totalrank
            })

        } catch (error) {
            console.log(error)
        }
    },




}

module.exports = getController;