require('dotenv').config()

const express = require('express')
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk')
const currency = require('currency.js')

// const PrintfulClient = require('./lib/printfulclient.js')
const payPalClient = require('./lib/paypal.js')
const db = require('./lib/datab.js')
const { mockProducts, mockStoreInfo, mockCountries, mockShippingCost, mockOrder } = require('./lib/mockdata.js')

// const pf = new PrintfulClient(process.env.PRINTFUL_SECRET)
const app = express()

let products = [...mockProducts]
let storeInfo = {...mockStoreInfo}

// FOR DEMO ONLY \/
const confirmed = []
// FOR DEMO ONLY /\

// Initialize products
const initProducts = () => {
  // Mock implementation using mockdata.js
  products.forEach(product => {
    const dbEntry = db.items.find((dbProd) => dbProd.id === product.sync_product.id)
    if (dbEntry) {
      product.description = dbEntry.description;
    }
  });
  console.log('Initialized with mock product data');
}

// Initialize store info
const initStoreInfo = () => {
  // Mock implementation using mockdata.js
  storeInfo = {
    ...mockStoreInfo,
    vat: db.vat || 0,
  };
  console.log('Initialized with mock store info');
}
initProducts()
initStoreInfo()

const variantById = (id) => {
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    for (let j = 0; j < product.sync_variants.length; j++) {
      const variant = product.sync_variants[j]
      if (id == variant.id) {
        return variant
      }
    }
  }
}

app.use(express.static('build'))
app.use(express.json())

app.post('/api/confirm/:orderId', async (req, res) => {
  const orderID = req.params.orderId

  // Call PayPal to get the transaction details
  let order
  try {
    const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID)
    order = await payPalClient.client().execute(request)
  } catch (err) {
    console.error(err)
    return res.sendStatus(500)
  }

  const printfulID = order.result.purchase_units[0].custom_id
  // Mock Printful API response
  // pf.get(`orders/${printfulID}`)
  //   .success((data, _info) => {
      
  // Using mock data instead
  const data = { ...mockOrder, id: printfulID };
  if (data.status === 'draft' &&
      data.retail_costs.total === order.result.purchase_units[0].amount.value) {
    // TODO: More robust error handling, in a middleware
    if (process.env.DEMO) {
      // For demo
      confirmed.push(printfulID)
      res.sendStatus(200)
    } else {
      // This should run only in production \._./
      // pf.post(`orders/${orderID}/confirm`).success(() => res.sendStatus(200)).error(() => res.sendStatus(400))
      // Mock successful confirmation
      confirmed.push(printfulID)
      res.sendStatus(200)
    }
  } else {
    res.sendStatus(400)
  }
  //   }).error((_err, info) => console.error(info))
})

app.get('/api/products', (_req, res) => res.json(products))

/**
 * Fetches necessary country/state information from Printful
 */
app.get('/api/countries', (req, res) => {
  // Mock Printful API call
  // pf.get('countries').success((data, info) => {
  //   res.json(data)
  // }).error((err, info) => {
  //   console.error(info)
  //   res.sendStatus(400)
  // })
  
  // Using mock data instead
  res.json(mockCountries);
})

/**
 * Fetches order details from Printful's API
*/
app.get('/api/orders/:orderId', (req, res) => {
  // Mock Printful API call
  // pf.get(`orders/${req.params.orderId}`).success((data, info) => {
  //   // For the demo of the store, we don't want to actually confirm any orders...
  //   if (process.env.DEMO && confirmed.includes(req.params.orderId)) {
  //     res.json({...data, status: 'pending'})
  //   } else {
  //     res.json(data)
  //   }
  // }).error((_err, info) => {
  //   console.error(info)
  //   res.sendStatus(404)
  // })
  
  // Using mock data instead
  const data = { ...mockOrder, id: req.params.orderId };
  if (confirmed.includes(req.params.orderId)) {
    res.json({...data, status: 'pending'});
  } else {
    res.json(data);
  }
})

/**
 * Creates order with Printful's API (now mocked)
*/
app.post('/api/orders', (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    secondAddress,
    country,
    city,
    state,
    zip,
    cart,
  } = req.body
  const recipient = {
    name: `${firstName} ${lastName}`,
    email: email,
    phone: phone,
    address1: address,
    city: city,
    state_code: state,
    country_code: country,
    zip: zip,
  }
  if (secondAddress && secondAddress.length > 0) {
    recipient.address2 = secondAddress
  }

  const items = cart.items.map((item) => variantById(item.id))
  const parsedItems = items.map((item) => {
    return {
      sync_variant_id: item.id,
      quantity: 1,
      retail_price: item.retail_price,
    }
  })
  const subtotal = items.reduce((accum, current) => accum.add(current.retail_price), currency(0))

  const discount = db.discounts[cart.discountCode]
  
  // Mock Printful API calls
  // First estimate the shipping costs
  // pf.post('orders/estimate-costs', ...)
  
  // Using mock shipping cost data
  const data = mockShippingCost;
  const discountAmount = discount ? subtotal.multiply(100-discount).divide(100) : currency(0)
  const retailCosts = {
    discount: discountAmount,
    vat: subtotal
      .add(currency(data.costs.shipping).value)
      .subtract(discountAmount.value)
      .multiply(db.vat)
      .divide(100),
  }

  // Mock Printful order creation
  // pf.post('orders', ...)
  
  // Generate a mock order ID and return it
  const mockOrderId = `mock-${Date.now()}`;
  // Store this mock order for later reference
  confirmed.push(mockOrderId);
  res.send(mockOrderId);
})

/**
 * Fetches store details
*/
app.get('/api/store', (req, res) => {
  res.json(storeInfo)
})

/**
 * Checks a discount code and returns the proper discount for it
*/
app.get('/api/discount/:code', (req, res) => {
  // TODO: Concrete implementation
  const discount = db.discounts[req.params.code]
  discount ? res.send(`${discount}`) : res.send('0')
})

const listener = app.listen(process.env.PORT || 3001, () => {
  const port = listener.address().port
  const host = process.env.HOST || 'localhost'
  const backendUrl = `http://${host}:${port}`

  if (process.env.NODE_ENV === 'production') {
    console.log(`Server running: ${backendUrl}`)
    console.log('The clothing store is serving the built frontend from the `build/` directory')
  } else {
    // Development: frontend dev server typically runs on 3000
    const frontendPort = process.env.FRONTEND_PORT || 3000
    const frontendUrl = `http://${host}:${frontendPort}`

    console.log('The clothing store backend is listening on port ' + port)
    console.log(`Backend API: ${backendUrl}`)
    console.log(`Frontend (dev): ${frontendUrl}`)
    console.log('Open the app in your browser at the frontend URL above')
  }
})
