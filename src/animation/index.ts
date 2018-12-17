type tweenFunction = (t: number, b: number, _c: number, d: number) => number
const easeInOutQuad: tweenFunction = (t, b, _c, d) => {
  const c = _c - b
  if ((t /= d / 2) < 1) {
    return (c / 2) * t * t + b
  } else {
    return (-c / 2) * (--t * (t - 2) - 1) + b
  }
}

const easeInOutElastic: tweenFunction = (t, b, _c, d) => {
  const c = _c - b
  let s = 1.70158
  let p = 0
  let a = c
  if (t === 0) {
    return b
  } else if ((t /= d / 2) === 2) {
    return b + c
  }
  if (!p) {
    p = d * (0.3 * 1.5)
  }
  if (a < Math.abs(c)) {
    a = c
    s = p / 4
  } else {
    s = (p / (2 * Math.PI)) * Math.asin(c / a)
  }
  if (t < 1) {
    return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b
  } else {
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) * 0.5 + c + b
  }
}

const easeInOutCirc: tweenFunction = (t, b, _c, d) => {
  const c = _c - b
  if ((t /= d / 2) < 1) {
    return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b
  } else {
    return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
  }
}

const easeInOutExpo: tweenFunction = (t, b, _c, d) => {
  const c = _c - b
  if (t === 0) {
    return b
  }
  if (t === d) {
    return b + c
  }
  if ((t /= d / 2) < 1) {
    return (c / 2) * Math.pow(2, 10 * (t - 1)) + b
  } else {
    return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b
  }
}

const easeInOutQuint: tweenFunction = (t, b, _c, d) => {
  const c = _c - b
  if ((t /= d / 2) < 1) {
    return (c / 2) * t * t * t * t * t + b
  } else {
    return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b
  }
}

const easeInOutQuart: tweenFunction = (t, b, _c, d) => {
  const c = _c - b
  if ((t /= d / 2) < 1) {
    return (c / 2) * t * t * t * t + b
  } else {
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b
  }
}

const linear: tweenFunction = (t, b, _c, d) => {
  const c = _c - b
  return (c * t) / d + b
}

const easeInOutCubic: tweenFunction = (t, b, _c, d) => {
  const c = _c - b
  if ((t /= d / 2) < 1) {
    return (c / 2) * t * t * t + b
  } else {
    return (c / 2) * ((t -= 2) * t * t + 2) + b
  }
}

export const tweenFunction = {
  linear,
  easeInOutQuad,
  easeInOutElastic,
  easeInOutCirc,
  easeInOutExpo,
  easeInOutQuint,
  easeInOutQuart,
  easeInOutCubic,
}
