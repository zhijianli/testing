const fs = require('fs')
const path = require('path')
const http = require('http')
const querystring = require('querystring')

const express = require('express')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const bodyParser = require("body-parser")
const proxyMiddleware = require('http-proxy-middleware')
const {createBundleRenderer} = require('vue-server-renderer')

const isProd = false//process.env.NODE_ENV === 'production'
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
const templatePath = resolve('../src/index.template.html')

// In development: setup the dev server with watch and hot-reload,
// and create a new renderer on bundle / index template update.
readyPromise = require('./setup-dev-server')(
  app,
  templatePath,
  (bundle, options) => {
    renderer = createRenderer(bundle, options)
  }
)

//const serve = (path) => express.static(resolve(path))

app.use(cookieParser('hanyang'))
app.use(favicon(path.resolve(__dirname, '../public/favicon.png')))
app.use(bodyParser.urlencoded({
  extended: true
}))

//app.use('/dist', serve('../dist'))

// proxy api requests
// const proxyTable = config.dev.proxyTable

// Object.keys(proxyTable).forEach(function (context) {
//   const options = proxyTable[context]

//   if (typeof options === 'string') {
//     options = {target: options}
//   }

//   app.use(proxyMiddleware(options.filter || context, options))
// })

function render (req, res) {
  const s = Date.now()

  res.setHeader("Content-Type", "text/html")

  const handleError = err => {
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

  const context = {
    url: req.url,
    uid: req.cookies.mid || req.signedCookies.uid,
    webp: req.headers.accept.includes('webp') || req.cookies.webp
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }

    res.send(html)

    console.log(`whole request: ${Date.now() - s}ms\n`)
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

app.get('/testing/*', (req, res) => {
  readyPromise.then(() => render(req, res))
})

const port = process.env.PORT || 9002

app.listen(port, () => {
  console.log(`[express] server started at localhost:${port}\n`)
})
