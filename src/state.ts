export type Direction = 'right' | 'left'

export default class State {
  public currentIndex: number = 1
  public slideListWidth: number
  public slideItemWidth: number
  public startPositionX: number
  public moveDeltaX: number
  public translateX: number
  public direction: Direction | null
  public total: number
  public dragging: false
}
