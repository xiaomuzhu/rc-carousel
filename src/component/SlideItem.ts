import * as styledComponents from 'styled-components'

export const SlideItem = styledComponents.default('div')<{ width: number }>`
  display: inline-block
  height: 100%
  width: ${props => props.width}px
`
