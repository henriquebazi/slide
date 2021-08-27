export default class Slide {
  constructor(content, slide) {
    this.content = document.querySelector(content)
    this.slide = document.querySelector(slide)
  }

  onStart(event) {
    event.preventDefault()

    this.content.addEventListener('mousemove', this.onMove)
  }

  onMove(event) {

  }

  onEnd(event) {
    this.content.removeEventListener('mousemove', this.onMove)
  }

  addSlideEvents() {
    this.content.addEventListener('mousedown', this.onStart)
    this.content.addEventListener('mouseup', this.onEnd)
  }

  bindEvents(){
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
  }

  init() {
    this.bindEvents()
    this.addSlideEvents()

    return this
  }
}