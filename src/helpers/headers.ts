import { parse } from 'path'
import { deepMerge, isPlainObject } from './util'
import { Method } from '../types/index'

function normalizeHeaderName(headers: any, normalizedName: string): void {
  // 大小写问题，header不关心是否大小写
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}
export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}
// 我们通过 XMLHttpRequest 对象的 getAllResponseHeaders 方法获取到的值是如下一段字符串：
// 每一行都是以回车符和换行符 \r\n 结束，它们是每个 header 属性的分隔符。
// 对于上面这串字符串，我们希望最终解析成一个对象结构：
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  headers.split('\r\n').forEach(line => {
    let [key, ...vals] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    const val = vals.join(':').trim()

    parsed[key] = val
  })

  return parsed
}

// 我们需要把headers压成一级的
export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return headers
  }
  headers = deepMerge(headers.common, headers[method], headers)
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']
  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
