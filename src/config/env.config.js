const DEV_BASE_API = './pro'
const TEST_BASE_API = ''
const PRO_BASE_API = '/control'
const envConfig = {
  dev: {
    baseApi: DEV_BASE_API
  },
  test: {
    baseApi: TEST_BASE_API
  },
  prod: {
    baseApi: PRO_BASE_API
  }
}

// export const WEBSOCKET_URL = 'https://aliiot.on-bright.com/pro/websocket/{topic}'
// export const WEBSOCKET_URL = 'https://aliiot.on-bright.com/nurseTest/websocket/{topic}'
export const WEBSOCKET_URL = '/control/websocket/{topic}'

export function isProEnv () {
  return process.env.NODE_ENV === 'production'
}

export function isTestEnv () {
  return process.env.NODE_ENV === 'test'
}

export function isDevelopEnv () {
  return process.env.NODE_ENV === 'development'
}

// 接口请求基路径
export function getReqBaseUrl () {
  return isProEnv() ? envConfig.prod.baseApi : envConfig.dev.baseApi
}

export const ROUTER_BASE = isProEnv() ? 'hcp' : '/'

export default envConfig
