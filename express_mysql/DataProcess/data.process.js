const pool = require('../database/index')


const dataprocess = {
    UniqueUsers(rows) {
        let Users = new Array();
        for (var i = 0; i < rows.length; i++) {
            /*User들 중 NULL 값이 있을 경우 제거 */
            if (rows[i].name == null || rows[i].sex == null || rows[i].age == null) {
                continue;
            }
            Users.push([rows[i].name, rows[i].sex, rows[i].age])
        }
        /* User들 중복 제거 */
        let UniqueUsers = [];
        let itemsFound = {};
        Users.forEach(function (item, index) {
            var stringUsers = JSON.stringify(item);
            if (itemsFound[item] != true) {
                UniqueUsers.push({ name: item[0], sex: item[1], age: item[2] });
            }
            itemsFound[item] = true;
        });

        return UniqueUsers;
    },


    RankbyGameName(Userrows) {
        for (var i = 0; i < Userrows.length; i++) {
            Userrows[i].ranks = i + 1;
        }
        return Userrows;
    },

    TotalRank(rows) {

    },




}

module.exports = dataprocess;


