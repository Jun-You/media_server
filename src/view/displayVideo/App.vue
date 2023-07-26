<template >
  <div id="container">
    <video id ="localVideo" autoplay controls></video>
  </div>
  <button @click="fullscreen">全屏</button>
</template>

<script setup>
  let ws = null;
  let peerConnection = null;
  let outStream = null;
  let clientId = null;

  function startWebSocket()
  {
    if ("WebSocket" in window)
    {
        
        // 打开一个 web socket
        ws = new WebSocket(`ws://localhost:${window.port}`);
        
        ws.onopen = function()
        {
          // Web Socket 已连接上，使用 send() 方法发送数据
          ws.send(JSON.stringify({ type: 'client', media: 'video'}));
        };
        
        ws.onmessage = function (evt) 
        { 
          var msg = evt.data;
          const obj = JSON.parse(msg);
          switch (obj.type) {
            case 'displaySubscript':
              displaySubcript(obj.message);
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
        "urls":["turn:localhost:3478"],
        "username":"senseberg",
        "credential":"great"}]};
    peerConnection = new RTCPeerConnection(configuration);
    peerConnection.onicecandidate = (e) => {
        if (e.candidate) {
          //alert('client candidate');
          ws.send(JSON.stringify({ type: 'clientCandidate', candidate: e.candidate, id: clientId }));
          //alert(e.candidate.candidate);
        }
    };
    peerConnection.ontrack = (ev) => {
        if (ev.streams && ev.streams[0]) {
          document.getElementById("localVideo").srcObject = ev.streams[0];
          //alert('stream received');
        } else {
          if (!outStream) {
          outStream = new MediaStream();
          document.getElementById("localVideo").srcObject = outStream;
          }
          outStream.addTrack(ev.track);
          //alert('track received');
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

  function displaySubcript(msg) {
    const bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.innerText = msg;
    bullet.style.willChange = "transform";
    const container = document.getElementById("container");
    container.appendChild(bullet);
    setTimeout(() => {
      bullet.style.transition = `transform ${((container.clientWidth + bullet.clientWidth) / container.clientWidth) * 10}s linear`;
      bullet.style.transform = `translateX(-${container.clientWidth + bullet.clientWidth}px)`;
      bullet.addEventListener('transitionend', () => {
        container.removeChild(bullet);
      });
    }, 1000);
  }

  function fullscreen() {
    const ele = document.getElementById("container");
    ele.requestFullscreen();
  }
</script>

<style>
#container {
  position: relative;
  width: 1024px;
  height: 768px;
}
#localVideo {
  width: 100%;
  height: 100%;
  position: absolute;
}

.bullet {
  white-space: nowrap;
  position: absolute;
  left: 100%;
  bottom: 30%;
  font-size: 5em;
  color: white;
  pointer-events: none;
}

</style>
