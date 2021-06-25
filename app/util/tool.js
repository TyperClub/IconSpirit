
const ArrayDiff = (a,b) =>{
    for (let i = 0; i < b.length; i++) {
        for (let j = 0; j < a.length; j++) {
          if (a[j].id == b[i].id) {
            a.splice(j, 1);
            j = j - 1;
          }
        }
      }
      return a;
}

module.exports = {
    ArrayDiff
};