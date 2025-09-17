import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import { Dropdown } from 'react-bootstrap'

const Navigation = ({ cart, orders, storeInfo }) => {
  const location = useLocation();
  
  return (
    <div className="row">
      <div className="col-sm text-center">
        <h1 className="display-4 mt-2">
          <Link className="link-dark store-title" to="/">{storeInfo.name.toUpperCase()}</Link>
        </h1>
        <ul className="nav nav-tabs" id="nav">
          <li className="nav-item me-auto">
            <Link 
              className={`nav-link${location.pathname === '/' || location.pathname.includes('/product') ? ' active' : ''}`} 
              to="/"
            >
              All items
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              className={`nav-link${location.pathname.includes('/cart') ? ' active' : ''}`} 
              to="/cart"
            >
              Shopping cart ({cart.items.length})
            </Link>
          </li>
          {orders.length > 0 && (
            <li>
              <Dropdown>
                <Dropdown.Toggle 
                  variant="link"
                  className={`nav-link${location.pathname.includes('/order') ? ' active' : ''}`}
                  id="dropdown-orders"
                >
                  My orders
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {orders.map((order) => (
                    <Dropdown.Item key={order} as={Link} to={`/order/${order}`}>
                      #{order}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

Navigation.propTypes = {
  cart: PropTypes.object,
  orders: PropTypes.array,
  storeInfo: PropTypes.object,
};

export default Navigation;
