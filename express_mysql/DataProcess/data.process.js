const pool = require('../database/index')


const dataprocess = {
    UniqueUsers(rows) {
        let Users = new Array();
        for (var i = 0; i < rows.length; i++) {
            /*User들 중 NULL 값이 있을 경우 제거 */
            if (rows[i].name == null || rows[i].age == null || rows[i].sex == null) {
                continue;
            }
            Users.push([rows[i].id, rows[i].name, rows[i].age, rows[i].sex])
        }
        /* User들 중복 제거 */
        let UniqueUsers = [];
        let itemsFound = {};
        Users.forEach(function (item, index) {
            var stringUsers = JSON.stringify(item.slice(1, 4));
            if (itemsFound[stringUsers] != true) {
                UniqueUsers.push({ id: item[0], name: item[1], sex: item[2], age: item[3] });
            }
            itemsFound[stringUsers] = true;
        });


        return UniqueUsers;
    },

    UniqueGame(rows) {
        let Game = new Array();
        for (var i = 0; i < rows.length; i++) {
            /*User들 중 NULL 값이 있을 경우 제거 */
            if (rows[i].game_name == null) {
                continue;
            }
            Game.push(rows[i]);
        }
        return Game
    },


    RankbyGameName(Userrows) {
        for (var i = 0; i < Userrows.length; i++) {
            Userrows[i].ranks = i + 1;
        }
        return Userrows;
    },

    TotalRank(rows) {
        let Users = new Array();
        for (var i = 0; i < rows.length; i++) {
            /*User들 중 NULL 값이 있을 경우 제거 */
            if (rows[i].name == null || rows[i].sex == null || rows[i].age == null || rows[i].win == null || rows[i].lose == null) {
                continue;
            }
            Users.push([rows[i].id, rows[i].name, rows[i].sex, rows[i].age, rows[i].game_id, rows[i].win, rows[i].lose])
        }


        /*User 정보에 있는 win들 모두 다 합치기 */
        /* 예외 처리 win, lose null 값 */

        let resultArr = [];
        let itemsFound2 = {};
        Users.forEach(function (item, index) {
            var stringUsers = JSON.stringify(item.slice(1, 4));
            if (itemsFound2[stringUsers] != true) { /* user들 정보중 name, sex, age 인 같은 정보 찾기 */
                resultArr[stringUsers] = { id: item[0], name: item[1], sex: item[2], age: item[3], win: item[5], lose: item[6] };
            } else {

                resultArr[stringUsers].win += item[5];
                resultArr[stringUsers].lose += item[6];

            }
            itemsFound2[stringUsers] = true;

        });

        resultArr = Object.values(resultArr);

        return resultArr

    },

    UpdateWinorLose: async (user1, user2, user1_score, user2_score) => {
        const sql = "update study_db.User SET  win = ?, lose = ? where id = ?"

        /* NULL 일경우 0,0 으로 초기화 */
        if ((!user1[0]["win"]) || (!user1[0]["lose"])) {
            const [user1_reset,] = await pool.query(sql, [0, 0, user1[0]["id"]])
        }
        if ((!user2[0]["win"]) || (!user2[0]["lose"])) {
            const [user2_reset,] = await pool.query(sql, [0, 0, user2[0]["id"]])
        }

        const sql_win = "update study_db.User SET  win = ? where id = ?"
        const sql_lose = "update study_db.User SET  lose= ? where id = ?"

        if (user1_score > user2_score) {
            user1[0]["win"] += 1
            user2[0]["lose"] += 1
            const { user1_win, } = await pool.query(sql_win, [user1[0]["win"], user1[0]["id"]])
            const { user2_lose, } = await pool.query(sql_lose, [user2[0]["lose"], user2[0]["id"]])

        } else if (user1_score < user2_score) {
            user1[0]["lose"] += 1
            user2[0]["win"] += 1
            const { user1_lose, } = await pool.query(sql_lose, [user1[0]["lose"], user1[0]["id"]])
            const { user2_win, } = await pool.query(sql_win, [user2[0]["win"], user2[0]["id"]])

        }

    },



    /*빈 배열인지 확인하는 코드 */
    isEmptyArr(arr) {
        //console.log(arr);
        if (Array.isArray(arr) && arr.length === 0) {
            return true;
        }

        return false;
    },

    /*User 테이블에 해당 정보가 없을 경우 User 정보 넣기 */


    InsertandSelectUser: async (user_name, game_id) => {
        //console.log("들어가기 성공", user_name, game_id);

        const sleep = ms => new Promise(res => setTimeout(res, ms));
        let [User,] = await pool.query("select * from User where name = ? ", [user_name])

        let sql = "insert into study_db.User (name, sex, age, game_id) values (?, ?, ?, ?)"
        const [user_update,] = await pool.query(sql, [user_name, User[0]["sex"], User[0]["age"], game_id])
        await sleep(500);
        const user_update_select = await pool.query("select id, win, lose from User where name = ? and game_id = ? ", [user_name, game_id])

        return user_update_select;

    }









}

module.exports = dataprocess;


