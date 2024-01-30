<template>
	<div class="bb2"></div>
</template>

<script>
require("./js/wordFx.js");
// import {Word,randomBetween} from "./js/wordFx.js"
import anime from "./js/anime.js";
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
			document.getElementsByClassName('bb2')[0].innerHTML=`<div class="mainStys">
		<div class="content">
			<div class="slideshow">
				<div class="slide slide--current">
					<div class="slide__bg slide__bg--1"></div>
					<h2 class="word word--1" style="font-size:10em">${message}</h2>
				</div>
			</div>
		</div>
	</div>`
        	return new Promise((result)=>{
			

			const effects = [
				{
					options: {
						shapeColors: ['#6435ea', '#295ddc', '#9fd7ff', '#d65380', '#0228f7', '#242627']
					},
					hide: {
						lettersAnimationOpts: {
							duration: 800,
							delay: (t, i) => i * 40,
							easing: 'easeOutExpo',
							opacity: {
								value: 0,
								duration: 100,
								delay: (t, i) => i * 40,
								easing: 'linear'
							},
							translateY: ['0%', '100%']
						}
					},
					show: {
						lettersAnimationOpts: {
							duration: 6000,
							delay: (t, i) => i * 40,
							easing: 'easeOutElastic',
							opacity: [0, 1],
							translateY: ['100%', '0%']
						},
						shapesAnimationOpts: {
							duration: 2000,
							delay: (t, i) => i * 35 + 100,
							easing: 'easeOutQuad',
							translateY: () => [anime.random(-15, 15), anime.random(-200, 200)],
							scale: () => [0.2, randomBetween(0.5, 1)],
							opacity: [
								{
									value: 500,
									duration: 100,
									delay: (t, i) => i * 30 + 200
								},
								{
									value: 0,
									duration: 2000,
									delay: 100,
									easing: 'linear'
								}
							]
						}
					}
				}]
			class Slideshow {
				constructor(el) {
					this.DOM = {};
					this.DOM.el = el;
					this.DOM.slides = Array.from(this.DOM.el.querySelectorAll('.slide'));
					this.DOM.bgs = Array.from(this.DOM.el.querySelectorAll('.slide__bg'));
					this.DOM.words = Array.from(this.DOM.el.querySelectorAll('.word'));
					this.slidesTotal = this.DOM.slides.length;
					this.current = 0;
					this.words = [];

					this.DOM.words.forEach((word, pos) => {

						this.words.push(new Word(word, effects[pos].options));
					});
					this.isAnimating = true;
					this.words[this.current].show(effects[this.current].show).then((e) => {

						this.isAnimating = false

					});
				}
				show(direction) {

					if (this.isAnimating) return;
					this.isAnimating = true;

					let newPos;
					let currentPos = this.current;
					if (direction === 'next') {
						newPos = currentPos < this.slidesTotal - 1 ? currentPos + 1 : 0;
					}
					else if (direction === 'prev') {
						newPos = currentPos > 0 ? currentPos - 1 : this.slidesTotal - 1;
					}

					this.DOM.slides[newPos].style.opacity = 1;
					this.DOM.bgs[newPos].style.transform = 'none';
					anime({
						targets: this.DOM.bgs[currentPos],
						duration: 600,
						easing: [0.2, 1, 0.3, 1],
						translateY: ['0%', direction === 'next' ? '-100%' : '100%'],
						complete: () => {
							this.DOM.slides[currentPos].classList.remove('slide--current');
							this.DOM.slides[currentPos].style.opacity = 0;
							this.DOM.slides[newPos].classList.add('slide--current');
							this.words[newPos].show(effects[newPos].show).then(() => this.isAnimating = false);
						}
					});

					this.words[newPos].hide();
					this.words[this.current].hide(effects[currentPos].hide).then(() => {

						this.current = newPos;
					});
				}
			}

			const slideshow = new Slideshow(document.querySelector('.slideshow'));
			// document.querySelector('.slidenav__item--prev').addEventListener('click', () => slideshow.show('prev') );
			// document.querySelector('.slidenav__item--next').addEventListener('click', () => slideshow.show('next') );
			// document.addEventListener('keydown', (ev) => {
			// 	const keyCode = ev.keyCode || ev.which;
			// 	if ( keyCode === 37 ) {
			// 		slideshow.show('prev');
			// 	}
			// 	else if ( keyCode === 39 ) {
			// 		slideshow.show('next');
			// 	}
			// });
			setTimeout(() => {
                document.getElementsByClassName('bb2')[0].innerHTML=''
                result('cheng')
            }, this.playTime);
			})
		}

	}
}
</script>

<style lang="scss">
@import url(./css/base.css);
h2{

}
.mainStys {
	width: 500vw;
	height: 500vh;
	background-color: #4cabef;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2;
	webkit-text-stroke: 0px white;
}
</style>