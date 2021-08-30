import debounce from './debounce.js'

export class Slide {
  constructor(content, slide) {
    this.content = document.querySelector(content)
    this.slide = document.querySelector(slide)
    this.activeClass = 'active'
    this.distances = {
      finalPosition: 0,
      startX: 0,
      movement: 0
    }
    this.changeEvent = new Event('changeEvent')
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
    this.changeActiveClass()
    this.content.dispatchEvent(this.changeEvent)
  }

  changeActiveClass() {
    this.slideArray.forEach(item => item.element.classList.remove(this.activeClass))
    this.slideArray[this.index.active].element.classList.add(this.activeClass)
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

  onResize() {
    setTimeout(() => {
      this.slidesConfig()
      this.changeSlide(this.index.active)
    }, 1000)
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize)
  }

  bindEvents(){
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.onResize = debounce(this.onResize.bind(this), 200)
    this.activePrevSlide = this.activePrevSlide.bind(this)
    this.activeNextSlide = this.activeNextSlide.bind(this)
  }

  init() {
    this.bindEvents()
    this.addSlideEvents()
    this.slidesConfig()
    this.changeSlide(0)
    this.transition(true)
    this.addResizeEvent()

    return this
  }
}

export class SlideNav extends Slide {
  constructor(content, slide) {
    super(content, slide)
    this.bindControlEvents()
  }
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev)
    this.nextElement = document.querySelector(next)
    this.addArrowEvent()
  }

  addArrowEvent() {
    this.prevElement.addEventListener('click', this.activePrevSlide)
    this.nextElement.addEventListener('click', this.activeNextSlide)
  }

  createControl() {
    const control = document.createElement('ul')
    control.dataset.control = 'slide'

    this.slideArray.forEach((item, index) => {
      control.innerHTML += `<li><a href="#slide${index + 1}">${index + 1}</a></li>`
    })
    this.content.appendChild(control)
    return control
  }

  eventControl(item, index) {
    item.addEventListener('click', event => {
      event.preventDefault()

      this.changeSlide(index)
    })

    this.content.addEventListener('changeEvent', this.activeControlItem)
  }

  activeControlItem() {
    this.controlArray.forEach(item => item.classList.remove(this.activeClass))
    this.controlArray[this.index.active].classList.add(this.activeClass)
  }

  addControl(customControl) {
    this.control = document.querySelector(customControl) || this.createControl()
    
    this.controlArray = [...this.control.children]
    this.activeControlItem()
    this.controlArray.forEach(this.eventControl)
  }

  bindControlEvents(){
    this.eventControl = this.eventControl.bind(this)
    this.activeControlItem = this.activeControlItem.bind(this)
  }
}