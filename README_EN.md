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
    Bundle-compare-analyzer is a simple analysis of the various versions of the code output file size of the visualization tool.
  </b>
  <br><br>
  <a href="https://www.npmjs.com/package/bundle-compare-analyzer">
    <img alt="Build Status" src="https://img.shields.io/npm/v/bundle-compare-analyzer.svg?style=flat-square">
  </a>

  <a>
    <img alt="Build Status"  src="https://img.shields.io/travis/lanjingling0510/react-mobile-datepicker/master.svg?style=flat-square">
  </a>

</p>

`Webpack`, `gulp`, `browserify` and other tools are always packaged source code into multiple bundles of JS files, we often need to optimize the package file size.

bundle-compare-analyzer can generate a version each time the source code is packaged. Easy to compare, analyze the size of each version of the bundles of JS files.

<a href="./README_EN.md">中文文档</a>

## Feature

- Leave each time webpack, gulp, browserify and other tools to generate bundle file information.
- Intuitive analysis of webpack, gulp, browserify and other tools to generate the size of the bundle file.

## Installation

```sh
npm install -g bundle-compare-analyzer
```

Support node4.0 or above

## Usage

bundle-compare-analyzer comes with three commands right now:
 - `add <bundlePath/bundleFile>`: After the package is finished, generate a version based on the specified package directory or a defined file.
 - `compare`: Compare each version.
 - `remove`: Remove the version.




 ### Generate version

 ```sh
 azer add ./build // bundle path

 ```

   <img alt="bundle-compare-analyzer" src="https://raw.githubusercontent.com/lanjingling0510/bundle-compare-analyzer/master/.github/screenshot_2.png">


 ### Remove the version.

 ```
  azer remove
```

<img alt="bundle-compare-analyzer" src="https://raw.githubusercontent.com/lanjingling0510/bundle-compare-analyzer/master/.github/screenshot_3.png">


 ### Analysis version

 ```sh
 azer compare
 ```

 ## Note

 - It is recommended to use `[name]. [Chunkhash] .js` for the output file name.


 ## How to Contribute

Anyone and everyone is welcome to contribute to this project. The best way to
start is by checking our [open issues](https://github.com/lanjingling0510/bundle-compare-analyzer/issues),
[submit a new issues](https://github.com/lanjingling0510/bundle-compare-analyzer/issues/new?labels=bug) or
[feature request](https://github.com/lanjingling0510/bundle-compare-analyzer/issues/new?labels=enhancement),
participate in discussions, upvote or downvote the issues you like or dislike.
