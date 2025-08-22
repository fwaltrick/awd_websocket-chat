import express from 'express'
import http from 'http'
import path from 'path'
import { WebSocketServer, WebSocket } from 'ws'

// Server
const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

const PORT = process.env.PORT || 8080

// For serving frontend files
app.use(express.static(path.join(__dirname, '../public')))

// WS Connection
wss.on('connection', (ws) => {
  console.log('Testing : new client connected')
  ws.on('message', (message) => {
    try {
      const messageObject = JSON.parse(message.toString())
      console.log('Received:', messageObject)

      messageObject.timestamp = new Date().toISOString()

      const broadcastMessage = JSON.stringify(messageObject)

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(broadcastMessage)
        }
      })
    } catch (error) {
      console.error('Failed to parse message or broadcast:', error)
    }
  })

  ws.on('close', () => {
    console.log('Client has disconnected.')
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
