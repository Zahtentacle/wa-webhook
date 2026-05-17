const express = require('express')
const app = express()
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

const VERIFY_TOKEN = 'token123'
let messages = []
let health = { lastPing: null, totalReceived: 0 }

// Webhook verify
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  } else {
    res.sendStatus(403)
  }
})

// Webhook receive
app.post('/webhook', (req, res) => {
  const entry = req.body?.entry?.[0]?.changes?.[0]?.value
  const msg = entry?.messages?.[0]
  if (msg) {
    const incoming = {
      id: msg.id,
      from: msg.from,
      name: entry?.contacts?.[0]?.profile?.name || msg.from,
      text: msg.text?.body || '',
      time: new Date().toISOString(),
      timestamp: msg.timestamp
    }
    messages.unshift(incoming)
    if (messages.length > 500) messages = messages.slice(0, 500)
    health.totalReceived++
    health.lastPing = new Date().toISOString()
    console.log('MSG:', incoming)
  }
  res.sendStatus(200)
})

// GET messages (dashboard polling)
app.get('/messages', (req, res) => {
  const since = req.query.since
  const filtered = since
    ? messages.filter(m => new Date(m.time) > new Date(since))
    : messages.slice(0, 50)
  res.json({ messages: filtered, health })
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', ...health, total: messages.length })
})

app.listen(3000, () => console.log('Ghost Webhook Running'))
