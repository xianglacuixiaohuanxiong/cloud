# 小程序云开发

项目使用小程序云服务作为中间服务器,通过小程序调用云函数请求接口.<br>
使用此方法的目的在于不用配置https域名从而可以正常访问接口.
##  云端函数
-   所有接口全部通过一个云端函数执行.为不干扰到后期正式云开发小程序.
-   在get_api云端函数安装axios,通过axios请求服务端接口.

##  小程序端
-   接口放置在api目录下的allApi方法,该方法传递接口api与需要的参数;
```
    api.allApi({
        api: 'xxx',
        data: data
    })
```
## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)

