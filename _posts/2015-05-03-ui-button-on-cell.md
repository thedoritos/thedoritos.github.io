---
layout: post
title: "UITableViewCell に配置した UIButton がスクロールを邪魔する問題へのもうひとつの解"
date: 2015-05-03 00:00:00
categories: diary

---

### 問題

UITableViewCell に UIButton を配置すると、UITableView をスクロールしたいときに、UIButton が邪魔になります。

具体的には、

1. テーブルをスクロールしようとする（画面をタッチ）
2. タッチした場所が UIButton だった
3. UIButton がタッチに反応する
4. テーブルがスクロールできない！

といったことになり、 UIButton が邪魔になります。

### stackoverflow の解

[UIButton inside UITableViewCell steals touch from UITableView - stackoverfow](http://stackoverflow.com/questions/15965663/uibutton-inside-uitableviewcell-steals-touch-from-uitableview)

stackoverflow では、以下の2つの方法が提案されているようです。

#### 方法 1. UITableView のプロパティを設定する

```
self.tableView.delaysContentTouches = YES;
self.tableView.canCancelContentTouches = YES
```

ひとつ目は、UITableView のプロパティを設定する方法です。しかし、この方法では問題を解決できませんでした。（なお、環境は記事文末の補足を参照）

#### 方法 2. UITableView のサブクラスを作成する

```
@interface AutoCancelTableView: UITableView
@end

@implementation AutoCancelTableView

//
// Overriding touchesShouldCanceInContentView changes the behaviour
// of button selection in a table view to act like cell selection -
// dragging while clicking a button will cancel the click and allow
// the scrolling to occur
//
- (BOOL)touchesShouldCancelInContentView:(UIView *)view {
    return YES;
}

@end
```

ふたつ目は、UITableView のサブクラスを作成し、既存の UITableView と差し替える方法です。ただし、以下の点を考慮すると、少しだけ使い勝手が悪いかなと思います。

- わざわざサブクラス化する必要がある
- xib も変更する必要がある

そこで、もうひとつの解です。

### もうひとつの解 : UITableView のクラス拡張を定義する

方針は、stackoverflow の 方法 2 と同じです。ただし、サブクラスを作るのではなく、クラス拡張を定義します。

<script src="https://gist.github.com/thedoritos/27b5659a92cc09549427.js"></script>

スクロールさせたいテーブルを保持している UIViewController の実装ファイル（.m）でインポートします。（または、テーブルが UITableView のサブクラスならば、その実装ファイルでインポートするのもあり）

### 補足

#### 環境

本記事の内容は、以下の環境で確認しました。

- Xcode 6.3
- iOS SDK 8.3
- Deployment Target 8.0

