export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'HEAD'
  | 'head'
  | 'options'
  | 'OPTIONS'
  | 'POST'
  | 'post'
  | 'patch'
  | 'PATCH'
  | 'put'
  | 'PUT'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType?: XMLHttpRequestResponseType
  // 我们可以设置某个请求的超时时间 timeout
  // ，也就是当请求发送后超过某个时间后仍然没收到响应，则请求自动终止，并触发 timeout 事件。
  // 请求默认的超时时间是 0，即永不超时。所以我们首先需要允许程序可以配置超时时间：
  timeout?: number
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
  withCredentials?: boolean

  // 每次发送请求的时候，从 cookie 中读取对应的 token 值
  // 然后添加到请求 headers中
  // 我们允许用户配置 xsrfCookieName 和 xsrfHeaderName
  // 其中 xsrfCookieName 表示存储 token 的 cookie 名称
  // xsrfHeaderName 表示请求 headers 中 token 对应的 header 名称。
  xsrfCookieName?: string
  xsrfHeaderName?: string

  // 对上传和下载做监控
  onDownloadProgress?: (e: ProgressEvent) => void
  onUploadProgress?: (e: ProgressEvent) => void
  auth?: AxiosBasicCredentials

  validateStatus?: (status: number) => boolean
  paramsSerializer?: (params: any) => string

  // 我们不希望每次发送请求都填写完整的 url，希望可以配置一个 baseURL，之后都可以传相对路径
  baseURL?: string

  [propName: string]: any
}

export interface AxiosResponse<T = any> {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse> {}

export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

export interface Axios {
  defaults: AxiosRequestConfig
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>

  getUri(config?: AxiosRequestConfig): string
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>

  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance

  CancelToken: CancelTokenStatic
  Cancel: CancelStatic
  isCancel: (value: any) => boolean
  // 实际上，axios.all 就是 Promise.all 的封装
  // 它返回的是一个 Promise 数组
  // then 函数的参数本应是一个参数为 Promise resolves（数组）的函数
  // 在这里使用了 axios.spread 方法
  // 所以 axios.spread 方法是接收一个函数，返回一个新的函数
  // 新函数的结构满足 then 函数的参数结构。
  all<T>(promises: Array<T | Promise<T>>): Promise<T[]>
  spread<T, R>(callback: (...args: T[]) => R): (arr: T[]) => R
  Axios: AxiosClassStatic
}

// 我们需要给相关的接口定义添加泛型参数。

export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number
  eject(id: number): void
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

export interface AxiosTransformer {
  (data: any, headers?: any): any
}

// 其中 CancelToken 是实例类型的接口定义
// Canceler 是取消方法的接口定义
// CancelExecutor 是 CancelToken 类构造函数参数的接口定义。
export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  throwIfRequested(): void
}

export interface Canceler {
  // 取消的时候可以输入一段字符串
  (message?: string): void
}

// 传给token构造函数的参数类型

export interface CancelExecutor {
  (cancel: Canceler): void
}

// 其中 CancelTokenSource 作为 CancelToken 类静态方法 source 函数的返回值类型
// CancelTokenStatic 则作为 CancelToken 类的类类型。

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}

export interface AxiosBasicCredentials {
  username: string
  password: string
}
