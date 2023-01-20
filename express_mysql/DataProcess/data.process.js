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


    RankbyGameName(rows, game_name) {


        let RankbyGameName = new Array();
        var Rank = 0;

        for (var i = 0; i < rows.length; i++) {
            /*User들 중 NULL 값이 있을 경우 제거 */
            if (rows[i].name == null || rows[i].sex == null || rows[i].age == null || rows[i].win == null || rows[i].lose == null) {
                continue;
            }
         RankbyGameName.push({ id: rows[i].id, name: rows[i].name, sex: rows[i].sex, age: rows[i].age, win: rows[i].win, lose: rows[i].lose, rank: Rank += 1, game_name: game_name })
        }
        return RankbyGameName;
       },



    TotalRank(rows) {
        let RemoveDuplicate= new Array();
        for (var i = 0; i < rows.length; i++) {
            /*User들 중 NULL 값이 있을 경우 제거 */
            if (rows[i].name == null || rows[i].sex == null || rows[i].age == null || rows[i].win == null || rows[i].lose == null) {
                continue;
            }
            RemoveDuplicate.push([rows[i].id, rows[i].name, rows[i].sex, rows[i].age, rows[i].game_id, rows[i].win, rows[i].lose, rows[i].sum])
        }


        /*User 정보에 있는 win들 모두 다 합치기 */
        /* 예외 처리 win, lose null 값 */

        let sumArr = [];
        let itemsFound= {};
        RemoveDuplicate.forEach(function (item, index) {
            var stringUsers = JSON.stringify(item[1]);
            if (itemsFound[stringUsers] != true) { /* user들 정보중 username, sex, age가 같은 정보 찾기 */
                sumArr[stringUsers] = [ item[0], item[1], item[2], item[3], item[4], item[5], item[6], item[7]] ;
            
            } else {

                sumArr[stringUsers][5] += item[5]; /*win 합치기 */
                sumArr[stringUsers][6] += item[6]; /*lose 합치기 */
                sumArr[stringUsers][7] += item[7]; /*sum 합치기 */

            }
            
            itemsFound[stringUsers] = true;

        });

        sumArr = Object.values(sumArr); // 배열로 변환
    
        /*내림차순 정렬*/
        sumArr.sort((a,b)=>{
            return b[5] - a[5];
        })

        /*동점자 처리일 경우 sum합계로 비교*/
        sumArr.sort((a,b)=>{
            if (b[5] === a[5]){
                return b[7] - a[7]
            }
        })
        
        // 중복자 제거, 순위 제거 한 배열 딕셔너리 형태로 저장해서 반환 
        var Rank = 0;
        let TotalRank= new Array();
        sumArr.forEach(function(item,index){
            TotalRank.push({"id" : item[0], "name" : item[1], "sex":item[2], "age":item[3],"win" :item[5], "lose" : item[6] , "sum" : item[7], "rank" : Rank+=1})
        })

        
        return TotalRank

    },

    UpdateWinorLose: async (user1, user2, user1_score, user2_score) => {
        const sql = "update study_db.User SET  win = ?, lose = ?, sum = ? where id = ?"

        /* NULL 일경우 0,0 으로 초기화 */
        if ((user1[0]["win"] == null) || (user1[0]["lose"] == null)) {
            const [user1_reset,] = await pool.query(sql, [0, 0, 0, user1[0]["id"]])
        }
        if ((user2[0]["win"] == null) || (!user2[0]["lose"] == null)) {
            const [user2_reset,] = await pool.query(sql, [0, 0, 0, user2[0]["id"]])
        }

        const sql_win = "update study_db.User SET  win = ?, sum = ? where id = ?"
        const sql_lose = "update study_db.User SET  lose= ?, sum = ? where id = ?"
        const sql_same = "update study_db.User SET  sum = ? where id = ?"

        if (user1_score > user2_score) {
            user1[0]["win"] += 1
            user2[0]["lose"] += 1
            user1[0]["sum"] += 1
            user2[0]["sum"] += 1
            const { user1_win, } = await pool.query(sql_win, [user1[0]["win"], user1[0]["sum"], user1[0]["id"]])
            const { user2_lose, } = await pool.query(sql_lose, [user2[0]["lose"], user2[0]["sum"], user2[0]["id"]])

        } else if (user1_score < user2_score) {
            user1[0]["lose"] += 1
            user2[0]["win"] += 1
            user1[0]["sum"] += 1
            user2[0]["sum"] += 1
            const { user1_lose, } = await pool.query(sql_lose, [user1[0]["lose"], user1[0]["sum"], user1[0]["id"]])
            const { user2_win, } = await pool.query(sql_win, [user2[0]["win"], user2[0]["sum"], user2[0]["id"]])

        } else {
            // 동점 일 경우 
            user1[0]["sum"] += 1
            user2[0]["sum"] += 1
            const { user1_same, } = await pool.query(sql_same, [user1[0]["sum"], user1[0]["id"]])
            const { user2_same, } = await pool.query(sql_same, [user2[0]["sum"], user2[0]["id"]])
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
        const user_update_select = await pool.query("select id, win, lose, sum from User where name = ? and game_id = ? ", [user_name, game_id])

        return user_update_select;

    },

    UserbyGameName: async (rows) => {
        //console.log("들어가기 성공", user_name, game_id);
        const sleep = ms => new Promise(res => setTimeout(res, ms));
        let User = [];
        for (var i = rows.length-1; i > 0; i--){
            //console.log(rows)
            let [user1,] = await pool.query("select name from User where id = ?", rows[i]["user_ID1"])
            let [user2,] = await pool.query("select name from User where id = ?", rows[i]["user_ID2"])
         
            
            /*빈 배열이라면 */
            if (!(user1[0]) || !(user2[0]) ){
                continue;
            }else{
                //console.log(user1[0].name, rows[i].score1, user2[0].name, rows[i].score2,rows[i].date)
                User.push({"Score_Table_Id":rows[i].id, "user1" : user1[0].name, "user1_score" : rows[i].score1, "user2" : user2[0].name, "user2_score" : rows[i].score2, "date" : rows[i].date})
            }
            

        
        }
        //console.log(User)
        return User;

    },









}

module.exports = dataprocess;


