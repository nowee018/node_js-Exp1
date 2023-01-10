const pool = require('../database/index')
const postsController = {
    getUser: async (req, res) => {
        try {
            const [rows, fields] = await pool.query("select * from User")
            res.json({
                data: rows
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

    postGame_name: async (req, res) => {
        try {
            const { game_name } = req.body
            console.log(req.body)
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
    User: async (req, res) => {
        try {
            const { id, age, sex } = req.query
            console.log(id, age, sex);
            const sql = "insert into study_db.User (id, age, sex) values (?, ?, ?)"
            const [rows, fields] = await pool.query(sql, [id, age, sex])
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
    // update: async (req, res) => {
    //     try {
    //         const { game } = req.params
    //         const { id } = req.params
    //         const sql = "update study_db.study_table set game = ? where id = ?"
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


}

module.exports = postsController;
