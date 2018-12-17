import React, { Component } from 'react'

import Carousel from 'rc-carousel'
export default class App extends Component {

  render () {

    return (
      <div className="App">
        <Carousel >
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544955814020&di=29a7b42350b6d5efc41b8113de650796&imgtype=0&src=http%3A%2F%2F01.minipic.eastday.com%2F20170525%2F20170525165353_c9101263c7206065a69929b56d4475c8_4.jpeg" alt="1"/>
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544955814357&di=04e480420616a90e24fec527706f25ad&imgtype=0&src=http%3A%2F%2Fimg.pcgames.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fgamephotolib%2F1607%2F19%2Fc2%2F15707739_1468943148736_medium.jpg" alt="1"/>
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544955814356&di=ff3b1471544f5d5c0d546be953485769&imgtype=0&src=http%3A%2F%2Fscdn.file1.gk99.com%2Fphoto%2F2017-05%2F2017-05-31%2F149619635994857.jpg" alt="1"/>
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1544955814352&di=ef7cd71976fb7bf69df6ebc038935624&imgtype=0&src=http%3A%2F%2F01.minipic.eastday.com%2F20170525%2F20170525163132_3eefa6dbb0663b2eaad4378eb655db78_8.jpeg" alt="1"/>
        </Carousel>
      </div>
    )
  }
}
