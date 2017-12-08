import compose from 'compose-function'
import isEmpty from 'isempty'
import querystring from 'querystring'
import { parse } from 'url'
import { appendHooks } from '@tinajs/tina'

const wechat = wx

class Router {
  _tabs = []
  location = ''

  constructor (config) {
    if (config && config.tabs) {
      this._tabs = config.tabs
    }
  }

  isTab (location) {
    return ~this._tabs.indexOf(parse(location.slice(1)).pathname)
  }

  navigate (location) {
    if (this.isTab(location)) {
      return wechat.switchTab({
        url: location,
      })
    }
    return wechat.navigateTo({
      url: location,
    })
  }

  redirect (location) {
    if (this.isTab(location)) {
      return wechat.switchTab({
        url: location,
      })
    }
    return wechat.redirectTo({
      url: location,
    })
  }

  back () {
    return wechat.navigateBack()
  }
}

export default function createRouterMiddleware (options) {
  let router = new Router(options)

  return compose(
    function RouterMiddleware (properties) {
      function current () {
        if (this && this.$route && this.$route.fullPath) {
          return this.$route.fullPath
        }
        if (this && this.route) {
          return this.route
        }
        let pages = getCurrentPages()
        if (pages && pages[0] && pages[0].route) {
          return pages[0].route
        }
      }

      function install () {
        this.$router = router
        this.$router.location = this::current()
        this.$log('Router Middleware', 'Ready')
      }

      return appendHooks(properties, {
        beforeLoad: install,
        created: install,
      })
    },
    function $route (model) {
      function install (options) {
        this.$route = {
          path: `/${this.route}`,
          query: { ...options },
          fullPath: isEmpty(options) ? `/${this.route}` : `/${this.route}?${querystring.stringify(options)}`,
        }
        this.$log('Route Middleware', 'Ready')
      }

      return appendHooks(model, {
        beforeLoad: install,
      })
    },
  )
}
