function parseOrder1(payload = {}) {
    // Safely retrieve top-level fields
    const orderNumber = payload.order_number || "";
    let orderDate = payload.created_at || "";
    if (orderDate) {
      // Replace `T` with ` -> ` and remove anything after `+`
      orderDate = orderDate.replace("T", " -> ");
      orderDate = orderDate.slice(0, orderDate.length - 6);
    }
  
    // Retrieve customer fields
    const customer = payload.customer || {};
    const defaultAddress = customer.default_address || {};
  
    // Determine the customer name
    let customerName = defaultAddress.name || "";
    if (!customerName) {
      const firstName = customer.first_name || "";
      const lastName = customer.last_name || "";
      customerName = (firstName + " " + lastName).trim();
    }
  
    // Determine the customer phone
    let customerPhone = (defaultAddress.phone || "").trim();
    if (!customerPhone) {
      const billingAddress = payload.billing_address || {};
      customerPhone = billingAddress.phone || "";
    }
    customerPhone = customerPhone.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  
    // Extract items
    const lineItems = payload.line_items || [];
    const items = lineItems.map((item) => ({
      name: item.name || "",
      quantity: item.quantity || 0,
      price: item.price || ""
    }));
  
    // Extract summary information
    const subtotal = payload.subtotal_price || "";
    const tax = payload.total_tax || "";
    const total = payload.total_price || "";
  
    // Extract shipping information
    const shippingLines = payload.shipping_lines || [];
    let shippingFee = null;
    let shippingMethod = null;
    if (shippingLines.length > 0) {
      shippingFee = shippingLines[0].price || null;
      shippingMethod = shippingLines[0].title || null;
    }
  
    const shippingAddress = payload.shipping_address || {};
    const address = [
      shippingAddress.address1 || "",
      shippingAddress.address2 || "",
      shippingAddress.city || "",
      shippingAddress.country || ""
    ].join(", ");
  
    // Construct the result object
    return {
      orderNumber,
      orderDate,
      customerName,
      customerPhone,
      items,
      subtotal,
      tax,
      shippingFee,
      total,
      address,
      shippingMethod
    };
  }
  function parseOrder(payload = {}) {
    // Destructure the main fields
    const {
      order_number: orderNumber = "",
      created_at: rawOrderDate = "",
      customer: {
        default_address: {
          name: defaultName = "",
          phone: defaultPhone = ""
        } = {},
        first_name: firstName = "",
        last_name: lastName = ""
      } = {},
      billing_address: {
        phone: billingPhone = ""
      } = {},
      line_items: lineItems = [],
      subtotal_price: subtotal = "",
      total_tax: tax = "",
      total_price: total = "",
      shipping_lines: shippingLines = [],
      shipping_address: {
        address1 = "",
        address2 = "",
        city = "",
        country = ""
      } = {}
    } = payload;
  
    // Fix up the order date
    let orderDate = rawOrderDate
      ? rawOrderDate.replace("T", " -> ").slice(0, -6)
      : "";
  
    // Determine the customer name
    let customerName = defaultName || (firstName + " " + lastName).trim();
  
    // Determine the customer phone
    let customerPhone = defaultPhone.trim() || billingPhone;
    // Remove non-numeric characters
    customerPhone = customerPhone.replace(/[^0-9]/g, "");
  
    // Map line items
    const items = lineItems.map(({ name = "", quantity = 0, price = "" }) => ({
      name,
      quantity,
      price
    }));
  
    // Shipping information
    let shippingFee = null;
    let shippingMethod = null;
    if (shippingLines.length > 0) {
      shippingFee = shippingLines[0].price || null;
      shippingMethod = shippingLines[0].title || null;
    }
  
    // Build full shipping address
    const address = [address1, address2, city, country].join(", ");
  
    // Return the final object
    return {
      orderNumber,
      orderDate,
      customerName,
      customerPhone,
      items,
      subtotal,
      tax,
      shippingFee,
      total,
      address,
      shippingMethod
    };
  }
  
