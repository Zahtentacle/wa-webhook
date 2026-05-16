const express = require('express')
const app = express()
app.use(express.json())

const VERIFY_TOKEN = 'token123'
const TOKEN = 'EAAOQZB1AbqfsBRVFTrZBVnHTN58yBeimQ1ZAl7Fc4KMWHaJwmhe7ZCAl0YYscge8tLj1OCdmLS1FufngbOMHdMKaAhAMiRx5WUdAQdyh47XYiqUUyWkDFk7VXtShpudM0TehucGCNOz4EOJmHIZCfnMvsH7yIIGhWxkdhQ9nzmsijyHmH1zLEslBsGqWm1vqF'
const PHONE_ID = '1078926971975097'

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  } else {
    res.sendStatus(403)
  }
})

app.post('/webhook', async (req, res) => {
  const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]
  if (!msg) return res.sendStatus(200)

  const from = msg.from
  const text = msg.text?.body || ''

  await fetch(`https://graph.facebook.com/v18.0/${PHONE_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: from,
      text: { body: `Halo! Pesan kamu sudah kami terima 👋` }
    })
  })

  res.sendStatus(200)
})

app.listen(3000, () => console.log('Running'))
