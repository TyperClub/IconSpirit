import http from '../utils/index'

const iconList = params => http.get('/api/v1/iconfont/list', params)
const generateFont = query => http.post('/api/v1/iconfont/generate', query)
const createProjects = params => http.post('/api/v1/project/create', params)
const getProjects = () => http.get('/api/v1/project/list')
const addProjectIcons = query => http.post('/api/v1/projectIcons/add', query)
const deleteProjectIcons = query => http.post('/api/v1/projectIcons/delete', query)
const login = query => http.post('/api/v1/login', query)
const logout =  () => http.post('/api/v1/logout')
const getUser = () => http.post('/api/v1/user')

export {
    iconList,
    getUser,
    createProjects,
    addProjectIcons,
    deleteProjectIcons,
    getProjects,
    generateFont,
    login,
    logout
}