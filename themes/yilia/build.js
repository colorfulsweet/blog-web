const webpack = require('webpack')
const configCreator = require('./webpack.config')

const webpackConfig = configCreator(process.env, {mode: 'production'})

webpack(webpackConfig, (err, stats) => {
  if (err) {
    throw err
  }
  const info = stats.toJson()
  if (stats.hasErrors()) {
    console.error(info.errors)
  }
  if (stats.hasWarnings()) {
    console.warn(info.warnings)
  }

  console.log(stats.toString({
    chunks: false,
    colors: true
  }))
})