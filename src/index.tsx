/**
 * @class ExampleComponent
 */

import * as React from 'react'

import * as styledComponents from 'styled-components'

const Title = styledComponents.default.h1`
  display: inline-block;
  margin: 2em auto;
  border: 2px solid #000;
  font-size: 2em;
`

export interface IProps {
  text: string
}

export default class ExampleComponent extends React.Component<IProps> {
  public render() {
    const { text } = this.props

    return <Title>Example Component: {text}</Title>
  }
}
