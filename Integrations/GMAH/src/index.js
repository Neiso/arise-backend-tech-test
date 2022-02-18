const express = require('express')
const app = express()
const port = process.env.LISTENING_PORT

const Router = require('./router')

// Read request body application/json
app.use(express.json())

// Mount routes to the server
app.use('/gmah/v1', Router)

app.use((req, res) => {
  res.status(404).send('Url not found')
})

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})