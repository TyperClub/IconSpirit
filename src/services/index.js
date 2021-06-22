import http from '../utils/index'

const iconList = params => http.get('/api/v1/iconfont/list', params)
const login = query => http.post('/api/v1/login', query)
const logout =  () => http.post('/api/v1/logout')
const getUser = () => http.post('/api/v1/user')

export {
    iconList,
    getUser,
    login,
    logout
}