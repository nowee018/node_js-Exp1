const pool = require('../database/index')
const dataprocess = require("../DataProcess/data.process")


const postsController = {
    // LIST --------------------------------------------

    /* score 별 리스트 가져오기 */
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
    getGame: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from Game")
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

    // RANK ---------------------------------------------------------------------------------------------------------------------------------
    /* game name을 넣으면 해당 rank 가져오기 */
    getUsersWithRankByGameName: async (req, res) => {
        try {

            const { game_name } = req.body
            //console.log(game_name)

            const [Userrows, Userfields] = await pool.query("select * from User where game_id in (select id from Game where game_name = ?) order by win DESC", [game_name])

            /*game 별 Rank 생성 */
            rankbygamename = dataprocess.RankbyGameName(Userrows)
            res.json({
                data: rankbygamename
            })

        } catch (error) {
            console.log(error)
        }
    },

    /* id 별 랭크 가져오기 */
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




    // POST ------------------------------------------------------------------------------------------------------

    postgamename: async (req, res) => {
        try {
            const { game_name } = req.body
            //console.log(req.body)
            const sql = "insert into study_db.Game (game_name) values (?)"
            const [rows, fields] = await pool.query(sql, [game_name])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
            res.json({
                status: "error"
            })
        }
    },

    postuser: async (req, res) => {
        try {
            const { name, age, sex, game_id } = req.body
            console.log(name, age, sex, game_id);
            const sql = "insert into study_db.User (name, age, sex, game_id) values (?, ?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [name, age, sex, game_id])
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

    // UPDATE --------------------------------------------------------------------------------------------------------------------------

    updatescore: async (req, res) => {
        try {
            const { win, lose } = req.body
            console.log(win, lose)
            const { id } = req.params
            const sql = "update study_db.User SET win = ?, lose = ? where id = ?"
            const { rows, fields } = await pool.query(sql, [win, lose, id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = postsController;
