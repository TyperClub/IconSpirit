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

export const guid = () =>{
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}