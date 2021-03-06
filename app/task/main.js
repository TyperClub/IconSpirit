const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const request = require('request')
const rp  = require('request-promise');
const MD5  = require('./md5');
const log4js = require('./log');
const shell = require('shelljs');
const puppeteerPool = require('../util/puppeteer-pool');


const logger = log4js.getLogger();

let iconsAddUrl = 'http://127.0.0.1:7001/api/v1/iconfont/add'
if(process.argv[2] === 'fat'){
    iconsAddUrl = 'http://10.111.247.210:8080/api/v1/iconfont/add'
}

function getBeforeValidationName(name){
    if(/^[a-zA-Z]+$/.test(name.replace(/[-|_|0-9|\s]+/g, ''))){
        return name.replace(/\s+/g, '').toLowerCase().replace(/(-+|\(|\))$/g,"")
    }
    let nameArr = name.split('-')
    if(nameArr.length > 1){
        nameArr.shift()
    }
    return name.split(',')[0]
}

function getAfterVerification(Eg_name){
    Eg_name = Eg_name.replace(/(^\s*)|(\s*$)/g, '') //去掉前后空格
    Eg_name = Eg_name.replace(/\s+/g, '-').toLowerCase()         //转小写，转 - 拼接
    Eg_name = Eg_name.replace(/-+/g, '-').replace(/(-+|\(|\))$/g,"")
    Eg_name = Eg_name.replace(/['|\.|\&|\[|\]|\(|\)|_|,]+/g, '')
    Eg_name = /^-/.test(Eg_name) ? Eg_name.substr(1,Eg_name.length-1) : Eg_name

    let Eg_names = Eg_name.split('-')
    while(Eg_names.length > 3){
        Eg_names.shift()
    }
    Eg_name = Eg_names.join('-')
    return Eg_name
}

async function getIconName(name){
    let appid = '20210618000866226';
    let key = 'yGxXuSKiDxaasPC06Wy7';
    let salt = (new Date).getTime();
    let query = name;
    // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
    let from = 'zh';
    let to = 'en';
    let str1 = appid + query + salt +key;
    let sign = MD5(str1);
    let rpbody = await rp({
        uri: `http://api.fanyi.baidu.com/api/trans/vip/translate`,
        method:'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
            'Content-Type': 'application/json'
        },
        qs: {
            q: query,
            appid: appid,
            salt: salt,
            from: from,
            to: to,
            sign: sign
        }
    });
    let Eg_names = []
    try {
        let body = JSON.parse(rpbody)
        let nameArr = body.trans_result[0].dst.split("/")
        nameArr.forEach(obj => {
            Eg_names.push(getAfterVerification(obj))
        });
    } catch (error){
        logger.error(`Get Icon name is error: ${error}，rpbody: ${rpbody}，name: ${name}`)
    }
    return Eg_names
}

function requestData(data, url, parameter, env){
    logger.info(`add ${data.length} icon..., url ${url}`)
    request({
        url: env === 'fat' ? 'http://10.111.247.210:8080/api/v1/iconfont/add' : iconsAddUrl,
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: data,
            ...parameter
        })
    }, function (err, response, body) {
        if (body) {
           try {
                let d = JSON.parse(body)
                if(d.code == 1){
                    if(d.msg === "重复添加"){
                        logger.info(`add ${data.length} icon of data successfully, url ${url}，返回：${d.msg}，data: ${JSON.stringify({
                            data: {
                                id: data[0].id,
                                gurop: data[0].gurop,
                                CH_Name: data[0].CH_Name
                            }
                        })}`)
                    }else{
                        logger.info(`add ${data.length} icon of data successfully, url ${url}，返回：${d.msg}`)
                    }
                }else{
                    logger.error(`添加失败，返回参数：${body} url：${url}`)
                }
           } catch (error) {
                logger.error(`添加失败：${error} url： ${url}`)
           }
        }else{
            logger.error(`添加失败：${err}`)
        }
    })
}

