// function parseOrder1(payload = {}) {
//     // Safely retrieve top-level fields
//     const orderNumber = payload.order_number || "";
//     let orderDate = payload.created_at || "";
//     if (orderDate) {
//       // Replace `T` with ` -> ` and remove anything after `+`
//       orderDate = orderDate.replace("T", " -> ");
//       orderDate = orderDate.slice(0, orderDate.length - 6);
//     }
  
//     // Retrieve customer fields
//     const customer = payload.customer || {};
//     const defaultAddress = customer.default_address || {};
  
//     // Determine the customer name
//     let customerName = defaultAddress.name || "";
//     if (!customerName) {
//       const firstName = customer.first_name || "";
//       const lastName = customer.last_name || "";
//       customerName = (firstName + " " + lastName).trim();
//     }
  
//     // Determine the customer phone
//     let customerPhone = (defaultAddress.phone || "").trim();
//     if (!customerPhone) {
//       const billingAddress = payload.billing_address || {};
//       customerPhone = billingAddress.phone || "";
//     }
//     customerPhone = customerPhone.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  
//     // Extract items
//     const lineItems = payload.line_items || [];
//     const items = lineItems.map((item) => ({
//       name: item.name || "",
//       quantity: item.quantity || 0,
//       price: item.price || ""
//     }));
  
//     // Extract summary information
//     const subtotal = payload.subtotal_price || "";
//     const tax = payload.total_tax || "";
//     const total = payload.total_price || "";
  
//     // Extract shipping information
//     const shippingLines = payload.shipping_lines || [];
//     let shippingFee = null;
//     let shippingMethod = null;
//     if (shippingLines.length > 0) {
//       shippingFee = shippingLines[0].price || null;
//       shippingMethod = shippingLines[0].title || null;
//     }
  
//     const shippingAddress = payload.shipping_address || {};
//     const address = [
//       shippingAddress.address1 || "",
//       shippingAddress.address2 || "",
//       shippingAddress.city || "",
//       shippingAddress.country || ""
//     ].join(", ");
  
//     // Construct the result object
//     return {
//       orderNumber,
//       orderDate,
//       customerName,
//       customerPhone,
//       items,
//       subtotal,
//       tax,
//       shippingFee,
//       total,
//       address,
//       shippingMethod
//     };
//   }
//   function parseOrder(payload = {}) {
//     // Destructure the main fields
//     const {
//       order_number: orderNumber = "",
//       created_at: rawOrderDate = "",
//       customer: {
//         default_address: {
//           name: defaultName = "",
//           phone: defaultPhone = ""
//         } = {},
//         first_name: firstName = "",
//         last_name: lastName = ""
//       } = {},
//       billing_address: {
//         phone: billingPhone = ""
//       } = {},
//       line_items: lineItems = [],
//       subtotal_price: subtotal = "",
//       total_tax: tax = "",
//       total_price: total = "",
//       shipping_lines: shippingLines = [],
//       shipping_address: {
//         address1 = "",
//         address2 = "",
//         city = "",
//         country = ""
//       } = {}
//     } = payload;
  
//     // Fix up the order date
//     let orderDate = rawOrderDate
//       ? rawOrderDate.replace("T", " -> ").slice(0, -6)
//       : "";
  
//     // Determine the customer name
//     let customerName = defaultName || (firstName + " " + lastName).trim();
  
//     // Determine the customer phone
//     let customerPhone = defaultPhone.trim() || billingPhone;
//     // Remove non-numeric characters
//     customerPhone = customerPhone.replace(/[^0-9]/g, "");
  
//     // Map line items
//     const items = lineItems.map(({ name = "", quantity = 0, price = "" }) => ({
//       name,
//       quantity,
//       price
//     }));
  
//     // Shipping information
//     let shippingFee = null;
//     let shippingMethod = null;
//     if (shippingLines.length > 0) {
//       shippingFee = shippingLines[0].price || null;
//       shippingMethod = shippingLines[0].title || null;
//     }
  
//     // Build full shipping address
//     const address = [address1, address2, city, country].join(", ");
  
//     // Return the final object
//     return {
//       orderNumber,
//       orderDate,
//       customerName,
//       customerPhone,
//       items,
//       subtotal,
//       tax,
//       shippingFee,
//       total,
//       address,
//       shippingMethod
//     };
//   }
  
