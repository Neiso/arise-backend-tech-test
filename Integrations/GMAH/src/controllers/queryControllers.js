const axios = require('axios')

const queryFactory = (check_in, check_out, adults) => {
  return `query {
    properties(first: 20) {
      edges {
        cursor
        node {
          name,
          country,
          id,
          partnerReferences {
            partner
          }
          rooms(startDate: "${check_in}", endDate: "${check_out}", adults: ${adults ? adults : 2}) {
            edges {
              cursor
              node {
                name,
                id,
                description,
                remaining,
                price {
                  currency,
                  amount
                }
              }
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }`
}

const filterResults = (hotels, parameters) => {
  const { country, hotelName } = parameters
  const priceMin = parseInt(parameters.priceMin)
  const priceMax = parseInt(parameters.priceMax)
  const hotelIds = parameters.hotelIds ? parameters.hotelIds.split(',') : []

  const filteredHotels = hotels.reduce((curr, rawHotel) => {
    const currHotel = rawHotel.node
    const rooms = currHotel.rooms.edges

    // Apply parameters
    if (hotelName && currHotel.name.indexOf(hotelName) === -1) return curr
    if (hotelIds.length && !hotelIds.includes(currHotel.id)) return curr
    if (country && country !== currHotel.country) return curr

    // If min-max; query price in between
    // Else if only min; query price above
    // Else if only max; query price below
    // Else just remove the non availible rooms
    let filteredRooms = []
    if (priceMin && priceMax) {
      filteredRooms = rooms.filter(room => room.node.remaining > 0 && room.node.price.amount > parseInt(priceMin) && room.node.price.amount < parseInt(priceMax))
    } else if (priceMin) {
      filteredRooms = rooms.filter(room => room.node.remaining > 0 && room.node.price.amount > parseInt(priceMin))
    } else if (priceMax) {
      filteredRooms = rooms.filter(room => room.node.remaining > 0 && room.node.price.amount < parseInt(priceMax))
    } else {
      filteredRooms = rooms.filter(room => room.node.remaining > 0)
    }
    if (!filteredRooms.length) return curr

    // Add hotel/rooms eligible
    delete currHotel.rooms
    curr.push({ hotel: { ...currHotel }, rooms: filteredRooms.map(room => room.node) })
    return curr
  }, [])

  return filteredHotels
}

exports.queryResolver = async (req, res) => {
  const { check_in, check_out, adults } = req.query

  if (!check_in || !check_out) return res.status(400).json({ succes: false, error: "Check in or check out date is missing" })

  try {
    const query = queryFactory(check_in, check_out, adults)

    const result = await axios({
      method: 'POST',
      url: process.env.GRAPHQL_ENDPOINT,
      data: {
        "query": query,
        "variables": {},
        "operationName": null
      }
    })

    // If no results found means an error occured with the GQL data cause currently there is no pagination mecanisim
    const hotels = result.data.data.properties.edges
    if (!hotels.length) throw Error('GQL returned no data')

    const filteredHotels = filterResults(hotels, req.query)

    res.json({ data: filteredHotels })
  } catch (err) {
    console.log('Error Happened While Querying:', err.stack)
    return res.status(500).json({ success: false, error: 'An error happened fetching the hotels.' })
  }
}