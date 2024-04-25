<template>
  <div>
    <div style="display: flex;justify-content: space-between;width: 343px;margin: 0 auto;align-items: center;padding-top: 20px;">
      <div class="" style="font-size: 28px;">允许点播</div>
      <div>
        <label class="switch">
          <input type="checkbox" v-model="order" @change="allowOrder()">
          <span class="slider round"></span>
        </label>

      </div>
    </div>
    <div style="width: 343px;margin: 0 auto;font-size: 28px;padding: 10px 0;text-align: left;">推送处理</div>
    <div class="topListSty">
      <div @click="dealSubscript=0;allowSubscript(true);" :style="dealSubscript==0?'background:#212237;color:#fff':''">
        <img v-if="dealSubscript==0" src="../../assets/d.png" alt="手动">
        <img v-else src="../../assets/dd.png" alt="手动">
        手动处理
      </div>

      <div @click="dealSubscript=1;allowSubscript(true);" :style="dealSubscript==1?'background:#212237;color:#fff':''">
        <img v-if="dealSubscript==1" src="../../assets/autoto.png" alt="自动">
        <img v-else src="../../assets/atuo.png" alt="自动">

        自动接受
      </div>
      <div @click="dealSubscript=2;allowSubscript(false);" :style="dealSubscript==2?'background:#212237;color:#fff':''">
        <img v-if="dealSubscript==2" src="../../assets/autoto.png" alt="拒绝">
        <img v-else src="../../assets/atuo.png" alt="拒绝">
        拒绝推送
      </div>
    </div>
    <div>
      <div class="listSty"  v-for="(item,index) in subscripts" style="margin-top: 10px;">
        <div>
            <img @click="openImg('data:image/jpg;base64,'+item.img)" v-if="item.img!=null" :src="'data:image/jpg;base64,'+item.img" alt="logo" srcset="">
            {{ item.content||'' }}
        </div>
        <div>
          <img src="../../assets/1.png" alt="√" srcset="" @click="displaySubscript(true,index)">

          <img src="../../assets/xx.png" alt="x" srcset="" @click="displaySubscript(false,index)">

        </div>
      </div>
    </div>
    <div @click="resetContent" class="btnSty">重置展示内容</div>
  </div>
  <div class="popup" @click="closeImg()"></div>
  
  <!-- <h1>正在共享媒体</h1> -->



  <!-- <div>
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
      <span v-if="item.type !== 'image'">{{ item.content }}</span>
      <span v-if="item.type === 'image'"><img :src="item.image" class="preview"></span>
    </div>
  </div> -->
  
</template>

<script setup>
// window.port=41647
  import { ref } from 'vue'
  const subscripts = ref([]);
  const dealSubscript = ref(2);
  let ws = null;
  let screenStream = null;
  //let peerConnection = null;
  const peerConnections = new Map();
  const configuration = {"iceServers":[{
    "urls":[`turn:[${window.ip}]:3478`],
    "username":"senseberg",
    "credential":"great"}]};
  const defaultContent = "default_001"; // the path of default content
  const defaultComments = true; //默认是否允许用户推送
  const order = ref(false); //是否允许用户点播url

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
            allowSubscript(dealSubscript.value === 0 || dealSubscript.value === 1);
            allowOrder();
          }, 1000);
        };
        
        ws.onmessage = function (evt) 
        {
          var msg = evt.data;
          const obj = JSON.parse(msg);
          switch (obj.type) {
            case 'subscript' :
              if (dealSubscript.value == 0) {
                try {
                  if(obj.message.content.split('||').length==2){
                    obj.message.img=obj.message.content.split('||')[1]
                    obj.message.content=obj.message.content.split('||')[0]

                    subscripts.value.push(obj.message);
                  }else{
                    obj.message.img=null
                    subscripts.value.push(obj.message); 

                  }
                } catch (error) {
                  
                }
                
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
        video: {
          frameRate:{ideal:25},
          width:{ideal:1920},
          height:{ideal:1080}
        },
        audio: {
          sampleRate : 44100,
        },
        systemAudio: "include"
    });
    //document.getElementById('localVideo').srcObject = screenStream;
    // const configuration = { iceServers: [{ urls: 'stun:stun.xten.com:3478' }] };
    // const configuration = { iceServers: [{ url: 'stun:[2408:820c:8f7f:3c00:c988:1b1e:1198:80e9]:3478' }] };
  }
  function openImg(src){
    console.log(document.getElementsByClassName("popup"))
    document.getElementsByClassName("popup")[0].innerHTML=`
    <div style="width: 100vw;height: 100vh;background: rgb(0, 0, 0);position: fixed; left: 0;top: 0;">
    <img src="${src}" style="max-height:100vh;max-width:100vw;object-fit: contain;width: 100vw;height: 100vh;" alt="图片" srcset="">
  </div>
    `
  }
  function closeImg() {
    document.getElementsByClassName("popup")[0].innerHTML=``
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

  function displaySubscript(flag,index) {
    if (subscripts.value.length === 0) {
      return;
    }
    const message = subscripts.value.splice(index,1)[0];
    // subscripts.value = subscripts.value.slice(1, subscripts.value.length);
    if (flag) {
      if(message.img!=null){
        message.content=message.content+'||'+message.img
      }
      
      ws.send(JSON.stringify({ type: 'displaySubscript', message: message }))
    }
  }

  function resetContent() {
    ws.send(JSON.stringify({ type: 'content', content: 'default' })) //reset default content
  }

  function allowSubscript(flag) {
    ws.send(JSON.stringify({ type: 'allowSubscript', flag: flag})) // allow clients to submit subscripts or not
  }

  function allowOrder() {
    ws.send(JSON.stringify({ type: 'allowOrder', flag: order.value})) // allow clients to play a url
  }
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.listSty{
  width: 343px;
  height: 83px;
  background: #FFFFFF;
  border-radius: 12px 12px 12px 12px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 5px;
  box-sizing: border-box;
  >div:nth-child(1){
    width: 70%;
    font-size: 12px;
    font-family: Source Han Sans, Source Han Sans;
    font-weight: 300;
    color: #404040;
    display: flex;
    align-items: center;
    overflow: hidden;
    >img{
      width: 60px;
      height: auto;
    }
  }
  >div:nth-child(2){
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 30%;
    >img{
      width: 30px;
      height: auto;
    }
  }

}
.btnSty{
  width: 343px;
  height: 50px;
  background: #212237;
  border-radius: 8px;
  font-size: 17px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}
.btnSty:hover{
    opacity: .7;
  }
.btnSty:active {
        opacity: .7;

      }

     .btnSty:focus{
        opacity: .7;
      }
body{
  background: #F7F8FC;
  width: 100%;
  height: 100%;
}
.topListSty{
  width: 343px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  >div{
    width: 103px;
    height: 58px;
    background: #FFFFFF;
    border-radius: 22px 22px 22px 22px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 17px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    color: #575757;
    padding: 0 15px;
    box-sizing: border-box;
    >img{
      width: 24px;
      height: auto;
    }
  }
  >div:hover{
    opacity: .7;
  }
}
.preview {
  max-height: 400px;
}



.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}
 
/* Hide default checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
 
/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}
 
.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}
 
input:checked + .slider {
  background-color: #2196F3;
}
 
input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
 
/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}
 
.slider.round:before {
  border-radius: 50%;
}
</style>
