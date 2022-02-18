const Router = require('express').Router()

const { queryResolver } = require('./controllers/queryControllers.js')
const { mutationResolver } = require('./controllers/mutationController')
// const MutateGL

// Query by COUNTRY
// Query by HOTELS
// Query by DATES
// Query by PRICES

Router.get('/query', queryResolver)
Router.post('/book', mutationResolver)

module.exports = Router