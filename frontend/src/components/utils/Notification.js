import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'

/**
 * React Bootstrap notification wrapper
 * @param {array} notification - A STATE tuple where the first element is the notification text,
 * and the second is the alert color class (alert-success, alert-danger, etc.)
 * @param {function} setNotification - Function for setting the notification state
 */
const Notification = ({notification, setNotification}) => {
  if (notification.length === 2) {
    // Convert Bootstrap alert class (alert-success, alert-danger) to React Bootstrap variant (success, danger)
    const variant = notification[1].replace('alert-', '');
    
    return (
      <Alert 
        variant={variant} 
        dismissible 
        onClose={() => setNotification([])}
      >
        {notification[0]}
      </Alert>
    )
  } else {
    return null;
  }
}

Notification.propTypes = {
  notification: PropTypes.array,
  setNotification: PropTypes.func,
}

export default Notification