// const examplePayload = {
//   id: 7629735067734,
//   admin_graphql_api_id: 'gid://shopify/Order/7629735067734',
//   app_id: 580111,
//   browser_ip: '103.125.177.132',
//   buyer_accepts_marketing: false,
//   cancel_reason: null,
//   cancelled_at: null,
//   cart_token: 'Z2NwLWV1cm9wZS13ZXN0MTowMUpSTTNHMjBEMDhLWlQzVlFGUFNHTjhSNw',
//   checkout_id: 28919928881238,
//   checkout_token: '08bad65800803191895979e6fa3721a6',
//   client_details: {
//     accept_language: 'en-PK',
//     browser_height: null,
//     browser_ip: '103.125.177.132',
//     browser_width: null,
//     session_hash: null,
//     user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
//   },
//   closed_at: null,
//   company: null,
//   confirmation_number: 'PLWZR7QWF',
//   confirmed: true,
//   contact_email: 'mubeenqamar29@gmail.com',
//   created_at: '2025-04-12T09:18:44+05:00',
//   currency: 'PKR',
//   current_shipping_price_set: {
//     shop_money: { amount: '250.00', currency_code: 'PKR' },
//     presentment_money: { amount: '250.00', currency_code: 'PKR' }
//   },
//   current_subtotal_price: '700.00',
//   current_subtotal_price_set: {
//     shop_money: { amount: '700.00', currency_code: 'PKR' },
//     presentment_money: { amount: '700.00', currency_code: 'PKR' }
//   },
//   current_total_additional_fees_set: null,
//   current_total_discounts: '0.00',
//   current_total_discounts_set: {
//     shop_money: { amount: '0.00', currency_code: 'PKR' },
//     presentment_money: { amount: '0.00', currency_code: 'PKR' }
//   },
//   current_total_duties_set: null,
//   current_total_price: '1062.00',
//   current_total_price_set: {
//     shop_money: { amount: '1062.00', currency_code: 'PKR' },
//     presentment_money: { amount: '1062.00', currency_code: 'PKR' }
//   },
//   current_total_tax: '112.00',
//   current_total_tax_set: {
//     shop_money: { amount: '112.00', currency_code: 'PKR' },
//     presentment_money: { amount: '112.00', currency_code: 'PKR' }
//   },
//   customer_locale: 'en-PK',
//   device_id: null,
//   discount_codes: [],
//   duties_included: false,
//   email: 'mubeenqamar29@gmail.com',
//   estimated_taxes: false,
//   financial_status: 'authorized',
//   fulfillment_status: null,
//   landing_site: '/password',
//   landing_site_ref: null,
//   location_id: null,
//   merchant_business_entity_id: 'MTU1OTc4MzI4MTUw',
//   merchant_of_record_app_id: null,
//   name: '💙1622',
//   note: null,
//   note_attributes: [],
//   number: 622,
//   order_number: 1622,
//   order_status_url: 'https://store-mobeen-pk.myshopify.com/55978328150/orders/421420b9aa3d519cc895a49b295b4aef/authenticate?key=c8b656d82b4a60fc851fb13fa07ae2da',
//   original_total_additional_fees_set: null,
//   original_total_duties_set: null,
//   payment_gateway_names: [ 'bogus' ],
//   phone: null,
//   po_number: null,
//   presentment_currency: 'PKR',
//   processed_at: '2025-04-12T09:18:41+05:00',
//   reference: null,
//   referring_site: '',
//   source_identifier: null,
//   source_name: 'web',
//   source_url: null,
//   subtotal_price: '700.00',
//   subtotal_price_set: {
//     shop_money: { amount: '700.00', currency_code: 'PKR' },
//     presentment_money: { amount: '700.00', currency_code: 'PKR' }
//   },
//   tags: '',
//   tax_exempt: false,
//   tax_lines: [
//     {
//       price: '112.00',
//       rate: 0.16,
//       title: 'GST',
//       price_set: [Object],
//       channel_liable: false
//     }
//   ],
//   taxes_included: false,
//   test: true,
//   token: '421420b9aa3d519cc895a49b295b4aef',
//   total_cash_rounding_payment_adjustment_set: {
//     shop_money: { amount: '0.00', currency_code: 'PKR' },
//     presentment_money: { amount: '0.00', currency_code: 'PKR' }
//   },
//   total_cash_rounding_refund_adjustment_set: {
//     shop_money: { amount: '0.00', currency_code: 'PKR' },
//     presentment_money: { amount: '0.00', currency_code: 'PKR' }
//   },
//   total_discounts: '0.00',
//   total_discounts_set: {
//     shop_money: { amount: '0.00', currency_code: 'PKR' },
//     presentment_money: { amount: '0.00', currency_code: 'PKR' }
//   },
//   total_line_items_price: '700.00',
//   total_line_items_price_set: {
//     shop_money: { amount: '700.00', currency_code: 'PKR' },
//     presentment_money: { amount: '700.00', currency_code: 'PKR' }
//   },
//   total_outstanding: '0.00',
//   total_price: '1062.00',
//   total_price_set: {
//     shop_money: { amount: '1062.00', currency_code: 'PKR' },
//     presentment_money: { amount: '1062.00', currency_code: 'PKR' }
//   },
//   total_shipping_price_set: {
//     shop_money: { amount: '250.00', currency_code: 'PKR' },
//     presentment_money: { amount: '250.00', currency_code: 'PKR' }
//   },
//   total_tax: '112.00',
//   total_tax_set: {
//     shop_money: { amount: '112.00', currency_code: 'PKR' },
//     presentment_money: { amount: '112.00', currency_code: 'PKR' }
//   },
//   total_tip_received: '0.00',
//   total_weight: 0,
//   updated_at: '2025-04-12T09:18:45+05:00',
//   user_id: null,
//   billing_address: {
//     first_name: 'Mobeen',
//     address1: 'Street 1 house 238 of Shalimar Housing society Salamatpura',
//     phone: null,
//     city: 'Lahore',
//     zip: null,
//     province: null,
//     country: 'Pakistan',
//     last_name: 'Qamar',
//     address2: null,
//     company: null,
//     latitude: null,
//     longitude: null,
//     name: 'Mobeen Qamar',
//     country_code: 'PK',
//     province_code: null
//   },
//   customer: {
//     id: 7381137686614,
//     email: 'mubeenqamar29@gmail.com',
//     created_at: '2024-10-10T11:20:33+05:00',
//     updated_at: '2025-04-12T09:18:44+05:00',
//     first_name: 'Mobeen',
//     last_name: 'Qamar',
//     state: 'invited',
//     note: null,
//     verified_email: true,
//     multipass_identifier: null,
//     tax_exempt: false,
//     phone: null,
//     currency: 'PKR',
//     tax_exemptions: [],
//     admin_graphql_api_id: 'gid://shopify/Customer/7381137686614',
//     default_address: {
//       id: 9223885914198,
//       customer_id: 7381137686614,
//       first_name: 'Mobeen',
//       last_name: 'Qamar',
//       company: null,
//       address1: 'Street 1 house 238 of Shalimar Housing society Salamatpura',
//       address2: null,
//       city: 'Lahore',
//       province: null,
//       country: 'Pakistan',
//       zip: null,
//       phone: null,
//       name: 'Mobeen Qamar',
//       province_code: null,
//       country_code: 'PK',
//       country_name: 'Pakistan',
//       default: true
//     }
//   },
//   discount_applications: [],
//   fulfillments: [],
//   line_items: [
//     {
//       id: 16580482695254,
//       admin_graphql_api_id: 'gid://shopify/LineItem/16580482695254',
//       attributed_staffs: [],
//       current_quantity: 1,
//       fulfillable_quantity: 1,
//       fulfillment_service: 'manual',
//       fulfillment_status: null,
//       gift_card: false,
//       grams: 0,
//       name: '"High-Quality 4X Power IC Chip for Redmi NOTE2',
//       price: '300.00',
//       price_set: [Object],
//       product_exists: true,
//       product_id: 7338244997206,
//       properties: [],
//       quantity: 1,
//       requires_shipping: true,
//       sales_line_item_group_id: null,
//       sku: '874007',
//       taxable: true,
//       title: '"High-Quality 4X Power IC Chip for Redmi NOTE2',
//       total_discount: '0.00',
//       total_discount_set: [Object],
//       variant_id: 41571896918102,
//       variant_inventory_management: 'shopify',
//       variant_title: null,
//       vendor: 'Albarak mobile',
//       tax_lines: [Array],
//       duties: [],
//       discount_allocations: []
//     },
//     {
//       id: 16580482728022,
//       admin_graphql_api_id: 'gid://shopify/LineItem/16580482728022',
//       attributed_staffs: [],
//       current_quantity: 1,
//       fulfillable_quantity: 1,
//       fulfillment_service: 'manual',
//       fulfillment_status: null,
//       gift_card: false,
//       grams: 0,
//       name: '"High-Quality 532 Power Supply IC for HONOR 4X 6X 7X 8X 8.1"',
//       price: '400.00',
//       price_set: [Object],
//       product_exists: true,
//       product_id: 7338235134038,
//       properties: [],
//       quantity: 1,
//       requires_shipping: true,
//       sales_line_item_group_id: null,
//       sku: '1304007',
//       taxable: true,
//       title: '"High-Quality 532 Power Supply IC for HONOR 4X 6X 7X 8X 8.1"',
//       total_discount: '0.00',
//       total_discount_set: [Object],
//       variant_id: 41571880403030,
//       variant_inventory_management: 'shopify',
//       variant_title: null,
//       vendor: 'Albarak mobile',
//       tax_lines: [Array],
//       duties: [],
//       discount_allocations: []
//     }
//   ],
//   payment_terms: null,
//   refunds: [],
//   shipping_address: {
//     first_name: 'Mobeen',
//     address1: 'Street 1 house 238 of Shalimar Housing society Salamatpura',
//     phone: null,
//     city: 'Lahore',
//     zip: null,
//     province: null,
//     country: 'Pakistan',
//     last_name: 'Qamar',
//     address2: null,
//     company: null,
//     latitude: 31.5829975,
//     longitude: 74.4088411,
//     name: 'Mobeen Qamar',
//     country_code: 'PK',
//     province_code: null
//   },
//   shipping_lines: [
//     {
//       id: 5135120564310,
//       carrier_identifier: null,
//       code: 'Standard by weight',
//       current_discounted_price_set: [Object],
//       discounted_price: '250.00',
//       discounted_price_set: [Object],
//       is_removed: false,
//       phone: null,
//       price: '250.00',
//       price_set: [Object],
//       requested_fulfillment_service_id: null,
//       source: 'shopify',
//       title: 'Standard by weight',
//       tax_lines: [],
//       discount_allocations: []
//     }
//   ],
//   returns: []
// }
// console.log(parseOrder1(examplePayload));
  

