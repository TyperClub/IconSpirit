const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const request = require('request')
const rp  = require('request-promise');

async function getIconName(id){
    let rpbody = await rp({
        uri: `https://www.iconfont.cn/api/icon/iconInfo.json?id=${id}`,
        method:'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
            'Content-Type': 'application/json'
        }
    });
    let data = {}
    try {
        let body = JSON.parse(rpbody)
        if(body.code == 200){
            data = body.data
        }else{
            console.log("Get Icon name is error", body)
        }
    } catch (error){
        console.log("Get Icon name is error: 无权限访问")
    }
    return data
}

function requestData(data, url){
    console.log(`add ${data.length} icon..., url ${url}`)
    request({
        url: "http://127.0.0.1:7001/api/v1/iconfont/add",
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
                    console.log(`add ${data.length} icon of data successfully, url ${url}`)
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
        let $ = cheerio.load(pageHtml);
        let data = []

        $('li').each(async (index,obj) => {
            // setTimeout(async ()=>{
                let classNameId = $(obj).attr('class')
                let id = classNameId.replace(/[^0-9]/ig,"")
                let iconData = {} //await getIconName(id)
                // console.log("index", index, iconData.font_class)
                data.push({
                    id: classNameId,
                    type: "alibaba",
                    gurop: groupText,
                    CH_Name: $(obj).text(),
                    ENG_Name: iconData.font_class || '',
                    createTime: new Date(),
                    content: $(obj).find('.icon-twrap').html()
                })
                if(index == $('li').length - 1){
                    requestData(data, url)
                    await page.close()
                }
            // }, 2200 * index * itemIndex + Math.ceil(Math.random()*1000))
        })
    }catch (error) { 
        console.log('open url is error：', error)
        await page.close()
    }
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
 );
  await page.goto('https://www.iconfont.cn/collections/index?page=2');
  await page.waitForTimeout(3000);
  try {
    const pages = await page.$eval('#J_collections_lists .total', (e) => e.textContent.replace(/[^0-9]/ig,""));
    const aList = await page.$$eval('.page-collections-wrap a',  eles => eles.map(ele => ele.href))
    console.log('pages', pages)
    console.log('aList', aList)
    
    aList.forEach((url,index) => {
        open(browser, url, index+1)
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
    }
  });
})();