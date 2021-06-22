export const isEmptyObject = obj => {
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false
      }
    }
    return true
  }
  
  export const filterRouter = (list, perm) => {
    let newData = list.filter(item => !item.meta || (item.meta && !item.meta.auth) || (item.meta && item.meta.auth && perm.includes(item.meta.authKey)))
  
    newData.forEach(item => item.children && (item.children = filterRouter(item.children, perm)))
    return newData
  }
  