import crypto from 'crypto';

// Ensure your encryption key is kept secret!
// For AES-256-CBC, this key must be 32 bytes (you can use a hash over a secret passphrase).
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'F1u2c3k4T5h6e7H8a9c0ker123321123'; 
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypts the phone number into a URL-safe string.
 *
 * @param {string} phoneNumber - The raw phone number, e.g. "923414075054".
 * @returns {string} The encrypted token.
 */
function encryptPhoneNumber(phoneNumber) {
  // Generate a random Initialization Vector (IV)
  const iv = crypto.randomBytes(16);
  
  // Create the cipher with the algorithm, key, and iv
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'utf8'), iv);
  
  // Encrypt the phone number (as UTF-8 text)
  const encryptedBuffer = Buffer.concat([
    cipher.update(phoneNumber, 'utf8'),
    cipher.final()
  ]);
  
  // Combine IV with the encrypted data. We need the IV for decryption.
  const combinedBuffer = Buffer.concat([iv, encryptedBuffer]);
  
  // Encode to base64, and then make it URL-safe:
  let encrypted = combinedBuffer.toString('base64');
  // Replace characters not URL-safe and remove padding "=".
  encrypted = encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  
  return encrypted;
}

/**
 * Decrypts the token back into the phone number.
 *
 * @param {string} token - The encrypted token (URL-safe string).
 * @returns {string} The decrypted phone number.
 */
