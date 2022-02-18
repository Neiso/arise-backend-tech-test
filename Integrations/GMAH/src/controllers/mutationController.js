const axios = require('axios')

const mutationFactory = (params) => {
  const { hotelId, roomId, checkIn, checkOut, contactPerson, adults, childrenAges, price } = params

  return `mutation{
    createReservation(payload: {
      hotelId: "${hotelId}",
      roomId: "${roomId}",
      checkIn: "${checkIn}",
      checkOut: "${checkOut}",
      contactPerson: { firstName: "${contactPerson.firstName}", lastName: "${contactPerson.lastName}"},
      adults: ${adults},
      childrenAges: ${childrenAges},
      price: { currency: ${price.currency}, amount: ${price.amount}, decimalPlaces: ${price.decimalPlaces}}
    }){
      id
      checkIn
      checkOut
      contactPerson {
        firstName, lastName
      }
      price {
        amount
      }
      property {
        id,
        name,
      }
      room {
        id,
        name,
        price { amount }
      }
    }
  }`
}

exports.mutationResolver = async (req, res) => {
  try {
    const mutation = mutationFactory(req.body.params)

    const result = await axios({
      method: 'POST',
      url: process.env.GRAPHQL_ENDPOINT,
      data: {
        "query": mutation,
        "variables": {},
        "operationName": null
      }
    })

    if (result.data.errors && result.data.errors.length) {
      return res.status(400).json({
        error: "Could not validate booking reservation",
        validation: {
          path: "createReservation",
          errors: result.data.errors.map(err => err.message)
        }
      })
    }

    return res.json(result.data)
  } catch (err) {
    console.log('Error Happened While Querying:', err.stack)

    return res.status(500).json({ success: false, error: 'An error happened while making the reservation.' })
  }
}