const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const atob = require('atob')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const multipart = require('connect-multiparty')
const path = require('path')

require('./server2')
const app = express()
const compiler = webpack(WebpackConfig)
const router = express.Router()

app.use(webpackHotMiddleware(compiler))

// app.use(express.static(__dirname))
app.use(express.static(__dirname,{
  setHeaders(res){
    res.cookie('XSRF-TOKEN-D','1234ABC')
  }
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(multipart({
  uploadDir:path.resolve(__dirname,'upload-file')
}))
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

router.get('/error/get',function(req,res){
  if(Math.random()>0.5){
    res.json({msg:'hello world'})
  }else{
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout',function(req,res){
  setTimeout(()=>{
    res.json({
      msg:'hello world'
    })
  },3000)
})

registerExtendRouter();

router.get('/interceptor/get',function(req,res){
  res.end('拦截器end')
})

router.post('/config/post',function(req,res){
  res.json(req.body)
})

router.get('/cancel/get',function(req,res){
  setTimeout(()=>{
    res.json('hello')
  },1000)
})

router.post('/cancel/post',function(req,res){
  setTimeout(()=>{
    res.json(req.body)
  },1000)
})

router.get('/more/get',function(req,res){
  res.json(req.cookies)
})

router.get('/more/A',function(req,res){
  res.json('A')
})

router.get('/more/B',function(req,res){
  res.json('B')
})

router.get('/more/upload',function(req,res){
  console.log(req.body,req.files)
  res.end('upload success!')
})

router.post('/more/post',function(req,res){
  const auth = req.headers.authorization
  const [type,credentials] = auth.split(' ')
  console.log(atob(credentials))
  const [username,password] = atob(credentials).split(':')
  if(type === 'Basic' && username === 'wjd' && password === '123456'){
    res.json(req.body)
  }else{
    res.status(401)
    res.end('UnAuthorization')
  }
})

router.get('/more/304',function(req,res){
  res.status(304)
  res.end()
})

function registerExtendRouter(){
  router.get('/extend/get',function(req,res){
    res.json({
      msg:'hello world'
    })
  })

  router.options('/extend/options',function(req,res){
    res.end()
  })

  router.delete('/extend/delete',function(req,res){
    res.end()
  })

  router.head('/extend/head',function(req,res){
    res.end()
  })

  router.post('/extend/post',function(req,res){
    res.json(req.body)
  })

  router.put('/extend/put',function(req,res){
    res.json(req.body)
    
  })

  router.patch('/extend/patch',function(req,res){
    res.json(req.body)
  })

  router.get('/extend/user',function(req,res){
    res.json({
      code:0,
      message:'ok',
      result:{
        name:'jack',
        age:18
      }
    })
  })
}


app.use(router)
app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))



const port = process.env.PORT || 8081
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
