<h1 align="center">bundle-compare-analyzer</h1>

<p align="center">
  :sparkling_heart::rocket::rocket::rocket::rocket: ............ :kissing_heart:
</p>

<p align="center">
  <img alt="bundle-compare-analyzer" src="https://raw.githubusercontent.com/lanjingling0510/bundle-compare-analyzer/master/.github/screenshot_1.png">
</p>

---



<p align="center">
  <br><br>
  <b>
    bundle-compare-analyzer是一个简单的分析各个版本代码打包文件大小的可视化工具。
  </b>
  <br><br>
</p>


bundle-compare-analyzer可以在每次将代码文件打包时，生成一个版本。便于对比，分析各个版本打包文件的大小。

## 安装

```sh
npm install -g bundle-compare-analyzer
```

支持node4.0以上版本

## 使用

bundle-compare-analyzer有三个命令:
 - `add <bundlePath/bundleFile>`: 打包完成后，根据指定的打包目录或确定的一个文件生成一个版本. 
 - `compare`: 对比分析各个版本.
 - `remove`: 删除版本.
 
 
 
 
 ### 生成版本
 
 ```sh
 azer add ./build // 打包路径
 
 ```
 
   <img alt="bundle-compare-analyzer" src="https://raw.githubusercontent.com/lanjingling0510/bundle-compare-analyzer/master/.github/screenshot_2.png">
 
 
 ### 删除版本
 
 ```
  azer remove
```
 
<img alt="bundle-compare-analyzer" src="https://raw.githubusercontent.com/lanjingling0510/bundle-compare-analyzer/master/.github/screenshot_3.png">
    
    
 ### 分析版本
 
 ```sh
 azer compare
 
 ```
 
 ## 注意
 
 - 推荐使用`[name].[chunkhash].js`为输出的文件名称
 
 
 ## How to Contribute

Anyone and everyone is welcome to contribute to this project. The best way to
start is by checking our [open issues](https://github.com/lanjingling0510/bundle-compare-analyzer/issues),
[submit a new issues](https://github.com/lanjingling0510/bundle-compare-analyzer/issues/new?labels=bug) or
[feature request](https://github.com/lanjingling0510/bundle-compare-analyzer/issues/new?labels=enhancement),
participate in discussions, upvote or downvote the issues you like or dislike.




 
 
