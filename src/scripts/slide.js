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
    let moveType 
    if (event.type === 'mousedown') {
      event.preventDefault()

      moveType = 'mousemove'
      this.distances.startX = event.clientX
    } else {
      moveType = 'touchmove'
      this.distances.startX = event.changedTouches[0].clientX
    }

    this.content.addEventListener(moveType, this.onMove)
  }

  onMove(event) {
    const pointerPostion = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX
    const finalPosition = this.updatePostion(pointerPostion)

    this.moveSlide(finalPosition)
  }

  onEnd(event) {
    const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove'
    this.content.removeEventListener(moveType, this.onMove)
    this.distances.finalPosition = this.distances.movePosition
  }

  addSlideEvents() {
    this.content.addEventListener('mousedown', this.onStart)
    this.content.addEventListener('touchstart', this.onStart)
    this.content.addEventListener('mouseup', this.onEnd)
    this.content.addEventListener('touchend', this.onEnd)
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