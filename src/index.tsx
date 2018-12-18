/**
 * @class Carousel
 */

import * as PropTypes from 'prop-types'
import * as React from 'react'

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
  public static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    speed: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    animation: PropTypes.string.isRequired,
    isAuto: PropTypes.bool.isRequired,
    autoPlayInterval: PropTypes.number.isRequired,
    afterChange: PropTypes.func,
    beforeChange: PropTypes.func,
    selesctedColor: PropTypes.string,
    showDots: PropTypes.bool.isRequired,
  }

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
    // 设置轮播区域的尺寸
    this.setSize()
    // 开启自动播放
    this.setState(() => {
      this.shouldAutoPlay && this.autoPlay()
    })
    // 监听 document,如果处于隐藏状态,那么取消定时器
    document.addEventListener('visibilitychange', () => {
      const isHidden = document.hidden
      if (isHidden) {
        clearInterval(this.autoPlayTimer)
      } else {
        this.shouldAutoPlay && this.autoPlay()
      }
    })
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.rafId!)
    this.rafId = null
    clearInterval(this.autoPlayTimer)
  }

  public render() {
    const { height, selesctedColor, showDots } = this.props
    const { total, currentIndex, slideItemWidth } = this.state

    return (
      <Frame ref={this.frameRef} height={height}>
        {this.renderSildeList()}
        {showDots && this.renderDots(total, slideItemWidth, currentIndex, selesctedColor)}
      </Frame>
    )
  }

  /**
   * 渲染提示点
   *
   * @private
   * @param {number} total
   * @param {number} width
   * @param {number} currentIndex
   * @param {string} selesctedColor
   * @param {React.ReactNode[]} slideItems
   * @returns
   * @memberof Carousel
   */
  private renderDots(total: number, width: number, currentIndex: number, selesctedColor: string) {
    const dotProps = {
      total,
      width,
      currentIndex,
      selesctedColor,
    }

    return React.createElement(IndicatorDot, { ...dotProps })
  }

  private shouldAutoPlay() {
    const { total } = this.state
    const { isAuto } = this.props

    return total - 2 > 1 && isAuto
  }

  /**
   * 自动播放
   *
   * @private
   * @memberof Carousel
   */
  private autoPlay() {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer)
    }

    const { autoPlayInterval } = this.props

    this.autoPlayTimer = setInterval(() => this.handleSwipe('left'), autoPlayInterval)
  }

  /**
   * 设置轮播区域尺寸
   * @param x
   */
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

  /**
   * 渲染轮播主区域
   *
   * @private
   * @returns SlideList
   * @memberof Carousel
   */
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

    const slideListProps = {
      translateX,
      width: slideListWidth,
    }

    if (len === 1) {
      return (
        <SlideList {...slideListProps}>
          <SlideItem width={slideItemWidth}>
            {React.cloneElement(children as React.ReactElement<any>, slideItemSize)}
          </SlideItem>
        </SlideList>
      )
    }

    const firstElement = children[0]
    const lastElement = children[len - 1]

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

  /**
   * 处理触摸起始时的事件
   *
   * @private
   * @param {React.TouchEvent} e
   * @memberof Carousel
   */
  private onTouchStart(e: React.TouchEvent) {
    clearInterval(this.autoPlayTimer)
    const { x } = getPosition(e)
    this.setSize(x)
    this.setState({
      startPositionX: x,
    })
  }

  /**
   * 当触摸滑动时处理事件
   *
   * @private
   * @param {React.TouchEvent} e
   * @memberof Carousel
   */
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

  /**
   * 滑动结束处理的事件
   *
   * @private
   * @memberof Carousel
   */
  private onTouchEnd() {
    this.shouldAutoPlay && this.autoPlay()
    const { moveDeltaX, slideItemWidth, direction } = this.state
    const threshold = slideItemWidth * THRESHOLD_PERCENTAGE
    const moveToNext = Math.abs(moveDeltaX) > threshold

    if (moveToNext) {
      this.props.beforeChange && this.props.beforeChange()
      this.handleSwipe(direction!)
    } else {
      this.handleMisoperation()
    }
  }

  /**
   * 图片轮播换位
   *
   * @private
   * @memberof Carousel
   */
  private handleSwipe = (direction: Direction) => {
    const { children, speed } = this.props
    const { slideItemWidth, currentIndex, translateX } = this.state
    const count = React.Children.count(children)

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

  /**
   * 轮播失败,返回原地
   *
   * @private
   * @memberof Carousel
   */
  private handleMisoperation() {
    const { speed } = this.props
    const { slideItemWidth, currentIndex, translateX } = this.state

    const endValue = -slideItemWidth * currentIndex
    const tweenQueue = this.getTweenQueue(translateX, endValue, speed * MISOPERATION_TIME_PERCENTAGE)
    this.rafId = requestAnimationFrame(() => this.animation(tweenQueue, currentIndex))
  }

  /**
   * 获取动画轨迹的数组
   *
   * @private
   * @param {number} beginValue
   * @param {number} endValue
   * @param {number} speed
   * @returns
   * @memberof Carousel
   */
  private getTweenQueue(beginValue: number, endValue: number, speed: number) {
    const { animation } = this.props
    const tweenQueue = []
    const updateTimes = speed / UPDATE_INTERVAL
    for (let i = 0; i < updateTimes; i++) {
      tweenQueue.push(tweenFunction[animation](UPDATE_INTERVAL * i, beginValue, endValue, speed) as number)
    }
    return tweenQueue
  }

  /**
   * 递归调用,根据轨迹运动
   *
   * @private
   * @param {number[]} tweenQueue
   * @param {number} newIndex
   * @memberof Carousel
   */
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

  /**
   * 动画最后一步,归位
   *
   * @private
   * @param {number} newIndex
   * @memberof Carousel
   */
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
