---
layout: post
title: "サブディレクトリに配置した WordPress をドメインルートで公開する"
date: 2014-09-14 00:00:00
categories: WordPress

---

### 概要：

WordPressをドキュメントルートのサブディレクトリ（例：/var/www/html/hoge）に配置している場合に、以下を実現するために必要な設定をまとめる。

1. 公開URLをドメインルート（例：http://yourdomain.com/）にする
2. 記事のカスタムパーマリンク（例：http://yourdomain.com/postname/）を設定する

基本的にはWordPress公式サイトの「既存のサブディレクトリをルートディレクトリとして表示する場合」に従えば良い。
パーマリンクの設定で躓いた点を書き足しておく。

### 動作環境：

- Apache 2.2.15
- WordPress 4.0

### 手順：

#### 0. 前提

WordPress が /var/www/html/hoge にインストールされている。  
ブログの公開URLは、「http://yourdomain.com/hoge/」になっている。

#### 1. 公開URLをドメインルートにする

WordPress公式サイトの「[既存のサブディレクトリをルートディレクトリとして表示する場合](http://wpdocs.sourceforge.jp/Giving_WordPress_Its_Own_Directory#.E6.97.A2.E5.AD.98.E3.81.AE.E3.82.B5.E3.83.96.E3.83.87.E3.82.A3.E3.83.AC.E3.82.AF.E3.83.88.E3.83.AA.E3.82.92.E3.83.AB.E3.83.BC.E3.83.88.E3.83.87.E3.82.A3.E3.83.AC.E3.82.AF.E3.83.88.E3.83.AA.E3.81.A8.E3.81.97.E3.81.A6.E8.A1.A8.E7.A4.BA.E3.81.99.E3.82.8B.E5.A0.B4.E5.90.88)」に従って設定する。

この時点でブログの公開URLは、「http://yourdomain.com/」になっている。

#### 2. 記事のカスタムパーマリンクを設定する

「管理ページ」 -> 「設定」 -> 「パーマリンンク設定」画面を開く。  
「共通設定 」項目から「投稿名」を選択する。

この時点で記事「fuga」の公開URLは、「http://yourdomain.com/fuga/」になっている。

### 躓きどころ：

上記手順で設定できなかった場合は、次の躓きどころが参考になるかもしれません。

#### 1. .htaccess ファイルの書き込み権限がない

「管理ページ」 -> 「設定」 -> 「パーマリンンク設定」画面のページ下部に次のメッセージが表示されているのを確認する。  
.htaccess が書き込み可能ならこの操作は自動的に行われますが、そうでない場合は .htaccess ファイルに mod_rewrite ルールを書き込む必要があります。以下のフィールドをクリックし、CTRL + a ですべてのコードを選択してください。

.htaccess ファイルがなければ作る。

```sh
cd /var/www/html
touch .htaccess
```

.htaccess ファイルの書き込み権限を apache ユーザーに与える。

```sh
cd /var/www/html
sudo chown apache:apache .htaccess
sudo chmod 600 .htaccess
```

上記手順の「2. 記事のカスタムパーマリンクを設定する」をもう一度実行する。

#### 2. ModRewrite が起動していない

httpd の設定ファイルを開く。

```sh
sudo vim /etc/httpd/conf/httpd.conf
```

「LoadModule rewrite_module modules/mod_rewrite.so」のコメントアウトを外す。

```
#LoadModule rewrite_module modules/mod_rewrite.so
LoadModule rewrite_module modules/mod_rewrite.so
```

httpd を再起動する。

```
sudo /etc/init.d/httpd restart
```

#### 3. ModRewrite が許可されていない

httpd 設定ファイルを開く。

```
sudo vim /etc/httpd/conf/httpd.conf
```

Directory ディレクティブが正しく設定されているか確認する。

```
<Directory "/var/www/html">
    Options -Indexes FollowSymLinks
    AllowOverride All
    Order allow,deny
    Allow from all
</Directory>
```

httpd を再起動する。

```
sudo /etc/init.d/httpd restart
```

### 感想：

WordPress + Apacheの今更感。