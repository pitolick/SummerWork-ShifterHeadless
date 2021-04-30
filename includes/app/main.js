jQuery(document).ready(function ($) {
    // REST API 取得先URL
    const RESTURL = 'https://1ba9aed77198b90b09637597a5df217fe7498b24.hl-a.getshifter.co/wp-json/'

    var app = {
        // 初期化処理
        init : function() {

            this.getSiteData()
            this.loadPosts()
            this.loadCategories()
            this.loadEvents()

        },
        // ロード完了時のイベント
        loadEvents : function() {
            // 見出し（h3）かサムネイルをクリックした時、その記事内容を取得する
            $( '#main-content' ).on( 'click', '.blog-post h3', this.loadSinglePost )
            $( '#main-content' ).on( 'click', '.blog-post .thumbnail', this.loadSinglePost )

        },
        // サイトデータを取得
        getSiteData : function() {
            // RESTURL で設定した WordPress の REST API を使用しデータを取得
            $.get( RESTURL )
                // レスポンスがあれば以下を処理
                .done( function( response ) {
                    // 設定画面で登録できるサイトのタイトルとキャッチフレーズを指定の要素に表示
                    $( '.site-title' ).html( response.name )
                    $( '.description' ).html( response.description )
                })
                // レスポンスがなければアラートを表示
                .fail( function() {
                    alert( 'failed to call specified URL' )
                })

        },
        // 投稿を取得
        loadPosts : function() {
            // APIリファレンス： https://developer.wordpress.org/rest-api/reference/posts/
            var url = RESTURL + 'wp/v2/posts?_embed'

            $.get( url )
                .done( function( response ) {
                    // レスポンスがあれば以下を処理
                    var posts = {
                        posts: response
                    }

                    var template = $( '#blog-post-template' ).html()
                    var output = $( '#main-content' )
                    // Mustache.js を利用してテンプレートパーツにデータを出力
                    var result = Mustache.to_html( template, posts )
                    output.append( result )

                })
                // レスポンスがなければアラートを表示
                .fail( function() {
                    alert( 'cannot load posts' )
                })

        },

        loadCategories : function() {
            // APIリファレンス： https://developer.wordpress.org/rest-api/reference/categories/
            var url = RESTURL + 'wp/v2/categories'

            $.get( url )
                .done( function( response ) {
                    // レスポンスがあれば以下を処理
                    var categories = {
                        categories : response
                    }

                    var template = $( '#blog-categories-template' ).html()
                    var output = $( '#categories' )
                    // Mustache.js を利用してテンプレートパーツにデータを出力
                    var result = Mustache.to_html( template, categories )
                    output.append( result )

                })
                // レスポンスがなければアラートを表示
                .fail( function() {
                    alert( 'cannot load categories' )
                })

        },

        loadSinglePost : function() {
            // 取得する記事のIDを取得
            // APIリファレンス： https://developer.wordpress.org/rest-api/reference/posts/
            var id = Math.abs( $( this ).parent( '.blog-post' ).data( 'id' ) )
            var url = RESTURL + 'wp/v2/posts/' + id + '?_embed'

            $.get( url )
                .done( function( response ) {
                    // レスポンスがあれば以下を処理
                    var template = $( '#single-post-template' ).html()
                    var output = $( '#main-content' )
                    // Mustache.js を利用してテンプレートパーツにデータを出力
                    var result = Mustache.to_html( template, response )
                    output.html( result )

                })
                // レスポンスがなければアラートを表示
                .fail( function() {
                    alert( 'cannot load post' )
                })

        }


    }
    // 初期化処理を実行
    app.init();

});
