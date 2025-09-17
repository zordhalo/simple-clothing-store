import React from 'react'
import { Spinner } from 'react-bootstrap'

/**
 * React Bootstrap loader component that can be included
 * instead of a page if the content isn't ready.
 */
const Loader = () => (
  <div className="d-flex justify-content-center">
    <Spinner animation="border" role="status" className="m-5">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
)

export default Loader
