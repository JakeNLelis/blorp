"use client";

import { useCartStore } from "@/store/cart";
import { useStore } from "@/components/cart-sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { placeOrder } from "./actions";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PhilippineAddressCascader, AddressData } from "@/components/philippine-address-cascader";
import { MapPin, CreditCard, ArrowLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type CheckoutFormProps = {
  savedAddresses: any[];
  savedPayments: any[];
};

export function CheckoutForm({ savedAddresses, savedPayments }: CheckoutFormProps) {
  const items = useStore(useCartStore, (state) => state.items) ?? [];
  const totalPrice = useCartStore((state) => state.totalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Profile Selector states
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses.length > 0 ? savedAddresses[0].id : "custom"
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>(
    savedPayments.length > 0 ? savedPayments[0].id : "custom"
  );

  // Shipping Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [shippingAddress, setShippingAddress] = useState<AddressData | null>(null);

  // Card Form states
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Sync state with selected address
  useEffect(() => {
    if (selectedAddressId === "custom") {
      setShippingAddress(null);
    } else {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      if (addr) {
        setShippingAddress({
          regionName: addr.region_name,
          regionCode: addr.region_code,
          provinceName: addr.province_name,
          provinceCode: addr.province_code,
          cityName: addr.city_name,
          cityCode: addr.city_code,
          barangayName: addr.barangay_name,
          barangayCode: addr.barangay_code,
          streetAddress: addr.street_address,
          contactNumber: addr.contact_number,
        });
      }
    }
  }, [selectedAddressId, savedAddresses]);

  // Sync state with selected payment card
  useEffect(() => {
    if (selectedPaymentId === "custom") {
      setCardholderName("");
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
    } else {
      const p = savedPayments.find((card) => card.id === selectedPaymentId);
      if (p) {
        setCardholderName(p.cardholder_name);
        setCardNumber(p.card_number);
        setExpiryDate(p.expiry_date);
        setCvv(p.cvv);
      }
    }
  }, [selectedPaymentId, savedPayments]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    // Build form data manually to include all address details
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);

    if (!shippingAddress) {
      setError("Please complete your shipping address details.");
      setIsPending(false);
      return;
    }

    formData.append("contactNumber", shippingAddress.contactNumber);
    formData.append("streetAddress", shippingAddress.streetAddress);
    formData.append("barangayName", shippingAddress.barangayName);
    formData.append("cityName", shippingAddress.cityName);
    formData.append("provinceName", shippingAddress.provinceName || "");
    formData.append("regionName", shippingAddress.regionName);

    formData.append("cardholderName", cardholderName);
    formData.append("cardNumber", cardNumber);
    formData.append("expiryDate", expiryDate);
    formData.append("cvv", cvv);

    try {
      const result = await placeOrder(formData, items);
      if (result?.error) {
        setError(result.error);
      } else {
        // Clear local cart storage since checkout was successful
        clearCart();
      }
    } catch (err) {
      if (err instanceof Error && 'digest' in err && typeof err.digest === 'string' && err.digest.startsWith('NEXT_REDIRECT')) {
        // Success redirect
        clearCart();
        throw err;
      }
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, "");
    if (clean.startsWith("4")) return "Visa";
    if (clean.startsWith("5")) return "Mastercard";
    return "Credit Card";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 font-sans">
      
      {/* Checkout Form Container */}
      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* SECTION 1: SHIPPING DETAILS */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-none border border-primary/20 bg-primary/10 text-primary text-sm font-semibold">
              1
            </div>
            <h2 className="text-2xl font-semibold tracking-tight font-heading">
              Shipping Information
            </h2>
          </div>

          {/* Quick Select Saved Address */}
          {savedAddresses.length > 0 && (
            <div className="p-4 rounded-none border bg-muted/30 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Deliver to a Saved Location
              </label>
              <select
                value={selectedAddressId}
                onChange={(e) => setSelectedAddressId(e.target.value)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {savedAddresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    📦 {addr.street_address}, Brgy. {addr.barangay_name}, {addr.city_name}
                  </option>
                ))}
                <option value="custom">✨ Ship to a custom/new address</option>
              </select>

              {selectedAddressId !== "custom" && shippingAddress && (
                <div className="mt-3 p-4 rounded-none border bg-card/60 text-sm text-muted-foreground relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-foreground text-xs uppercase tracking-wide flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-emerald-600" />
                      Active Delivery Destination
                    </p>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-semibold px-2 py-0.5 rounded-none border border-emerald-500/20">
                      Saved
                    </span>
                  </div>
                  <p className="mt-2 text-foreground font-medium">{shippingAddress.streetAddress}</p>
                  <p>Brgy. {shippingAddress.barangayName}, {shippingAddress.cityName}</p>
                  <p>{shippingAddress.provinceName ? shippingAddress.provinceName + ", " : ""}{shippingAddress.regionName}</p>
                  <p className="text-emerald-600 font-semibold text-xs mt-2">📞 Contact: {shippingAddress.contactNumber}</p>
                </div>
              )}
            </div>
          )}

          {/* Recipient Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                First Name
              </label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First name"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Last Name
              </label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                placeholder="Last name"
                disabled={isPending}
              />
            </div>
          </div>

          {/* New/Custom address inputs (Render cascader if "custom" is selected) */}
          {selectedAddressId === "custom" && (
            <div className="p-5 rounded-none border bg-card/25 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Philippine Address Cascade Input
              </p>
              <PhilippineAddressCascader
                disabled={isPending}
                onChange={(val) => setShippingAddress(val)}
              />
            </div>
          )}
        </div>

        {/* SECTION 2: PAYMENT METHOD */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-none border border-primary/20 bg-primary/10 text-primary text-sm font-semibold">
              2
            </div>
            <h2 className="text-2xl font-semibold tracking-tight font-heading">
              Secure Mock Payment
            </h2>
          </div>

          {/* Quick Select Saved Card */}
          {savedPayments.length > 0 && (
            <div className="p-4 rounded-none border bg-muted/30 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Charge to a Saved Card
              </label>
              <select
                value={selectedPaymentId}
                onChange={(e) => setSelectedPaymentId(e.target.value)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {savedPayments.map((card) => (
                  <option key={card.id} value={card.id}>
                    💳 {getCardBrand(card.card_number)} ending in •••• {card.card_number.slice(-4)}
                  </option>
                ))}
                <option value="custom">✨ Use a custom/new payment card</option>
              </select>

              {selectedPaymentId !== "custom" && (
                <div className="mt-3 p-4 rounded-none border bg-card/60 text-sm text-muted-foreground relative overflow-hidden flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="size-5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {getCardBrand(cardNumber)} ending in {cardNumber.slice(-4)}
                      </p>
                      <p className="text-xs">Holder: {cardholderName} | Expiry: {expiryDate}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-600 font-semibold px-2.5 py-0.5 rounded-none border border-indigo-500/20">
                    Auto-approved Mock
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Manual Card Details Form (Enabled if "custom" selected) */}
          {selectedPaymentId === "custom" && (
            <div className="p-5 rounded-none border bg-card/25 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cardholder Name
                </label>
                <Input
                  placeholder="e.g. JUAN DELA CRUZ"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Card Number (16 Digits)
                </label>
                <Input
                  placeholder="4123 4567 8901 2345"
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                    setCardNumber(val);
                  }}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Expiry Date (MM/YY)
                  </label>
                  <Input
                    placeholder="12/28"
                    value={expiryDate}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "");
                      if (val.length > 2) {
                        val = val.slice(0, 2) + "/" + val.slice(2, 4);
                      }
                      setExpiryDate(val.slice(0, 5));
                    }}
                    required
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    CVV / CVC
                  </label>
                  <Input
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      setCvv(val);
                    }}
                    required
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 rounded-none border border-destructive/20 bg-destructive/5 text-destructive text-sm font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Submit Checkout Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <Button variant="ghost" asChild className="rounded-md flex items-center gap-2">
            <Link href="/products">
              <ArrowLeft className="size-4" />
              Back to Catalog
            </Link>
          </Button>

          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-64 h-12 rounded-md font-semibold flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Completing Checkout...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Place Order (₱{totalPrice().toLocaleString()})
              </>
            )}
          </Button>
        </div>
      </form>

      {/* SECTION 3: ORDER SUMMARY */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight font-heading">
          Order Summary
        </h2>
        
        <div className="rounded-none border bg-card/30 p-6 divide-y divide-border space-y-4">
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 pb-2">
            {items.map((item) => {
              // Extract original price & discount prices
              const originalPrice = Number(item.product.price);
              const discountPrice = item.product.sale_price !== null && item.product.sale_price !== undefined 
                ? Number(item.product.sale_price) 
                : null;
              const activePrice = discountPrice !== null ? discountPrice : originalPrice;
              
              return (
                <div key={item.product.id} className="flex gap-4 items-center">
                  <div className="relative h-14 w-14 overflow-hidden rounded-none bg-muted border flex-shrink-0">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-secondary flex items-center justify-center text-[10px] text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-1 text-foreground">
                      {item.product.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    {discountPrice !== null && (
                      <span className="text-[10px] bg-red-500/10 text-red-600 font-semibold px-2 py-0.5 rounded-none border border-red-500/20 mt-1 inline-block">
                        🏷️ Discounted Sale
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {discountPrice !== null ? (
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground line-through">
                          ₱{originalPrice.toLocaleString()}
                        </p>
                        <p className="text-sm font-semibold text-foreground">
                          ₱{discountPrice.toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-foreground">
                        ₱{originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">
                ₱{totalPrice().toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping Fee</span>
              <span className="text-emerald-600 font-bold uppercase text-xs">
                Free Delivery
              </span>
            </div>
            
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-dashed">
              <span className="font-heading">Total Bill</span>
              <span className="text-primary text-xl">
                ₱{totalPrice().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
