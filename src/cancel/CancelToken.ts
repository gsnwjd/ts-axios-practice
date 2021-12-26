import { CancelExecutor,CancelTokenSource,Canceler} from "../types"
import Cancel from './Cancel'

interface ResolvePromise{
    (reason?:Cancel):void
}

export default class CancelToken{
    promise: Promise<Cancel>
    reason?:Cancel
    constructor(executor:CancelExecutor){
        let resolvePromise:ResolvePromise
        this.promise = new Promise<Cancel>(resolve=>{
            resolvePromise = resolve
        })

        executor(message=>{
            if(this.reason){
                // 如果已经有值就直接return
                return 
            }
            this.reason = new Cancel(message)
            resolvePromise(this.reason)
        })

    }
    throwIfRequested(){
        if(this.reason){
            throw this.reason
        }
    }

    // 函数套函数形成闭包，把c赋值给cancel,cancel就是一个指针，指向了c这个函数
    static source(): CancelTokenSource{
        let cancel!:Canceler
        const token = new CancelToken(c=>{
            cancel = c
        })
        return {
            cancel,token
        }
    }
}