import { configure, render } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import 'jest-styled-components'
import * as React from 'react'
import IndicatorDot from '../../component/Dot'

configure({ adapter: new Adapter() })

describe('it works', () => {
  it('Dots', () => {
    const wrapper = render(<IndicatorDot total={5} currentIndex={1} width={200} selesctedColor={'red'} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
