const fs = require('fs')
const path = require('path')
const http = require('http')
const querystring = require('querystring')

const express = require('express')
//const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
//const LRU = require('lru-cache')
const {createBundleRenderer} = require('vue-server-renderer')

//const metaConfig = require("./meta-config")
// const isProd = true// process.env.NODE_ENV === 'production'
const isProd = false
const config = {
  general: {
    // host: isProd ? 'api.120xinmao.com' : '192.168.0.247',
    // host: isProd ? 'api.120xinmao.com' : '127.0.0.1',
    host: isProd ? 'moluantongxue.com' : '127.0.0.1',
    port: isProd ? 80 : 9002
  },
  testing: {
    // host: isProd ? 'api.120xinmao.com' : '192.168.0.247',
    // host: isProd ? 'api.120xinmao.com' : '127.0.0.1',
    host: isProd ? 'moluantongxue.com' : '127.0.0.1',
    port: 9000
  },
  templatePath: isProd ? './dist/index.template.html' : './src/index.template.html'
}

const resolve = file => path.resolve(__dirname, file)

const app = express()

function createRenderer (bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    // recommended for performance
    runInNewContext: false
  }))
}

let renderer
let readyPromise
const templatePath = resolve(config.templatePath)
const template = fs.readFileSync(templatePath, 'utf-8')
const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

renderer = createRenderer(bundle, {
  template,
  clientManifest
})

app.set("x-powered-by", false)

app.use(cookieParser('hanyang'))
//app.use(favicon(path.resolve(__dirname, 'public/favicon.png')))
app.use('/static', express.static(path.join(__dirname, "dist/static")))
app.use(bodyParser.urlencoded({
  extended: true
}))

const handleError = (err, req, res) => {
  if (err.url) {
    res.redirect(err.url)
  } else if(err.code === 404) {
    res.status(404).send('404 | Page Not Found')
  } else {
    // Render Error Page or Redirect
    res.status(500).send('500 | Internal Server Error')
    console.error(`error during render : ${req.url}`)
    console.error(err.stack)
  }
}

// const microCache = LRU({
//   max: 100,
//   maxAge: 10 * 60 * 1000 // 10分钟后过期
// })

function render (req, res) {
  // const hit = microCache.get(req.url)

  // if (hit) {
  //   return res.end(hit)
  // }

  res.setHeader("Content-Type", "text/html")

  const context = {
    url: req.url,
    uid: req.cookies.mid || req.signedCookies.uid,
    webp: req.headers.accept.includes('webp') || req.cookies.webp
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err, req, res)
    }

    res.send(html)

    //microCache.set(req.url, html)
  })
}

app.get("/depression-testing/*", (req, res) => {
  //const postData = querystring.stringify(req.query)
  const proxyRequest = http.request({
    host: config.testing.host,
    port: config.testing.port,
    path: req.path.replace("/depression-testing", ""),
    method: req.method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
      //"Content-Length": Buffer.byteLength(postData)
    }
  }, (proxyResponse) => {
    res.writeHead(proxyResponse.statusCode, proxyResponse.headers)

    proxyResponse.pipe(res)
  })

  //proxyRequest.write(postData)
  proxyRequest.end()
})

app.post("/depression-testing/*", (req, res) => {
  const postData = querystring.stringify(req.body)
  const proxyRequest = http.request({
    host: config.testing.host,
    port: config.testing.port,
    path: req.path.replace("/depression-testing", ""),
    method: req.method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData)
    }
  }, (proxyResponse) => {
    res.writeHead(proxyResponse.statusCode, proxyResponse.headers)

    proxyResponse.pipe(res)
  })

  proxyRequest.write(postData)
  proxyRequest.end()
})

app.post("/depression-api/*", (req, res) => {
  const postData = querystring.stringify(req.body)
  const proxyRequest = http.request({
    host: config.general.host,
    port: config.general.port,
    path: req.path,
    method: req.method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData)
    }
  }, (proxyResponse) => {
    res.writeHead(proxyResponse.statusCode, proxyResponse.headers)

    proxyResponse.pipe(res)
  })

  proxyRequest.write(postData)
  proxyRequest.end()
})

app.get('*', render)

const port = 6006
app.listen(port, () => {
  console.log(`[express] server started at localhost:${port}\n`)
})
