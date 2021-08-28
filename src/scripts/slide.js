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

  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
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
    this.transition(false)
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
    this.transition(true)
    this.changeSlideOnEnd()
  }

  changeSlideOnEnd() {
    if (this.distances.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide()
    } else if (this.distances.movement < 120 && this.index.previous !== undefined) {
      this.activePrevSlide()
    } else {
      this.changeSlide(this.index.active)
    }
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

  slidePosition(slide) {
    const margin = (this.content.offsetWidth - slide.offsetWidth) / 2

    return -(slide.offsetLeft - margin)
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map(element => {
      const position = this.slidePosition(element)

      return {
        position,
        element
      }
    })
  }

  slideIndexNav(index) {
    const last = this.slideArray.length - 1

    this.index = {
      previous: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1
    }

    console.log(this.index)
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index]

    this.moveSlide(this.slideArray[index].position)
    this.slideIndexNav(index)
    this.distances.finalPosition = activeSlide.position
  }

  activePrevSlide() {
    if (this.index.previous !== undefined) {
      this.changeSlide(this.index.previous)
    }
  }

  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next)
    }
  }

  init() {
    this.bindEvents()
    this.addSlideEvents()
    this.slidesConfig()
    this.changeSlide(0)
    this.transition(true)

    return this
  }
}