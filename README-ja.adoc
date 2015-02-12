= HubPress

== HubPress とはなにか？

image::http://hubpress.io/img/editor.png[]

HubPress は無料でブログを作るためのオープンソースツールです。

http://github.com/anthonny[Anthonny Quérouil] (twitter http://twitter.com/anthonny_q[@anthonny_q])
により作成・メンテナンスされています。

NOTE: HubPress はまだ作成途中です。バグを発見した場合は是非教えてください。

HubPressの更新が勢いに乗れば、それだけドキュメントも更新されます。
定期的にHubPressの更新を確認し、新しい機能・使い方を確認して下さい。

== Getting Started

=== インストール

==== リポジトリのフォーク

Fork アイコンをクリックして、自分の GitHub アカウントにリポジトリのコピーを作成してください。

==== github.io ドメインの使用

もしあなたがGitHub Pagesを利用したことがなければ、ここに記載の方法で
簡単に HubPress をセットアップできます。
ほんの数ステップで HubPress がデプロイされ利用可能になります。

IMPORTANT: 「username.github.io ドメインを他プロジェクトで利用済みである」あるいは「独自ドメインで HubPress を利用したい」場合, 下記のステップは読み飛ばしてください。

. リポジトリ名を `<username>.github.io` に変更
. `hubpress/config.json` の設定
+
image:http://hubpress.io/img/edit-config.png[Edit config]
+
なお、以下のパラメータは必須です。
+
* `username`: GitHub のユーザー名です。
* `repositoryName`: フォーク後のリポジトリの名前。 `<username>.github.io`
. 変更をコミットし, `http://<username>.github.io/` ドメインで GitHub Page を公開。
. 以下のような画面が出れば、HubPressは正しくセットアップされています。
+
image:http://hubpress.io/img/home-install.png[Install complete,300]

==== 「username.github.io ドメインを他プロジェクトで利用済みである」あるいは「独自ドメインで HubPress を利用したい」場合

やや多めに設定が必要です。

. リポジトリの設定からデフォルトのブランチを `gh-pages` に設定
+
image:http://hubpress.io/img/settings-gh-pages.png[Settings gh-pages,400]
. *gh-pages* ブランチに移動。
+
image:http://hubpress.io/img/switch-gh-pages.png[Install complete,300]
+
. `hubpress/config.json` の設定
+
image:http://hubpress.io/img/edit-config-gh-pages.png[Edit config]
+
なお、以下のパラメータは必須です。
+
* `username`: GitHub のユーザー名です。
* `repositoryName`: フォーク後のリポジトリの名前。特に変更していないなら `hubpress.io`
. 変更をコミットし, `http://<username>.github.io/<repositoryName>/` で GitHub Page を公開。
. 以下のような画面が出れば、HubPressは正しくセットアップされています。
+
image:http://hubpress.io/img/home-install.png[Install complete,300]

== 管理画面

HubPressの管理画面は */hubpress* からアクセスできます。つまり

* http://<username>.github.io/hubpress/ (github.ioドメインを利用している場合 )
* http://<username>.github.io/<repositoryName>/hubpress/ (独自ドメインを利用している場合)

です。

=== 管理画面へのログイン

GitHub のログイン情報でログインできます。

一旦ログインすると、HubPress から GiHub API へコールするためのトークンが発行されます。

このトークンは HubPress の全セッション間で共有されます。
そのためPCで管理画面を開いた後、タブレット端末でも開いた場合は
トークンはPC,タブレット両端末で使われます。

=== ページの設定

CNAMEやページングといった、基本的なブログの設定が可能です。
またあなたのソーシャルアカウントとブログを紐付けすることもできます。

==== Meta

この節は `/hubpress/config.json` ファイルで変更可能な基本情報についての説明を含みます。

*Git CNAME* を設定可能して独自ドメインの利用が可能です。
詳しくは https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/
を見てください。

==== Site

===== Title と　Description

*Title* や *Description* フィールドにより
ブログタイトルや, その説明を設定することができます。

*Logo* や *Cover Image* フィールドには

* ホスティングサービス上の画像へのHTML リンク。 例. gravatar
* /images ディレクトリ内の画像へのリンク

が設定可能です。

NOTE: ブログへの画像の投稿については `/images/README.adoc` を参照してください。

===== Theme

`/themes` ディレクトリの中にあるテーマ名を指定することで、ブログテーマを選択可能です。

===== Google Analytics

*Google Analytics* フィールドの設定により ブログサイトで Google Analytics を利用可能です。

===== Disqus Shortname

The *Disqus shortname* field takes your Disqus URL/shortname that is specified when you register a new site for Disqus. Only the shortname is required, not a link to your profile page.

==== Social Network

Social Network グループ内のフィールドには
公開プロフィールページヘの URL を入力してください。
ブログ上での表示方法はテーマの設定次第です。

== 投稿の管理

はじめて HubPress を利用する際には **Posts** はまだありません。
ブログに投稿をすると、左側に記事のリスト、右側にプレビューの形で表示されます。

=== 記事を書く

NOTE: もし AsciiDocに馴染みがなければ http://asciidoctor.org/docs/asciidoc-writers-guide/[AsciiDoctor Writer's Guide] で勉強して下さい。

HupPress エディタは左側に AsciiDoc のコード、右側にプレビューを表示します。

==== AsciiDoc Blog の基本知識

===== Blog のタイトルとヘッダー

記事のタイトルは常に AsciiDoc 投稿における Level 1 となります。
つまり `= Blog Title` により 記事のタイトルを `Blog Title` に設定できます。

記事の保存には `= Blog Title` が１つ必要です。

もし 1st-level のヘッダーを使いたければ代わりに `== First Level Heading` を使ってください。
ネストしたヘッダも同様です。

===== カバー画像

記事にカバー画像を追加したい場合 `hp-image` 属性を追加する必要があります。

例:
[source, asciidoc]
----
= Blog Title
:hp-image: http://github.com/<username>/<repositoryName>/images/a-cover-image.jpg
----

===== 公開日

公開日はデフォルトで記事を作成した日になります。
`published_at` 属性を設定することにより、公開日を指定することができます。

例:
[source, asciidoc]
----
= Blog Title
:published_at: 2015-01-31
----

===== タグとカテゴリ

タグのみサポートしています。
`hp-tags` 属性により、タグを複数追加できます。

例:
[source, asciidoc]
----
= Blog Title
:hp-tags: tag1,tag2,tag3
----

== Credits

Thanks to https://github.com/jaredmorgs[Jared Morgan] for initially tidying up the README you see here, and continuing to be the "docs guy" for HubPress.

日本語訳: https://github.com/takkyuuplayer/[takkyuuplayer]
