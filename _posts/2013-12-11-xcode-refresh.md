---
layout: post
title: "Xcodeでビルド時にリソースを更新する"
date: 2013-12-11 00:00:00
categories: Xcode build

---

### 概要：

Xcode でアプリをビルドする時に、リソース（画像やスクリプトなど）の更新が反映されないことがあるので、ビルド時に実行するスクリプトを追加して更新が必ず（たぶん）反映されるようにする。

リソースの更新を反映するだけなら、メニューの Product ⇒ Clean を選択してからビルド（Cmd + Shift + K ⇒ Cmd + R）でも可能だが、こちらの方法だとソースコードをリビルドするため時間がかかる。

### 動作環境：

Mac OSX 10.9（13A603）
Xcode 5.0.2（5A3005）

### 参考：

- [Crashlytics | How to Add a Run Script Build Phase](http://www.runscriptbuildphase.com/)
- [Stack Overflow | How to force XCode 4 to always update resources?](http://stackoverflow.com/questions/6766904/how-to-force-xcode-4-to-always-update-resources)

### 手順：

1. Build Phases を選択
1. メニューの Editor ⇒ Add Build Phase ⇒ Add Run Script Build Phase を選択
1. Build Phases の Run Script に以下のスクリプトを記述

    ```sh
    find "${PROJECT_DIR}/../Resources/." -exec touch -cm {} \;
	```

ディレクトリのパスは適宜書き換えてください。この例では Cocos2d-x のテンプレートに合わせて、Resources 配下を全て更新するようにしてます。

### 感想：

リビルドしなくて済むので、Lua スクリプト使いやすくなった。
本当は実行時に書き換えてこそなんでしょうけど...