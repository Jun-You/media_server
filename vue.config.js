const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false, /*关闭语法检查*/

  pages: {
    index: {
      entry: "./src/view/index/main.js",
      template: "./src/view/index/index.html",
      title: "超媒体"
    },
    playLocalVideos: {
      entry: "./src/view/playLocalVideos/main.js",
      template: "./src/view/playLocalVideos/index.html",
      title: "播放本地视频"

    },
    shareMedia: {
      entry: "./src/view/shareMedia/main.js",
      template: "./src/view/shareMedia/index.html",
      title: "共享媒体"

    },
    displayVideo: {
      entry: "./src/view/displayVideo/main.js",
      template: "./src/view/displayVideo/index.html",
      title: "展示画面"

    }
  }
})
