import { configure, mount } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
import * as React from 'react'
import Carousel from '../'

configure({ adapter: new Adapter() })

const setup = () => {
  const wrapperSingle = mount(
    <Carousel>
      <div>Carousel Test</div>
    </Carousel>
  )

  const wrapperMultiple = mount(
    <Carousel>
      <div id="first">Carousel Test1</div>
      <div id="second">Carousel Test2</div>
      <div id="three">Carousel Test3</div>
    </Carousel>
  )

  return {
    wrapperSingle,
    wrapperMultiple,
  }
}

describe('Carousel', () => {
  const { wrapperSingle, wrapperMultiple } = setup()

  it('should render', () => {
    expect(wrapperSingle.contains('Carousel Test')).toBeTruthy()

    expect(wrapperSingle.state('total')).toEqual(3)
  })

  it('dots should not render', () => {
    expect(wrapperSingle.find('span').exists()).toBeTruthy()

    wrapperSingle.setProps({
      showDots: false,
    })
    expect(wrapperSingle.find('span').exists()).toBeFalsy()
  })

  it('should render multiple', () => {
    expect(wrapperMultiple.state('total')).toEqual(5)
  })
})
