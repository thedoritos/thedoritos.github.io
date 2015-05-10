---
layout: post
title: "3DText on Processing"
date: 2011-02-10 00:00:00
categories: Processing

---

### 要約：

Processingで3D文字を描画する方法を調べた。

Blenderで作った3Dモデル（.obj）を  
OBJ Loaderで読み込んで  
Processing & OpenGLで描画した。

### 完成図：

![result](http://1.bp.blogspot.com/-eVLEqaRzZDU/TVoZUcRTS0I/AAAAAAAAAB8/O3RXP50iUWc/s320/apple1.png)

### 準備：

[Processing + OpenGL + Eclipse](http://thedoritos.blogspot.com/2011/01/opengl-processing-eclipse.html)

### 調べたこと試したこと：

#### ① OpenGLは文字描画できない

OpenGLは文字描画の機能を備えていないので、ビットマップを使うかポリゴンで作った文字を描画する。

#### 『OpenGL tutorial』

[http://www.videotutorialsrock.com/index.php](http://www.videotutorialsrock.com/index.php)  
より「Lesson 8: Drawing Text」の項を参考にした。動画による解説もあるのが良いね。  
今回は厚みのある立体文字を描画したいのでポリゴンで描画する方法を採用。

ソース内でいちいちVertexを指定していられないので、3Dモデルを別途作り、適宜読み込んで使う。.obj形式が一般的らしい。


#### ② Blenderで3Dモデリング

『Blender』は高機能なオープンソースの3Dモデリングソフト。公式/非公式のリファレンスが豊富で初心者（な僕）でも30分もあれば使い始められる。すごい。

- Textオブジェクトの生成
- Fontの読み込み
- オブジェクトの形状編集
- .objファイルの書き出し

などは  
『Web/Blender Studio+』  
[http://wbs.nsf.tc/tutorial/tutorial_blender.html](http://wbs.nsf.tc/tutorial/tutorial_blender.html)  
より「3Dテキスト」の項を参考にした。

![apple on blender](http://3.bp.blogspot.com/-4MSFNr4AJeA/TVoaDZ653EI/AAAAAAAAACM/6V74Zzbk7IY/s320/blender.png)

#### ③ Processingで.obj描画

『OBJ Loader』はProcessingのライブラリ。objの読み込み&描画ができる。結局、困った時は本家本元を訪ねるのが一番早いな。

![apple on processing](http://2.bp.blogspot.com/-kwCPyRxuItI/TVoZxFU1wSI/AAAAAAAAACE/yv4CHxOCycs/s320/apple2.png)

### 感想：

現段階ではポリゴンが多過ぎてすぐ処理落ち。  
Blenderの方の勉強が必要ですな。