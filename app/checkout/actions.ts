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

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const country = formData.get('country') as string;
  const postalCode = formData.get('postalCode') as string;

  if (!firstName || !lastName || !address || !city || !country || !postalCode) {
    return { error: 'Missing required shipping information' };
  }

  const shippingInfo = {
    firstName,
    lastName,
    address,
    city,
    country,
    postalCode,
  }

  const productIds = cartItems.map(item => item.product.id);
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, price')
    .in('id', productIds);

  if (productsError || !products) {
    console.error('Error fetching products:', productsError)
    return { error: 'Failed to validate products' }
  }

  if (products.length !== cartItems.length) {
      return { error: 'One or more products in your cart are no longer available' }
  }

  const productPrices = Object.fromEntries(products.map(p => [p.id, p.price]));

  let total = 0;
  for (const item of cartItems) {
      const price = productPrices[item.product.id];
      if (price === undefined) {
          return { error: 'Product price not found' };
      }

      const quantity = Math.max(1, Math.floor(item.quantity)); // basic quantity validation
      total += price * quantity;

      // Update item with validated values for order items insert
      item.product.price = price;
      item.quantity = quantity;
  }

  // 1. Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total: total,
      shipping_info: shippingInfo,
      status: 'pending'
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error('Error creating order:', orderError)
    return { error: 'Failed to create order' }
  }

  // 2. Create order items
  const orderItemsData = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price: item.product.price
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)

  if (itemsError) {
    console.error('Error creating order items:', itemsError)

    // Compensation delete
    const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .match({ id: order.id });

    if (deleteError) {
         console.error('Failed to rollback order creation:', deleteError);
    }

    return { error: 'Failed to create order items' }
  }

  // Use a query parameter to pass the order ID, we can't clear the client-side cart from a server action easily
  // We'll clear it on the success page
  redirect(`/order-success?orderId=${order.id}`)
}