class RunTask {
    pages = 0
    iconColorType = 3
    async main(num, iconColorType, pageCount){
        const browser = await puppeteer.launch({
            headless: process.argv[2] === 'fat'? true: false,
            args: [
                '--proxy-server=http://101.89.158.216:28100',
                '--ignore-certificate-errors',
                '--ignore-certificate-errors-spki-list',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage'
            ]
        });
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);//将浏览器响应时间改为无限长,默认为30秒
      await page.authenticate({
        username: "p307",
        password: "p3071",
      });
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
     );
     this.iconColorType = iconColorType
     if(num === 1){
        if(pageCount){//指定页数
            this.pages = pageCount 
        }else{
            await page.goto(`https://www.iconfont.cn/collections/index?page=1&type=${iconColorType}`, {
                waitUntil: 'networkidle0'
            });
            await page.waitForTimeout(3000);
            this.pages = await page.$eval('#J_collections_lists .total', (e) => e.textContent.replace(/[^0-9]/ig,""));
        }
     }
     
      try {
        if(pageCount) this.pages = pageCount
        let pageIndex = this.pages - num + 1
        await page.goto(`https://www.iconfont.cn/collections/index?page=${pageIndex}&type=${iconColorType}`, {
            waitUntil: 'networkidle0'
        });
        await page.waitForTimeout(3000);
    
        logger.info(`pages：${this.pages}，pageIndex：${pageIndex}，iconColorType：${iconColorType}`)
    
        const aList = await page.$$eval('.page-collections-wrap a',  eles => eles.map(ele => ele.href))
        logger.info('aList：', aList, `iconColorType：${iconColorType}`)
        
        aList.forEach((url,index) => {
            if(/collections\/detail/.test(url)){
                this.open(browser, url, index + 1)
            }
        })
    
        await page.close()
        if(aList.length === 0 && pageIndex > 0){
            await browser.close();
            logger.info(`继续查询：https://www.iconfont.cn/collections/index?page=${pageIndex}&type=${iconColorType}`);
            new RunTask().main(num, iconColorType, this.pages)
            return
        }
      } catch (error) {
        logger.error(`page goto is error: ${error}`)
        await page.close()
        await browser.close();
      }
      
      browser.on('targetdestroyed', async target => {
        const openPages = await browser.pages();
        let pageList = []
        openPages.forEach(item => {
            pageList.push(item.url())
        })
        logger.info('targetdestroyed event，Open pages:', openPages.length, pageList);
        if (openPages.length == 1) {
          logger.info('Closing empty browser');
          await browser.close();
          logger.info('Browser closed');
          if(this.pages === 0 && iconColorType == 2){
              if(this.pages === 0 && iconColorType == 4){
                await browser.close();
              }else{
                new RunTask().main(1,4)
              }
          }else{
            new RunTask().main(++num, iconColorType, this.pages)
          }
        }
      });
    }

    async queryName(num, queryName, env){
        
     
      try {
        // const browser = await puppeteer.launch({
        //     headless: process.argv[2] === 'fat'? true: false,
        //     args: [
        //         // '--proxy-server=http://101.89.158.216:28100',
        //         '--ignore-certificate-errors',
        //         '--ignore-certificate-errors-spki-list',
        //         '--no-sandbox',
        //         '--single-process',
        //         '--no-zygote',
        //         '--disable-setuid-sandbox',
        //         '--disable-gpu',
        //         '--disable-dev-shm-usage'
        //     ]
        // });

        puppeteerPool().use(async(instance) => {
            const page = await instance.use()
            // await page.goto("http://www.baidu.com")
            logger.info(`open https://www.iconfont.cn/search/index?page=1&q=${queryName}`)
            await this.openQuery(page, `https://www.iconfont.cn/search/index?page=1&q=${queryName}`, 1, env)
        })

        

        // browser.on('targetdestroyed', async target => {
        //     const openPages = await browser.pages();
        //     let pageList = []
        //     openPages.forEach(item => {
        //         pageList.push(item.url())
        //     })
        //     logger.info('targetdestroyed event，Open pages:', openPages.length, pageList);
        //     if (openPages.length == 1) {
        //       logger.info('Closing empty browser');
        //       await browser.close();
        //       logger.info('Browser closed');
        //       new RunTask().queryName(++num, queryName)
        //     }
        //   });
      } catch (error) {
        console.log(`page goto is error: ${error}`)
        logger.error(`page goto is error: ${error}`)
      }
    }

    async openQuery (page, url, itemIndex, env){
        // let page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
        );
        await page._client.send('Network.enable', {
            maxResourceBufferSize: 1024 * 1024 * 150, // 150Mb
            maxTotalBufferSize: 1024 * 1024 * 300, // 300mb
        })
        await page.setDefaultNavigationTimeout(0);//将浏览器响应时间改为无限长,默认为30秒

        let results = {} // collects all results

        let paused = false;
        let pausedRequests = [];

        const nextRequest = () => { // continue the next request or "unpause"
            if (pausedRequests.length === 0) {
                paused = false;
            } else {
                // continue first request in "queue"
                (pausedRequests.shift())(); // calls the request.continue function
            }
        };

        await page.setRequestInterception(true);
        page.on('request', request => {
            if (paused) {
                pausedRequests.push(() => request.continue());
            } else {
                paused = true; // pause, as we are processing a request now
                request.continue();
            }
        });

        page.on('requestfinished', async (request) => {
            if(/https:\/\/www.iconfont.cn\/api\/icon\/search\.json/.test(request.url())){
                const response = await request.response();
                let responseBody;
                if (request.redirectChain().length === 0) {
                    // body can only be access for non-redirect responses
                    responseBody = await response.json();
                }
                results = {
                    url: request.url(),
                    responseBody,
                };
            }
            nextRequest(); // continue with next request
        });
        page.on('requestfailed', (request) => {
            // handle failed request
            nextRequest();
        });


        await page.goto(url, {
            waitUntil: 'networkidle0'
        })
        await page.waitForTimeout(3000*itemIndex);
        if(results.responseBody && results.responseBody.code == 200){
            let res = results.responseBody.data
            let data = []
            let CH_Names = []
            for(let index in res.icons){
                let obj = res.icons[index]
                let CH_Name = getBeforeValidationName(obj.name)
                CH_Names.push(CH_Name)
            }
            
            for(let index in res.icons){
                let obj = res.icons[index]
                let $ = cheerio.load(obj.show_svg);
                let content = $("svg").removeAttr('style').prop("outerHTML");
                // let ENG_Name = ENG_Names[index]
                logger.info(index, obj.name)
                let item = {
                    id: `J_icon_id_${obj.id}`,
                    type: "alibaba",
                    gurop: "alibaba",
                    guropType: "3",
                    author: "alibaba",
                    CH_Name: obj.name,
                    ENG_Name: obj.font_class || 'other',
                    unicodeAlibaba: obj.unicode,
                    slug: obj.slug,
                    iconColorType: this.iconColorType,
                    createTime: new Date(),
                    content: content
                }
                data.push(item)
            }
            requestData(data, url, {type: 1}, env)
        }else{
            logger.error(`获取失败 results： ${results} url：${url}`)
        }
        
        await page.waitForTimeout(1000);
        await page.close()
        shell.exec('pkill chrome')
    }

    async open (browser, url, itemIndex){
        let page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
        );
        await page._client.send('Network.enable', {
            maxResourceBufferSize: 1024 * 1024 * 150, // 150Mb
            maxTotalBufferSize: 1024 * 1024 * 300, // 300mb
        })
        await page.setDefaultNavigationTimeout(0);//将浏览器响应时间改为无限长,默认为30秒

        let results = {} // collects all results

        let paused = false;
        let pausedRequests = [];

        const nextRequest = () => { // continue the next request or "unpause"
            if (pausedRequests.length === 0) {
                paused = false;
            } else {
                // continue first request in "queue"
                (pausedRequests.shift())(); // calls the request.continue function
            }
        };

        await page.setRequestInterception(true);
        page.on('request', request => {
            if (paused) {
                pausedRequests.push(() => request.continue());
            } else {
                paused = true; // pause, as we are processing a request now
                request.continue();
            }
        });

        page.on('requestfinished', async (request) => {
            if(/https:\/\/www.iconfont.cn\/api\/collection\/detail\.json/.test(request.url())){
                const response = await request.response();
                let responseBody;
                if (request.redirectChain().length === 0) {
                    // body can only be access for non-redirect responses
                    responseBody = await response.json();
                }
                results = {
                    url: request.url(),
                    responseBody,
                };
            }
            nextRequest(); // continue with next request
        });
        page.on('requestfailed', (request) => {
            // handle failed request
            nextRequest();
        });


        await page.goto(url, {
            waitUntil: 'networkidle0'
        })
        await page.waitForTimeout(3000*itemIndex);
        if(results.responseBody && results.responseBody.code == 200){
            let res = results.responseBody.data
            let data = []
            let CH_Names = []
            for(let index in res.icons){
                let obj = res.icons[index]
                let CH_Name = getBeforeValidationName(obj.name)
                CH_Names.push(CH_Name)
            }
            // let ENG_Names = await getIconName(CH_Names.join("\/"))
            // if(!ENG_Names.length){
            //     logger.error("获取 ENG_Names 获取失败，第二次进行重试")
            //     ENG_Names = await getIconName(CH_Names.join("\/"))
            // }
            for(let index in res.icons){
                let obj = res.icons[index]
                let $ = cheerio.load(obj.show_svg);
                let content = $("svg").removeAttr('style').prop("outerHTML");
                // let ENG_Name = ENG_Names[index]
                let ENG_Name = "other"
                logger.info(index, `iconColorType：${this.iconColorType}`, res.creator.nickname, obj.name, ENG_Name)
                let item = {
                    id: `J_icon_id_${obj.id}`,
                    type: "alibaba",
                    gurop: res.collection.name,
                    guropType: "2",
                    author: res.creator.nickname,
                    CH_Name: obj.name,
                    ENG_Name: ENG_Name || 'other',
                    unicodeAlibaba: obj.unicode,
                    description: res.collection.description,
                    slug: res.collection.slug,
                    collectionId: res.collection.id,
                    tag_ids: res.collection.tag_ids,
                    iconColorType: this.iconColorType,
                    createTime: new Date(),
                    content: content
                }
                data.push(item)
            }
            requestData(data, url)
        }else{
            logger.error(`获取失败 results： ${results} url：${url}`)
        }
        
        await page.waitForTimeout(1000);
        await page.close()
    }
}

// new RunTask().main(1,4,383)
// let arguments = process.argv.splice(2)
// if(arguments.length){
//     logger.info(`执行 RunTask queryName ${arguments}`)
//     new RunTask().queryName(1, arguments[1])
// }

module.exports = RunTask