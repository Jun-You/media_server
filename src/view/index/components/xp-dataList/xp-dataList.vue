<template>
    <div class="mainSty">
        <div>
            <div class="searchSty">
                <div>
                    <img :src="search" alt="" srcset="">
                </div>
                <div>
                    <input type="text" v-model="searchText" placeholder="请输入查询关键词">
                </div>
                <div @click="getPlayList(searchText)">搜索</div>
            </div>
            <div style="height: 85vh;overflow-y: scroll;margin-top: 10px;">
                <div class="listSty" v-for="item in dataList" v-bind:key="item.title">
                <div>
                    <div>
                        <img :src="item.icon" alt="">
                    </div>
                    <div>
                        <div>{{ item.title }}</div>
                        <div>
                            {{ item.artist }} - {{ item.album }}
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <img @click="setObj=item,playPopSty=true" :src="play" alt="">
                    </div>
                    <div @click="ispop=true,setObj=item">
                        点播
                    </div>
                </div>
            </div>
            <div style="width: 100%;height: 20vh;"></div>
            </div>
           

            <div style="width: 100vw;height: 80px;position: fixed;bottom: 0;left: 0;background-color: #F7F8FC;">
                <div class="cancelSty" @click="cancel()">退出</div>
            </div>
            
        </div>

        <div class="popStys" v-if="ispop">
            <div>
                <div>确定点播：</div>
                <div>{{ setObj.title }}({{ setObj.artist }}-{{ setObj.album }})</div>
                <div>
                    <div @click="ispop=false">
                        取消
                    </div>
                    <div @click="setAdvertisement(setObj),ispop=false">
                        确定
                    </div>
                </div>
            </div>
        </div>

        <div style="" class="playPop" v-if="playPopSty" @click.stop="playPopSty=false">
            <div>
                <video :src="setObj.url" autoplay controls></video>
            </div>
        </div>
    </div>

</template>

<script setup>
import play from "../../../../assets/play.png"
import search from "../../../../assets/sc.png"

import {ref,defineEmits,onMounted} from "vue"
let ispop=ref(false)
let setObj=ref({})
let searchText=ref('')
let playPopSty=ref(false)
let dataList = ref([])

async function getPlayList(params='') {
    const response = await fetch(
      `https://www.shugan.tech/playlist/${window.mediaId}/${encodeURI(params)}`
    );
    dataList.value = await response.json();
}
/*
onMounted(()=>{
    getPlayList()
})
*/
const emit = defineEmits(['childEvent','cancel']);
const cancel=()=>{
    
    emit('cancel',{});
}
const setAdvertisement=(obj)=>{
    emit('childEvent',obj);
}


</script>

<style lang="scss">
.cancelSty{
    width: 343px;
    height: 50px;
    background-color: #188EF4;
    color: #fff;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px auto;
    border-radius: 10px;

}
.cancelSty:active{
    opacity: .7;
}
.playPop{
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    >div{
        width: 80vw;
        height: 50vw;
        background-color: #fff;
        >video{
            width: 100%;
            height: 100%;
        }
    }
}
.mainSty{
    width: 100vw;
    height: 100vh;
    background-color: #F7F8FC;
    padding-top: 5px;
    box-sizing: border-box;
    user-select: none;
    position: fixed;
    left: 0;
    top: 0;
}
.listSty{
    width: 343px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    >div:nth-child(1){
        display: flex;
    align-items: center;

        >div:nth-child(1){
            width: 50px;
            height: 50px;
            border-radius: 5px;
            >img{
                width: 50px;
                height: 50px;

            }
        }
        >div:nth-child(2){
            padding-left: 10px;
            text-align: left;
            >div:nth-child(2){
            font-family: PingFang SC Bold, PingFang SC Bold;
            font-weight: 400;
            font-size: 15px;
            color: #292929;
            }
            >div:nth-child(3){
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 12px;
                color: #292929;
            }
        }
    }
    >div:nth-child(2){
        display: flex;
        align-items: center;
        >div:nth-child(1){
            width: 20px;
            height: 17px;
            >img{
                width: 20px;
                height: 17px;
            }
        }
        >div:nth-child(2){
            margin-left: 10px;
            width: 70px;
            height: 33px;
            background: #188EF4;
            border-radius: 11rpx 11rpx 11rpx 11rpx;
            border-radius: 5px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 13rpx;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

}
.searchSty{
    width: 343px;
    display: flex;
    height: 33px;
    border-radius: 16px;
    margin: 0 auto;
    background-color: #fff;
    >div:nth-child(1){
        width: 33px;
        height: 33px;
        display: flex;
        align-items: center;
        justify-content: center;
        >img{
            width: 20px;
            height: 20px;
        }
    }
    >div:nth-child(2){
        width: 250px;
        >input{
            width: 100%;
            height: 100%;
            border: 0;
            padding-left: 10px;
        }
    }
    >div:nth-child(3){
        width: 70px;
        height: 33px;
        background: #188EF4;
        border-radius: 16px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        font-size: 13px;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    >div:nth-child(3):active{
        opacity: .7;
    }
}
input {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  outline: none;
}
input[type="text"],input[type="password"],input[type="email"]{
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  outline: none;
  /* 添加任意自定义样式 */
}
input:hover,
input:focus {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  outline: none;
  /* 添加任意自定义样式 */
}
.popStys{
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    >div{
        width: 260px;
        height: 160px;
        background: #FFFFFF;
        box-shadow: 0rpx 0rpx 8px 0rpx rgba(0,0,0,0.14);
        border-radius: 11px;
        >div:nth-child(1){
            font-family: Source Han Sans CN, Source Han Sans CN;
            font-weight: 400;
            font-size: 16px;
            color: #000000;
            box-sizing: border-box;
            padding-bottom: 30px;
            padding-top: 15px;
        }
        >div:nth-child(2){
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 13px;
            color: #5F5F5F;
            padding-bottom: 20px;
            box-sizing: border-box;
        }
        >div:nth-child(3){
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 12px;
            display: flex;
            justify-content: space-around;
            >div:nth-child(1){
                width: 90px;
            color: #000000;
                height: 30px;
                border-radius: 20px;
                border: 1px solid #DEDEDE;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            >div:nth-child(2){
                width: 90px;
                height: 30px;
                background: #188EF4;
                border-radius: 20px;
                color: #FFFFFF;
                display: flex;
                align-items: center;
                justify-content: center;

            }
            >div:active{
                opacity: .7;
            }
        }

    }
}
</style>