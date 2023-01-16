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




    // POST ------------------------------------------------------------------------------------------------------

    postgamename: async (req, res) => {
        try {
            const { game_name } = req.body
            //console.log(game_name)
            const sql = "insert into study_db.Game (game_name) values (?)"

            /*game_name이 null 값이거나 중복된 값이면 예외 처리*/
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
            // console.log(name, age, sex, game_id);
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


    postscore: async (req, res) => {
        try {


            let { game_name, user1_name, user1_age, user1_sex, user2_name, user2_age, user2_sex, user1_score, user2_score, date } = req.body

            let [game_id,] = await pool.query("select id from Game where game_name = ? ", [game_name])

            let user1 = await pool.query("select id, win, lose from User where name = ? and  age = ? and sex = ? and game_id = ? ", [user1_name, user1_age, user1_sex, game_id[0]["id"]])
            let user2 = await pool.query("select id, win, lose from  User where name = ? and  age = ? and  sex = ? and game_id = ? ", [user2_name, user2_age, user2_sex, game_id[0]["id"]])

            /* User1 table에 해당 정보가 없을 경우*/
            if (dataprocess.isEmptyArr(user1[0])) {

                user1 = await dataprocess.InsertandSelectUser(user1_name, user1_age, user1_sex, game_id[0]["id"]);

            }

            /* User2 table에 해당 정보가 없을 경우*/
            if (dataprocess.isEmptyArr(user2[0])) {

                user2 = await dataprocess.InsertandSelectUser(user2_name, user2_age, user2_sex, game_id[0]["id"]);

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

    // UPDATE --------------------------------------------------------------------------------------------------------------------------

    updatescore: async (req, res) => {
        try {

            const { id, win, lose } = req.body
            const sql = "update study_db.User SET win = ?, lose = ? where id = ?"
            const { rows, fields } = await pool.query(sql, [win, lose, id])
            res.json({
                data: rows
            })
        } catch (error) {
            console.log(error)
        }
    },

    updateuser: async (req, res) => {
        try {
            const { name, age, sex } = req.body
            const { id } = req.params
            const sql = "update study_db.User SET name =?, age =? , sex = ?  where id = ? "
            const { rows, fields } = await pool.query(sql, [name, age, sex, id])
            res.json({
                data: rows
            })
        } catch (error) {
            R
            console.log(error)
        }
    },


    // DELETE  -----------------------------------------------------------------------------------------------------
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




}


module.exports = postsController;
