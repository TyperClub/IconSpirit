import http from '../utils/index'

const iconList = params => http.get(`/api/v1/iconfont/list?_t=${Date.now()}`, params)
const uploadIcon = query => http.post('/api/v1/iconfont/upload', query)
const myUploadIcons = query => http.post(`/api/v1/iconfont/myupload`, query)
const generateFont = query => http.post('/api/v1/iconfont/generate', query)
const fontTransfer = query => http.post('/api/v1/iconfont/fontTransfer', query)
const downloadCssFile = params => http.get(`/api/v1/iconfont/fontCss/download?_t=${Date.now()}`, params)
const deleteIcons = query => http.post(`/api/v1/iconfont/delete`, query)
const editIcons = query => http.post("/api/v1/iconfont/edit", query)
const publicIcons = query => http.post("/api/v1/iconfont/public", query)

const createProjects = params => http.post('/api/v1/project/create', params)
const editProjects = params => http.post('/api/v1/project/edit', params)
const createIconsAndProjects = query => http.post('/api/v1/project/icons/create', query)
const deleteProjects = params => http.post('/api/v1/project/delete', params)
const recoveryProjects = params => http.post('/api/v1/project/recovery', params)
const getProjects = () => http.get(`/api/v1/project/list?_t=${Date.now()}`)
const addProjectIcons = query => http.post('/api/v1/projectIcons/add', query)
const editProjectIcons = query => http.post('/api/v1/projectIcons/edit', query)
const deleteProjectIcons = query => http.post('/api/v1/projectIcons/delete', query)

const login = query => http.post('/api/v1/login', query)
const logout =  () => http.post('/api/v1/logout')
const getUser = () => http.post('/api/v1/user')
const queryUser = (query) => http.post('/api/v1/user/query', query)

const addprojectParticipants = query => http.post('/api/v1/projectParticipants/add', query)
const deleteProjectParticipants = query => http.post('/api/v1/projectParticipants/delete', query) 
const projectParticipantsList = query => http.post('/api/v1/projectParticipants/list', query) 


const getProjectsHistory =  params => http.get(`/api/v1/history/list?_t=${Date.now()}`, params)
const getLatelyHistory =  params => http.get(`/api/v1/history/lately?_t=${Date.now()}`, params)


export {
    downloadCssFile,
    iconList,
    myUploadIcons,
    deleteIcons,
    editIcons,
    publicIcons,
    uploadIcon,
    getUser,
    queryUser,
    createProjects,
    editProjects,
    createIconsAndProjects,
    deleteProjects,
    recoveryProjects,
    addProjectIcons,
    editProjectIcons,
    deleteProjectIcons,
    addprojectParticipants,
    deleteProjectParticipants,
    projectParticipantsList,
    getProjects,
    generateFont,
    fontTransfer,
    getProjectsHistory,
    getLatelyHistory,
    login,
    logout
}