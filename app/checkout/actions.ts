'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Tables } from '@/types/supabase'

export async function placeOrder(formData: FormData, cartItems: { product: Tables<"products">, quantity: number }[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to place an order' }
  }

  if (cartItems.length === 0) {
    return { error: 'Your cart is empty' }
  }

  // Shipping inputs
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const contactNumber = formData.get('contactNumber') as string;
  const streetAddress = formData.get('streetAddress') as string;
  const barangayName = formData.get('barangayName') as string;
  const cityName = formData.get('cityName') as string;
  const provinceName = formData.get('provinceName') as string;
  const regionName = formData.get('regionName') as string;

  if (!firstName || !lastName || !contactNumber || !streetAddress || !barangayName || !cityName || !regionName) {
    return { error: 'Missing required shipping information. Please ensure all Philippine address fields are complete.' };
  }

  // Payment inputs
  const cardholderName = formData.get('cardholderName') as string;
  const cardNumber = formData.get('cardNumber') as string;
  const expiryDate = formData.get('expiryDate') as string;
  const cvv = formData.get('cvv') as string;

  if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
    return { error: 'Payment card details are required for mock verification.' };
  }

  const cleanCard = cardNumber.replace(/\s+/g, "");
  if (!/^\d{16}$/.test(cleanCard)) {
    return { error: 'Invalid payment details: Card number must be exactly 16 digits.' };
  }
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
    return { error: 'Invalid payment details: Expiry date must be MM/YY format.' };
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    return { error: 'Invalid payment details: CVV/CVC must be 3 or 4 digits.' };
  }

  const shippingInfo = {
    firstName,
    lastName,
    contactNumber,
    streetAddress,
    barangayName,
    cityName,
    provinceName: provinceName || "NCR",
    regionName,
    country: "Philippines"
  };

  const productIds = cartItems.map(item => item.product.id);
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, price, sale_price')
    .in('id', productIds);

  if (productsError || !products) {
    console.error('Error fetching products:', productsError)
    return { error: 'Failed to validate products' }
  }

  if (products.length !== cartItems.length) {
      return { error: 'One or more products in your cart are no longer available' }
  }

  // Prioritize sale_price over regular price if sale_price is active (not null)
  const productPrices = Object.fromEntries(
    products.map(p => [
      p.id, 
      p.sale_price !== null && p.sale_price !== undefined ? Number(p.sale_price) : Number(p.price)
    ])
  );

  let total = 0;
  for (const item of cartItems) {
      const price = productPrices[item.product.id];
      if (price === undefined) {
          return { error: 'Product price not found' };
      }

      if (!Number.isFinite(item.quantity) || item.quantity < 1) {
          return { error: 'Invalid product quantity' };
      }

      const quantity = Math.floor(item.quantity);
      total += price * quantity;

      // Update item with validated values for order items insert
      item.product.price = price;
      item.quantity = quantity;
  }

  const orderPayload = {
    user_id: user.id,
    total: total,
    shipping_info: shippingInfo,
    status: 'pending'
  };

  const orderItemsData = cartItems.map(item => ({
    product_id: item.product.id,
    quantity: item.quantity,
    price: item.product.price
  }));

  const { data: order, error: orderError } = await supabase
    .rpc('create_order_with_items', { order: orderPayload, items: orderItemsData }) as { data: any, error: any };

  if (orderError || !order) {
    console.error('Error creating order with items:', orderError)
    return { error: 'Failed to create order' }
  }

  redirect(`/order-success?orderId=${order.id}`)
}