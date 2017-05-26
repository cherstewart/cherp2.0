'use strict'

import 'babel-polyfill'
import http from 'http'
import path from 'path'
import connect from 'connect'
import compression from 'compression'
import marko from 'marko/node-require'
import markoComponents from 'marko/components'
import router from './lib/router'
import IO from 'socket.io'

const port = process.env.PORT || '9001' // It's over 9000

const app = connect()
const server = http.createServer(app)
const io = new IO(server)

marko.install()

app
    .use(compression())
    .use('/', (request, response) => router.page(request, response))

io.on('connection', (socket) => {
    console.log('connected to socket')
    socket.on('pageLoaded', () => {
        console.log(`${Date.now()}: page loaded.`)
        router.resolveData(socket)
    })
})


server.listen(port, (err) => {
    if (err) {
        return console.error(`There was an error: ${err}`)
    }
    console.log(`Listening on port: ${port}`)
})

module.exports = app
