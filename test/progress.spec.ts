import axios from '../src/index'
import { getAjaxRequest } from './helper'

describe('progress', () => {
  beforeEach(() => {
    jasmine.Ajax.install()
  })

  afterEach(() => {
    jasmine.Ajax.uninstall()
  })

  test('should add a download progress handler', () => {
    const progressSpy = jest.fn()
    axios('/foo', { onDownloadProgress: progressSpy })
    return getAjaxRequest().then(request => {
      request.respondWith({
        status: 200,
        responseText: '{"foo":"bar"}'
      })

      expect(progressSpy).toHaveBeenCalled()
    })
  })

  test('should add a upload progress handler', () => {
    const progressSpy = jest.fn()
    axios('/foo', { onUploadProgress: progressSpy })
    return getAjaxRequest().then(request => {
      // Jasmine AJAX doesn't trigger upload events.Waiting for jest-ajax fix
      // expect(progressSpy).toHaveBeenCalled()
      // 由于 jasmine-ajax 插件不会派发 upload 事件
      // 这个未来可以通过我们自己编写的 jest-ajax 插件来解决
      // 目前不写断言的情况它会直接通过。
    })
  })
})
