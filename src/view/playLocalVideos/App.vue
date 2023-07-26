<script setup>
  let ws = null;
  let files;
  let index;
  function play() {
    const video = document.getElementById('localVideo');
    const file = files[index];
    var url = URL.createObjectURL(file);
    console.log(url);
    video.src = url;
    if (ws !== null) {
      const flags = file.name.split('-');
      if (flags.length < 4) {
        ws.send(JSON.stringify({ type: 'content', content: 'default' })) //default content
      } else {
        ws.send(JSON.stringify({ type: 'content', content: flags[2], comments: flags[1] === '1'?true:false}))
      }
    }
  }
  function onInputFileChange() {
    const video = document.getElementById('localVideo');
    const playList = document.getElementById('file');
    video.onended = playNext;
    files = playList.files;
    if (files.length === 0)
        return;
    index = 0;
    play();
  }
  function playNext() {
      index++;
      if (index === files.length) {
          index = 0;
      }
      play();
  }
  function startWebSocket()
  {
    if ("WebSocket" in window)
    {
        // 打开一个 web socket
        ws = new WebSocket(`ws://localhost:${window.port}`);
        ws.onopen = function()
        {
          // Web Socket 已连接上，使用 send() 方法发送数据
          ws.send(JSON.stringify({ type: 'local' }));
        };
        ws.onclose = function()
        { 
          // 关闭 websocket
        };
    }
    else
    {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
    }
  }
  window.onload = startWebSocket;
</script>
<template>
  <div class="container">
      <input type="file" id="file"  @change="onInputFileChange" multiple>
      <video id="localVideo" autoplay="true" controls></video>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
}
#file {
  width: 100%;
  height: 10%;
}
#localVideo {
  width: 100%;
  height: 90%;
}
</style>
