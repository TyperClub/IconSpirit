const InitCssStyle = (fontFamily, fontFamilyPath) =>{
    return [`
@font-face {
    font-family: '${fontFamily}';
    src: url('${fontFamilyPath}.eot'); /* IE9 */
    src: url('${fontFamilyPath}.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('${fontFamilyPath}.woff') format('woff2'),
    url('${fontFamilyPath}.woff') format('woff'), /* chrome、firefox */
    url('${fontFamilyPath}.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
    url('${fontFamilyPath}.svg#iconfont') format('svg'); /* iOS 4.1- */
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