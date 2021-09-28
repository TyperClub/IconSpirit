const consulStatus = false

const {execSync} = require('child_process')
const path = require('path')

if(consulStatus){
    let result = execSync(`node ${path.resolve(__dirname, './consul.js')}`)
    if(!result) console.error("consul request was failure...")
    result = JSON.parse(result.toString())
}else{
    result = {
        oss: {
            local: {
                website: "",
                region: "",
                accessKeyId: "",
                accessKeySecret: "",
                bucket: "",
                cname: true,
                path: ""
            }
        }
    }
}

module.exports.consulConfig = result