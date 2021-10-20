import { isPlainObject } from './util'
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    // 排除表单数据
    return JSON.stringify(data)
  }
  return data
}

// 在我们不去设置 responseType 的情况下，当服务端返回给我们的数据是字符串类型，我们可以尝试去把它转换成一个 JSON 对象。例如：
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      //do nothing
    }
  }
  return data
}
