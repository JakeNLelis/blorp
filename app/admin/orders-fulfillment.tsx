"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  User, 
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateOrderStatus } from "./actions";

type OrderItem = {
  id: string;
  price: number;
  quantity: number;
  products: {
    title: string;
  } | null;
};

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  shipping_info: any;
  order_items: OrderItem[];
};

type OrdersFulfillmentProps = {
  orders: Order[];
};

export function OrdersFulfillment({ orders }: OrdersFulfillmentProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (orderId: string, nextStatus: "shipped" | "completed") => {
    if (!confirm(`Are you sure you want to update this order's status to '${nextStatus}'?`)) {
      return;
    }

    setUpdatingId(orderId);
    try {
      const res = await updateOrderStatus(orderId, nextStatus);
      if (res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter and search orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    const info = order.shipping_info || {};
    const customerName = `${info.firstName || ""} ${info.lastName || ""}`.toLowerCase();
    const orderRef = order.id.toLowerCase();
    const street = (info.streetAddress || "").toLowerCase();
    
    const matchesSearch = 
      customerName.includes(searchTerm.toLowerCase()) ||
      orderRef.includes(searchTerm.toLowerCase()) ||
      street.includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center rounded-none bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20 uppercase tracking-wide">
            Completed ✅
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center rounded-none bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-500/20 uppercase tracking-wide">
            Shipped 🚚
          </span>
        );
      case "reported":
        return (
          <span className="inline-flex items-center rounded-none bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 border border-rose-500/20 uppercase tracking-wide animate-pulse">
            DISPUTE: NOT ARRIVED ⚠️
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-none bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 border border-amber-500/20 uppercase tracking-wide">
            Pending Processing ⏳
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 bg-muted/10 p-4 rounded-none border">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, order ref, street..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 rounded-md bg-background"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring shrink-0"
        >
          <option value="all">📦 All Fulfillment States</option>
          <option value="pending">⏳ Pending Processing</option>
          <option value="shipped">🚚 Shipped / In Transit</option>
          <option value="completed">✅ Completed / Arrived</option>
          <option value="reported">⚠️ Disputes / Non-Arrivals</option>
        </select>
      </div>

      {/* Orders Count Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-none border bg-card/10 text-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Orders</p>
          <p className="text-2xl font-bold font-heading text-foreground mt-1">{orders.length}</p>
        </div>
        <div className="p-4 rounded-none border bg-card/10 text-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold font-heading text-amber-600 mt-1">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </div>
        <div className="p-4 rounded-none border bg-card/10 text-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Shipped</p>
          <p className="text-2xl font-bold font-heading text-blue-600 mt-1">
            {orders.filter((o) => o.status === "shipped").length}
          </p>
        </div>
        <div className="p-4 rounded-none border bg-card/10 text-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Disputed (Not Arrived)</p>
          <p className="text-2xl font-bold font-heading text-rose-600 mt-1">
            {orders.filter((o) => o.status === "reported").length}
          </p>
        </div>
      </div>

      {/* Orders List Container */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center border border-dashed rounded-none bg-muted/5">
          <Package className="size-10 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm font-semibold">No orders match your search</p>
          <p className="text-xs text-muted-foreground mt-0.5">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const info = order.shipping_info || {};
            const customerName = `${info.firstName || "Customer"} ${info.lastName || ""}`;
            const isPending = order.status === "pending";
            const isShipped = order.status === "shipped";
            const isDisputed = order.status === "reported";
            const loading = updatingId === order.id;

            return (
              <div 
                key={order.id}
                className={`rounded-none border overflow-hidden transition-all duration-300 bg-card/10 ${
                  isDisputed ? "border-rose-500/30 bg-rose-500/5" : "hover:border-foreground/50"
                }`}
              >
                {/* Order Summary Header */}
                <div className="bg-muted/40 px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider text-[10px]">Order Date</p>
                      <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="size-3 text-muted-foreground" />
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider text-[10px]">Order Reference</p>
                      <p className="font-mono text-foreground font-semibold mt-0.5 uppercase tracking-wide select-all bg-muted/60 px-1.5 py-0.5 rounded-none">
                        {order.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground uppercase tracking-wider text-[10px]">Fulfillment Status</p>
                      <div className="mt-0.5">{getStatusBadge(order.status)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground uppercase tracking-wider text-[10px]">Total Bill</p>
                    <p className="text-base font-bold text-foreground mt-0.5">₱{Number(order.total).toLocaleString()}</p>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] divide-y lg:divide-y-0 lg:divide-x divide-border">
                  
                  {/* Left Panel: Order Items */}
                  <div className="p-6 space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Package className="size-4" />
                      Purchased Items ({order.order_items.length})
                    </h4>
                    <div className="divide-y divide-border/60">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                          <div className="space-y-0.5 min-w-0 pr-4">
                            <p className="font-semibold text-foreground truncate block">
                              {(Array.isArray(item.products) ? item.products[0] : item.products)?.title || "Deleted Product"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ₱{Number(item.price).toLocaleString()} per unit
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-foreground">Qty: {item.quantity}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              ₱{(Number(item.price) * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Panel: Shipping & Dispatch Action */}
                  <div className="p-6 space-y-6 bg-muted/10">
                    
                    {/* Shipping info */}
                    <div className="space-y-4 text-sm">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        Delivery Location & Contact
                      </h4>
                      <div className="space-y-2 bg-background/50 border p-4 rounded-none">
                        <p className="font-bold text-foreground flex items-center gap-1.5">
                          <User className="size-3.5 text-muted-foreground" />
                          {customerName}
                        </p>
                        <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                          <Phone className="size-3.5 text-emerald-600" />
                          {info.contactNumber || "No Contact Number"}
                        </p>
                        <div className="text-xs text-muted-foreground leading-relaxed pt-1.5 border-t border-dashed space-y-0.5">
                          <p className="text-foreground font-medium">{info.streetAddress}</p>
                          <p>Brgy. {info.barangayName}, {info.cityName}</p>
                          <p>{info.provinceName ? info.provinceName + ", " : ""}{info.regionName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Dispatch Action Panel */}
                    <div className="pt-2">
                      {isPending && (
                        <Button
                          className="w-full h-11 rounded-md justify-center flex items-center gap-2"
                          disabled={loading}
                          onClick={() => handleUpdateStatus(order.id, "shipped")}
                        >
                          <Truck className="size-4" />
                          Dispatch & Ship Order 🚚
                        </Button>
                      )}

                      {isShipped && (
                        <Button
                          variant="outline"
                          className="w-full h-11 rounded-md justify-center flex items-center gap-2 border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-600 text-emerald-600"
                          disabled={loading}
                          onClick={() => handleUpdateStatus(order.id, "completed")}
                        >
                          <CheckCircle className="size-4" />
                          Mark Arrived & Completed 📦
                        </Button>
                      )}

                      {isDisputed && (
                        <div className="p-4 rounded-none border border-rose-500/20 bg-rose-500/10 text-rose-700 space-y-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="size-5 shrink-0 text-rose-600 mt-0.5" />
                            <div>
                              <p className="font-bold text-sm">Dispute: Shipment Not Arrived</p>
                              <p className="text-xs text-rose-600 mt-0.5">
                                The customer reported they did not receive this order. Please call their contact number ({info.contactNumber}) to verify the delivery.
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            className="w-full h-9 rounded-md text-xs justify-center"
                            disabled={loading}
                            onClick={() => handleUpdateStatus(order.id, "shipped")}
                          >
                            Re-ship Order / Reset to Shipped
                          </Button>
                        </div>
                      )}

                      {order.status === "completed" && (
                        <div className="p-4 rounded-none border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 flex items-center gap-2">
                          <CheckCircle className="size-5 shrink-0 text-emerald-600" />
                          <div>
                            <p className="font-bold text-sm">Delivery Succeeded</p>
                            <p className="text-xs text-emerald-600 mt-0.5">
                              This order was successfully fulfilled and marked completed.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
