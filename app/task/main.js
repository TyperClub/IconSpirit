const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const request = require('request')

const open = async (browser, url) =>{
    let page = await browser.newPage();
    await page.goto(url);
    await page.waitForTimeout(3000);

    try{
        const pageHtml = await page.$eval('.page-collection-detail-wrap .block-icon-list', (e) => e.outerHTML);
        const groupText = await page.$eval('.block-sub-banner .right-content .title', (e) => e.outerText);
        let $ = cheerio.load(pageHtml);
        let data = []
        $('li').each((index,obj) => {
            data.push({
                id:  $(obj).attr('class'),
                type: "alibaba",
                gurop: groupText,
                CH_Name: $(obj).text(),
                ENG_Name: "",
                createTime: new Date(),
                content: $(obj).find('.icon-twrap').html()
            })
        })
        requestData(data, url)
    }catch (error) { 
        console.log('open url is error：', error)
    }
    await page.close()
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
                let data = JSON.parse(body)
                if(data.code == 1){
                    console.log(`add ${data.length} icon of data successfully, url ${url}`)
                }else{
                    console.log('添加失败：', data, `url ${url}`)
                }
           } catch (error) {
               console.log(`添加失败：url ${url}`)
           }
        }else{
            console.log('添加失败', err)
        }
    })
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'
 );
  await page.goto('https://www.iconfont.cn/collections/index');
  await page.waitForTimeout(2000);
  try {
    const pages = await page.$eval('#J_collections_lists .total', (e) => e.textContent.replace(/[^0-9]/ig,""));
    const aList = await page.$$eval('.page-collections-wrap a',  eles => eles.map(ele => ele.href))
    console.log('pages', pages)
    console.log('aList', aList)
    
    aList.forEach(url => {
        open(browser, url)
    })
    // open(browser, aList[0])
  } catch (error) {
    console.log(11, error)
    await page.close()
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