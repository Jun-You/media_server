<template>
    <div class="boxssssss">


    </div>
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
        // draw1(message, outTime = 5000) {
        //     return new Promise((result) => {


        //         setTimeout(() => {
        //             document.getElementsByClassName('bb1')[0].innerHTML = ''
        //             result()
        //         }, outTime);
        //     })
        // }
        draw1(message, outTime = 5000) {

            document.getElementsByClassName('boxssssss')[0].innerHTML = ` <div style="position: fixed;
    left: 0;
    top: 0;" class="container">

<h1 style="font-size:10em;">${message}</h1>

<div class="bird-container bird-container--one">
    <div class="bird bird--one"></div>
</div>

<div class="bird-container bird-container--two">
    <div class="bird bird--two"></div>
</div>

<div class="bird-container bird-container--three">
    <div class="bird bird--three"></div>
</div>

<div class="bird-container bird-container--four">
    <div class="bird bird--four"></div>
</div>

</div>`
            return new Promise((result) => {

                setTimeout(() => {
                    document.getElementsByClassName('boxssssss')[0].innerHTML = ''
                    result()
                }, this.playTime);

            })
        }
    }
}
</script>
<style lang="scss">
/* tamil */
@font-face {
  font-family: 'Arima Madurai';
  font-style: normal;
  font-weight: 300;
  src: url(https://fonts.gstatic.com/s/arimamadurai/v15/t5t7IRoeKYORG0WNMgnC3seB1ZXtuoqmfyca.woff2) format('woff2');
  unicode-range: U+0964-0965, U+0B82-0BFA, U+200C-200D, U+20B9, U+25CC;
}
/* vietnamese */
@font-face {
  font-family: 'Arima Madurai';
  font-style: normal;
  font-weight: 300;
  src: url(https://fonts.gstatic.com/s/arimamadurai/v15/t5t7IRoeKYORG0WNMgnC3seB1ZXtupOmfyca.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Arima Madurai';
  font-style: normal;
  font-weight: 300;
  src: url(https://fonts.gstatic.com/s/arimamadurai/v15/t5t7IRoeKYORG0WNMgnC3seB1ZXtupKmfyca.woff2) format('woff2');
  unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Arima Madurai';
  font-style: normal;
  font-weight: 300;
  src: url(https://fonts.gstatic.com/s/arimamadurai/v15/t5t7IRoeKYORG0WNMgnC3seB1ZXtupymfw.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

*,
*::before,
*::after {
    box-sizing: border-box;
}

h1 {
    font-family: 'Arima Madurai', cursive;
    color: black;
    font-size: 8rem;
    letter-spacing: -3px;
    text-shadow: 0px 1px 1px rgba(255, 255, 255, 0.6);
    position: relative;
    z-index: 3;
}

.container {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    // min-height: 100vh;
    min-height: 35rem;
    // background-color: rgba(255, 168, 76, 1);
    background-image: linear-gradient(to bottom, rgba(255, 168, 76, 0.6) 0%, rgba(255, 123, 13, 0.6) 100%), url('https://images.unsplash.com/photo-1446824505046-e43605ffb17f');
    background-blend-mode: soft-light;
    background-size: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    padding: 2rem;
}

.bird {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/174479/bird-cells-new.svg);
    background-size: auto 100%;
    width: 88px;
    height: 125px;
    will-change: background-position;

    animation-name: fly-cycle;
    animation-timing-function: steps(10);
    animation-iteration-count: infinite;

    &--one {
        animation-duration: 1s;
        animation-delay: -0.5s;
    }

    &--two {
        animation-duration: 0.9s;
        animation-delay: -0.75s;
    }

    &--three {
        animation-duration: 1.25s;
        animation-delay: -0.25s;
    }

    &--four {
        animation-duration: 1.1s;
        animation-delay: -0.5s;
    }

}

.bird-container {
    position: absolute;
    top: 20%;
    left: -10%;
    transform: scale(0) translateX(-10vw);
    will-change: transform;

    animation-name: fly-right-one;
    animation-timing-function: linear;
    animation-iteration-count: infinite;

    &--one {
        animation-duration: 15s;
        animation-delay: 0;
    }

    &--two {
        animation-duration: 16s;
        animation-delay: 1s;
    }

    &--three {
        animation-duration: 14.6s;
        animation-delay: 9.5s;
    }

    &--four {
        animation-duration: 16s;
        animation-delay: 10.25s;
    }

}

@keyframes fly-cycle {

    100% {
        background-position: -900px 0;
    }

}

@keyframes fly-right-one {

    0% {
        transform: scale(0.3) translateX(-10vw);
    }

    10% {
        transform: translateY(2vh) translateX(10vw) scale(0.4);
    }

    20% {
        transform: translateY(0vh) translateX(30vw) scale(0.5);
    }

    30% {
        transform: translateY(4vh) translateX(50vw) scale(0.6);
    }

    40% {
        transform: translateY(2vh) translateX(70vw) scale(0.6);
    }

    50% {
        transform: translateY(0vh) translateX(90vw) scale(0.6);
    }

    60% {
        transform: translateY(0vh) translateX(110vw) scale(0.6);
    }

    100% {
        transform: translateY(0vh) translateX(110vw) scale(0.6);
    }

}

@keyframes fly-right-two {

    0% {
        transform: translateY(-2vh) translateX(-10vw) scale(0.5);
    }

    10% {
        transform: translateY(0vh) translateX(10vw) scale(0.4);
    }

    20% {
        transform: translateY(-4vh) translateX(30vw) scale(0.6);
    }

    30% {
        transform: translateY(1vh) translateX(50vw) scale(0.45);
    }

    40% {
        transform: translateY(-2.5vh) translateX(70vw) scale(0.5);
    }

    50% {
        transform: translateY(0vh) translateX(90vw) scale(0.45);
    }

    51% {
        transform: translateY(0vh) translateX(110vw) scale(0.45);
    }

    100% {
        transform: translateY(0vh) translateX(110vw) scale(0.45);
    }

}
</style>