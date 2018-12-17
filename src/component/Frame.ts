import * as styledComponents from 'styled-components'

export const Frame = styledComponents.default('div')<{ height: number }>`
  display: block
  width: 100vw
  height: ${props => props.height}px
  overflow: hidden
  background: grey
  position: relative
`
