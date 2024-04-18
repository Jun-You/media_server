<script setup>
  let ws = null;
  let localFiles;
  let index;
  import updateImg from "../../assets/a49691e65f4ad851e405bc9a1c5ab4c.png"
  import fullScreenImg from "../../assets/c.png"
  const playlist = [];

  function play() {
    if(playlist.length > 0) {
      const video = document.getElementById('localVideo');
      const playUrl = playlist.splice(0,1);
      video.src = playUrl[0];
      if (ws !== null) {
        const filename = playUrl[0].split('/').pop();
        const flags = filename.split('-');
        if (flags.length < 3) {
          ws.send(JSON.stringify({ type: 'content', content: 'default' })) //default content
        } else {
          ws.send(JSON.stringify({ type: 'content', content: flags[1], comments: flags[0] === '1'?true:false}))
        }
      }
    } else {
      const video = document.getElementById('localVideo');
      const file = localFiles[index];
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
      index++;
      if (index === localFiles.length) {
          index = 0;
      }
    }
  }
  function upfile(params) {
    document.getElementById('file').click()
  }
  function onInputFileChange() {
    const video = document.getElementById('localVideo');
    const locaoPlayList = document.getElementById('file');
    video.onended = play;
    localFiles = locaoPlayList.files;
    if (localFiles.length === 0)
        return;
    index = 0;
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
          ws.send(JSON.stringify({ type: 'localPlayer' }));
        };
        ws.onmessage = (evt) => {
          var msg = evt.data;
          const obj = JSON.parse(msg);
          if (obj.type === 'playUrl'){
            playlist.push(obj.url);
          }
        }
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
  
  function fullscreen() {
    const video = document.getElementById("localVideo");
    video.requestFullscreen();
  }
</script>
<template>
  <div class="container">
    <div class="popSty">
      <!-- <input type="file" id="file"  @change="onInputFileChange" multiple> -->
     
    <input type="file" id="file" @change="onInputFileChange" multiple>
    <div class="file">
      <div class="file_bt" @click="upfile()">
        <div>
          <img :src="updateImg" alt="" srcset="">
        </div>
        <div>
          点击上传
        </div>
      </div>
      
    </div>
     
      <div @click="fullscreen">
        <img :src="fullScreenImg" alt="" srcset="">
      </div>
    </div>
      
      <video id="localVideo" autoplay></video>
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

#localVideo {
  width: 100%;
  height: 90%;
}
video::-webkit-media-controls{
    display:none !important;
}
.popSty{
  width: 300px;
  height: 70px;
  position: fixed;
  bottom: 30px;
  left: 30px;
  display: flex;
  justify-content: space-around;
  background-color: #0099FF;
  border-radius: 15px;
  align-items: center;
}
.popSty>div:nth-child(3)>img{
  width: 30px;
  height: auto;
}
.popSty>div:nth-child(3){
  width: 60px;
  height: 60px;
  background-color: #fff;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popSty>div:nth-child(3):hover{
  opacity: .7;
}
/* .popSty>input{
  width: 200px;
  height: 50px;
} */
input[type="file"]{
    display: none;
}
.filetip{
    color: #BCBCBC;
    font-weight: 400;
    font-size: 16px;
}
.filetip.active{
    display: inline-block;
}
.file{
    display: inline-block;
    overflow: hidden;
}
.file_bt{
    display: inline-block;
    color: #fff;
    font-size: 20px;
    font-weight: 400;
    border: 1px solid #fff;
    width: 200px;
    height: 60px;
    border-radius: 15px;
    letter-spacing: 2px;
    line-height: normal;
    background-color: #fff;
    color: #000;
    display: flex;

}
.file_bt>div>img{
  width: 30px;
  height: auto;
}
.file_bt>div:nth-child(1){
  width: 70px;
  height: 70px;
  line-height: 80px;
}
.file_bt>div:nth-child(2){
  line-height: 60px;
}

.file_bt:hover{
  opacity: .7;
}
.file p {
    display: none;
    overflow: hidden;
    background-color: rgb(242,242,242);
    padding: 0 8px;
    line-height: 25px;
    border-radius: 1px;
}
.file p span:first-child{
    float: left;
}
.file p span:last-child{
    float: right;
}
</style>
