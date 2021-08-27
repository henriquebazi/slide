export default class Slide {
  constructor(content, slide) {
    this.content = document.querySelector(content)
    this.slide = document.querySelector(slide)
    this.distances = {
      finalPosition: 0,
      startX: 0,
      movement: 0
    }
  }

  moveSlide(distX) {
    this.distances.movePosition = distX
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
  }

  updatePostion(clientX) {
    this.distances.movement = (this.distances.startX - clientX) * 1.6
    return this.distances.finalPosition - this.distances.movement
  }

  onStart(event) {
    event.preventDefault()

    this.distances.startX = event.clientX
    this.content.addEventListener('mousemove', this.onMove)
  }

  onMove(event) {
    const finalPosition = this.updatePostion(event.clientX)

    this.moveSlide(finalPosition)
  }

  onEnd() {
    this.content.removeEventListener('mousemove', this.onMove)
    this.distances.finalPosition = this.distances.movePosition
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