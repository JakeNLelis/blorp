"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Package,
  User,
  CreditCard as CardIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhilippineAddressCascader, AddressData } from "@/components/philippine-address-cascader";
import { saveAddress, deleteAddress, savePayment, deletePayment } from "./actions";

type ProfileTabsProps = {
  orders: any[];
  addresses: any[];
  payments: any[];
};

export function ProfileTabs({ orders, addresses, payments }: ProfileTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "payments">("orders");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Address form states
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  // Card form states
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressData) {
      setError("Please complete the address cascade selection.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await saveAddress(addressData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Address saved successfully!");
        setAddressData(null);
        (e.target as HTMLFormElement).reset();
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    setLoading(true);
    try {
      const res = await deleteAddress(id);
      if (res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await savePayment({
        cardNumber,
        cardholderName,
        expiryDate,
        cvv,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Payment card saved successfully!");
        setCardNumber("");
        setCardholderName("");
        setExpiryDate("");
        setCvv("");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this card?")) return;
    setLoading(true);
    try {
      const res = await deletePayment(id);
      if (res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCardBrand = (num: string) => {
    const firstChar = num.trim().charAt(0);
    if (firstChar === "4") return "Visa";
    if (firstChar === "5") return "Mastercard";
    return "Credit Card";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Dynamic Tab Triggers */}
      <div className="flex border-b border-border/80 gap-6 text-sm font-medium">
        <button
          onClick={() => {
            setActiveTab("orders");
            setError(null);
            setSuccess(null);
          }}
          className={`pb-3 transition-all relative flex items-center gap-2 ${
            activeTab === "orders" ? "text-primary border-b-2 border-primary font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingBag className="size-4" />
          Order History
        </button>

        <button
          onClick={() => {
            setActiveTab("addresses");
            setError(null);
            setSuccess(null);
          }}
          className={`pb-3 transition-all relative flex items-center gap-2 ${
            activeTab === "addresses" ? "text-primary border-b-2 border-primary font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MapPin className="size-4" />
          Saved Addresses ({addresses.length})
        </button>

        <button
          onClick={() => {
            setActiveTab("payments");
            setError(null);
            setSuccess(null);
          }}
          className={`pb-3 transition-all relative flex items-center gap-2 ${
            activeTab === "payments" ? "text-primary border-b-2 border-primary font-semibold" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CreditCard className="size-4" />
          Saved Cards ({payments.length})
        </button>
      </div>

      {/* Global Alerts */}
      {success && (
        <div className="flex items-start gap-3 rounded-none border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-600 text-sm">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
          <p className="font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-none border border-destructive/20 bg-destructive/5 p-4 text-destructive text-sm">
          <AlertCircle className="size-5 shrink-0 text-destructive/80" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* 1. ORDER HISTORY TAB */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="rounded-none border border-dashed p-12 text-center space-y-4 bg-muted/5">
              <div className="mx-auto flex size-12 items-center justify-center rounded-none bg-muted border text-muted-foreground">
                <ShoppingBag className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-medium font-heading">No orders yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Explore our collections and discover something tailored just for you.
                </p>
              </div>
              <Button asChild className="rounded-md">
                <Link href="/products">Shop Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-none border bg-card/30 overflow-hidden transition-all duration-300 hover:border-foreground/20"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/40 px-6 py-4 border-b text-sm">
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Order Date</p>
                        <p className="font-medium text-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Order Ref</p>
                        <p className="font-mono text-xs uppercase tracking-wide text-foreground/80">{order.id.slice(0, 8)}...</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Fulfillment</p>
                        <span className={`inline-flex items-center rounded-none px-2.5 py-0.5 text-[10px] font-bold uppercase border mt-0.5 ${
                          order.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : order.status === "pending"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : order.status === "shipped"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : order.status === "reported"
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Paid</p>
                      <p className="text-base font-semibold text-foreground">₱{Number(order.total).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-border px-6">
                    {(order.order_items || []).map((item: any) => {
                      const product = Array.isArray(item.products) ? item.products[0] : item.products;
                      return (
                        <div key={item.id} className="flex items-center gap-4 py-4">
                          <div className="relative aspect-square size-16 shrink-0 overflow-hidden rounded-none bg-muted border">
                            {product?.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-secondary text-[10px] text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            {product ? (
                              <Link href={`/products/${product.id}`} className="font-medium text-foreground hover:underline truncate block">
                                {product.title}
                              </Link>
                            ) : (
                              <p className="font-medium text-foreground italic">Unavailable Product</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Qty: {item.quantity} × ₱{Number(item.price).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right text-sm font-medium">
                            ₱{(Number(item.price) * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. SAVED ADDRESSES TAB */}
      {activeTab === "addresses" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          {/* Address List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-heading mb-4">My Saved Addresses</h3>
            {addresses.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-none text-muted-foreground bg-muted/5">
                <MapPin className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="font-medium">No saved addresses</p>
                <p className="text-xs text-muted-foreground mt-0.5">Add an address using the form to checkout faster.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-none border bg-card/25 space-y-3 relative hover:border-foreground/20 transition-all"
                  >
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                      disabled={loading}
                      title="Delete address"
                    >
                      <Trash2 className="size-4.5" />
                    </button>
                    <div>
                      <p className="font-bold text-foreground">Shipping Address</p>
                      <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                        📞 Contact: {addr.contact_number}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground/90 space-y-0.5 font-sans leading-relaxed">
                      <p className="text-foreground">{addr.street_address}</p>
                      <p>
                        Brgy. {addr.barangay_name}, {addr.city_name}
                      </p>
                      <p>
                        {addr.province_name ? addr.province_name + ", " : ""}{addr.region_name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Address Form */}
          <div className="rounded-none border bg-card/45 p-6 space-y-6 h-fit">
            <div className="space-y-1">
              <h4 className="text-lg font-semibold font-heading">Add New Address</h4>
              <p className="text-xs text-muted-foreground">Specify geographic location cascade from PSGC standard database.</p>
            </div>
            <form onSubmit={handleSaveAddress} className="space-y-5">
              <PhilippineAddressCascader
                disabled={loading}
                onChange={(data) => setAddressData(data)}
              />
              <Button
                type="submit"
                disabled={loading || !addressData}
                className="w-full h-11 rounded-md justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving Address...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 size-4" />
                    Save Address
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* 3. SAVED CARDS TAB */}
      {activeTab === "payments" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          {/* Cards List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold font-heading mb-4">My Saved Cards</h3>
            {payments.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-none text-muted-foreground bg-muted/5">
                <CreditCard className="size-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="font-medium">No saved cards</p>
                <p className="text-xs text-muted-foreground mt-0.5">Save typical Visa or Mastercard cards here for rapid checkout.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {payments.map((card) => {
                  const brand = card.card_brand || "Credit Card";
                  const isVisa = brand === "Visa";
                  return (
                    <div
                      key={card.id}
                      className={`p-6 rounded-none border text-white relative transition-all overflow-hidden flex flex-col justify-between h-44 ${
                        isVisa
                          ? "bg-indigo-900 border-indigo-700/50"
                          : "bg-zinc-900 border-slate-800/50"
                      }`}
                    >
                      <button
                        onClick={() => handleDeletePayment(card.id)}
                        className="absolute top-4 right-4 text-white/70 hover:text-red-300 transition-colors z-10"
                        disabled={loading}
                        title="Delete card"
                      >
                        <Trash2 className="size-4.5" />
                      </button>

                      {/* Card Brand Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-widest uppercase font-mono text-white/80">
                          {brand}
                        </span>
                        <CardIcon className="size-6 text-white/40" />
                      </div>

                      {/* Card Number */}
                      <p className="text-lg font-mono tracking-widest py-2 text-white/95">
                        •••• •••• •••• {card.last4}
                      </p>

                      {/* Expiry & Holder Info */}
                      <div className="flex justify-between items-end text-xs font-mono">
                        <div>
                          <p className="text-[9px] text-white/60 uppercase tracking-wider">Cardholder</p>
                          <p className="font-semibold uppercase tracking-wide truncate max-w-[140px] text-white/90">
                            {card.cardholder_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-white/60 uppercase tracking-wider">Expires</p>
                          <p className="font-semibold text-white/90">{card.expiry_date}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Add Card Form */}
          <div className="rounded-none border bg-card/45 p-6 space-y-6 h-fit">
            <div className="space-y-1">
              <h4 className="text-lg font-semibold font-heading">Add New Card</h4>
              <p className="text-xs text-muted-foreground">Save standard Visa or Mastercard payment credentials securely.</p>
            </div>
            <form onSubmit={handleSavePayment} className="space-y-4 font-sans text-sm">
              {/* Cardholder Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Cardholder Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. JUAN DELA CRUZ"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                  required
                  disabled={loading}
                />
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Card Number (16 Digits)
                </label>
                <Input
                  type="text"
                  placeholder="4123 4567 8901 2345"
                  value={cardNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                    setCardNumber(val);
                  }}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Expiry Date (MM/YY)
                  </label>
                  <Input
                    type="text"
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
                    disabled={loading}
                  />
                </div>

                {/* CVV */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
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
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !cardNumber || !cardholderName || !expiryDate || !cvv}
                className="w-full h-11 rounded-md justify-center mt-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving Card...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 size-4" />
                    Save Card Credentials
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
