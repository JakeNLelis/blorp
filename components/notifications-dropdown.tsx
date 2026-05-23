"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellRing,
  Check,
  CheckSquare,
  Package,
  Tag,
  Star,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/supabase";
import { User, RealtimeChannel } from "@supabase/supabase-js";

type Notification = Tables<"notifications">;

const safeParseJson = (str: string | null): string[] => {
  if (!str) return [];
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error("Failed to parse read notification IDs from localStorage:", e);
    return [];
  }
};

export function NotificationsDropdown({
  currentUser,
}: {
  currentUser: User | null;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = useMemo(() => createClient(), []);

  const fetchNotifications = async () => {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching notifications:", error.message || error);
    } else {
      // Merge with localStorage read-notification-ids
      let readIds: string[] = [];
      if (typeof window !== "undefined") {
        const localReadString = localStorage.getItem("read-notification-ids");
        readIds = safeParseJson(localReadString);
      }

      const merged = (data || []).map((n) => {
        if (readIds.includes(n.id)) {
          return { ...n, is_read: true };
        }
        return n;
      });

      setNotifications(merged);
      setUnreadCount(merged.filter((n) => !n.is_read).length);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    const activeUser = currentUser;
    let channel: RealtimeChannel | null = null;

    async function setupSubscription() {
      // Fetch notifications
      await fetchNotifications();

      // Check if admin
      const { data: adminRes } = await supabase.rpc("is_admin");
      const userIsAdmin = !!adminRes;

      // Subscribe to real-time notifications inserts/updates using a unique channel name to avoid StrictMode double-subscription errors
      const channelId = `realtime-notifications-${Math.random().toString(36).substring(2)}`;
      channel = supabase
        .channel(channelId)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: userIsAdmin
              ? "is_admin_notification=eq.true"
              : `user_id=eq.${activeUser.id}`,
          },
          () => {
            fetchNotifications();
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "notifications",
            filter: userIsAdmin
              ? "is_admin_notification=eq.true"
              : `user_id=eq.${activeUser.id}`,
          },
          () => {
            fetchNotifications();
          },
        )
        .subscribe();
    }

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabase, currentUser]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Persist read state in localStorage
    if (typeof window !== "undefined") {
      const localReadString = localStorage.getItem("read-notification-ids");
      const readIds: string[] = safeParseJson(localReadString);
      if (!readIds.includes(id)) {
        readIds.push(id);
        localStorage.setItem("read-notification-ids", JSON.stringify(readIds));
      }
    }

    // Try updating Supabase (will succeed for owned notifications)
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    // Collect all notification IDs from current local state
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);

    if (typeof window !== "undefined" && unreadIds.length > 0) {
      const localReadString = localStorage.getItem("read-notification-ids");
      const readIds: string[] = safeParseJson(localReadString);

      unreadIds.forEach((id) => {
        if (!readIds.includes(id)) {
          readIds.push(id);
        }
      });
      localStorage.setItem("read-notification-ids", JSON.stringify(readIds));
    }

    // Try updating in Supabase with defence-in-depth filters
    if (currentUser) {
      const { data: adminRes } = await supabase.rpc("is_admin");
      const userIsAdmin = !!adminRes;

      let query = supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("is_read", false);

      if (userIsAdmin) {
        query = query.or(`user_id.eq.${currentUser.id},is_admin_notification.eq.true`);
      } else {
        query = query.eq("user_id", currentUser.id);
      }

      await query;
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  // User reports that their order did not arrive
  const handleReportNotArrived = async (
    notificationId: string,
    orderId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (
      !confirm(
        "Are you sure you want to report that this order did not arrive? We will notify the administration immediately.",
      )
    ) {
      return;
    }

    // 1. Update the order status to 'reported'
    const { error: orderError } = await supabase
      .from("orders")
      .update({ status: "reported" })
      .eq("id", orderId);

    if (orderError) {
      alert("Failed to report order: " + orderError.message);
      return;
    }

    // 2. Create notification for Admin
    const { error: adminNotifError } = await supabase
      .from("notifications")
      .insert({
        title: "⚠️ Order Dispute / Non-arrival!",
        message: `User ${currentUser?.email} reported that order "${orderId}" did not arrive.`,
        type: "order_reported",
        link: `/admin/orders`,
        is_admin_notification: true,
      });

    if (adminNotifError) {
      console.error("Failed to notify admin of dispute:", adminNotifError);
      alert(
        "Failed to report non-arrival to administrators: " +
          adminNotifError.message,
      );
      return;
    }

    // 3. Mark the current arrival notification as read and show success
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    alert(
      "Report submitted successfully. The administration has been notified.",
    );
    fetchNotifications();
    router.refresh();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "new_product":
        return <Package className="size-4 text-emerald-500" />;
      case "new_discount":
        return <Tag className="size-4 text-rose-500" />;
      case "review":
        return <Star className="size-4 text-amber-500 fill-amber-500" />;
      case "order_shipped":
        return <Package className="size-4 text-blue-500" />;
      case "order_arrived":
        return <CheckSquare className="size-4 text-emerald-500" />;
      case "order_reported":
        return <AlertTriangle className="size-4 text-destructive" />;
      default:
        return <Info className="size-4 text-muted-foreground" />;
    }
  };

  const extractOrderId = (message: string) => {
    // Attempt to extract order ID from message: e.g. "Your order f6b5a3..."
    const match = message.match(/order "([^"]+)"|order ([a-f0-9-]{36})/i);
    return match ? match[1] || match[2] : null;
  };

  if (!currentUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          {unreadCount > 0 ? (
            <>
              <BellRing className="size-4 animate-pulse text-amber-300" />
              <span className="absolute top-1 right-1 flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-red-500"></span>
              </span>
            </>
          ) : (
            <Bell className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 p-4 bg-background border rounded-none shadow-none font-sans"
      >
        <div className="flex items-center justify-between pb-3 border-b mb-2">
          <h4 className="font-semibold tracking-tight text-sm font-heading">
            Notifications
          </h4>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <Check className="size-3" /> Mark all read
            </button>
          )}
        </div>

        <div className="max-h-87.5 overflow-y-auto space-y-2 pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              You have no notifications.
            </div>
          ) : (
            notifications.map((n) => {
              const isArrival = n.type === "order_arrived";
              const orderId = isArrival ? extractOrderId(n.message) : null;

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.link) {
                      router.push(n.link);
                    }
                  }}
                  className={`p-3 rounded-none border transition-all text-left flex gap-3 relative ${
                    n.is_read
                      ? "bg-muted/30 border-muted-foreground/10"
                      : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                  } ${n.link ? "cursor-pointer" : ""}`}
                >
                  <div className="size-8 rounded-none bg-background border flex items-center justify-center shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-1.5">
                      <p
                        className={`text-xs font-semibold ${!n.is_read ? "text-foreground" : "text-foreground/75"}`}
                      >
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <button
                          onClick={(e) => handleMarkAsRead(n.id, e)}
                          title="Mark as read"
                          className="text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <Check className="size-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {n.message}
                    </p>

                    {/* Action buttons inside notification for disputes */}
                    {isArrival && orderId && !n.is_read && (
                      <div className="pt-2 flex gap-2">
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={(e) =>
                            handleReportNotArrived(n.id, orderId, e)
                          }
                          className="h-7 text-[10px] rounded-md px-2 py-0"
                        >
                          Report: Not Arrived ⚠️
                        </Button>
                      </div>
                    )}

                    <p className="text-[10px] text-muted-foreground/60 pt-0.5">
                      {new Date(n.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
