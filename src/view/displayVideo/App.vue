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

  function displaySubcript(message) {
    switch (message.type) {
      case 'image':
        {
          const fullscreen = document.createElement('div');
          fullscreen.className = message.type;
          const image = document.createElement('img');
          image.className = 'display';
          image.src = message.image;
          fullscreen.appendChild(image);
          const text = document.createElement('p');
          text.className = 'text';
          text.innerText = message.content;
          text.setAttribute('data-text', message.content);
          fullscreen.appendChild(text);
          const container = document.getElementById("container");
          container.appendChild(fullscreen);
          setTimeout(() => {
            container.removeChild(fullscreen);
          }, 10000);
          break;
        }
      case 'fire':
        {
          const fullscreen = document.createElement('div');
          fullscreen.className = message.type;
          const background = document.createElement('div');
          background.className = 'background';
          const text = document.createElement('p');
          text.className = 'text';
          text.innerText = message.content;
          text.setAttribute('data-text', message.content);
          background.appendChild(text);
          fullscreen.appendChild(background);
          const container = document.getElementById("container");
          container.appendChild(fullscreen);
          setTimeout(() => {
            container.removeChild(fullscreen);
          }, 10000);
          break;
        }
      case 'neon-blue-animation':
        {
          const fullscreen = document.createElement('div');
          fullscreen.className = message.type;
          const text = document.createElement('p');
          text.className = 'text';
          for (var i = 0; i < message.content.length; i++){
            const span = document.createElement('span');
            span.style.animationDelay = `${1 + 0.2 * i}s`;
            span.innerText = message.content[i];
            text.appendChild(span);
          }
          fullscreen.appendChild(text);
          const container = document.getElementById("container");
          container.appendChild(fullscreen);
          setTimeout(() => {
            container.removeChild(fullscreen);
          }, 10000);
          break;
        }
      case 'neon-blue':
      case 'stroke':
      case 'plain':
      case 'blur':
        {
          const fullscreen = document.createElement('div');
          fullscreen.className = message.type;
          const text = document.createElement('p');
          text.className = 'text';
          text.innerText = message.content;
          text.setAttribute('data-text', message.content);
          fullscreen.appendChild(text);
          const container = document.getElementById("container");
          container.appendChild(fullscreen);
          setTimeout(() => {
            container.removeChild(fullscreen);
          }, 10000);
          break;
        }
      case 'bullet':
      case 'default':
      default:
        {
          const bullet = document.createElement("div");
          bullet.className = 'bullet';
          bullet.innerText = message.content;
          bullet.style.willChange = "transform";
          const container = document.getElementById("container");
          container.appendChild(bullet);
          setTimeout(() => {
            bullet.style.transition = `transform ${((container.clientWidth + bullet.clientWidth) / container.clientWidth) * 10}s linear`;
            bullet.style.transform = `translateX(-${container.clientWidth + bullet.clientWidth}px)`;
            bullet.addEventListener('transitionend', () => {
              container.removeChild(bullet);
            });
          }, 2000);
        }
    }
    
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

.neon-blue,.neon-blue-animation,.fire,.stroke,.plain,.image {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  pointer-events: none;
  background-color: black;
}

.fire {
  background-color: #fff;
}

.blur {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  width: 100%;
  filter: contrast(20);
  background: #000;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.fire .background{
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
  background-image: url('assets/images/fire.jpg');
  background-size: cover;
  -webkit-text-fill-color: transparent;
	background-clip: text;
}

.neon-blue .text,.neon-blue-animation .text,.fire .text,.stroke .text, .plain .text, .image .text{
  align-self: center;
  font-size: 10em;
  pointer-events: none;
  max-width: 90%;
  max-height: 100%;
  text-align: center;
}

.image .display {
  position: absolute;
  align-self: center;
  pointer-events: none;
  height: 100%;
}

.image .text {
  position: absolute;
  color: white;
  top: 50%;
}

.plain .text{
  color: #fff;
}

.neon-blue .text{
  color: #fff;
    text-shadow: 
        0 0 10px #0ebeff,
        0 0 20px #0ebeff,
        0 0 50px #0ebeff,
        0 0 100px #0ebeff,
        0 0 200px #0ebeff;
  animation: neon-blue 1.5s ease-in-out infinite alternate;
}

.stroke .text {
  position: relative;
  -webkit-text-stroke: 3px #7272a5;
  &::before {
        content: " ";
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-image: linear-gradient(45deg, #ff269b, #2ab5f5, #ffbf00);
        mix-blend-mode: multiply;
    }

    &::after {
        content: "";
        background: radial-gradient(circle, #fff, #000 50%);
        background-size: 25% 25%;
        position: absolute;
        top: -100%;
        left: -100%;
        right: 0;
        bottom: 0;
        mix-blend-mode: color-dodge;
        animation: mix 5s linear infinite;
    }
}

.blur .text {
  box-sizing: border-box;
  font-family: Righteous;
  color: white;
  font-size: 10rem;
  text-transform: uppercase;
  line-height: 1;
  animation: letterspacing 5s linear forwards;
  display: block;
  letter-spacing: -5rem;
  align-self: center;
}

.neon-blue-animation .text span{
  animation: flicker 1s linear forwards;
}

@keyframes neon-blue {
  from {
    text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #fff, 0 0 40px #228dff,
      0 0 70px #228dff, 0 0 80px #228dff, 0 0 100px #228dff, 0 0 150px #228dff;
  }
  to {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #228dff,
      0 0 35px #228dff, 0 0 40px #228dff, 0 0 50px #228dff, 0 0 75px #228dff;
  }
}

@keyframes flicker {
  0% {
    color: transparent;
  }
  5%, 15%, 25%, 30%, 100% {
    color: #fff;
    text-shadow: 
      0px 0px 5px #0ebeff,
      0px 0px 10px #0ebeff,
      0px 0px 20px #0ebeff,
      0px 0px 50px #0ebeff;
      
  }
  10%, 20% {
    color: transparent;
    text-shadow: none;
  }
}

@keyframes mix {
    to {
        transform: translate(50%, 50%);
    }
}

@keyframes letterspacing {
    0% {
        letter-spacing: -5rem;
        filter: blur(.6rem);
    }

    50% {
        filter: blur(.4rem);
    }

    100% {
        letter-spacing: .5rem;
        filter: blur(0rem);
    }
}

</style>
