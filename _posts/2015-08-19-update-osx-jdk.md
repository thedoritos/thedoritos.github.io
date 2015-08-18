---
layout: post
title: "OS X の JDK バージョンを更新する"
date: 2015-08-19 00:00:00
categories: Java
---

### 概要

- Oracle から JDK 1.8 をダウンロード & インストールしたけど、Java のバージョンが 1.6 のままだった
- JAVA_HOME を更新して 1.8 が使えるようになった
    - `export JAVA_HOME=\`/usr/libexec/java_home -v 1.8\``

### JDK のバージョンが上がらない

1. [Oracle Java SE Downloads](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) から JDK 1.8 をダウンロードする
1. インストーラを実行してインストールする
1. バージョンを確認する

```
$ which java
/usr/bin/java
$ java -version
java version "1.6.0_65"
Java(TM) SE Runtime Environment (build 1.6.0_65-b14-466.1-11M4716)
Java HotSpot(TM) 64-Bit Server VM (build 20.65-b04-466.1, mixed mode)
$ javac -version
javac 1.6.0_65
```

ということで、変わってないです。

### Mac の Java は 2 つある

Mac OS X には Java がインストールされる場所が 2 つあるようです。

1. /System/Library/Java/JavaVirtualMachines
    - Apple から提供される Java がインストールされる場所
2. /Library/Java/JavaVirtualMachines
    - Oracle からダウンロードした Java がインストールされる場所

### バージョンの決まり方（システム編）

/usr/bin/java を見てみると、

```
$ ls -la /usr/bin/java
lrwxr-xr-x  1 root  wheel  74 Mar 31 21:02 /usr/bin/java -> /System/Library/Frameworks/JavaVM.framework/Versions/Current/Commands/java
```

ということで Current/Commands/java へのエイリアスでした。

なるほど Current で切り替えてるんだろうなってことで、Versions ディレクトリを見てみると、

```
$ ls -l /System/Library/Frameworks/JavaVM.framework/Versions/
total 64
lrwxr-xr-x  1 root  wheel   10 Mar 31 21:02 1.4 -> CurrentJDK
lrwxr-xr-x  1 root  wheel   10 Mar 31 21:02 1.4.2 -> CurrentJDK
lrwxr-xr-x  1 root  wheel   10 Mar 31 21:02 1.5 -> CurrentJDK
lrwxr-xr-x  1 root  wheel   10 Mar 31 21:02 1.5.0 -> CurrentJDK
lrwxr-xr-x  1 root  wheel   10 Mar 31 21:02 1.6 -> CurrentJDK
lrwxr-xr-x  1 root  wheel   10 Mar 31 21:02 1.6.0 -> CurrentJDK
drwxr-xr-x  8 root  wheel  272 Mar 31 21:02 A
lrwxr-xr-x  1 root  wheel    1 Mar 31 21:02 Current -> A
lrwxr-xr-x  1 root  wheel   59 Mar 31 21:02 CurrentJDK -> /System/Library/Java/JavaVirtualMachines/1.6.0.jdk/Contents
```

- Runtime は Current を経由してるものの常にひとつ
- JDK は CurrenJDK を経由して JavaVirtualMachines の最新を使う
    - ちなみに 1.4 から 1.6.0 までどれ使っても 1.6 を指す（！！！）

ということっぽいです。

### バージョンの決まり方（オラクル編）

[http://stackoverflow.com/questions/15624667/mac-osx-java-terminal-version-incorrect](http://stackoverflow.com/questions/15624667/mac-osx-java-terminal-version-incorrect) によると、
Java のバージョンは環境変数 JAVA_HOME を定義することで変えられるようです。

JAVA_HOME が何を指してるかというと、

```
$ echo $JAVA_HOME
/Library/Java/Home
$ ls -l $JAVA_HOME
lrwxr-xr-x  1 root  wheel  48 Mar 31 21:02 /Library/Java/Home -> /System/Library/Frameworks/JavaVM.framework/Home
$ ls -l /System/Library/Frameworks/JavaVM.framework/Home
lrwxr-xr-x  1 root  wheel  24 Mar 31 21:02 /System/Library/Frameworks/JavaVM.framework/Home -> Versions/CurrentJDK/Home
```

CurrentJDK ですということで、一周回って戻ってきました。

JAVA_HOME を定義してあげればいいのですが、 /usr/libexec/java_home を使うと良いようです。

```
$ /usr/libexec/java_home
/Library/Java/JavaVirtualMachines/jdk1.8.0_51.jdk/Contents/Home
$ /usr/libexec/java_home -v 1.7
/Library/Java/JavaVirtualMachines/jdk1.7.0_51.jdk/Contents/Home
```

ということで、.bash_profile で JAVA_HOME を定義することにしました。

```.bash_profile
export `/usr/libexec/java_home -v 1.8`
```

せっかくなんで、java_home を使ってみました。

### まとめ

- Mac の Java は 2 つある
    - Apple のと Oracle の
- JAVA_HOME で使うバージョンを切り替えている
    - /usr/libexec/java_home を使うと JDK のパスを取得できて便利
	- .bash_profile で JAVA_HOME を定義すればバージョンを切り替えられる
