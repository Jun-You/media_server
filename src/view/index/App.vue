<template>
  <div id="content" class="item" v-html="html">
  </div>
  <div v-if="comments" @click="isXpPopup=true" class="sendButton">
    <img src="./send.png" alt="发送" style="width: 30px;height: auto;">
  </div>
  <div v-if="allowOrder" @click="isAllowOrder=true" class="sendButton" style="bottom: 90px;">
    <img :src="play" alt="发送" style="width: 30px;height: auto;">
  </div>
  <div style="position: fixed;bottom: 0;left: 0;z-index: 99999999;">
    <xpPopup @close="isXpPopup=false" v-if="isXpPopup" @change="sendMsg" />
  </div>
  <div style="position: fixed;bottom: 0;left: 0;z-index: 99999999;">
    <dataList v-if="isAllowOrder" @childEvent="childEvent" @cancel="isAllowOrder=false"></dataList>
  </div>

 
</template>

<script setup>
  // window.ip='2408:8421:1957:212e:fad1:52b8:23a0:755b'
  // window.port=41647
  import { ref, watchEffect } from "vue";
  import xpPopup from "./components/xp-popup/xp-popup.vue"
  import dataList from "./components/xp-dataList/xp-dataList.vue"
  import play from "../../assets/play.png"

  const content = ref(null);
  var isXpPopup=ref(false)
  const html = ref(null);
  const allowSubscriptByHost = ref(false);
  const allowSubscriptByVideo = ref(false);
  let isAllowOrder=ref(false);
  const comments = ref(false);  //字幕状态
  const allowOrder = ref(false); //点播状态
  let message = null;
  let updateContent = true;// when client is getting detail about the content, stop updatting content
  let ws = null;
  let peerConnection = null;
  let outStream = null;
  let clientId = null;
  let previousContent = null;

  watchEffect(async () => {
    if (content.value === null)
      return;
    const response = await fetch(
      `https://www.shugan.tech/html/${content.value}`
    );
    html.value = await response.text();
  })

  watchEffect(() => {
    comments.value = allowSubscriptByHost.value && allowSubscriptByVideo.value;
  })

  async function displayPage(path) {

    updateContent = false;
    const response = await fetch(
      `https://www.shugan.tech/html/${path}`
    );
    html.value = await response.text();
  }

  window.displayPage = displayPage;

  async function restoreContent() {
    updateContent = true;
    const response = await fetch(
      `https://www.shugan.tech/html/${previousContent}`
    );
    html.value = await response.text();
  }
  window.restoreContent = restoreContent;

  function startWebSocket()
  {
    if ("WebSocket" in window)
    {
        // 打开一个 web socket
        ws = new WebSocket(`ws://[${window.ip}]:${window.port}`);
        console.log("准备连接web socket")
        ws.onopen = function()
        {
          console.log("连接成功 socket")
          // Web Socket 已连接上，使用 send() 方法发送数据
          ws.send(JSON.stringify({ type: 'client', media: 'audio'}));
          if (message !== null) {
            ws.send(message);
            message = null;
          }
        };
        
        ws.onmessage = function (evt) 
        { 
          var msg = evt.data;
          const obj = JSON.parse(msg);
          switch (obj.type) {
            case 'content':
                previousContent = obj.content;
                //alert(previousContent + "\n" + updateContent.value);
                //comments.value = obj.comments;
                allowSubscriptByVideo.value = obj.comments;
              if (updateContent) {  // when client is getting detail about the content, stop updatting content
                content.value = obj.content;
              }
              break;
            case 'allowSubscript':
              allowSubscriptByHost.value = obj.flag;
              break;
            case 'allowOrder':
              allowOrder.value = obj.flag;
              break;
            case 'ready':
                onReady(obj);
                break;
            case 'offer':
                onOffer(obj);
                break;
            case 'hostCandidate':
                onHostCandidate(obj);
                break;
            default:
                break;
          }
        };
        
        ws.onclose = function()
        { 
          // 关闭 websocket
        };
      
      //setTimeout(()=>{ws.send(JSON.stringify({type: 'playUrl', url: 'http://localhost:8080/video/mazida-mazida3.mp4'}))}, 10000);
    }
    else
    {
        // 浏览器不支持 WebSocket
        alert("您的浏览器不支持 WebSocket!");
    }
  }
  window.onload = startWebSocket;
  function onReady(obj) {
    clientId = obj.id;
    window.mediaId = obj.media_id;
    // const configuration = { iceServers: [{ urls: 'stun:stun.xten.com:3478' }] };
    // const configuration = { iceServers: [{ url: 'stun:[2408:820c:8f7f:3c00:c988:1b1e:1198:80e9]:3478' }] };
    const configuration = {"iceServers":[{
        "urls":[`turn:[${window.ip}]:3478`],
        "username":"senseberg",
        "credential":"great"}]};
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onicecandidate = (e) => {
        if (e.candidate) {
          //alert('client candidate');
          ws.send(JSON.stringify({ type: 'clientCandidate', candidate: e.candidate, id:clientId}));
          //alert(e.candidate.candidate);
        }
    };
    peerConnection.ontrack = (ev) => {
        if (ev.streams && ev.streams[0]) {
          document.getElementById('localAudio').srcObject = ev.streams[0];
          // alert('stream received');
        } else {
          if (!outStream) {
          outStream = new MediaStream();
          document.getElementById('localAudio').srcObject = outStream;
          }
          outStream.addTrack(ev.track);
          // alert('track received');
        }
    };
    peerConnection.addEventListener('connectionstatechange', () => {
        if (peerConnection.connectionState === 'connected') {
          //alert('connected');
        }
    });
  }

  async function onOffer(obj) {
    const offer = new RTCSessionDescription(obj.offer);
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    const json = JSON.stringify({ type: 'answer', 'answer': answer, id: clientId });
    ws.send(json);
  }
  function childEvent(params) {
    isAllowOrder.value=false
    console.log(params)
    message = JSON.stringify({type: 'playUrl', url:params.url })
    if (ws.readyState !== WebSocket.OPEN) {
      startWebSocket();
      return;
    }
    ws.send(message)
    message = null;
  }
  function onHostCandidate(obj) {
    peerConnection.addIceCandidate(obj.candidate);
    //alert('host candidate received');
  }
  
  function sendMsg(msg) {
    if (msg.value === null) {
      return;
    }
    //console.log(msg.value,msg.modelId)
    message = JSON.stringify({ type: 'subscript', message: {content: msg.value, type:msg.modelId}})
    if (ws.readyState !== WebSocket.OPEN) {
      startWebSocket();
      return;
    }
    ws.send(message)
    message = null;
  }
</script>

<style>
#body {
  width: 100 vw;
}
#localAudio {
  width: 100%;
}
.sendButton{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #187FED;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  display: flex;
  z-index: 3;
  align-items: center;
  justify-content: center;
}
#app {
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
#comments {
  align-items: baseline;
}
.item {
  width: 100%;
  margin: 0.5em 0;
}
.sub-item {
  margin: 0 2px;
}
.item-button {
  align-self: center;
  margin: 0.5em 0;
}
.left {
  float: left;
}
.right {
  float: right;
}
.full {
  width: auto;
  max-width: 50%;
}
#choose-image {
  max-width: 75%;
}
</style>
