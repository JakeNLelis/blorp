"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export interface SaveAddressData {
  contactNumber: string;
  regionName: string;
  regionCode: string;
  provinceName: string;
  provinceCode: string;
  cityName: string;
  cityCode: string;
  barangayName: string;
  barangayCode: string;
  streetAddress: string;
  isDefault?: boolean;
}

export async function saveAddress(addressData: SaveAddressData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Authentication required." };
  }

  const { error } = await supabase.from("saved_addresses").insert({
    user_id: user.id,
    contact_number: addressData.contactNumber,
    region_name: addressData.regionName,
    region_code: addressData.regionCode,
    province_name: addressData.provinceName,
    province_code: addressData.provinceCode,
    city_name: addressData.cityName,
    city_code: addressData.cityCode,
    barangay_name: addressData.barangayName,
    barangay_code: addressData.barangayCode,
    street_address: addressData.streetAddress,
    is_default: addressData.isDefault || false,
  });

  if (error) {
    console.error("Failed to save address:", error);
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/checkout");
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Authentication required." };
  }

  const { error } = await supabase
    .from("saved_addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete address:", error);
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/checkout");
  return { success: true };
}

export async function savePayment(cardData: {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  isDefault?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Authentication required." };
  }

  if (!cardData.cardNumber || !cardData.cardholderName || !cardData.expiryDate || !cardData.cvv) {
    return { error: "All card details are required." };
  }

  const cleanCardNumber = cardData.cardNumber.replace(/\s+/g, "");
  if (!/^\d{16}$/.test(cleanCardNumber)) {
    return { error: "Card number must be exactly 16 digits." };
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiryDate)) {
    return { error: "Expiry date must be in MM/YY format." };
  }

  if (!/^\d{3,4}$/.test(cardData.cvv)) {
    return { error: "CVV/CVC must be 3 or 4 digits." };
  }

  // Simulate secure tokenization with PCI-DSS compliant mock gateway
  const mockToken = "pay_tok_" + Math.random().toString(36).substring(2, 12);
  const last4Digits = cleanCardNumber.slice(-4);
  const brandChar = cleanCardNumber.charAt(0);
  const cardBrand = brandChar === "4" ? "Visa" : brandChar === "5" ? "Mastercard" : "Credit Card";

  const { error } = await supabase.from("saved_payments").insert({
    user_id: user.id,
    payment_method_token: mockToken,
    last4: last4Digits,
    card_brand: cardBrand,
    cardholder_name: cardData.cardholderName,
    expiry_date: cardData.expiryDate,
    is_default: cardData.isDefault || false,
  });

  if (error) {
    console.error("Failed to save card:", error);
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/checkout");
  return { success: true };
}

export async function deletePayment(paymentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Authentication required." };
  }

  const { error } = await supabase
    .from("saved_payments")
    .delete()
    .eq("id", paymentId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to delete payment:", error);
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/checkout");
  return { success: true };
}
