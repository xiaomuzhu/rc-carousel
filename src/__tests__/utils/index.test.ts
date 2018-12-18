import { getPosition } from '../../utils'

test('getPosition success', () => {
  const e = {
    touches: [
      {
        pageX: 200,
        pageY: 300,
      },
    ],
  }
  expect(getPosition(e as any)).toEqual({
    x: 200,
    y: 300,
  })
})

test('getPosition fail', () => {
  const e = {
    touche1111: [
      {
        pageX: 200,
        pageY: 300,
      },
    ],
  }
  expect(getPosition(e as any)).toEqual({
    x: 0,
    y: 0,
  })
})
