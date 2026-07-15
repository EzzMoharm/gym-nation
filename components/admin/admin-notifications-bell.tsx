"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Bell, ShoppingBag, Clock } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDateShort } from "@/lib/utils";
import { getAllAdminOrders } from "@/app/admin/actions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

interface OrderNotification {
  id: string;
  order_number: string;
  total: number;
  created_at: string;
}

// A synthesized chime using Web Audio API to notify the admin when online
function playChime() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Osc 1: Sweet base note sweeping up
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc1.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12); // E6
    
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    
    // Osc 2: High harmony sweeping up with a small delay
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.08); // C6
    osc2.frequency.exponentialRampToValueAtTime(1568, ctx.currentTime + 0.2); // G6
    
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.09, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.45);
    
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.6);
  } catch (e) {
    console.warn("Chime generation failed:", e);
  }
}

export function AdminNotificationsBell() {
  const { profile } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [ringBell, setRingBell] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (profile?.role !== "admin") return;

    // Load initial recent orders
    async function loadNotifications() {
      try {
        const res = await getAllAdminOrders();
        if (!res.error && res.data) {
          const fetchedOrders = res.data as any[];
          
          // Get last checked timestamp from localStorage
          const lastChecked = localStorage.getItem("admin_last_checked_orders");
          const lastCheckedTime = lastChecked ? new Date(lastChecked).getTime() : 0;
          
          // Count new orders since last checked
          const unread = fetchedOrders.filter(
            (o) => new Date(o.created_at).getTime() > lastCheckedTime
          ).length;
          
          setNotifications(fetchedOrders.slice(0, 5));
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to load admin notifications:", err);
      } finally {
        isFirstMount.current = false;
      }
    }

    loadNotifications();

    // Subscribe to new orders in real-time
    const supabase = createClient();
    const channel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = payload.new as OrderNotification;
          
          setNotifications((prev) => [newOrder, ...prev].slice(0, 5));
          setUnreadCount((prev) => prev + 1);
          setRingBell(true);
          setTimeout(() => setRingBell(false), 1500); // Stop ringing after 1.5s
          
          // Play chime sound to alert admin
          playChime();
          
          // Show premium toast
          toast.success("New Order Received! 🛒", {
            description: `Order ${newOrder.order_number} for ${formatPrice(newOrder.total)}`,
            duration: 8000,
          });
        }
      )
      .subscribe();

    // Fallback: poll for new orders every 15 seconds in case real-time fails/is disabled
    const interval = setInterval(async () => {
      try {
        const res = await getAllAdminOrders();
        if (!res.error && res.data) {
          const fetchedOrders = res.data as any[];
          const lastChecked = localStorage.getItem("admin_last_checked_orders");
          const lastCheckedTime = lastChecked ? new Date(lastChecked).getTime() : 0;
          const unread = fetchedOrders.filter(
            (o) => new Date(o.created_at).getTime() > lastCheckedTime
          ).length;
          setNotifications(fetchedOrders.slice(0, 5));
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to poll admin notifications:", err);
      }
    }, 15000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [profile]);

  const handleOpenChange = (open: boolean) => {
    if (open && unreadCount > 0) {
      // Mark all as read when opening dropdown
      localStorage.setItem("admin_last_checked_orders", new Date().toISOString());
      setUnreadCount(0);
    }
  };

  const clearNotifications = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("admin_last_checked_orders", new Date().toISOString());
    setUnreadCount(0);
  };

  if (profile?.role !== "admin") return null;

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger render={
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer hover:bg-muted/50 rounded-xl h-9.5 w-9.5 shrink-0"
          aria-label="Admin Notifications"
        />
      }>
        <motion.div
          animate={ringBell ? {
            rotate: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
            scale: [1, 1.15, 1.15, 1]
          } : {}}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Bell className="h-4.5 w-4.5" />
        </motion.div>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-extrabold text-destructive-foreground animate-pulse shadow-sm">
            {unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 p-2 rounded-2xl bg-card border border-border shadow-xl align-end z-50">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="px-1.5 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Notifications
          </span>
          {unreadCount > 0 && (
            <button
              onClick={clearNotifications}
              className="text-xs font-semibold text-brand hover:text-brand-light transition-colors cursor-pointer"
            >
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        
        <div className="space-y-1 py-1 max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-xs flex flex-col items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <span>No recent orders received</span>
            </div>
          ) : (
            notifications.map((notif) => (
              <DropdownMenuItem 
                key={notif.id} 
                className="p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => router.push("/admin/orders")}
              >
                <div className="flex flex-col w-full gap-1">
                  <div className="flex justify-between w-full text-xs">
                    <span className="font-bold font-mono text-foreground">{notif.order_number}</span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDateShort(notif.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between w-full text-xs text-muted-foreground">
                    <span>New order placed</span>
                    <span className="font-bold text-brand">{formatPrice(notif.total)}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        
        <DropdownMenuSeparator />
        <div className="p-1">
          <DropdownMenuItem 
            className="p-0 rounded-xl cursor-pointer"
            onClick={() => router.push("/admin/orders")}
          >
            <Button variant="outline" className="w-full text-xs h-9 rounded-xl font-semibold">
              View All Orders
            </Button>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
