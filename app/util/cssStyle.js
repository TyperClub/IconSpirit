const config = require('../config/oss_config');

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

module.exports = {
    InitCssStyle,
    addItemStyle
};