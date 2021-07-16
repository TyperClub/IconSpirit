function test(){
     try{
        const pageHtml = await page.$eval('.page-collection-detail-wrap .block-icon-list', (e) => e.outerHTML);
        const groupText = await page.$eval('.block-sub-banner .right-content .title', (e) => e.outerText);
        const authors = await page.$$eval('.block-sub-banner .right-content .content', eles => eles.map(ele => ele.outerText));
        let $ = cheerio.load(pageHtml);
        let data = []

        let CH_Names = []
        $('li').each(async (index,obj) => {
            let CH_Name = getBeforeValidationName($(obj).text())
            CH_Names.push(CH_Name)
        })
        let ENG_Names = await getIconName(CH_Names.join("\/"))
        $('li').each(async (index,obj) => {
            let classNameId = $(obj).attr('class')
            let ENG_Name = ENG_Names[index]
            logger.info(index, authors[1], $(obj).text(), ENG_Name)
            $(obj).find('.icon-twrap svg').removeAttr('style')
            data.push({
                id: classNameId.replace(/\s+/g,''),
                type: "alibaba",
                gurop: groupText,
                author: authors[1],
                CH_Name: $(obj).text(),
                ENG_Name: ENG_Name || 'other',
                createTime: new Date(),
                content: $(obj).find('.icon-twrap').html()
            })
        })
        requestData(data, url)
        await page.waitForTimeout(1000);
        await page.close()
    }catch (error) { 
        logger.error(`open url is error：${error}，url： ${url}`)
        await page.close()
    }
}