import { SlideNav } from './slide.js'

const slide = new SlideNav('.content', '.slide')
slide.init()
slide.addArrow('.prev', '.next')
