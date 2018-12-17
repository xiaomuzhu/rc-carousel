/**
 * @class ExampleComponent
 */

import * as React from 'react'

// import { number } from 'prop-types';
import { tweenFunction } from './animation/index'
import IndicatorDot from './component/Dot'
import { Frame } from './component/Frame'
import { SlideItem } from './component/SlideItem'
import { SlideList } from './component/SlideList'
import Props from './props'
import State from './state'
import { Direction } from './state'
import { getPosition } from './utils/index'

const FPS = 60
const UPDATE_INTERVAL = 1000 / FPS
const THRESHOLD_PERCENTAGE = 0.1
const MISOPERATION_TIME_PERCENTAGE = THRESHOLD_PERCENTAGE * 2

export default class Carousel extends React.Component<Props, State> {
  public static defaultProps = new Props()

  private frameRef: React.RefObject<HTMLDivElement> = React.createRef()
  private rafId: number | null
  private autoPlayTimer: NodeJS.Timeout

  constructor(props: Props) {
    super(props)
    this.state = new State()
    this.rafId = null
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }

  public componentDidMount() {
    this.setSize()
    this.setState(() => {
      this.props.isAuto && this.autoPlay()
    })
    document.addEventListener('visibilitychange', () => {
      const isHidden = document.hidden
      if (isHidden) {
        clearInterval(this.autoPlayTimer)
      } else {
        this.autoPlay()
      }
    })
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.rafId!)
    this.rafId = null
    window.removeEventListener('resize', this.handleResize)
    clearInterval(this.autoPlayTimer)
  }

  public render() {
    const { children, height, selesctedColor, showDots } = this.props
    const { total, currentIndex, slideItemWidth } = this.state

    return (
      <Frame ref={this.frameRef} height={height}>
        {this.renderSildeList()}
        {showDots && this.renderDots(total - 2, slideItemWidth, currentIndex, selesctedColor, children)}
      </Frame>
    )
  }

  private renderDots(
    total: number,
    width: number,
    currentIndex: number,
    selesctedColor: string,
    slideItems: React.ReactNode[]
  ) {
    const dotProps = {
      total,
      width,
      currentIndex,
      slideItems,
      selesctedColor,
    }

    return React.createElement(IndicatorDot, { ...dotProps })
  }

  private autoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer)
    }

    const { autoPlayInterval } = this.props

    this.autoPlayTimer = setInterval(() => this.handleSwipe('left'), autoPlayInterval)
  }

  private handleResize() {
    const width = window.innerWidth
    const { total, currentIndex } = this.state
    this.setState({
      slideItemWidth: width,
      slideListWidth: total * width,
      translateX: -width * currentIndex,
    })
  }

  private setSize(x?: number) {
    const { width } = this.frameRef.current!.getBoundingClientRect()
    const len = React.Children.count(this.props.children)
    const total = len + 2

    this.setState({
      slideItemWidth: width,
      slideListWidth: total * width,
      total,
      translateX: -width * this.state.currentIndex,
      startPositionX: x !== undefined ? x : 0,
    })
  }

  private renderSildeList() {
    const { children, height } = this.props
    const len = React.Children.count(children)

    if (len < 1) {
      return null
    }

    const { translateX, slideItemWidth, slideListWidth } = this.state

    const slideItemSize = {
      height,
      width: slideItemWidth,
    }

    const firstElement = children[0]
    const lastElement = children[len - 1]

    const slideListProps = {
      translateX,
      width: slideListWidth,
    }

    return (
      <SlideList {...slideListProps}>
        <SlideItem width={slideItemWidth}>{React.cloneElement(lastElement, slideItemSize)}</SlideItem>
        {React.Children.map(children, (child: React.ReactElement<any>, i: number) => {
          return (
            <SlideItem
              onTouchStart={this.onTouchStart}
              onTouchMove={this.onTouchMove}
              onTouchEnd={this.onTouchEnd}
              width={slideItemWidth}
              key={i}
            >
              {React.cloneElement(child, slideItemSize)}
            </SlideItem>
          )
        })}
        <SlideItem width={slideItemWidth}>{React.cloneElement(firstElement, slideItemSize)}</SlideItem>
      </SlideList>
    )
  }

  private onTouchStart(e: React.TouchEvent) {
    clearInterval(this.autoPlayTimer)
    const { x } = getPosition(e)
    this.setSize(x)
    this.setState({
      startPositionX: x,
    })
  }

  private onTouchMove(e: React.TouchEvent) {
    const { slideItemWidth, currentIndex, startPositionX } = this.state
    const { x } = getPosition(e)

    const deltaX = x - startPositionX
    const direction = deltaX > 0 ? 'right' : 'left'

    this.setState({
      direction,
      moveDeltaX: deltaX,
      translateX: -(slideItemWidth * currentIndex) + deltaX,
    })
  }

  private onTouchEnd() {
    this.autoPlay()
    const { moveDeltaX, slideItemWidth, direction } = this.state
    const threshold = slideItemWidth * THRESHOLD_PERCENTAGE
    const moveToNext = Math.abs(moveDeltaX) > threshold

    if (moveToNext) {
      this.handleSwipe(direction!)
    } else {
      this.handleMisoperation()
    }
  }

  private handleSwipe = (direction: Direction) => {
    const { children, speed } = this.props
    const { slideItemWidth, currentIndex, translateX } = this.state
    const count = children.length

    this.props.beforeChange && this.props.beforeChange()

    let endValue: number
    let newIndex: number
    if (direction === 'left') {
      newIndex = currentIndex !== count ? currentIndex + 1 : 1
      endValue = -slideItemWidth * (currentIndex + 1)
    } else {
      newIndex = currentIndex !== 1 ? currentIndex - 1 : count
      endValue = -slideItemWidth * (currentIndex - 1)
    }

    const tweenQueue = this.getTweenQueue(translateX, endValue, speed)
    this.rafId = requestAnimationFrame(() => this.animation(tweenQueue, newIndex))
    this.props.afterChange && this.props.afterChange()
  }

  private handleMisoperation() {
    const { speed } = this.props
    const { slideItemWidth, currentIndex, translateX } = this.state

    const endValue = -slideItemWidth * currentIndex
    const tweenQueue = this.getTweenQueue(translateX, endValue, speed * MISOPERATION_TIME_PERCENTAGE)
    this.rafId = requestAnimationFrame(() => this.animation(tweenQueue, currentIndex))
  }

  private getTweenQueue(beginValue: number, endValue: number, speed: number) {
    const { animation } = this.props
    const tweenQueue = []
    const updateTimes = speed / UPDATE_INTERVAL
    for (let i = 0; i < updateTimes; i += 1) {
      tweenQueue.push(tweenFunction[animation](UPDATE_INTERVAL * i, beginValue, endValue, speed))
    }
    return tweenQueue
  }

  private animation(tweenQueue: number[], newIndex: number) {
    if (tweenQueue.length < 1) {
      this.handleOperationEnd(newIndex)
      return
    }
    this.setState({
      translateX: tweenQueue[0],
    })
    tweenQueue.shift()
    this.rafId = requestAnimationFrame(() => this.animation(tweenQueue, newIndex))
  }

  private handleOperationEnd(newIndex: number) {
    const { slideItemWidth } = this.state

    this.setState({
      currentIndex: newIndex,
      translateX: -slideItemWidth * newIndex,
      moveDeltaX: 0,
      dragging: false,
      direction: null,
      startPositionX: 0,
    })
  }
}
