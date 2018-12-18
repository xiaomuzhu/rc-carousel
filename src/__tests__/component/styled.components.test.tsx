import { configure, render } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import 'jest-styled-components'
import * as React from 'react'
import { Frame } from '../../component/Frame'
import { SlideItem } from '../../component/SlideItem'
import { SlideList } from '../../component/SlideList'

configure({ adapter: new Adapter() })

describe('it works', () => {
  it('Frame', () => {
    const wrapper = render(<Frame height={200} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('SlideList', () => {
    const slideListProps = {
      translateX: 200,
      width: 2000,
    }
    const wrapper = render(
      <SlideList {...slideListProps}>
        <SlideItem width={200} />
      </SlideList>
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  it('SlideItem', () => {
    const wrapper = render(<SlideItem width={200} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
