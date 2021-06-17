const puppeteer = require('puppeteer');
const cheerio = require("cheerio");


const open = async (browser, url) =>{
    let page = await browser.newPage();
    await page.goto(url);
    await page.waitForTimeout(2000);

    try{
        const pageHtml = await page.$eval('.page-collection-detail-wrap .block-icon-list', (e) => e.outerHTML);
        var $ = cheerio.load(pageHtml);
        let data = []
        $('li').each((index,obj) => {
            data.push({
                id:  $(obj).attr('class'),
                gurop: "alibaba",
                CH_Name: $(obj).text(),
                ENG_Name: "",
                createTime: new Date(),
                content: $(obj).find('.icon-twrap').html()
            })
        })
        postData(data)
    }catch (error) { 
        console.log('open url is error：', error)
    }

    await browser.close();
}

function postData(data){
    console.log(data)
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

    open(browser, aList[0])
  } catch (error) { 
    console.log(11, error)
    await browser.close();
  }
})();