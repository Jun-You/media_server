<template>
    <div class="asdadwq"></div>
    
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
        draw1(text) {

        	return new Promise((result)=>{

            setTimeout(() => {
                document.getElementsByClassName('asdadwq')[0].innerHTML=''
                result()
		    }, this.playTime);
                document.getElementsByClassName('asdadwq')[0].innerHTML = `<div class="boxs">

<div class='container'>
<h2 class="fadeup" style="font-size:10em;">${text}</h2>
<div class='reveal'>
<div class="image-wrap"><img src='https://img2.baidu.com/it/u=1929941019,3324507395&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500' /></div>
</div>
</div>
</div>`


document.addEventListener("DOMContentLoaded", function () {
                const options = {
                    root: null,
                    rootMargin: "0px",
                    threshold: 0.4
                };

                // IMAGE ANIMATION

                let revealCallback = (entries) => {
                    entries.forEach((entry) => {
                        let container = entry.target;

                        if (entry.isIntersecting) {
                            console.log(container);
                            container.classList.add("animating");
                            return;
                        }

                        if (entry.boundingClientRect.top > 0) {
                            container.classList.remove("animating");
                        }
                    });
                };

                let revealObserver = new IntersectionObserver(revealCallback, options);

                document.querySelectorAll(".reveal").forEach((reveal) => {
                    revealObserver.observe(reveal);
                });

                // TEXT ANIMATION

                let fadeupCallback = (entries) => {
                    entries.forEach((entry) => {
                        let container = entry.target;
                        container.classList.add("not-fading-up");

                        if (entry.isIntersecting) {
                            container.classList.add("fading-up");
                            return;
                        }

                        if (entry.boundingClientRect.top > 0) {
                            container.classList.remove("fading-up");
                        }
                    });
                };

                let fadeupObserver = new IntersectionObserver(fadeupCallback, options);

                document.querySelectorAll(".fadeup").forEach((fadeup) => {
                    fadeupObserver.observe(fadeup);
                });
            });

        })
        }
    }
}
</script>
<style lang="scss">
@import url('./css/p.css');
@import url('./css/reset.css');
@import url('./css/style.css');
@import url('./css/skn8ash.css');
.boxs{
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
}
</style>