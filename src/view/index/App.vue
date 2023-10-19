<template>
  <div id ="comments" class="item" v-if="comments">
    <select class="sub-item left" v-model="type" >
      <option disabled value="default">选择特效：</option>
      <option value="bullet">弹幕</option>
      <option value="plain">平面文字</option>
      <option value="neon-blue">氙光蓝</option>
      <option value="neon-blue-animation">氙光蓝-动画</option>
      <option value="fire">火焰</option>
      <option value="stroke">轮廓</option>
      <option value="blur">模糊</option>
    </select>
    <input type="text" v-model="message" id="subscript" class="sub-item left full"/>
    <button @click="subscript" class="sub-item left">发送字幕</button>
  </div>
  <div id="content" class="item" v-html="html">
  </div>
</template>

<script setup>
  import { ref, watchEffect } from "vue";

  const SERVER_IP = '2408:820c:8f7d:c570:20c:29ff:fe94:ca49';
  const content = ref(null);
  const html = ref(null);
  const comments = ref(true);
  const message = ref(null);
  const type = ref('default');
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
      `http://[${SERVER_IP}]/html/${content.value}`
    );
    html.value = await response.text();
  })

  async function displayPage(path) {
    updateContent = false;
    const response = await fetch(
      `http://[${SERVER_IP}]/html/${path}`
    );
    html.value = await response.text();
  }

  window.displayPage = displayPage;

  async function restoreContent() {
    updateContent = true;
    const response = await fetch(
      `http://[${SERVER_IP}]/html/${previousContent}`
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
        
        ws.onopen = function()
        {
          // Web Socket 已连接上，使用 send() 方法发送数据
          ws.send(JSON.stringify({ type: 'client', media: 'audio'}));
        };
        
        ws.onmessage = function (evt) 
        { 
          var msg = evt.data;
          const obj = JSON.parse(msg);
          switch (obj.type) {
            case 'content':
                previousContent = obj.content;
                //alert(previousContent + "\n" + updateContent.value);
                comments.value = obj.comments;
              if (updateContent) {  // when client is getting detail about the content, stop updatting content
                content.value = obj.content;
              }
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

  function onHostCandidate(obj) {
    peerConnection.addIceCandidate(obj.candidate);
    //alert('host candidate received');
  }

  function subscript() {
    if (message.value !== null) {
      ws.send(JSON.stringify({ type: 'subscript', message: {content: message.value, type: type.value}}))
      message.value = null;
    }
  }

</script>

<style>
#body {
  width: 100 vw;
}
#localAudio {
  width: 100%;
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
}
</style>
