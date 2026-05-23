"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

type OrderItem = {
  id: string;
  price: number;
  quantity: number;
  products: {
    title: string;
  } | null;
};

type ShippingInfo = {
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  streetAddress?: string;
  barangayName?: string;
  cityName?: string;
  provinceName?: string;
  regionName?: string;
  country?: string;
} | null;

type Order = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  shipping_info: ShippingInfo;
  order_items: OrderItem[];
};

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  category_id: string | null;
  stock: number;
};

type AdminAnalyticsProps = {
  orders: Order[];
  products: Product[];
};

export function AdminAnalytics({ orders, products }: AdminAnalyticsProps) {
  // 1. Compute high level metrics
  const metrics = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== "cancelled");
    const totalRevenue = activeOrders.reduce(
      (sum, o) => sum + Number(o.total),
      0,
    );
    const totalOrders = activeOrders.length;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get unique buyers count
    const uniqueBuyers = new Set(
      orders.map((o) => o.shipping_info?.contactNumber || o.id),
    ).size;
    const lowStockCount = products.filter((p) => p.stock <= 5).length;

    return {
      revenue: totalRevenue,
      ordersCount: totalOrders,
      aov,
      customers: uniqueBuyers,
      lowStock: lowStockCount,
    };
  }, [orders, products]);

  // 2. Prepare sales over time (last 7 active days) for SVG Chart
  const salesChartData = useMemo(() => {
    const dailyMap: Record<string, number> = {};

    // Group active orders by date
    orders.forEach((o) => {
      if (o.status === "cancelled") return;
      const dateStr = new Date(o.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      dailyMap[dateStr] = (dailyMap[dateStr] || 0) + Number(o.total);
    });

    const dates = Object.keys(dailyMap);
    // If no data, populate with mock indicators
    if (dates.length === 0) {
      return [
        { label: "Day 1", value: 0 },
        { label: "Day 2", value: 0 },
        { label: "Day 3", value: 0 },
        { label: "Day 4", value: 0 },
      ];
    }

    // Sort by actual time (simulate reverse order to chronological order)
    return Object.entries(dailyMap)
      .map(([label, value]) => ({ label, value }))
      .reverse() // original query order is descending, so reverse is ascending
      .slice(-7); // take last 7 data points
  }, [orders]);

  // 3. Prepare Top Selling Products
  const topSellers = useMemo(() => {
    const quantities: Record<
      string,
      { title: string; count: number; image: string | null; revenue: number }
    > = {};

    orders.forEach((order) => {
      if (order.status === "cancelled") return;
      order.order_items.forEach((item) => {
        // Since order_items product references are loaded, we fetch title from product details
        const title = item.products?.title || "Unknown Product";
        const qty = item.quantity;
        const rev = Number(item.price) * qty;

        if (quantities[title]) {
          quantities[title].count += qty;
          quantities[title].revenue += rev;
        } else {
          // Find matching product for image
          const matchedProd = products.find((p) => p.title === title);
          quantities[title] = {
            title,
            count: qty,
            image: matchedProd?.image_url || null,
            revenue: rev,
          };
        }
      });
    });

    return Object.values(quantities)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [orders, products]);

  // SVG Line Chart dimension parameters
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 20;

  const points = useMemo(() => {
    if (salesChartData.length === 0) return [];
    const maxValue = Math.max(...salesChartData.map((d) => d.value), 100);
    const divisor = salesChartData.length > 1 ? salesChartData.length - 1 : 1;

    return salesChartData.map((d, index) => {
      const x =
        salesChartData.length > 1
          ? padding + (index * (chartWidth - padding * 2)) / divisor
          : padding + (chartWidth - padding * 2) / 2;
      const y =
        chartHeight -
        padding -
        (d.value / maxValue) * (chartHeight - padding * 2);
      return { x, y };
    });
  }, [salesChartData]);

  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const startX = points[0].x;
    const endX = points[points.length - 1].x;
    const baseHeight = chartHeight - padding;
    return `${linePath} L ${endX} ${baseHeight} L ${startX} ${baseHeight} Z`;
  }, [points, linePath]);

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="rounded-none border bg-card/15 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Gross Sales
            </span>
            <div className="p-2 bg-emerald-500/10 rounded-md text-emerald-600 border border-emerald-500/10">
              <DollarSign className="size-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-bold font-heading">
              ₱{metrics.revenue.toLocaleString()}
            </h4>
            <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle className="size-3" />
              100% Mock Paid
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-none border bg-card/15 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2 bg-primary/10 rounded-md text-primary border border-primary/10">
              <ShoppingBag className="size-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-bold font-heading">
              {metrics.ordersCount} completed
            </h4>
            <p className="text-[10px] text-muted-foreground mt-1">
              Order logs updated
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-none border bg-card/15 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              AOV (Average Order)
            </span>
            <div className="p-2 bg-purple-500/10 rounded-md text-purple-600 border border-purple-500/10">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-bold font-heading">
              ₱{Math.round(metrics.aov).toLocaleString()}
            </h4>
            <p className="text-[10px] text-muted-foreground mt-1">
              Per transaction average
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-none border bg-card/15 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="p-2 bg-amber-500/10 rounded-md text-amber-600 border border-amber-500/10">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <div>
            <h4 className="text-2xl font-bold font-heading">
              {metrics.lowStock} products
            </h4>
            <p className="text-[10px] text-amber-600 font-semibold mt-1">
              Needs attention
            </p>
          </div>
        </div>
      </div>

      {/* 2. Charts and Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        {/* Sales Over Time Chart */}
        <div className="rounded-none border bg-card/5 p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium tracking-tight font-heading">
              Revenue Dynamics
            </h3>
            <p className="text-xs text-muted-foreground">
              Historical billing performance over the last 7 active transaction
              days.
            </p>
          </div>

          {/* SVG Line / Area Chart */}
          <div className="relative w-full h-44 flex items-center justify-center">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-full text-primary"
            >
              {/* Gradients */}
              <defs>
                <linearGradient
                  id="chart-area-grad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-primary, currentColor)"
                    stopOpacity="0.2"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-primary, currentColor)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              <line
                x1={padding}
                y1={padding}
                x2={chartWidth - padding}
                y2={padding}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <line
                x1={padding}
                y1={chartHeight / 2}
                x2={chartWidth - padding}
                y2={chartHeight / 2}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
              <line
                x1={padding}
                y1={chartHeight - padding}
                x2={chartWidth - padding}
                y2={chartHeight - padding}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />

              {/* Area */}
              {areaPath && <path d={areaPath} fill="url(#chart-area-grad)" />}

              {/* Line */}
              {linePath && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
              )}

              {/* Dots */}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="var(--background)"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          {/* Axis Labels */}
          <div className="flex justify-between text-[10px] text-muted-foreground font-semibold uppercase tracking-wider px-2 border-t pt-3">
            {salesChartData.map((d, i) => (
              <span key={i}>{d.label}</span>
            ))}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="rounded-none border bg-card/5 p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium tracking-tight font-heading">
              Top Performing Listings
            </h3>
            <p className="text-xs text-muted-foreground">
              Listings generating the highest volume of client purchases.
            </p>
          </div>

          <div className="divide-y divide-border space-y-4">
            {topSellers.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No orders placed yet. Product listings will rank upon purchase.
              </div>
            ) : (
              topSellers.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center pt-4 first:pt-0"
                >
                  <div className="relative aspect-square size-12 shrink-0 overflow-hidden bg-muted border">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover size-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary text-[9px] text-muted-foreground">
                        No Img
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-foreground">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.count} units sold
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      ₱{item.revenue.toLocaleString()}
                    </p>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded-none font-bold uppercase mt-1 inline-block">
                      Rank #{index + 1}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t text-[10px] text-muted-foreground font-semibold flex items-center justify-between">
            <span>AUDITED SYSTEM LOGS</span>
            <ArrowUpRight className="size-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* 3. Low Stock Action Plan */}
      <div className="rounded-none border bg-card/15 p-6 space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-medium tracking-tight font-heading flex items-center gap-2 text-amber-600">
            <AlertTriangle className="size-5" />
            Active Stock Depletions
          </h3>
          <p className="text-xs text-muted-foreground">
            The following listings have depleted stocks below the critical
            threshold (5 pcs) and require urgent restock actions.
          </p>
        </div>

        {products.filter((p) => p.stock <= 5).length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-none bg-muted/5">
            ✓ Excellent! All product listings are adequately supplied above
            threshold values.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products
              .filter((p) => p.stock <= 5)
              .map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 border rounded-none bg-background flex justify-between items-center gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate text-foreground">
                      {prod.title}
                    </p>
                    <p className="text-xs text-amber-600 font-semibold mt-1">
                      Current Stock: {prod.stock} pcs
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="text-[10px] bg-rose-500/10 text-rose-600 border border-rose-500/20 px-2 py-1 font-bold uppercase">
                      DEPLETED
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
