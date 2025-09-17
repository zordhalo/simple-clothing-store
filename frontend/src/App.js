import React, {useEffect, useState} from 'react'
import {
  Route, 
  Routes,
  BrowserRouter as Router,
  useLocation
} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import axios from 'axios'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

import localStorageService from './services/localstorage'
import productsService from './services/products'
import storeConfig from './config'

import Notification from './components/utils/Notification'
import Cart from './components/cart/Cart'
import Loader from './components/utils/Loader'
import Navigation from './components/Navigation'
import Order from './components/order/Order'
import Product from './components/Product'
import Store from './components/Store'

// Wrapper components to handle params in React Router v6
const ProductWrapper = ({ productById, addToCart }) => {
  const location = useLocation();
  const id = location.pathname.split('/').pop();
  
  return productById(id) ? (
    <Product product={productById(id)} addToCart={addToCart} />
  ) : (
    <Loader />
  );
};

const OrderWrapper = ({ setOrderNotification, addOrder, orders, storeInfo }) => {
  const location = useLocation();
  const id = parseInt(location.pathname.split('/').pop());
  
  return (
    <Order
      orderId={id}
      setOrderNotification={setOrderNotification}
      addOrder={addOrder}
      orders={orders}
      storeInfo={storeInfo}
    />
  );
};

const App = () => {
  const [cart, setCart] = useState(localStorageService.getCart())
  const [orders, setOrders] = useState(localStorageService.getOrders())
  const [products, setProducts] = useState([])
  const [orderNotification, setOrderNotification] = useState([])
  const [cartNotification, setCartNotification] = useState([])
  const [connectionNotification, setConnectionNotification] = useState([])
  const [storeInfo, setStoreInfo] = useState(storeConfig)

  // Init store information
  useEffect(() => {
    axios.get('/api/store')
      .then((response) => setStoreInfo({
        ...response.data,
        ...storeConfig,
      }))
      .catch(() => setConnectionNotification(['Sorry, there\'s a problem with the connection!', 'alert-danger']))
  }, [
    storeInfo.brand,
  ])

  // Init products
  useEffect(() => {
    productsService.getAll()
      .then((prods) => setProducts(prods))
  }, [])

  const productById = (id) => products.find((product) => product.sync_product.id === parseInt(id))

  const addToCart = (item) => {
    setCart(localStorageService.addToCart(item, cart))
    setCartNotification([`${item.name} has been added to your cart!`, 'alert-success'])
  }
  const removeFromCart = (index) => setCart(localStorageService.removeFromCart(index, cart))
  const applyDiscount = (code, amount) => setCart(localStorageService.applyDiscount(code, amount, cart))
  const clearCart = () => setCart(localStorageService.clearCart())

  const addOrder = (id) => setOrders(localStorageService.addOrder(id, orders))

  return (
    <div>
      <main className="container">
        <Helmet>
          <title>{storeInfo.name} | {storeInfo.description}</title>
          <meta name="description" content={storeInfo.description} />
        </Helmet>
        <Notification notification={connectionNotification} setNotification={setConnectionNotification} />
        <Notification notification={orderNotification} setNotification={setOrderNotification} />
        <Notification notification={cartNotification} setNotification={setCartNotification} />
        <Router>
          <div>
            <Navigation cart={cart} orders={orders} storeInfo={storeInfo} />
            <div className={`alert alert-danger alert-dismissible fade show ${typeof(Storage) !== 'undefined' ? 'd-none' : ''}`} role="alert">
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              Our store currently only supports modern browsers, sorry!
            </div>
            <Routes>
              <Route path="/" element={<Store products={products} />} />
              <Route path="/cart" element={
                <Cart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  storeInfo={storeInfo}
                  applyDiscount={applyDiscount}
                  clearCart={clearCart} />
              } />
              <Route path="/product/:id" element={
                <ProductWrapper
                  productById={productById}
                  addToCart={addToCart}
                />
              } />
              <Route path="/order/:id" element={
                <OrderWrapper
                  setOrderNotification={setOrderNotification}
                  addOrder={addOrder}
                  orders={orders}
                  storeInfo={storeInfo} />
              } />
            </Routes>
          </div>
        </Router>
        <footer className="justify-content-center text-center">
          <p>© {storeInfo.established}-{(new Date()).getFullYear()} {storeInfo.name} {storeInfo.companySuffix}. {storeInfo.brand}® is a registered trademark of {storeInfo.name} {storeInfo.companySuffix}. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}

export default App