const examplePayload = {
        "id": 6364979626262,
        "admin_graphql_api_id": "gid://shopify/Order/6364979626262",
        "app_id": 580111,
        "browser_ip": "182.180.55.53",
        "buyer_accepts_marketing": true,
        "cancel_reason": null,
        "cancelled_at": null,
        "cart_token": "Z2NwLWFzaWEtc291dGhlYXN0MTowMUpSMDYySEVONU1BQlZLRVdQNjFXUURBOA",
        "checkout_id": 38970873872662,
        "checkout_token": "1a3129ea15aee1dbd4fbd5ca3fec45a7",
        "client_details": {
          "accept_language": "en-PK",
          "browser_height": null,
          "browser_ip": "182.180.55.53",
          "browser_width": null,
          "session_hash": null,
          "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
        },
        "closed_at": null,
        "confirmation_number": "D8CRM72NN",
        "confirmed": true,
        "contact_email": "tanzildgkhan@gmail.com",
        "created_at": "2025-04-04T15:55:20+05:00",
        "currency": "PKR",
        "current_shipping_price_set": {
          "shop_money": {
            "amount": "275.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "275.00",
            "currency_code": "PKR"
          }
        },
        "current_subtotal_price": "1310.00",
        "current_subtotal_price_set": {
          "shop_money": {
            "amount": "1310.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "1310.00",
            "currency_code": "PKR"
          }
        },
        "current_total_additional_fees_set": null,
        "current_total_discounts": "0.00",
        "current_total_discounts_set": {
          "shop_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          }
        },
        "current_total_duties_set": null,
        "current_total_price": "1585.00",
        "current_total_price_set": {
          "shop_money": {
            "amount": "1585.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "1585.00",
            "currency_code": "PKR"
          }
        },
        "current_total_tax": "0.00",
        "current_total_tax_set": {
          "shop_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          }
        },
        "customer_locale": "en-PK",
        "device_id": null,
        "discount_codes": [],
        "duties_included": false,
        "email": "tanzildgkhan@gmail.com",
        "estimated_taxes": false,
        "financial_status": "pending",
        "fulfillment_status": null,
        "landing_site": "/products/1-set-usb-logic-analyzer-24m-8ch-microcontroller-arm-fpga-debug-tool-in-pakistan?srsltid=AfmBOoq3gLigFFOc8UEUL_0zbpR-sUH57b0lNU_WJK4b31nNvC8Up-Ic",
        "landing_site_ref": null,
        "location_id": null,
        "merchant_business_entity_id": "MTc0NDA3NjQxMzY2",
        "merchant_of_record_app_id": null,
        "name": "#192075",
        "note": null,
        "note_attributes": [],
        "number": 191075,
        "order_number": 192075,
        "order_status_url": "https://digilog.pk/74407641366/orders/85c49c7de5cc0571b12d0cd23ee4457d/authenticate?key=f6a2ee9870728398133c6dc3638b628c",
        "original_total_additional_fees_set": null,
        "original_total_duties_set": null,
        "payment_gateway_names": [
          "Bank Transfer (Advance Payment)"
        ],
        "phone": null,
        "po_number": null,
        "presentment_currency": "PKR",
        "processed_at": "2025-04-04T15:55:19+05:00",
        "reference": null,
        "referring_site": "https://www.google.com/",
        "source_identifier": null,
        "source_name": "web",
        "source_url": null,
        "subtotal_price": "1310.00",
        "subtotal_price_set": {
          "shop_money": {
            "amount": "1310.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "1310.00",
            "currency_code": "PKR"
          }
        },
        "tags": "",
        "tax_exempt": false,
        "tax_lines": [],
        "taxes_included": false,
        "test": false,
        "token": "85c49c7de5cc0571b12d0cd23ee4457d",
        "total_cash_rounding_payment_adjustment_set": {
          "shop_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          }
        },
        "total_cash_rounding_refund_adjustment_set": {
          "shop_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          }
        },
        "total_discounts": "0.00",
        "total_discounts_set": {
          "shop_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          }
        },
        "total_line_items_price": "1310.00",
        "total_line_items_price_set": {
          "shop_money": {
            "amount": "1310.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "1310.00",
            "currency_code": "PKR"
          }
        },
        "total_outstanding": "1585.00",
        "total_price": "1585.00",
        "total_price_set": {
          "shop_money": {
            "amount": "1585.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "1585.00",
            "currency_code": "PKR"
          }
        },
        "total_shipping_price_set": {
          "shop_money": {
            "amount": "275.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "275.00",
            "currency_code": "PKR"
          }
        },
        "total_tax": "0.00",
        "total_tax_set": {
          "shop_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          },
          "presentment_money": {
            "amount": "0.00",
            "currency_code": "PKR"
          }
        },
        "total_tip_received": "0.00",
        "total_weight": 43,
        "updated_at": "2025-04-04T15:55:22+05:00",
        "user_id": null,
        "billing_address": {
          "first_name": "Tanzil",
          "address1": "Govt college Chitral lower KPK, Pakistan",
          "phone": "+923339548010",
          "city": "Chitral",
          "zip": null,
          "province": null,
          "country": "Pakistan",
          "last_name": "Rahman",
          "address2": null,
          "company": null,
          "latitude": 35.8323463,
          "longitude": 71.7889167,
          "name": "Tanzil Rahman",
          "country_code": "PK",
          "province_code": null
        },
        "customer": {
          "id": 9774398669078,
          "email": "tanzildgkhan@gmail.com",
          "created_at": "2025-04-04T15:53:35+05:00",
          "updated_at": "2025-04-04T15:55:21+05:00",
          "first_name": "Tanzil",
          "last_name": "Rahman",
          "state": "disabled",
          "note": null,
          "verified_email": true,
          "multipass_identifier": null,
          "tax_exempt": false,
          "phone": null,
          "currency": "PKR",
          "tax_exemptions": [],
          "admin_graphql_api_id": "gid://shopify/Customer/9774398669078",
          "default_address": {
            "id": 10737438556438,
            "customer_id": 9774398669078,
            "first_name": "Tanzil",
            "last_name": "Rahman",
            "company": null,
            "address1": "Govt college Chitral lower KPK, Pakistan",
            "address2": null,
            "city": "Chitral",
            "province": null,
            "country": "Pakistan",
            "zip": null,
            "phone": "+923339548010",
            "name": "Tanzil Rahman",
            "province_code": null,
            "country_code": "PK",
            "country_name": "Pakistan",
            "default": true
          }
        },
        "discount_applications": [],
        "fulfillments": [],
        "line_items": [
          {
            "id": 15925151465750,
            "admin_graphql_api_id": "gid://shopify/LineItem/15925151465750",
            "attributed_staffs": [],
            "current_quantity": 1,
            "fulfillable_quantity": 1,
            "fulfillment_service": "manual",
            "fulfillment_status": null,
            "gift_card": false,
            "grams": 7,
            "name": "Arduino Tm1637 4 Digit 7 Segment Display Module Led Display Module",
            "price": "200.00",
            "price_set": {
              "shop_money": {
                "amount": "200.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "200.00",
                "currency_code": "PKR"
              }
            },
            "product_exists": true,
            "product_id": 8191762432278,
            "properties": [],
            "quantity": 1,
            "requires_shipping": true,
            "sales_line_item_group_id": null,
            "sku": "B149,krt54,IMP50,Th25,A",
            "taxable": false,
            "title": "Arduino Tm1637 4 Digit 7 Segment Display Module Led Display Module",
            "total_discount": "0.00",
            "total_discount_set": {
              "shop_money": {
                "amount": "0.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "0.00",
                "currency_code": "PKR"
              }
            },
            "variant_id": 44490779918614,
            "variant_inventory_management": "shopify",
            "variant_title": null,
            "vendor": "China",
            "tax_lines": [],
            "duties": [],
            "discount_allocations": []
          },
          {
            "id": 15925151498518,
            "admin_graphql_api_id": "gid://shopify/LineItem/15925151498518",
            "attributed_staffs": [],
            "current_quantity": 1,
            "fulfillable_quantity": 1,
            "fulfillment_service": "manual",
            "fulfillment_status": null,
            "gift_card": false,
            "grams": 4,
            "name": "Arduino Water Level Sensor In Pakistan",
            "price": "60.00",
            "price_set": {
              "shop_money": {
                "amount": "60.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "60.00",
                "currency_code": "PKR"
              }
            },
            "product_exists": true,
            "product_id": 8191781011734,
            "properties": [],
            "quantity": 1,
            "requires_shipping": true,
            "sales_line_item_group_id": null,
            "sku": "B117,KRT51,IMP500,Th250,A",
            "taxable": false,
            "title": "Arduino Water Level Sensor In Pakistan",
            "total_discount": "0.00",
            "total_discount_set": {
              "shop_money": {
                "amount": "0.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "0.00",
                "currency_code": "PKR"
              }
            },
            "variant_id": 44490831593750,
            "variant_inventory_management": "shopify",
            "variant_title": null,
            "vendor": "China",
            "tax_lines": [],
            "duties": [],
            "discount_allocations": []
          },
          {
            "id": 15925151531286,
            "admin_graphql_api_id": "gid://shopify/LineItem/15925151531286",
            "attributed_staffs": [],
            "current_quantity": 1,
            "fulfillable_quantity": 1,
            "fulfillment_service": "manual",
            "fulfillment_status": null,
            "gift_card": false,
            "grams": 15,
            "name": "Am2302 Temperature And Humidity Sensor In Pakistan",
            "price": "800.00",
            "price_set": {
              "shop_money": {
                "amount": "800.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "800.00",
                "currency_code": "PKR"
              }
            },
            "product_exists": true,
            "product_id": 8191710822678,
            "properties": [],
            "quantity": 1,
            "requires_shipping": true,
            "sales_line_item_group_id": null,
            "sku": "b595,krt168,IMP20,Th10,SA",
            "taxable": false,
            "title": "Am2302 Temperature And Humidity Sensor In Pakistan",
            "total_discount": "0.00",
            "total_discount_set": {
              "shop_money": {
                "amount": "0.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "0.00",
                "currency_code": "PKR"
              }
            },
            "variant_id": 44490609557782,
            "variant_inventory_management": "shopify",
            "variant_title": null,
            "vendor": "Digilog Electronics",
            "tax_lines": [],
            "duties": [],
            "discount_allocations": []
          },
          {
            "id": 15925151564054,
            "admin_graphql_api_id": "gid://shopify/LineItem/15925151564054",
            "attributed_staffs": [],
            "current_quantity": 50,
            "fulfillable_quantity": 50,
            "fulfillment_service": "manual",
            "fulfillment_status": null,
            "gift_card": false,
            "grams": 0,
            "name": "To-220 Silicon Rubber Pad Insulation Silicon Heatsink Silicon Sheet",
            "price": "2.00",
            "price_set": {
              "shop_money": {
                "amount": "2.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "2.00",
                "currency_code": "PKR"
              }
            },
            "product_exists": true,
            "product_id": 8191529943318,
            "properties": [],
            "quantity": 50,
            "requires_shipping": true,
            "sales_line_item_group_id": null,
            "sku": "B593,L100,Th50",
            "taxable": false,
            "title": "To-220 Silicon Rubber Pad Insulation Silicon Heatsink Silicon Sheet",
            "total_discount": "0.00",
            "total_discount_set": {
              "shop_money": {
                "amount": "0.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "0.00",
                "currency_code": "PKR"
              }
            },
            "variant_id": 44490083402006,
            "variant_inventory_management": "shopify",
            "variant_title": null,
            "vendor": "Digilog Electronics",
            "tax_lines": [],
            "duties": [],
            "discount_allocations": []
          },
          {
            "id": 15925151596822,
            "admin_graphql_api_id": "gid://shopify/LineItem/15925151596822",
            "attributed_staffs": [],
            "current_quantity": 3,
            "fulfillable_quantity": 3,
            "fulfillment_service": "manual",
            "fulfillment_status": null,
            "gift_card": false,
            "grams": 4,
            "name": "10a Bridge Rectifier In Pakistan",
            "price": "50.00",
            "price_set": {
              "shop_money": {
                "amount": "50.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "50.00",
                "currency_code": "PKR"
              }
            },
            "product_exists": true,
            "product_id": 8190944510230,
            "properties": [],
            "quantity": 3,
            "requires_shipping": true,
            "sales_line_item_group_id": null,
            "sku": "B813,L10,Th5",
            "taxable": false,
            "title": "10a Bridge Rectifier In Pakistan",
            "total_discount": "0.00",
            "total_discount_set": {
              "shop_money": {
                "amount": "0.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "0.00",
                "currency_code": "PKR"
              }
            },
            "variant_id": 44487650640150,
            "variant_inventory_management": "shopify",
            "variant_title": null,
            "vendor": "China",
            "tax_lines": [],
            "duties": [],
            "discount_allocations": []
          }
        ],
        "payment_terms": null,
        "refunds": [],
        "shipping_address": {
          "first_name": "Tanzil",
          "address1": "Govt college Chitral lower KPK, Pakistan",
          "phone": "+923339548010",
          "city": "Chitral",
          "zip": null,
          "province": null,
          "country": "Pakistan",
          "last_name": "Rahman",
          "address2": null,
          "company": null,
          "latitude": 35.8323463,
          "longitude": 71.7889167,
          "name": "Tanzil Rahman",
          "country_code": "PK",
          "province_code": null
        },
        "shipping_lines": [
          {
            "id": 5098465755414,
            "carrier_identifier": null,
            "code": "Advance Payment (1 to 3 Working Days)",
            "current_discounted_price_set": {
              "shop_money": {
                "amount": "275.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "275.00",
                "currency_code": "PKR"
              }
            },
            "discounted_price": "275.00",
            "discounted_price_set": {
              "shop_money": {
                "amount": "275.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "275.00",
                "currency_code": "PKR"
              }
            },
            "is_removed": false,
            "phone": null,
            "price": "275.00",
            "price_set": {
              "shop_money": {
                "amount": "275.00",
                "currency_code": "PKR"
              },
              "presentment_money": {
                "amount": "275.00",
                "currency_code": "PKR"
              }
            },
            "requested_fulfillment_service_id": null,
            "source": "shopify",
            "title": "Advance Payment (1 to 3 Working Days)",
            "tax_lines": [],
            "discount_allocations": []
          }
        ],
        "returns": []
      }
console.log(parseOrder(examplePayload));
  