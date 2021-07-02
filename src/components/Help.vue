<template>
<el-container style="height: 100%; border: 1px solid #eee">
  <el-container>
    <el-header style="text-align: right; font-size: 12px">
        <navigation></navigation>
    </el-header>
    <div class="home">
        <div class="main">
    <div class="nav-tabs">
      <ul id="tabs" class="dib-box">
        <li class="dib" :class="activeIndex === 0 ? 'active' : ''" @click="rowIndex(0)"><span>Font class</span></li>
        <li class="dib" :class="activeIndex === 1 ? 'active' : ''" @click="rowIndex(1)"><span>Unicode</span></li>
      </ul>
    </div>
    <div class="tab-container">
      <div class="content unicode" v-show="activeIndex === 1">
          <ul class="icon_lists dib-box">
          
            <li class="dib">
              <span class="icon iconfont">&#xe63d;</span>
                <div class="name">首页</div>
                <div class="code-name">&amp;#xe63d;</div>
              </li>
          
            <li class="dib">
              <span class="icon iconfont">&#xe72c;</span>
                <div class="name">possion回归</div>
                <div class="code-name">&amp;#xe72c;</div>
              </li>
          
            <li class="dib">
              <span class="icon iconfont">&#xe72b;</span>
                <div class="name">ARIMA</div>
                <div class="code-name">&amp;#xe72b;</div>
              </li>
          
            <li class="dib">
              <span class="icon iconfont">&#xe602;</span>
                <div class="name">全部</div>
                <div class="code-name">&amp;#xe602;</div>
              </li>
          
          </ul>
          <div class="article markdown">
          <h2 id="unicode-">Unicode 引用</h2>
          <hr>

          <p>Unicode 是字体在网页端最原始的应用方式，特点是：</p>
          <ul>
            <li>支持按字体的方式去动态调整图标大小，颜色等等。</li>
            <li>默认情况下不支持多色，直接添加多色图标会自动去色。</li>
          </ul>
          <blockquote>
            <p>注意：新版 iconfont 支持两种方式引用多色图标：SVG symbol 引用方式和彩色字体图标模式。（使用彩色字体图标需要在「编辑项目」中开启「彩色」选项后并重新生成。）</p>
          </blockquote>
          <p>Unicode 使用步骤如下：</p>
          <h3 id="link-preload">第一步：在 HTML 页面为字体增加 preload，提升字体加载速度：</h3>

<pre><code class="language-html">&lt;link rel="preload" href="//t-fat.zmlearn.com/test/font/font_60df06ac9824f66506988086_2.woff2" as="font" type="font/woff2" crossorigin="anonymous"&gt;
</code></pre>

          <h3 id="-font-face">第二步：拷贝项目下面生成的 <code>@font-face</code></h3>
<pre><code class="language-css"
>@font-face {
  font-family: 'iconfont';
  src: url('//t-fat.zmlearn.com/test/font/font_60df06ac9824f66506988086_2.woff2?t=1625055528367') format('woff2'),
       url('//t-fat.zmlearn.com/test/font/font_60df06ac9824f66506988086_2.woff?t=1625055528367') format('woff'),
       url('//t-fat.zmlearn.com/test/font/font_60df06ac9824f66506988086_2.ttf?t=1625055528367') format('truetype');
}
</code></pre>
          <h3 id="-iconfont-">第三步：定义使用 iconfont 的样式</h3>
<pre><code class="language-css"
>.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</code></pre>
          <h3 id="-">第四步：挑选相应图标并获取字体编码，应用于页面</h3>
<pre>
<code class="language-html"
>&lt;span class="iconfont"&gt;&amp;#x33;&lt;/span&gt;
</code></pre>
          <blockquote>
            <p>"iconfont" 是你项目下的 font-family。可以通过编辑项目查看，默认是 "iconfont"。</p>
          </blockquote>
          </div>
      </div>
      <div class="content font-class" v-show="activeIndex === 0">
        <ul class="icon_lists dib-box">
          
          <li class="dib">
            <span class="icon iconfont icon-shouye-01"></span>
            <div class="name">
              首页
            </div>
            <div class="code-name">.icon-shouye-01
            </div>
          </li>
          
          <li class="dib">
            <span class="icon iconfont icon-possionhuigui"></span>
            <div class="name">
              possion回归
            </div>
            <div class="code-name">.icon-possionhuigui
            </div>
          </li>
          
          <li class="dib">
            <span class="icon iconfont icon-ARIMA"></span>
            <div class="name">
              ARIMA
            </div>
            <div class="code-name">.icon-ARIMA
            </div>
          </li>
          
          <li class="dib">
            <span class="icon iconfont icon-aichegujiabeifen7"></span>
            <div class="name">
              全部
            </div>
            <div class="code-name">.icon-aichegujiabeifen7
            </div>
          </li>
          
        </ul>
        <div class="article markdown">
        <h2 id="font-class-">font-class 引用</h2>
        <hr>

        <p>font-class 是 Unicode 使用方式的一种变种，主要是解决 Unicode 书写不直观，语意不明确的问题。</p>
        <p>与 Unicode 使用方式相比，具有如下特点：</p>
        <ul>
          <li>相比于 Unicode 语意明确，书写更直观。可以很容易分辨这个 icon 是什么。</li>
          <li>因为使用 class 来定义图标，所以当要替换图标时，只需要修改 class 里面的 Unicode 引用。</li>
        </ul>
        <p>使用步骤如下：</p>
        <h3 id="link-preload">第一步：在 HTML 页面为字体增加 preload，提升字体加载速度：</h3>

