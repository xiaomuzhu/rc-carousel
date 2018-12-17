import * as React from 'react'

export const getPosition = (e: React.TouchEvent) => {
  if (e.touches) {
    const { pageX, pageY } = e.touches[0]

    return {
      x: pageX,
      y: pageY,
    }
  }

  return {
    x: 0,
    y: 0,
  }
}
