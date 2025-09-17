import React from 'react'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import PropTypes from 'prop-types'
import currency from 'currency.js'
import axios from 'axios'

const Payment = ({order, costs, setLoading, setOrderNotification, setPaid, clientID}) => {
  // TODO: Refactor this to be in a service
  const paymentApproved = (details) => {
    setLoading(true)
    axios.post(`/api/confirm/${details.id}`).then(() => {
      setOrderNotification(['Your order has been confirmed. We\'re getting it ready for shipment now!', 'alert-success'])
      setPaid(true)
      setLoading(false)
    })
  }

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          currency_code: costs.currency,
          value: costs.total,
          breakdown: {
            item_total: {
              currency_code: costs.currency,
              value: costs.subtotal,
            },
            shipping: {
              currency_code: costs.currency,
              value: costs.shipping,
            },
            handling: {
              currency_code: costs.currency,
              value: (currency(costs.digitization).add(costs.additional_fee).add(costs.filfillment_fee).format()),
            },
            tax_total: {
              currency_code: costs.currency,
              value: currency(costs.tax).add(costs.vat).format(),
            },
            discount: {
              currency_code: costs.currency,
              value: costs.discount,
            },
          },
        },
        description: `Payment for your order ${order.id}`,
        custom_id: `${order.id}`,
      }],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        brand_name: 'CLOTHING STORE',
      },
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      paymentApproved(details);
    });
  };

  return (
    <div className="row">
      <div className="col-md-12">
        You can pay with a credit / debit card via PayPal.
        All our transactions are processed by PayPal and we never store any of your payment information.<br />
      </div>
      <div className="col-md-12">
        <PayPalScriptProvider options={{ 
          clientId: clientID,
          components: "buttons",
          currency: costs.currency
        }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={onApprove}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  )
}

Payment.propTypes = {
  order: PropTypes.object,
  costs: PropTypes.object,
  setLoading: PropTypes.func,
  setOrderNotification: PropTypes.func,
  setPaid: PropTypes.func,
  clientID: PropTypes.string,
}

export default Payment
