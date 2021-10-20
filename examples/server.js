const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(WebpackConfig)
const router = express.Router()

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})

router.get('/base/get', function(req, res) {
  res.json(req.query)
  // 我们做了请求数据的处理，把 data 转换成了 JSON 字符串，但是数据发送到服务端的时候，服务端并不能正常解析我们发送的数据，因为我们并没有给请求 header 设置正确的 Content-Type。
})

router.post('/base/post', function(req, res) {
  res.json(req.body)
})

router.post('/base/buffer', function(req, res) {
  let msg = []
  req.on('data',(chunk)=>{
    if(chunk){
      msg.push(chunk)
    }
  })

  req.on('end',()=>{
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

app.use(router)
app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))



const port = process.env.PORT || 8082
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
