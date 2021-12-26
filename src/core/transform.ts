// 重构之前写的对请求数据和响应数据的处理逻辑

import { AxiosRequestConfig, AxiosTransformer } from "..";

// 由于我们可能会编写多个转换函数，我们先定义一个 transform 函数来处理这些转换函数的调用逻辑
export default function transform(data:any,headers:any,fns?:AxiosTransformer| AxiosTransformer[]):any{
    if(!fns){
        return data
    }
    if(!Array.isArray(fns)){
        fns = [fns]
    }
    fns.forEach(fn=>{
        data = fn(data,headers)
    })
    return data
}