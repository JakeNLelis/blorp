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

  const shippingInfo = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    country: formData.get('country') as string,
    postalCode: formData.get('postalCode') as string,
  }

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

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
    return { error: 'Failed to create order items' }
  }

  // Use a query parameter to pass the order ID, we can't clear the client-side cart from a server action easily
  // We'll clear it on the success page
  redirect(`/order-success?orderId=${order.id}`)
}
