const express = require('express')
const app = express()
app.use(express.json())

const VERIFY_TOKEN = 'token123'

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  } else {
    res.sendStatus(403)
  }
})

app.post('/webhook', (req, res) => {
  console.log(JSON.stringify(req.body))
  res.sendStatus(200)
})

app.listen(3000, () => console.log('Running'))
