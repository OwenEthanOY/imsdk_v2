/* eslint-disable @typescript-eslint/no-unsafe-function-type */

/**
 * @description 生成一个只调用一次的函数, 该函数只会调用一次
 * @description_en Given a function, returns a function that is only calling that function once.
 */
export function createSingleCallFunction<T extends Function>(
  this: unknown,
  fn: T,
  fnDidRunCallback?: () => void,
): T {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const _this = this
  let didCall = false
  let result: unknown

  return function () {
    if (didCall) {
      return result
    }

    didCall = true
    if (fnDidRunCallback) {
      try {
        // eslint-disable-next-line prefer-rest-params
        result = fn.apply(_this, arguments)
      } finally {
        fnDidRunCallback()
      }
    } else {
      // eslint-disable-next-line prefer-rest-params
      result = fn.apply(_this, arguments)
    }

    return result
  } as unknown as T
}
