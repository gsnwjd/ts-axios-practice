import { AxiosStatic, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import mergeConfig from './core/mergeConfig'
import defaults from './default'

import CancelToken from './cancel/CancelToken'
import Cancel, { isCancel } from './cancel/Cancel'
// 在 createInstance 工厂函数的内部
// 我们首先实例化了 Axios 实例 context
// 接着创建instance 指向 Axios.prototype.request 方法，并绑定了上下文 context
// 接着通过 extend 方法把 context 中的原型方法和实例方法全部拷贝到 instance 上
// 这样就实现了一个混合对象：instance 本身是一个函数，又拥有了 Axios 类的所有原型和实例属性
// 最终把这个 instance 返回

// 由于这里 TypeScript 不能正确推断 instance 的类型
// 我们把它断言成 AxiosInstance 类型。

// 我们希望提供了一个 axios.create 的静态接口允许我们创建一个新的 axios 实例
// 同时允许我们传入新的配置和默认配置合并，并做为新的默认配置。
// AxiosInstance更改为AxiosStatic类型
// 新增取消方法

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 绑定上下文
  const instance = Axios.prototype.request.bind(context)

  // 交叉类型之和
  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function create(config) {
  // config和defaults合并
  return createInstance(mergeConfig(defaults, config))
}
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    //then参数函数类型
    return callback.apply(null, arr) //展开数组为多个参数
  }
}

axios.Axios = Axios
export default axios
