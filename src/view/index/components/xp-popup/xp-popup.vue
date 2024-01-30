<template>
    <div class="popupSty">
      <div>
        <swiper
    :slides-per-view="1"
    :pagination="{
      dynamicBullets: true,
    }"
    @swiper="setSwiperRef"
    @slideChange="onSlideChange"  
    :modules="modules"
    style="width: 100%;margin: 0 auto;height: 100%;"
  >
    <swiper-slide v-for="item in modelList">
        <div class="swiperItemSty">
            <div>
                <div @click="slideTo('-')">
                  <img src="./static/right.svg" alt="<">
                </div>
                <div>
                  {{ item.title }}
                </div>
                <div>
                  <img @click="slideTo('+')" src="./static/left.svg" alt=">">
                  
                </div>

            </div>
            <div>
              <video loop="loop" class="myVideo" width="322" height="322" controls>
                <source :src="item.videoUrl" type="video/mp4">
              </video>
            </div>
            <div>
                <textarea v-model="textMsg"></textarea>
            </div>
            <span class="inputBtn" v-if="item.isimg">
              <span>选择文件</span>
                <input @change="updataChange" accept="image/*" class="inputFile" type="file" id="myImg" name="myImg" title="">
              </span>
              <span id="fileName">{{ fileName }}</span>
        </div>
    </swiper-slide>
  </swiper>

      </div>
      <div class="btmBtnSty">
        <div @click="closeBtn()">
          取消
        </div>
        <div @click="updata">
          提交
        </div>
      </div>
    </div>
</template>
<script>
 import { Swiper, SwiperSlide,useSwiper,useSwiperSlide } from 'swiper/vue';
 import xg1 from "./static/xg1.mp4"
 import xg2 from "./static/xg2.mp4"
 import xg3 from "./static/xg3.mp4"
 import xg4 from "./static/xg4.mp4"
 import xg5 from "./static/xg5.mp4"
 import xg6 from "./static/xg6.mp4"
 import xg7 from "./static/xg7.mp4"
 import pmwz from "./static/pmwz.mp4"
 import xuang from "./static/xuang.mp4"
 import rh from "./static/rh.mp4"
 import dm from "./static/danmu.mp4"

 

 import { ref } from "vue";

// Import Swiper styles
import 'swiper/css';

import 'swiper/css/pagination';
// import './style.css';

// import required modules
import { Pagination} from 'swiper/modules';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup(props,ctx) {
    let swiperRef = null;
    let fileName=ref(null)
    let prependNumber =0;
    let base64File=""
    let modelList=[
    {
        title:"弹幕",
        modelId:"bullet",
        message:"",
        videoUrl:dm,
        maxLength:"10",
        isimg:false
      },{
        title:"平面文字",
        modelId:"plain",
        message:"",
        videoUrl:pmwz,
        maxLength:"10",
        isimg:false
      },{
        title:"图文并茂",
        message:"",
        videoUrl:xg1,
        modelId:"xp-draw1",
        maxLength:"10",
        isimg:true
      }, {
        title:"卡通",
        message:"",
        videoUrl:xg2,
        modelId:"xp-draw2",
        maxLength:"10",
        isimg:false

      }, {
        title:"我带你飞",
        message:"",
        videoUrl:xg3,
        modelId:"xp-draw3",
        maxLength:"10",
        isimg:false

      }, {
        title:"浪漫雪花",
        message:"",
        modelId:"xp-draw4",
        videoUrl:xg4,
        maxLength:"10",
        isimg:false
      }, 
      
      {
        title:"心意满满",
        modelId:"xp-draw6",
        message:"",
        videoUrl:xg5,
        maxLength:"10",
        isimg:false
      }, {
        title:"流星雨",
        modelId:"xp-draw7",
        message:"",
        videoUrl:xg6,
        maxLength:"10",
        isimg:false
      }, {
        title:"绚丽烟花",
        modelId:"xp-draw8",
        message:"",
        videoUrl:xg7,
        maxLength:"10",
        isimg:false
      }
      , {
        title:"绚光",
        modelId:"neon-blue-animation",
        message:"",
        videoUrl:xuang,
        maxLength:"10",
        isimg:false
      }, {
        title:"融合",
        modelId:"blur",
        message:"",
        videoUrl:rh,
        maxLength:"10",
        isimg:false
      }
    ]
    let textMsg=ref(null)
   
    const onSlideChange= (e)=>{
      prependNumber=e.activeIndex
      document.getElementsByClassName('myVideo')[prependNumber].currentTime=0      
        document.getElementsByClassName('myVideo')[prependNumber].play()
    }
    const setSwiperRef = (swiper) => {
        swiperRef = swiper;
      };

      const slideTo = (e) => {

        if(e=="+"){
          ++prependNumber
        }else{
          --prependNumber
          
        }
        document.getElementsByClassName('myVideo')[prependNumber].currentTime=0      
        document.getElementsByClassName('myVideo')[prependNumber].play()

        swiperRef.slideTo(prependNumber, 0);
      };
     
    function updata(){
      
      if(modelList[prependNumber].isimg&&base64File==''){
        alert('请上传图片')
        return
      }
      if(!modelList[prependNumber].isimg&&(textMsg.value==''||textMsg.value==null)){
        alert('请填写内容')
        return
      }
      ctx.emit('change',{
        value:modelList[prependNumber].isimg? textMsg.value+'||'+base64File:textMsg.value,
        modelId:modelList[prependNumber].modelId
      })
      textMsg.value=""
      base64File=""
      fileName.value=""
      closeBtn()

    }
    function closeBtn(){
        ctx.emit('close',{})
      }
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
}
    function updataChange(event){
      fileName.value = event.target.value.match(/[^\\|/]*$/)[0];
      fileToBase64(event.target.files[0]).then(e=>{
        base64File=e
      })
    }
    return {
      setSwiperRef,
      slideTo,
      onSlideChange,
      modelList,
      textMsg,
      prependNumber,
      updata,
      fileName,
      updataChange,
      fileToBase64,
      closeBtn,
      modules: [Pagination],
    };
  },
  mounted(){
    document.body.style.userSelect = 'none';
    document.getElementsByClassName('myVideo')[0].currentTime=0      
        document.getElementsByClassName('myVideo')[0].play()
  },
  methods:{
    
  }
};
</script>
<style lang="scss">
   .myVideo::-webkit-media-controls {
            display: none !important;
        }