<pre><code class="language-html">&lt;link rel="preload" href="//t-fat.zmlearn.com/test/font/font_60df06ac9824f66506988086_2.woff2" as="font" type="font/woff2" crossorigin="anonymous"&gt;
</code></pre>

        <h3 id="-fontclass-">第二步：引入项目下面生成的 fontclass 代码：</h3>
<pre><code class="language-html">&lt;link rel="stylesheet" href="//t-fat.zmlearn.com/test/font/font_60df06ac9824f66506988086_2.css"&gt;
</code></pre>
        <h3 id="-">第三步：挑选相应图标并获取类名，应用于页面：</h3>
<pre><code class="language-html">&lt;span class="iconfont icon-xxx"&gt;&lt;/span&gt;
</code></pre>
        <blockquote>
          <p>"
            iconfont" 是你项目下的 font-family。可以通过编辑项目查看，默认是 "iconfont"。</p>
        </blockquote>
      </div>
      </div>
    </div>
  </div>
    </div>
  </el-container>
</el-container>
</template>

<script>
import Navigation from './Navigation';

  export default {
    data() {
      return {
        activeIndex: 0,
      }
    },
    mounted(){

    },
    methods: {
      rowIndex(index){
        this.activeIndex = index
      }
    },
    components: {
      Navigation
    }
  };
</script>


<style lang="less">
.el-card__body{
  padding: 0;
}

.icon {
  font-size: 36px;
  color: #666;
}
</style>
<style lang="less" scoped>
.f-fr{
  float: right;
}

@font-face {
  font-family: "iconfont"; /* Project id 2627940 */
  src: url('//at.alicdn.com/t/font_2627940_8ugnklz9kr3.woff2?t=1625055528367') format('woff2'),
       url('//at.alicdn.com/t/font_2627940_8ugnklz9kr3.woff?t=1625055528367') format('woff'),
       url('//at.alicdn.com/t/font_2627940_8ugnklz9kr3.ttf?t=1625055528367') format('truetype');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-shouye-01:before {
  content: "\e63d";
}

.icon-possionhuigui:before {
  content: "\e72c";
}

.icon-ARIMA:before {
  content: "\e72b";
}

.icon-aichegujiabeifen7:before {
  content: "\e602";
}


/* tabs */
.nav-tabs {
  position: relative;
}

.nav-tabs .nav-more {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 42px;
  line-height: 42px;
  color: #666;
}

#tabs {
  border-bottom: 1px solid #eee;
}

#tabs li {
  cursor: pointer;
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  border-bottom: 2px solid transparent;
  position: relative;
  z-index: 1;
  margin-bottom: -1px;
  color: #666;
}


#tabs .active {
  border-bottom-color: #409ef4;
  color: #222;
}


/* 椤甸潰甯冨眬 */
.main {
  padding: 130px 100px 30px;
  width: 960px;
  margin: 0 auto;
}

.main .logo {
  color: #333;
  text-align: left;
  margin-bottom: 30px;
  line-height: 1;
  height: 110px;
  margin-top: -50px;
  overflow: hidden;
  *zoom: 1;
}

.main .logo a {
  font-size: 160px;
  color: #333;
}

.helps {
  margin-top: 40px;
}

.helps pre {
  padding: 20px;
  margin: 10px 0;
  border: solid 1px #e7e1cd;
  background-color: #fffdef;
  overflow: auto;
}

.icon_lists {
  width: 100% !important;
  overflow: hidden;
  *zoom: 1;
}

.icon_lists li {
  width: 100px;
  margin-bottom: 10px;
  margin-right: 20px;
  text-align: center;
  list-style: none !important;
  cursor: default;
}

.icon_lists li .code-name {
  line-height: 1.2;
}

.icon_lists .icon {
  display: block;
  height: 100px;
  line-height: 100px;
  font-size: 42px;
  margin: 10px auto;
  color: #333;
  -webkit-transition: font-size 0.25s linear, width 0.25s linear;
  -moz-transition: font-size 0.25s linear, width 0.25s linear;
  transition: font-size 0.25s linear, width 0.25s linear;
}

