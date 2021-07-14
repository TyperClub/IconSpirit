const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const request = require('request')
const rp  = require('request-promise');
const MD5  = require('./md5');

let iconsAddUrl = 'http://127.0.0.1:7001/api/v1/iconfont/add'
if(process.argv[2] === 'fat'){
    iconsAddUrl = 'http://10.111.247.210:8080/api/v1/iconfont/add'
}

async function getIconName(name){// 只有数字
    if(/^[a-zA-Z]+$/.test(name.replace(/[-|_|0-9]+/g, ''))){
        return name.replace(/\s+/g, '').toLowerCase().replace(/(-+|\(|\))$/g,"")
    }
    let nameArr = name.split('-')
    if(nameArr.length > 1){
        nameArr.shift()
    }
    let appid = '20210618000866226';
    let key = 'yGxXuSKiDxaasPC06Wy7';
    let salt = (new Date).getTime();
    name = name.split(',')[0]
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
    let Eg_name = ""
    try {
        let body = JSON.parse(rpbody)
        Eg_name = body.trans_result[0].dst.replace(/\s+/g, '-').toLowerCase()
        Eg_name = Eg_name.replace(/-+/g, '-').replace(/(-+|\(|\))$/g,"")
        Eg_name = Eg_name.replace(/['|\.]+/g, '')
    } catch (error){
        console.log("Get Icon name is error:", error, rpbody)
    }
    return Eg_name
}

function requestData(data, url){
    console.log(`add ${data.length} icon..., url ${url}`)
    request({
        url: iconsAddUrl,
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: data
        })
    }, function (err, response, body) {
        if (body) {
           try {
                let d = JSON.parse(body)
                if(d.code == 1){
                    console.log(`add ${data.length} icon of data successfully, url ${url}`, d.msg)
                }else{
                    console.log('添加失败：', d, `url ${url}`)
                }
           } catch (error) {
               console.log(`添加失败：url ${url}`)
           }
        }else{
            console.log('添加失败', err)
        }
    })
}

const open = async (browser, url, itemIndex) =>{
    let page = await browser.newPage();
    await page.goto(url);
    await page.waitForTimeout(3000*itemIndex);

    try{
        const pageHtml = await page.$eval('.page-collection-detail-wrap .block-icon-list', (e) => e.outerHTML);
        const groupText = await page.$eval('.block-sub-banner .right-content .title', (e) => e.outerText);
        const authors = await page.$$eval('.block-sub-banner .right-content .content', eles => eles.map(ele => ele.outerText));
        let $ = cheerio.load(pageHtml);
        let data = []

        $('li').each(async (index,obj) => {
            setTimeout(async ()=>{
                let classNameId = $(obj).attr('class')
                let ENG_Name = await getIconName($(obj).text())
                console.log(index, authors[1], $(obj).text(), ENG_Name)
                $(obj).find('.icon-twrap svg').removeAttr('style')
                data.push({
                    id: classNameId.replace(/\s+/g,''),
                    type: "alibaba",
                    gurop: groupText,
                    author: authors[1],
                    CH_Name: $(obj).text(),
                    ENG_Name: ENG_Name || '',
                    createTime: new Date(),
                    content: $(obj).find('.icon-twrap').html()
                })
                if(index == $('li').length - 1){
                    requestData(data, url)
                    await page.close()
                }
            }, 200 * index * itemIndex)
        })
    }catch (error) { 
        console.log('open url is error：', error, url)
        await page.close()
    }
}

let pages = 0
async function RunTask(num){
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
 );
 if(num === 1){
    await page.goto(`https://www.iconfont.cn/collections/index?page=1`);
    await page.waitForTimeout(3000);
    pages = await page.$eval('#J_collections_lists .total', (e) => e.textContent.replace(/[^0-9]/ig,""));
 }
 
  try {
    let pageIndex = pages - num + 1
    await page.goto(`https://www.iconfont.cn/collections/index?page=${pageIndex}`);
    await page.waitForTimeout(3000);

    console.log('pages', pages, "pageIndex", pageIndex)

    const aList = await page.$$eval('.page-collections-wrap a',  eles => eles.map(ele => ele.href))
    console.log('aList', aList)
    
    aList.forEach((url,index) => {
        if(/collections\/detail/.test(url)){
            open(browser, url, index+1)
        }
    })
  } catch (error) {
    console.log('page goto is error: ', error)
    await page.close()
    await browser.close();
  }
  
  await page.close()
  // handle a page being closed
  browser.on('targetdestroyed', async target => {
    const openPages = await browser.pages();
    console.log('Open pages:', openPages.length);
    if (openPages.length == 1) {
      console.log('Closing empty browser');
      await browser.close();
      console.log('Browser closed');
      RunTask(++num)
    }
  });
}

RunTask(1)