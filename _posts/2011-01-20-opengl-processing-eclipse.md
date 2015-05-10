---
layout: post
title: "OpenGL + Processing + eclipse"
date: 2011-01-20 00:00:00
categories: Processing

---

### ※2013/07/23追記

本記事は古くなっています。  
Processing 2.0を使用する場合は、[フォーラム](https://forum.processing.org/topic/tip-processing-2-0-in-eclipse-with-opengl)を参考に。

#### ざっくり訳

1. プロジェクトにlibフォルダを作る
1. Processing/Contents/Resouces/Java/core/library 内を全部つっこむ
1. ビルドパスに core.jar, glugen-rt.jar, jogl-all.jar を追加する
1. glugen-rt.jar, jogl-all.jar のNative Library Location をlibフォルダに設定する

#### 動作確認環境

- Processing 2.0.1 Mac OS X
- OS X 10.8.4
- Eclipse IDE for Java Developers Indigo Service Release 2

追記以上

\--------------------------------------------------  
※以下の記事は古くなっています。  
　以下の記事には無駄な文字や文章が含まれています。  
　以下の内容には[補足記事](http://computational-design.blogspot.jp/2011/12/blog-post.html)があります（ありがとうございます）。  
\--------------------------------------------------

### はじめに

これまでの開発はjavaのIDEであるeclipseを使っていて、  
Processingをインポートする形で使っていました。

Objective-C でGLESに取りかかる前に  
ProcessingでOpenGLを使ってみようとしたところ、  
設定が少し面倒だったのでメモ。

### 1. jarとライブラリの追加

#### 1.1

プロジェクトフォルダに「jar」フォルダと「lib」フォルダを作成。  
（srcに入れては駄目！…なはず）

#### 1.2

「jar」フォルダに必要な.jarファイルを追加する。  

../processing から

- core.jar

../processing/libraries/opengl から

- opengl.jar
- jogl.jar
- gluegen-rt.jar

#### 1.3

「lib」フォルダに必要な.jnilibファイル（Windowsなら.dll）を追加。

../processing/libraries/opengl にある .jnilib を全部突っ込めばOK。

![jnilibs](http://3.bp.blogspot.com/_HdDwCVOvXvs/TTvqaf14LmI/AAAAAAAAABQ/XhFA_eWckUE/s1600/gltest1.png)

### 2. Java Build Pathの設定

#### 2.1

プロジェクトフォルダを右クリックして  
「Properties」→「Java Build Path」→「Libraries」→「Add JARs」  
で先ほど用意した.jarを追加。  

#### 2.2

さらに「jogl.jar」のタブを開いて「Native library location: 」に  
先ほどの「lib」フォルダを指定。

![library location](http://4.bp.blogspot.com/_HdDwCVOvXvs/TTvutmR4G-I/AAAAAAAAABg/XekJZH9Zvvc/s1600/gltest2.png)

これで設定完了！あとは書くだけ。

### 3. 書いてみた

![blue cubes](http://1.bp.blogspot.com/_HdDwCVOvXvs/TTv1Uw5AemI/AAAAAAAAABo/Wc6f066SeTU/s1600/sample.png)