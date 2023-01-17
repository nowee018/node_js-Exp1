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

            let [Userrows, Userfields] = await pool.query("select * from User where name = ? order by win DESC, sum DESC", [name])
            let Users = [];
            /* Users들 이름별 Rank 순위 */
            var Rank = 0;
            for (var i = 0; i < Userrows.length; i++) {

                let [game,] = await pool.query("select game_name from Game where id = ?", [Userrows[i].game_id])

                // 예외처리 1) win, lose 가 null 값일 경우 랭크에 포함 x 
                if (Userrows[i].win == null || Userrows[i].lose == null) {

                    continue;
                }
                // 예외처리 2) 동점자 처리 (win의 합계와 sum의 합계가 같을 경우)
                if (i > 0 && (Userrows[i - 1].win == Userrows[i].win) && (Userrows[i - 1].sum == Userrows[i].sum)) {
                    Userrows[i].rank = Rank;
                    Userrows[i].game_name = game[0]["game_name"];
                    Users.push(Userrows[i])
                    continue;

                }
                Userrows[i].rank = Rank += 1;
                Userrows[i].game_name = game[0]["game_name"];
                Users.push(Userrows[i])
            }

            res.json({
                data: Users
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