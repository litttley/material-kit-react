###### pdf 阅读器 pdftron

官网地址:https://www.pdftron.com/
github demo : https://github.com/PDFTron/pdf-in-react
`yarn add @pdftron/webviewer`

安装 yarn add @pdftron/webviewer
更新版本号 例 yarn upgrade @mui/x-data-grid@5.0.0-beta.7

# 错误问题修复

问题 1:执行 npm run lint:fix 时报`Using`babel-preset-react-app`requires that you specify`NODE_ENV`or`BABEL_ENV` environment variables. Valid values are "development", "test", and "production".`
解决:先设置环境变量`SET NODE_ENV=development `然再执行`npm run lint:fix`
