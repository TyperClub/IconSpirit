// service -> user.js
const Service = require('egg').Service

class IconfontSevice extends Service {
    add() {
        // 还没有从数据库里查询
        const mockUsers = [
            { name: 'user1', age: 18, sex: 'girl', job: 'student' },
            { name: 'user2', age: 19, sex: 'girl', job: 'student' },
            { name: 'user3', age: 20, sex: 'boy', job: 'no job' },
        ]

        return Object.assign({}, {
            pageNum: 1,
            pageSize: 10,
            list: mockUsers
        })
    }
}

module.exports = IconfontSevice