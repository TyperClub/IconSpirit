const config = require('../config/oss_config');
const FontCarrier = require('font-carrier')
const request = require('request')
const rp  = require('request-promise');
const { insertStr, hex2int } = require('./tool')

const InitCssStyle = (fontFamily, fontFamilyPath) =>{
    return [`
@font-face {
    font-family: '${fontFamily}';
    src: url('${config.website}${fontFamilyPath}.eot'); /* IE9 */
    src: url('${config.website}${fontFamilyPath}.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('${config.website}${fontFamilyPath}.woff') format('woff2'),
    url('${config.website}${fontFamilyPath}.woff') format('woff'), /* chrome、firefox */
    url('${config.website}${fontFamilyPath}.svg#iconfont') format('svg'); /* iOS 4.1- */
}
.${fontFamily} {
    font-family: "${fontFamily}";
    font-size: 16px;
    font-style: normal;
}
`]
}

const addItemStyle = (className, unicode16) =>{
    return `
.${className}:before {
    content: "\\${unicode16}";
}
`
}

const transfer = async (cssUrl) =>{
    let iconList = []
    let cssStyle = await rp({
        uri: cssUrl,
        method:'GET',
    });
    cssStyle.replace(/\.([^:^ ]+):[\s\S]+?content: "\\([^"]+)";/gi, (...item) => {
        iconList.push({
            name: item[1],
            unicode: `&#${item[2]};`,
        })
    })

    let fontUrl = cssUrl.replace(/\.css/, '.ttf')
    let response = await rp({
        uri: fontUrl,
        method:'GET',
        encoding: "binary",
    });
    let buffer = Buffer.from(response, 'binary');
    let transFont = FontCarrier.transfer(buffer)

    let iconListSvg = []
    for(let index in iconList){
        let item = iconList[index]
        let unicode10 = hex2int(item.unicode.replace(/&#|;/g, ''))
        let unicode = insertStr(item.unicode, 2, 'x')
        iconListSvg.push({
            CH_Name: item.name,
            ENG_Name: item.name,
            content: transFont.getSvg(unicode),
            unicode: unicode10
        })
    }
    let fontFamily = transFont.getFontface().options.fontFamily
    let prefix = iconList[0].name.split('-')[0] + '-'

    return {
        fontFamily,
        prefix,
        iconListSvg
    }
}

module.exports = {
    InitCssStyle,
    addItemStyle,
    transfer,
};