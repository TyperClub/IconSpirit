import http from '../utils/index'

const iconList = params => http.get('/api/v1/iconfont/list', params)

export {
    iconList
}