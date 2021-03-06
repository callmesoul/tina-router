import extname from 'replace-ext'

export const globals = {
  global: this || global,
  wx,
}

export function parseTabsFromGlobal (global) {
  if (!global || !global.__wxConfig) {
    console.warn([
      '[tina-router]: 自动获取全局配置失败，请确认关闭微信开发者工具的 [ES6 转 ES5] 功能。',
      '详情请参考：https://github.com/tinajs/tina-router#' + encodeURI('无法正确地自动获取底部-tab-列表'),
    ].join('\n'))
    return
  }
  if (!global.__wxConfig.tabBar || !Array.isArray(global.__wxConfig.tabBar.list)) {
    return []
  }
  return global.__wxConfig.tabBar.list.map(({ pagePath }) => {
    return extname(pagePath, '')
  })
}
