/**
 * This file contains mock data to replace Printful API responses
 */

const mockProducts = [
  {
    id: 1,
    name: "T-Shirt Sample",
    sync_product: { id: 1 },
    sync_variants: [
      { 
        id: 101, 
        name: "T-Shirt Sample - S",
        retail_price: "19.99",
        files: [{ thumbnail_url: "https://via.placeholder.com/150" }],
        variant_id: 1001
      },
      { 
        id: 102, 
        name: "T-Shirt Sample - M", 
        retail_price: "19.99",
        files: [{ thumbnail_url: "https://via.placeholder.com/150" }],
        variant_id: 1002
      },
      { 
        id: 103, 
        name: "T-Shirt Sample - L", 
        retail_price: "19.99",
        files: [{ thumbnail_url: "https://via.placeholder.com/150" }],
        variant_id: 1003
      }
    ],
    description: "This is a sample T-shirt product."
  },
  {
    id: 2,
    name: "Hoodie Sample",
    sync_product: { id: 2 },
    sync_variants: [
      { 
        id: 201, 
        name: "Hoodie Sample - S", 
        retail_price: "39.99",
        files: [{ thumbnail_url: "https://via.placeholder.com/150" }],
        variant_id: 2001
      },
      { 
        id: 202, 
        name: "Hoodie Sample - M", 
        retail_price: "39.99",
        files: [{ thumbnail_url: "https://via.placeholder.com/150" }],
        variant_id: 2002
      },
      { 
        id: 203, 
        name: "Hoodie Sample - L", 
        retail_price: "39.99",
        files: [{ thumbnail_url: "https://via.placeholder.com/150" }],
        variant_id: 2003
      }
    ],
    description: "This is a sample hoodie product."
  }
];

const mockStoreInfo = {
  name: "Sample Clothing Store",
  currency: "USD",
  email: "sample@example.com",
  vat: 0
};

const mockCountries = [
  {
    code: "US",
    name: "United States",
    states: [
      { code: "CA", name: "California" },
      { code: "NY", name: "New York" },
      { code: "TX", name: "Texas" }
    ]
  },
  {
    code: "CA",
    name: "Canada",
    states: [
      { code: "ON", name: "Ontario" },
      { code: "QC", name: "Quebec" }
    ]
  }
];

const mockShippingCost = {
  costs: {
    shipping: "5.00",
    tax: "0.00"
  }
};

const mockOrder = {
  id: "mock-order-123",
  status: "draft",
  retail_costs: {
    total: "24.99"
  },
  recipient: {}
};

module.exports = {
  mockProducts,
  mockStoreInfo,
  mockCountries,
  mockShippingCost,
  mockOrder
};