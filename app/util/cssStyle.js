const config = require('../config/oss_config');
const FontCarrier = require('@icons/font-carrier')
const request = require('request')
const rp  = require('request-promise');
const { insertStr, hex2int } = require('./tool')

const InitCssStyle = (fontFamily, fontFamilyPath, fontFormat, env) =>{
    let fontsStyls = []
    let fonts = {
        woff2: `url('${config[env].website}${fontFamilyPath}.woff?t=${new Date().getTime()}') format('woff2')`,
        eot: `    url('${config[env].website}${fontFamilyPath}.eot?t=${new Date().getTime()}'), /* IE9 */\nurl('${config[env].website}${fontFamilyPath}.eot?#iefix&?t=${new Date().getTime()}') format('embedded-opentype')`,
        woff: `    url('${config[env].website}${fontFamilyPath}.woff?t=${new Date().getTime()}') format('woff')`,
        ttf: `    url('${config[env].website}${fontFamilyPath}.ttf?t=${new Date().getTime()}') format('truetype')`,
        svg:`     url('${config[env].website}${fontFamilyPath}.svg?t=${new Date().getTime()}') format('svg')`,
    }
    for(let index in fontFormat){
        let attr = fontFormat[index].toLowerCase()
        if(fonts[attr]){
            fontsStyls.push(fonts[attr])
        }
    }

return [
`@font-face {
    font-family: '${fontFamily}';
    src: ${fontsStyls.join(',\n')};
}`,
`
.${fontFamily} {
    font-family: "${fontFamily}";
    font-size: 16px;
    font-style: normal;
}`]

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
    let fontFamily = transFont.getFontface().options.fontFamily
    let prefix = iconList[0].name.split('-')[0] + '-'

    let iconListSvg = []
    for(let index in iconList){
        let item = iconList[index]
        let unicode10 = hex2int(item.unicode.replace(/&#|;/g, ''))
        let unicode = insertStr(item.unicode, 2, 'x')
        let name = item.name.slice(prefix.length) || item.name
        
        iconListSvg.push({
            CH_Name: name,
            ENG_Name: name,
            content: transFont.getSvg(unicode),
            unicode: unicode10
        })
    }

    iconListSvg = iconListSvg.reverse()

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