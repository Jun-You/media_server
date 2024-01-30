<template>
    <div class="mainDiv">
        
    </div>
	
</template>

<script>
	export default {
		name:"meteorPassing",
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
			// setTimeout(() => {
			//     document.querySelector("audio").play();
			// }, 2000);
			// this.drawCanvas()
		},
		methods: {
			drawCanvas(text){
                return new Promise((result)=>{

                setTimeout(() => {
			 document.getElementsByClassName('mainDiv')[0].innerHTML=''
             result()
		}, this.playTime);
            let spanNames=[]
            let spanNames1=[]

            text.split('').map(e=>{
                spanNames.push(`<span class="name">${e}</span>`)
                spanNames1.push(`<span class="name2" style="font-size:10em">${e}</span>`)
            })    
                let joinNames=spanNames.join(' ')
                document.getElementsByClassName('mainDiv')[0].innerHTML= `
                <div class="div3">
                    <div class="main">

                    ${joinNames}
		    <span class="name heart">❤</span>

		</div>
		
		<div class="main" style="display:flex;width:100%;height: 100%;
    transition: all 1s;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;position: auto;">
    <span class="name2 heart" style="font-size:10em">❤</span>

		    ${spanNames1.join(' ')}
		</div>
    </div>
             `


                function Meteor(speed = 5, style = 1, color = "aqua") {
	    this.speed = speed
	    this.style = style
	    this.color = color
	    this.meteor = null
	    // 初始化
	    this.init = () => {
	        this.meteor = document.createElement("div")
	        this.meteor.classList.add("meteor")
	        var xy = this.position()
	        if (this.meteor) {
	            this.meteor.style.animation = `meteor ${speed}s forwards`
	            this.meteor.style.backgroundColor = this.color
	            // console.log(this.color);
	            this.meteor.style.top = `${xy[1]}px`
	            this.meteor.style.right = `${xy[0]-700}px`
	        }
            document.getElementById('container').appendChild(this.meteor)
	        // document.body.appendChild(this.meteor)
	    }
	
	    this.destruct = () => {
	        if (this.meteor) {
                try {
            document.getElementById('container').removeChild(this.meteor)

                } catch (error) {
                    
                }

	        }
	    }
	
	    // 计算流星位置
	    this.position = () => {
	        var xy = [0, 0]
	        if (Math.floor(Math.random() * 2)) {
	            xy[0] = 0
	            xy[1] = -((Math.floor(Math.random() * document.body.clientWidth)))
	        } else {
	            xy[0] = -((Math.floor(Math.random() * document.body.clientHeight)))
	            xy[1] = 0
	        }
	        return xy
	    }
	
	    // 运行
	    this.run = () => {
	        this.init()
	        setTimeout(this.destruct, this.speed * 1000)
	    }
	}
	
	
	function start() {
	    let colors = ['f00', 'ff0', 'fff', '0ff', '00f', 'fba', 'bfa', 'f0f']
	    var n = Math.floor(Math.random() * colors.length)
	    var color = `#${colors[n]}`;
	    // console.log(color);
	    (new Meteor(n, n, color)).run()
        if(document.getElementsByClassName('mainDiv')[0].innerHTML==''){
           clearInterval(requestID)
        }
	}
      let classNames=document.getElementsByClassName('name')
      let classNames2=document.getElementsByClassName('name2')

        for (let w=0;w<classNames.length;w++){
            if(w==classNames.length-1){
                classNames[w].style.animation=` name1-heart 3s ${w*2}s linear`
            classNames2[w].style.animation=` show 1s ${classNames.length*2+1}s forwards`


            }else{
            classNames[w].style.animation=`name1 2s ${w*2}s linear`
            classNames2[w].style.animation=` show 1s ${classNames.length*2+1}s forwards`

            }
            if(w==0){
                classNames2[w].style.animation=` show-heart 1s ${classNames.length*2+2}s forwards`

            }
        }



        let requestID =setInterval(start, 1)
       
})

            }
		}
	}
	
</script>
 <style>
        * {
            margin: 0;
            padding: 0;
        }

        .div3 {
            background-color: #fff;
            height: 100vh;
            overflow: hidden;
            position: fixed;
            left: 0;
            top: 0;
            animation: bg 10s infinite alternate;
            width: 100vw;
            height: 100vh;

        }

        .main {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            width: 50px;
            height: 60px;
            cursor: pointer;
        }

        .main:nth-child(2) {
            transition: all 1s;
        }

        .main:nth-child(2):hover {
            transform: scale(1.5);
        }


        .name,
        .name2 {
            display: inline-block;
            font-weight: bold;
            font-size: 40px;
            font-family: serif;
            position: absolute;
            color: rgba(255, 255, 255, 0);
        }

        /* 名字动画后显示名字 */
        .name2 {
            position: relative;
            /* 9s */
            /* animation: show 1s 9s forwards; */
        }

        /* .name2:nth-child(4) {
            animation: show-heart 1s 10s forwards;
        } */

        /* 名字动画 */
        /* .name:nth-child(1) {
            animation: name1 2s linear;
        }

        .name:nth-child(2) {
            animation: name1 2s 2s linear;
        }

        .name:nth-child(3) {
            animation: name1 2s 4s linear;
        }

        .name:nth-child(4) {
            animation: name1-heart 3s 6s linear;
        } */


        @keyframes bg {
            to {
                background-color: rgb(10, 10, 10);
            }
        }

        /* 名字动画 */
        @keyframes name1 {
            0% {
                color: rgb(255, 255, 255, 0);
            }

            60% {
                color: rgb(255, 255, 255);
            }

            100% {
                color: rgba(255, 255, 255, 0);
                transform: scale(10);
            }
        }

        /* 显示第一个爱心 */
        @keyframes name1-heart {
            0% {
                color: rgb(255, 0, 0, 0);
            }

            60% {
                color: rgb(255, 0, 0);
            }

            100% {
                color: rgba(255, 0, 0, 0);
                transform: scale(100);

            }
        }


        /* 显示名字动画 */
        @keyframes show {
            to {
                color: rgba(255, 255, 255);
                transform: translateY(-100px);
            }
        }

        /* 显示名字后的爱心 */
        @keyframes show-heart {
            to {
                color: red;
                transform: translateY(-100px);
            }
        }


        .test:nth-child(3) {
            width: 4px;
            height: 100px;
            /* border-radius: 50%; */
            background-color: aqua;
            position: absolute;
            border-radius: 50% 50% 50% 50% / 98% 98% 5% 5%;
            top: 0;
            right: -20px;
            transform: rotate(45deg);
            animation: meteor 5s forwards;
        }


        .meteor {
            z-index: 100;
            width: 4px;
            height: 100px;
            background-color: aqua;
            position: absolute;
            border-radius: 50% 50% 50% 50% / 98% 98% 5% 5%;
            /* top: 0;
    right: -50px; */
            transform: rotate(45deg);
            /* animation: meteor 5s forwards; */
        }

        /* .meteor:hover{
    animation-play-state: paused;
} */

        @keyframes meteor {
            to {
                transform: rotate(45deg) translate(0, 5000px);

            }
        }
    </style>