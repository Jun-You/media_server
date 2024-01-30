<template>
    <div class="mainBox"></div>
    
</template>

<script>
    export default {
        data() {
			return {
				
			}
		},
        props:{
			playTime:{
				type:Number,
				default:5000
			}
		},
		onLoad() {
			
		},
		mounted() {
            
        },
		 methods: {
             draw1(message,outTime=5000){
                    // <img class="imgClass" src="data:image/jpg;base64,${message[1]}" alt="">
                return new Promise(resolve=>{
                    message=message.split('||');
                    document.getElementsByClassName('mainBox')[0].innerHTML=`<div class="main-sty">
        <div>
            <div>
                <div class="imgbbBox">
                    <img class="imgClass" style="max-height:100vh;max-width:100vw" src="data:image/jpg;base64,${message[1]}" alt="">
                

                </div>
            </div>
           
        </div>
        <div>
        <h1 class="animate__animated animate__fadeIn" style="font-size:100px">${message[0]=='null'?'':message[0]}</h1>

        </div>

    </div>`
            setTimeout(() => {
                document.getElementsByClassName('mainBox')[0].innerHTML=''
                console.log("xianzhixing ")
                resolve('cheng')
            }, this.playTime);

           
                })
              
            }
            
        }
    }
</script>

<style lang="scss">
@import 'animate.css';

@keyframes scaleanim {
    0%{
        transform: scale(1.2);
    }
    50%{
    
        transform: scale(1.05);
    }
    100%{
        transform: scale(1);

    }
}
@keyframes clipPathAnim {
    0%{
        clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);

    }
    100%{
        clip-path: polygon(0 0, 100% 0%, 100% 100%, 0 100%);


    }
}
    .main-sty{
        width: 100%;
        height: 100%;
        background-color:#000000 ;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2;
        >div:nth-child(1){
            width: 100%;
            height: 100%;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            >div{
                width: 100%;
                height: auto;
                overflow: hidden;
                >div{
                width: auto;
                height: 100vh;
                overflow: hidden;
                animation:scaleanim 4s;
                text-align: center;

                // transform: scale(1.2);
                // transition: 4s ease-out;
                
                >img{
                    // width: auto;
                    // height: 100%;
                    object-fit: contain;
                    width: 100vw;
                    height: 100vh;
                    transition: 1s;
                    animation:clipPathAnim 1s;


                    

                }
            }
            }
            
        }
        >div:nth-child(2){
            width: 100%;
            height: 100%;
            position: absolute;
            display: flex;
            align-items: flex-end;
            padding-bottom: 200px;
            justify-content: center;
            font-size: clamp(3rem, 10vw, 6rem);
            font-weight: 700;
            z-index: 3;
            -webkit-text-stroke: 2px white;
            text-stroke: 2px white;
            color: transparent;
            color:#fff;

        }

    }
</style>