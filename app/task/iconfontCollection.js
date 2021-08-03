const request = require('request')
const rp  = require('request-promise');
const Host = "http://10.111.247.210:8080"
const Host1 = "http://127.0.0.1:7001"
const iconsList = `${Host}/api/v1/iconfont/list?pageNum=1&pageSize=9&type=1`
const iconsCreate = `${Host}/api/v1/iconfontCollection/create`

request({
    url: iconsList,
    method:'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    // body: JSON.stringify({
    //     data: data
    // })
}, function (err, response, body) {
    if (body) {
       try {
            let d = JSON.parse(body)
            request({
                url: iconsCreate,
                method:'POST',
                timeout: 20000000,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: d.data
                })
            }, function(err, response, body){
                console.log(1121, err, body)
            })
       }catch(e){
        console.log(e)
       }
    }
})