.icon_lists .icon:hover {
  font-size: 100px;
}

.icon_lists .svg-icon {
  /* 閫氳繃璁剧疆 font-size 鏉ユ敼鍙樺浘鏍囧ぇ灏� */
  width: 1em;
  /* 鍥炬爣鍜屾枃瀛楃浉閭绘椂锛屽瀭鐩村榻� */
  vertical-align: -0.15em;
  /* 閫氳繃璁剧疆 color 鏉ユ敼鍙� SVG 鐨勯鑹�/fill */
  fill: currentColor;
  /* path 鍜� stroke 婧㈠嚭 viewBox 閮ㄥ垎鍦� IE 涓嬩細鏄剧ず
      normalize.css 涓篃鍖呭惈杩欒 */
  overflow: hidden;
}

.icon_lists li .name,
.icon_lists li .code-name {
  color: #666;
}

/* markdown 鏍峰紡 */
.markdown {
  color: #666;
  font-size: 14px;
  line-height: 1.8;
}

.highlight {
  line-height: 1.5;
}

.markdown img {
  vertical-align: middle;
  max-width: 100%;
}

.markdown h1 {
  color: #404040;
  font-weight: 500;
  line-height: 40px;
  margin-bottom: 24px;
}

.markdown h2,
.markdown h3,
.markdown h4,
.markdown h5,
.markdown h6 {
  color: #404040;
  margin: 1.6em 0 0.6em 0;
  font-weight: 500;
  clear: both;
}

.markdown h1 {
  font-size: 28px;
}

.markdown h2 {
  font-size: 22px;
}

.markdown h3 {
  font-size: 16px;
}

.markdown h4 {
  font-size: 14px;
}

.markdown h5 {
  font-size: 12px;
}

.markdown h6 {
  font-size: 12px;
}

.markdown hr {
  height: 1px;
  border: 0;
  background: #e9e9e9;
  margin: 16px 0;
  clear: both;
}

.markdown p {
  margin: 1em 0;
}

.markdown>p,
.markdown>blockquote,
.markdown>.highlight,
.markdown>ol,
.markdown>ul {
  width: 80%;
}

.markdown ul>li {
  list-style: circle;
}

.markdown>ul li,
.markdown blockquote ul>li {
  margin-left: 20px;
  padding-left: 4px;
}

.markdown>ul li p,
.markdown>ol li p {
  margin: 0.6em 0;
}

.markdown ol>li {
  list-style: decimal;
}

.markdown>ol li,
.markdown blockquote ol>li {
  margin-left: 20px;
  padding-left: 4px;
}

.markdown pre{
  padding: 10px 15px;
  background: #eee;
  margin: 0 3px;
  border-radius: 3px;
  overflow: auto;
}
.markdown strong,
.markdown b {
  font-weight: 600;
}

.markdown>table {
  border-collapse: collapse;
  border-spacing: 0px;
  empty-cells: show;
  border: 1px solid #e9e9e9;
  width: 95%;
  margin-bottom: 24px;
}

.markdown>table th {
  white-space: nowrap;
  color: #333;
  font-weight: 600;
}

.markdown>table th,
.markdown>table td {
  border: 1px solid #e9e9e9;
  padding: 8px 16px;
  text-align: left;
}

.markdown>table th {
  background: #F7F7F7;
}

.markdown blockquote {
  font-size: 90%;
  color: #999;
  border-left: 4px solid #e9e9e9;
  padding-left: 0.8em;
  margin: 1em 0;
}

.markdown blockquote p {
  margin: 0;
}

.markdown .anchor {
  opacity: 0;
  transition: opacity 0.3s ease;
  margin-left: 8px;
}

.markdown .waiting {
  color: #ccc;
}

.markdown h1:hover .anchor,
.markdown h2:hover .anchor,
.markdown h3:hover .anchor,
.markdown h4:hover .anchor,
.markdown h5:hover .anchor,
.markdown h6:hover .anchor {
  opacity: 1;
  display: inline-block;
}

.markdown>br,
.markdown>p>br {
  clear: both;
}

.dib {
    display: inline-block;
    *display: inline;
    *zoom:1}

.dib-box {
    font-size: 0;
    *word-spacing: -1px
}

@media (-webkit-min-device-pixel-ratio: 0) {
    .dib-box {
        letter-spacing:-5px
    }
}

.dib-box .dib {
    vertical-align: top;
    font-size: 12px;
    letter-spacing: normal;
    word-spacing: normal;
    line-height: inherit
}

.dib-box .justify,.justify {
    font-size: 0;
    line-height: inherit
}
</style>
