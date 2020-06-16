import auth, {  } from 'basic-auth';
import express, {  } from 'express';
import { resolve } from 'path';
//@ts-ignore
import basicAuth from 'basic-auth-connect';
import serve, {  } from 'serve-static';
import multer, { Options } from 'multer';

export const app = express();

//@ts-ignore
app.use(multer({  inMemory: true }).single('upload'))

app.post('/upload', function(req, res) {
  res.send(req.files)
})

/**
 * Accept file uploads.
 */
//@ts-ignore
app.use(multer({ inMemory: true }).single('upload'))

/**
 * Echo uploaded files for testing assertions.
 */

app.post('/upload', function(req, res) {
  res.send(req.files)
})

/**
 * Echo HTTP Basic Auth for testing assertions.
 */

app.get('/auth', basicAuth('my', 'auth'), function(req, res) {
  res.send(auth(req))
})

app.get('/auth2', basicAuth('my2', 'auth2'), function(req, res) {
  res.send(auth(req))
})

/**
 * Echo HTTP Headers for testing assertions.
 */

app.get('/headers', function(req, res) {
  res.header('Cache-Control', 'no-cache')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  res.send(req.headers)
})

/**
 * Redirect to the provided URL for testing redirects and headers
 */

app.get('/redirect', function(req, res) {
  var code = Number(req.query.code) || 301
  var url = req.query.url || '/'
  //@ts-ignore
  res.redirect(code, url)
})

/**
 * Start the response but do not end the request
 */
app.get('/not-modified', function(req, res) {
  res.sendStatus(304)
})

/**
 * Simply hang up on the connection for testing interrupted page loads
 */

app.get('/do-not-respond', function(req, res) {
  //@ts-ignore
  res.socket.end()
})

/**
 * Start the response but do not end the request
 */
app.get('/never-ends', function(req, res) {
  res.set('Content-Type', 'text/html')
  res.write(`<strong>this page will not stop</strong>`)
})

/**
 * Wait forever and never respond
 */

app.get('/wait', function(_req, _res) {})

/**
 * Return 'Referer' header if presented
 */

app.get('/referer', function(req, res) {
  res.send(
    typeof req.headers.referer !== 'undefined' ? req.headers.referer : ''
  )
})

/**
 * Serve the fixtures directory as static files.
 */

app.use(serve(resolve(__dirname, 'fixtures')))

/**
 * Serve the test files so they can be accessed via HTML as well.
 */

app.use('/files', serve(resolve(__dirname, 'files')));

export default app;