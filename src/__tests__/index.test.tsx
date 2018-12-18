import { configure, mount } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import Carousel from '../'

configure({ adapter: new Adapter() })

const setup = () => {
  const wrapper = mount(
    <Carousel>
      <div>Carousel Test</div>
    </Carousel>
  )

  return {
    wrapper,
  }
}

describe('Carousel', () => {
  const { wrapper } = setup()

  it('should render', () => {
    expect(wrapper.contains('Carousel Test')).toBeTruthy()
  })
})