.inputBtn {  
    position: relative;  
    display: inline-block;  
    padding: 6px 10px;  
    border: 1px solid #1E9FFF;  
    border-radius: 3px;  
    background-color: #1E9FFF;  
    cursor: pointer;  
    font-size: 12px;  
    color: #fff;  
}  
.inputBtn:hover{  
    border: 1px solid #3aa9fb;  
    background-color: #3aa9fb;  
}  
.inputFile {  
    position: absolute;  
    left: 0;  
    top: 0;  
    width: 100%;  
    height: 100%;  
    opacity: 0;  
    filter: alpha(opacity=0);  
}  
    .popupSty{
        width:100vw;
        height:100vh;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9999999999999999999999999999999999;
        padding-top: 10px;
        background-color: #fff;
        // background: linear-gradient(180deg, #E3F3FE 0%, rgba(255, 255, 255, 0.00) 100%);
        >div:nth-child(1){
          box-shadow: 2px 4px 6.5px 0px rgba(0, 0, 0, 0.1);
          width: 348px;
          min-height:658px;
          margin: 0 auto;
          border-radius: 15px;
        }
    }
    .swiperItemSty{
        width: 348px;
     
      
        min-height: 582px;
        border-radius: 14px;
        background: #FFF;
        
        >div:nth-child(1){
          width: 322px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          height: 60px;
          align-items: center;
          >div:nth-child(1),>div:nth-child(3){
            width: 15px;
            height: auto;
          }

          >div:nth-child(2){
            color: #000;
            text-align: center;
            font-family: Post No Bills Jaffna SemiBold;
            font-size: 28px;
            font-style: normal;
            font-weight: 600;
            line-height: normal;
            letter-spacing: 4px;
          }

        }
        >div:nth-child(2){
          width: 322px;
          height: 322px;
          flex-shrink: 0;
          background-color: #ccc;
          border-radius: 10px;
          margin: 0 auto;

        }
        >div:nth-child(3){
          width: 322px;
          height: 105px;
          flex-shrink: 0;
          border-radius: 14px;
          background: #F0F0F0;
          margin: 15px auto;
          >textarea{
            width: 100%;
            height: 100%;
            background: #F0F0F0;
            border: 0;
            border-radius: 14px;
            padding: 15px;
            box-sizing: border-box;
          }
        }


    }
    .btmBtnSty{
      width: 100vw;
      height: 70px;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 999;
      display: flex;
      justify-content: space-between;
      >div{
        width: 134px;
        height: 38px;
        flex-shrink: 0;
        border-radius: 26px;
        background: #0295FF;
        box-shadow: 2px 2px 4px 0px rgba(4, 84, 142, 0.40);
        color: #FFF;
        text-align: center;
        font-family: Post No Bills Jaffna SemiBold;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        letter-spacing: 4px;
        text-align: center;
        line-height: 38px;
        margin: 0 auto;
      }
      >div:active {
        opacity: .7;

      }

      >div:focus{
        opacity: .7;
      }

    }
    
</style>