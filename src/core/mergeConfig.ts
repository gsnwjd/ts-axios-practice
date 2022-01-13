import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

const strats = Object.create(null)

function defaultstrat(val1: any, val2: any): any {
  // 优先取配置2中的值
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}

// 复杂对象合并策略，支持传入一个或多个参数
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    // 普通对象就深拷贝
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    // val2有值。值不是对象
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else {
    // 无论是val1 === 'undefined' 还是 val1!=='undefined' 最后的结果都要返回undefined
    return val1
  }
  // else if (typeof val1 !== 'undefined') {
  //   return val1
  // }
}
// 深入拷贝的策略应该是这些
const stratkeysDeepMerge = ['headers', 'auth']

stratkeysDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

// 定义一个合并策略函数的map，url,params...
const stratKeysFromVal2 = ['url', 'params', 'data']
stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2strat
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }
  const config = Object.create(null)
  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    // config1中出现，config2中没出现
    if (!config2[key]) {
      mergeField(key)
    }
  }
  function mergeField(key: string): void {
    const strat = strats[key] || defaultstrat
    config[key] = strat(config1[key], config2![key])
    // 多用了一层函数，需要断言为空
  }

  return config
}
