const pool = require('../database/index')
const dataprocess = require("../DataProcess/data.process")


const putsController = {
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

}



module.exports = putsController;