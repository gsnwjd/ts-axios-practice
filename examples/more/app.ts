import axios from '../../src/index'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import qs from 'qs'



// document.cookie = 'a=b'

// axios.get('/more/get').then(res=>{
//   console.log(res)
// })

axios.post('http://localhost:8088/more/server2',{},{
  withCredentials:false
}).then(res=>{
  console.log(res)
})

// 测试XSRF防御的demo
// const instance =  axios.create({
//   xsrfCookieName:'XSRF-TOKEN-D',
//   xsrfHeaderName:'X-XSRF-TOKEN-D'
// })

// instance.get('/more/get').then(res=>{
//   console.log(res)
// })

const instance = axios.create()

function calculatePercentage(loaded:number,total:number){
  return Math.floor(loaded*1.0/total)
}

function loadProgressBar(){
  const setupStartProgress=()=>{
    instance.interceptors.request.use(config=>{
      NProgress.start()
      return config
    })
  }


const setupUpdateProgress=()=>{
  const update = (e:ProgressEvent) => {
    console.log(e)
    NProgress.set(calculatePercentage(e.loaded,e.total))
  }

  instance.defaults.onDownloadProgress = update
  instance.defaults.onUploadProgress = update
}

const setupStopProgress=()=>{
  instance.interceptors.response.use(response=>{
    NProgress.done()
    return response
  },error=>{
    NProgress.done()
    return Promise.reject(error)
  })
}

  setupStartProgress()
  setupUpdateProgress()
  setupStopProgress()

}

loadProgressBar()

const downEl = document.getElementById('download')

downEl!.addEventListener('click',e=>{
  instance.get('https://img.mukewang.com/5cc01a7b0001a33718720632.jpg',{
      withCredentials:true
    })
})

const uploadEl = document.getElementById('upload')

uploadEl!.addEventListener('click',e=>{
  const data = new FormData()
  const fileEl = document.getElementById('file') as HTMLInputElement
  if(fileEl.files){
    data.append('file',fileEl.files[0])

    instance.post('/more/upload',data)
  }
})

axios.post('/more/post',{
  a:1
},{
  auth:{
  username:'wjd',
  password:'123456'
}}).then(res=>{
  console.log(res)
})


// axios.get('/more/304').then(res=>{
//   console.log('-----------',res)
// }).catch((e)=>{
//   console.log(e.message)
// })

// axios.get('/more/304',{
//   validateStatus(status){
//     console.log('------------',status,'----------------')
//     return status >=200 && status <400
//   }
// }).then(res=>{
//   console.log(res)
// }).catch((e)=>{
//   console.log(e.message)
// })

// axios.get('/more/get',{
//   params:new URLSearchParams('a=b&c=d')
// }).then(res=>{
//   console.log(res)
// })

// axios.get('/more/get',{
//   params:{
//     a:1,
//     b:2,
//     c:['1','d']
//   }
// }).then(res=>{
//   console.log(res)
// })


// // axios.get('/more/get',{
// //   params:{
// //     a:1,
// //     b:2,
// //     c:['1','d']
// //   },
// //   paramsSerializer(params){
// //     return qs.stringify(params,{arrayFormat:'brackets'})
// //   }
// // }).then(res=>{
// //   console.log(res)
// // })

// baseurl demo测试

// const instance3 = axios.create({
//   baseURL:'https://img.mukewang.com/'
// })

// instance3.get('5cc01a7b0001a33718720632.jpg')
// instance3.get('https://img.mukewang.com/szimg/5becd5ad0001b89306000338-360-202.jpg')


function getA(){
  return axios.get('/more/A')
}

function getB(){
  return axios.get('/more/B')
}

axios.all([getA(),getB()]).then(axios.spread(function(resA,resB){
  console.log(resA.data,resB.data)
}))


axios.all([getA(),getB()]).then(([resA,resB])=>{
  console.log(resA.data,resB.data)
})

const fakeConfig = {
  baseURL:'http://www.baidu.com/',
  url:'/user/12345',
  params:{
    idClient:1,
    idTest:2,
    testString:'this is a test'
  }
}

console.log(axios.getUri(fakeConfig))

