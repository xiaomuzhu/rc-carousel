import * as styledComponents from 'styled-components'

interface SlideListProps {
  translateX: number
  width: number
}

export const SlideList = styledComponents.default.div.attrs<SlideListProps>({
  style: (props: SlideListProps) => ({
    width: props.width + 'px',
    transform: `translateX(${props.translateX}px)`,
  }),
})`
    display: block
    height: 100%
    position: relative
`
