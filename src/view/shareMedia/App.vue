<template>
  <h1>正在共享媒体</h1>
  <div>
    <button @click="resetContent">重置展示内容</button>
  </div>
  <div>
    <h2>弹幕申请</h2>
    <input type="radio" id="zero" value=0 v-model="dealSubscript"/>
    <label for="zero">手动处理</label>
    <input type="radio" id="one" value=1 v-model="dealSubscript"/>
    <label for="one">自动接受</label>
    <input type="radio" id="two" value=2 v-model="dealSubscript"/>
    <label for="two">自动拒绝</label>
  </div>
  
  <div v-if="dealSubscript == 0 && subscripts.length > 0">
    <div>
    处理第一条 <button @click="displaySubscript(true)">接受</button> <button @click="displaySubscript(false)">拒绝</button>
    </div>
    <div v-for="item in subscripts" v-bind:key="item">
      <span>{{ item }}</span>
    </div>
  </div>
  
</template>

<script setup>
  import { ref } from 'vue'

  const subscripts = ref([]);
  const dealSubscript = ref(0);
  let ws = null;
  let screenStream = null;
  //let peerConnection = null;
  const peerConnections = new Map();
  const configuration = {"iceServers":[{
    "urls":[`turn:[${window.ip}]:3478`],
    "username":"senseberg",
    "credential":"great"}]};
  const defaultContent = "default_001"; // the path of default content
  const defaultComments = true;

  function startWebSocket()
  {
    if ("WebSocket" in window)
    {
        
        // 打开一个 web socket
        ws = new WebSocket(`ws://localhost:${window.port}`);
        
        ws.onopen = function()
        {
          // Web Socket 已连接上，使用 send() 方法发送数据
          ws.send(JSON.stringify({ type: 'host'}));
          setTimeout(() => {
            ws.send(JSON.stringify({ type: 'defaultContent', content: defaultContent, comments: defaultComments }));
          }, 1000);
        };
        
        ws.onmessage = function (evt) 
        {
          var msg = evt.data;
          const obj = JSON.parse(msg);
          switch (obj.type) {
            case 'subscript' :
              if (dealSubscript.value == 0) {
                subscripts.value.push(obj.message);
              } else if (dealSubscript.value == 1) {
                ws.send(JSON.stringify({ type: 'displaySubscript', message: obj.message }))
              }
              break;
            case 'ready':
                startMedia();
                break;
            case 'client':
                onClient(obj);
                break;
            case 'answer':
                onAnswer(obj);
                break;
            case 'clientCandidate':
                onClientCandidate(obj);
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
  async function startMedia() {
    screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          sampleRate : 44100,
        },
        systemAudio: "include"
    });
    //document.getElementById('localVideo').srcObject = screenStream;
    // const configuration = { iceServers: [{ urls: 'stun:stun.xten.com:3478' }] };
    // const configuration = { iceServers: [{ url: 'stun:[2408:820c:8f7f:3c00:c988:1b1e:1198:80e9]:3478' }] };
  }

  async function onClient(obj) {
    const peerConnection = new RTCPeerConnection(configuration);
    const clientId = obj.id;
    peerConnection.onicecandidate = (e) => {
        if (e.candidate) {
            ws.send(JSON.stringify({ type: 'hostCandidate', candidate: e.candidate, id: clientId}));
        }
    };
    peerConnection.addEventListener('connectionstatechange', () => {
        if (peerConnection.connectionState === 'connected') {
          //alert('connected');
          console.log("connected");
        }
        if (peerConnection.connectionState === 'closed') {
          peerConnections.delete(clientId);
          console.log("closed");
        }
    });
    await peerConnection.addTrack(screenStream.getAudioTracks()[0]);
    if (obj.media === 'video') {
        await peerConnection.addTrack(screenStream.getVideoTracks()[0]);
    }
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    const json = JSON.stringify({ type: 'offer', 'offer': offer, id: clientId });
    ws.send(json);
    peerConnections.set(clientId, peerConnection);
    //alert('send offer');
  }

  async function onAnswer(obj) {
    // alert('on answer');
    const answer = new RTCSessionDescription(obj.answer);
    //console.log("answer received");
    const peerConnection = peerConnections.get(obj.id);
    if (peerConnection !== null) {
        await peerConnection.setRemoteDescription(answer);
    }
    //alert('answer set');
  }

  function onClientCandidate(obj) {
    const peerConnection = peerConnections.get(obj.id);
    if (peerConnection !== null) { 
        peerConnection.addIceCandidate(obj.candidate);
    }
    //console.log('client candidate received');
    //alert(obj.candidate.candidate);
  }

  function displaySubscript(flag) {
    if (subscripts.value.length === 0) {
      return;
    }
    const message = subscripts.value[0];
    subscripts.value = subscripts.value.slice(1, subscripts.value.length);
    if (flag) {
      ws.send(JSON.stringify({ type: 'displaySubscript', message: message }))
    }
  }

  function resetContent() {
    ws.send(JSON.stringify({ type: 'content', content: 'default' })) //reset default content
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
