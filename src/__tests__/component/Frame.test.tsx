import { configure, render } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import 'jest-styled-components'
import * as React from 'react'
import { Frame } from '../../component/Frame'

configure({ adapter: new Adapter() })

describe('Frame', () => {
  it('it works', () => {
    const wrapper = render(<Frame height={200} />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })
})
