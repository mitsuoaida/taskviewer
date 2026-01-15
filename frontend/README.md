# my-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
### .env
backendで使う各種設定値を登録してください
backend/.templete.envに必要な値を列挙しています

### ローカルでのLambdaロジック/Expressによる単体テスト方法
backend - redmine-api以下に.jsのテストファイルを作成する（例：local-test.js）
backend - redmine-api直下で、node local-test.js のコマンドを実行すると単体テストができる
dotenv/configをimportすれば.envのファイルを取得してくれる

### ローカルでのVue.jsとの結合テスト方法
backendとfrontendの同時起動が必要
backend
* cd backend/redmine-api
* node server.js
frontend
* cd frontend
* npm run dev

## はまるポイント
IAM のロールの付け方