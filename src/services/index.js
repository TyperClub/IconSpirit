import http from '../utils/index'

const iconList = params => http.get('/api/v1/iconfont/list', params)
const generateFont = query => http.post('/api/v1/iconfont/generate', query)
const fontTransfer = query => http.post('/api/v1/iconfont/fontTransfer', query)
const createProjects = params => http.post('/api/v1/project/create', params)
const deleteProjects = params => http.post('/api/v1/project/delete', params)
const getProjects = () => http.get('/api/v1/project/list')
const addProjectIcons = query => http.post('/api/v1/projectIcons/add', query)
const deleteProjectIcons = query => http.post('/api/v1/projectIcons/delete', query)
const login = query => http.post('/api/v1/login', query)
const logout =  () => http.post('/api/v1/logout')
const getUser = () => http.post('/api/v1/user')
const queryUser = (query) => http.post('/api/v1/user/query', query)
const addprojectParticipants = query => http.post('/api/v1/projectParticipants/add', query)
const deleteProjectParticipants = query => http.post('/api/v1/projectParticipants/delete', query) 
const projectParticipantsList = query => http.post('/api/v1/projectParticipants/list', query) 

export {
    iconList,
    getUser,
    queryUser,
    createProjects,
    deleteProjects,
    addProjectIcons,
    deleteProjectIcons,
    addprojectParticipants,
    deleteProjectParticipants,
    projectParticipantsList,
    getProjects,
    generateFont,
    fontTransfer,
    login,
    logout
}