function decryptPhoneNumber(token) {
  // Revert URL-safe base64 back to normal base64.
  let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
  // Add any missing padding.
  while (base64.length % 4) {
    base64 += '=';
  }
  
  const combinedBuffer = Buffer.from(base64, 'base64');
  // Extract the IV (first 16 bytes) and the encrypted message.
  const iv = combinedBuffer.slice(0, 16);
  const encryptedBuffer = combinedBuffer.slice(16);
  
  // Create a decipher.
  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY, 'utf8'), iv);
  const decryptedBuffer = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final()
  ]);
  
  return decryptedBuffer.toString('utf8');
}

// --- Example Usage ---

// Let's assume you want to create a URL like: https://yourdomain.com/{encryptedPhoneNumber}
const rawPhoneNumber = "564561631615616";
const encryptedToken = encryptPhoneNumber(rawPhoneNumber);
console.log("Encrypted token:", encryptedToken);

// Later on, when you receive a request, you can decrypt the token:
const decryptedNumber = decryptPhoneNumber(encryptedToken);
console.log("Decrypted phone number:", decryptedNumber);

// Later on, when you receive a request, you can decrypt the token:

console.log("Decrypted phone number:", decryptPhoneNumber("YMew7X2tEaJga-GNTckLREpJjfahaxnW3rniSD6Uzs4"));

// Now, you can build the URL using the encrypted token:
const url = `https://yourdomain.com/${encryptedToken}`;
console.log("Generated URL:", url);
