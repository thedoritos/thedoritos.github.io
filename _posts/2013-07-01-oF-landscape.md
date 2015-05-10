---
layout: post
title: "oF iOSをLandscapeモードで起動する"
date: 2013-07-01 00:00:00
categories: openFramework iOS

---

### 要約：

openFrameworks iOSをLandscapeモードで表示したい場合、標準（たぶん）の方法だと通知センターがPortraitモードのままだから困る。ので色々試したらできたっぽい。

### 動作環境：

- oF：0.7.4
- iOS：6.x

### 試したこと：

以下の3通りの方法を試した。

#### ① iPhoneSetOrientation(OFXIPHONE_ORIENTATION_LANDSCAPE_RIGHT)

##### 概要：

testApp#setup()でこのメソッドを呼ぶ。  
コメントアウトを外すだけ。  
というかソースに「横向きにしたいときは外せ」ってコメントしてある。

##### 問題点：

通知センターが縦画面表示のままになる。  
引き出しタブが画面横から出てきてテンション下がる。

#### ② Supported Interface Orientations

##### 概要：

- プロジェクトの設定からこの項目を変更する。
- （TARGESTS->Summary->iPhone/iPod Deployment Info->Supported Interface Orientations）
- Landscape LeftおよびLandscape Rightを選択する。

##### 問題点：

- スケッチのサイズが縦画面表示のままになる。
- 画面からはみ出ていてすごくテンション下がる。

#### ③ 上記2 + ViewControllerを自分で初期化する

##### 概要：

- ofxiPhoneViewControllerを自分で初期化する。
- 画面サイズ変更のサンプル(iosCustomSizeExample)を参考にした。
    - アプリ起動時に呼ぶデリゲートクラスを実装した。
    - main.mmでこれを呼ぶよう修正した。

##### ソース：

[github](https://github.com/thedoritos/ofLandscape/tree/master/src)

##### 問題点：

いまのところなし！

### 感想：

標準っぽい方法(上記1)が駄目って駄目じゃない？  
みんなはどうやってるんでしょうか？