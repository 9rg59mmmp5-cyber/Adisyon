import React, { useState, useMemo, useEffect } from "react";
import {
  Utensils,
  Croissant,
  IceCream,
  CupSoda,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  RefreshCcw,
  Banknote,
  ArrowLeft,
  Receipt,
  Coffee,
  BellRing,
  PlusCircle,
  X,
  Users,
  LogOut,
  TrendingUp,
  CalendarDays,
  QrCode,
  ExternalLink,
} from "lucide-react";
import {
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_TABLES,
  INITIAL_WAITERS,
} from "./data";
import { Product, Table, OrderItem, Waiter, CompletedOrder } from "./types";
import QRCode from "react-qr-code";
import CustomerMenu from "./CustomerMenu";

const iconMap: Record<string, React.FC<any>> = {
  Utensils,
  Croissant,
  IceCream,
  CupSoda,
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(price);
}

const categoryColorMap: Record<string, string> = {
  c1: "bg-amber-100 border-amber-300 text-amber-800",
  c2: "bg-pink-100 border-pink-300 text-pink-800",
  c3: "bg-blue-100 border-blue-300 text-blue-800",
  c4: "bg-rose-100 border-rose-300 text-rose-800",
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<{
    role: "admin" | "waiter";
    id?: string;
  } | null>(null);
  const [waiters, setWaiters] = useState<Waiter[]>(INITIAL_WAITERS);

  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(
    CATEGORIES[0].id,
  );
  const [isCartOpenMobile, setIsCartOpenMobile] = useState(false);

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    categoryId: CATEGORIES[0].id,
  });

  const [isWaiterManagerOpen, setIsWaiterManagerOpen] = useState(false);
  const [newWaiterName, setNewWaiterName] = useState("");

  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([]);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPublicMenu, setIsPublicMenu] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setIsPublicMenu(window.location.hash === '#menu');
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const activeTable = useMemo(
    () => tables.find((t) => t.id === activeTableId),
    [tables, activeTableId],
  );

  const toggleWaiterStatus = (tableId: string) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === tableId ? { ...t, needsWaiter: !t.needsWaiter } : t,
      ),
    );
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || newProduct.price <= 0) return;

    const product: Product = {
      id: `p${Date.now()}`,
      name: newProduct.name,
      price: Number(newProduct.price),
      categoryId: newProduct.categoryId,
      colorClass:
        categoryColorMap[newProduct.categoryId] ||
        "bg-slate-100 border-slate-300 text-slate-800",
    };

    setProducts((prev) => [...prev, product]);
    setIsAddProductOpen(false);
    setNewProduct({ name: "", price: 0, categoryId: CATEGORIES[0].id });
  };

  const handleAddWaiter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWaiterName.trim()) return;

    const newWaiter: Waiter = {
      id: `w${Date.now()}`,
      name: newWaiterName.trim(),
    };

    setWaiters((prev) => [...prev, newWaiter]);
    setNewWaiterName("");
  };

  const handleRemoveWaiter = (id: string) => {
    if (confirm("Bu garsonu silmek istediğinize emin misiniz?")) {
      setWaiters((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const activeProducts = useMemo(() => {
    return products.filter((p) => p.categoryId === activeCategory);
  }, [products, activeCategory]);

  const updateTableOrder = (
    tableId: string,
    updater: (orders: OrderItem[]) => OrderItem[],
  ) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          const newOrders = updater(t.orders);
          return {
            ...t,
            orders: newOrders,
            status: newOrders.length > 0 ? "occupied" : "empty",
          };
        }
        return t;
      }),
    );
  };

  const handleRemoveProduct = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
      // Optionally remove from carts, but for simplicity let's skip cart cleanup
    }
  };

  const handleAddToCart = (product: Product) => {
    if (!activeTableId) return;
    updateTableOrder(activeTableId, (orders) => {
      const existing = orders.find((item) => item.product.id === product.id);
      if (existing) {
        return orders.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...orders, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    if (!activeTableId) return;
    updateTableOrder(activeTableId, (orders) => {
      const existing = orders.find((item) => item.product.id === productId);
      if (!existing) return orders;
      const newQuantity = existing.quantity + delta;

      if (newQuantity <= 0) {
        return orders.filter((item) => item.product.id !== productId);
      }
      return orders.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      );
    });
  };

  const handleCheckout = () => {
    if (!activeTableId || !activeTable) return;
    if (activeTable.orders.length === 0) {
      setActiveTableId(null);
      return;
    }
    if (confirm(`${activeTable.name} hesabı kapatılacak. Emin misiniz?`)) {
      const total = getTableTotal(activeTable);
      const newCompletedOrder: CompletedOrder = {
        id: `order_${Date.now()}`,
        tableName: activeTable.name,
        total: total,
        timestamp: Date.now(),
      };
      setCompletedOrders((prev) => [...prev, newCompletedOrder]);
      updateTableOrder(activeTableId, () => []);
      setActiveTableId(null);
      setIsCartOpenMobile(false);
    }
  };

  const clearCart = () => {
    if (!activeTableId) return;
    if (
      confirm(
        "Bu masadaki tüm siparişleri iptal etmek istediğinize emin misiniz?",
      )
    ) {
      updateTableOrder(activeTableId, () => []);
    }
  };

  const getTableTotal = (table: Table) => {
    return table.orders.reduce(
      (acc, order) => acc + order.product.price * order.quantity,
      0,
    );
  };

  if (isPublicMenu) {
    return <CustomerMenu products={products} />;
  }

  const dailyReportModal = isReportOpen && (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-emerald-50">
          <h3 className="text-xl font-black text-emerald-800 flex items-center gap-2">
            <TrendingUp size={24} />
            Gün Sonu Kazanç Özeti
          </h3>
          <button
            onClick={() => setIsReportOpen(false)}
            className="p-2 bg-emerald-100/50 hover:bg-emerald-200 rounded-xl transition text-emerald-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 flex-1 overflow-y-auto bg-slate-50">
          <div className="bg-emerald-600 rounded-xl p-6 text-white shadow-md mb-6 flex flex-col items-center justify-center">
            <span className="text-emerald-100 font-bold mb-1 flex items-center gap-2">
              <CalendarDays size={18} /> Toplam Hasılat
            </span>
            <span className="text-4xl font-black">
              {formatPrice(
                completedOrders.reduce((sum, order) => sum + order.total, 0),
              )}
            </span>
            <span className="text-emerald-100 text-sm mt-2">
              {completedOrders.length} Adisyon Tamamlandı
            </span>
          </div>

          <h4 className="font-bold text-slate-700 mb-3 px-1">Satış Geçmişi</h4>
          {completedOrders.length === 0 ? (
            <p className="text-slate-500 text-center py-8 bg-white rounded-xl border border-slate-100">
              Henüz tamamlanan bir sipariş yok.
            </p>
          ) : (
            <div className="space-y-3">
              {completedOrders
                .slice()
                .reverse()
                .map((order) => (
                  <div
                    key={order.id}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-lg">
                        {order.tableName}
                      </div>
                      <div className="text-slate-500 text-sm mt-0.5">
                        {new Date(order.timestamp).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="text-xl font-black text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100">
                      {formatPrice(order.total)}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-8">
          <h1 className="text-3xl font-black text-center text-slate-800 mb-8 flex items-center justify-center gap-3">
            <Coffee className="text-sky-600" size={32} />
            Sisteme Giriş Yap
          </h1>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-700 mb-4">
                Masa ve Kasa Yönetimi
              </h2>
              <button
                onClick={() => setCurrentUser({ role: "admin" })}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-md active:scale-[0.98]"
              >
                <Banknote size={24} />
                Kasa Olarak Giriş Yap
              </button>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Users size={20} className="text-sky-600" />
                Garsonlar
              </h2>
              {waiters.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  Sistemde kayıtlı garson bulunamadı. Kasa olarak giriş yapıp
                  garson ekleyebilirsiniz.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {waiters.map((waiter) => (
                    <button
                      key={waiter.id}
                      onClick={() =>
                        setCurrentUser({ role: "waiter", id: waiter.id })
                      }
                      className="bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold py-3 px-4 rounded-xl transition border border-sky-200 text-center active:scale-95 flex flex-col items-center justify-center"
                    >
                      <span className="truncate w-full">{waiter.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {dailyReportModal}
      </div>
    );
  }

  const waiterManagerModal = isWaiterManagerOpen && (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-xl font-black text-slate-800">Garson Yönetimi</h3>
          <button
            onClick={() => setIsWaiterManagerOpen(false)}
            className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-slate-500"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 flex-1 overflow-y-auto">
          {waiters.length === 0 ? (
            <p className="text-slate-500 text-center mb-6">
              Sistemde garson bulunmuyor.
            </p>
          ) : (
            <div className="space-y-2 mb-6">
              {waiters.map((waiter) => (
                <div
                  key={waiter.id}
                  className="flex justify-between items-center p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <span className="font-bold text-slate-700">
                    {waiter.name}
                  </span>
                  <button
                    onClick={() => handleRemoveWaiter(waiter.id)}
                    className="text-rose-500 hover:bg-rose-100 p-2 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-slate-200 pt-5">
            <form onSubmit={handleAddWaiter} className="flex gap-2">
              <input
                type="text"
                required
                value={newWaiterName}
                onChange={(e) => setNewWaiterName(e.target.value)}
                placeholder="Yeni Garson Adı"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
              />
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-5 rounded-xl transition shadow-sm active:scale-95"
              >
                Ekle
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const qrModal = isQrModalOpen && (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-gradient-to-r from-sky-50 to-indigo-50">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <QrCode size={24} className="text-indigo-600" />
            Dijital Menü Özeti
          </h3>
          <button
            onClick={() => setIsQrModalOpen(false)}
            className="p-2 bg-white/60 hover:bg-white rounded-xl transition text-slate-600 shadow-sm"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center">
          <div className="bg-white p-4 rounded-3xl shadow-sm border-2 border-slate-100 mb-6 relative">
            <QRCode value={`${window.location.origin}${window.location.pathname}#menu`} size={200} />
          </div>
          <h4 className="text-xl font-bold text-slate-800 mb-2">Müşteri Menünüz Hazır</h4>
          <p className="text-slate-500 mb-6 max-w-sm">Bu QR kodu masalarınıza yazdırarak müşterilerinizin restoran menünüze telefonlarından anında ulaşmasını sağlayabilirsiniz.</p>
          
          <a
            href={`${window.location.origin}${window.location.pathname}#menu`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-md"
          >
            Menüyü Önizle <ExternalLink size={20} />
          </a>
        </div>
      </div>
    </div>
  );

  if (!activeTableId) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Coffee className="text-sky-600" size={32} />
              Masa Adisyon Yönetimi
            </h1>
            <p className="text-slate-500 font-medium">
              {currentUser.role === "admin"
                ? "Kasa / Yönetici Girişi"
                : `Garson: ${waiters.find((w) => w.id === currentUser.id)?.name || "Bilinmiyor"}`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {currentUser.role === "admin" && (
              <>
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm px-4 py-2 rounded-xl font-bold hover:opacity-90 active:scale-95 transition whitespace-nowrap"
                >
                  <QrCode size={18} />
                  Dijital Menü / QR
                </button>
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="flex items-center gap-2 bg-white border border-emerald-200 shadow-sm px-4 py-2 rounded-xl text-emerald-700 font-bold hover:bg-emerald-50 active:scale-95 transition whitespace-nowrap"
                >
                  <TrendingUp size={18} />
                  Gün Sonu
                </button>
                <button
                  onClick={() => setIsWaiterManagerOpen(true)}
                  className="flex items-center gap-2 bg-white border border-sky-200 shadow-sm px-4 py-2 rounded-xl text-sky-700 font-bold hover:bg-sky-50 active:scale-95 transition whitespace-nowrap"
                >
                  <Users size={18} />
                  Garson Yönetimi
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Tüm masaları ve kayıtları sıfırlamak istediğinize emin misiniz?",
                      )
                    ) {
                      setTables(INITIAL_TABLES);
                    }
                  }}
                  className="flex items-center gap-2 bg-white border shadow-sm px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-50 active:scale-95 transition whitespace-nowrap"
                >
                  <RefreshCcw size={18} />
                  Sistemi Sıfırla
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentUser(null)}
              className="flex items-center gap-2 bg-slate-800 text-white shadow-sm px-4 py-2 rounded-xl font-bold hover:bg-slate-700 active:scale-95 transition whitespace-nowrap"
            >
              <LogOut size={18} />
              Çıkış Yap
            </button>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {tables.map((table) => {
            const isOccupied = table.status === "occupied";
            const total = getTableTotal(table);

            return (
              <button
                key={table.id}
                onClick={() => {
                  setActiveTableId(table.id);
                  if (table.needsWaiter) {
                    toggleWaiterStatus(table.id);
                  }
                }}
                className={`p-5 md:p-6 rounded-2xl shadow-sm border text-left transition select-none active:scale-[0.98] flex flex-col h-32 md:h-36 relative overflow-hidden
                  ${
                    isOccupied
                      ? "bg-sky-600 border-sky-700 text-white shadow-sky-600/20 hover:bg-sky-500"
                      : table.needsWaiter
                        ? "bg-amber-50 border-amber-300 text-slate-800"
                        : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                  }
                `}
              >
                {isOccupied && (
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                )}

                <div className="font-bold text-lg md:text-xl mb-auto opacity-90">
                  {table.name}
                </div>

                {table.needsWaiter && (
                  <div className="absolute top-4 right-4 text-amber-500 bg-white/80 p-1.5 rounded-full shadow-sm animate-pulse">
                    <BellRing size={24} />
                  </div>
                )}

                {isOccupied && (
                  <div className="font-black text-xl md:text-2xl mt-auto z-10 flex items-center justify-between w-full">
                    <span>{formatPrice(total)}</span>
                    <Receipt size={20} className="opacity-70" />
                  </div>
                )}
                {!isOccupied && (
                  <div className="text-slate-400 font-medium mt-auto z-10">
                    Boş
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {waiterManagerModal}
        {dailyReportModal}
        {qrModal}
      </div>
    );
  }

  // --- ORDER VIEW ---
  const cart = activeTable?.orders || [];
  const cartTotal = getTableTotal(activeTable!);
  const cartCount = cart.reduce((acc, c) => acc + c.quantity, 0);

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-50 text-slate-800 font-sans overflow-hidden select-none">
      {/* LEFT PANEL: PRODUCTS */}
      <div
        className={`flex-1 flex flex-col h-full bg-slate-50 ${isCartOpenMobile ? "hidden md:flex" : "flex"}`}
      >
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTableId(null)}
              className="p-2 -ml-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-slate-700"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                {activeTable?.name}
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Sipariş Ekranı
              </p>
            </div>
          </div>

          <div className="flex gap-2 md:gap-3">
            <button
              onClick={() => {
                toggleWaiterStatus(activeTableId);
                if (!activeTable?.needsWaiter) {
                  alert(
                    "Garsona kibarca haber verildi. Size en kısa sürede yardımcı olacağız.",
                  );
                }
              }}
              className={`flex relative p-2 md:p-3 md:px-4 rounded-xl shadow-md items-center gap-2 font-bold active:scale-95 transition ${activeTable?.needsWaiter ? "bg-amber-100 text-amber-700 border border-amber-300" : "bg-white border text-slate-700 hover:bg-slate-50"}`}
            >
              <BellRing
                size={22}
                className={activeTable?.needsWaiter ? "animate-pulse" : ""}
              />
              <span className="hidden md:inline">
                {activeTable?.needsWaiter ? "Garson Çağrıldı" : "Garson Çağır"}
              </span>
            </button>

            {/* Mobile Cart Toggle */}
            <button
              className="md:hidden relative p-3 px-4 bg-sky-600 text-white rounded-xl shadow-md flex items-center gap-2 font-bold active:scale-95 transition"
              onClick={() => setIsCartOpenMobile(true)}
            >
              <ShoppingCart size={22} />
              {formatPrice(cartTotal)}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Categories */}
        <div
          className="bg-white/80 backdrop-blur-md px-4 py-3 border-b flex gap-2 overflow-x-auto shrink-0 touch-pan-x"
          style={{ scrollbarWidth: "none" }}
        >
          {CATEGORIES.map((category) => {
            const Icon = iconMap[category.iconName] || Utensils;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap font-bold transition active:scale-95 ${
                  isActive
                    ? "bg-sky-600 text-white shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                }`}
              >
                <Icon size={20} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {activeProducts.map((product) => {
              const inCartItem = cart.find((c) => c.product.id === product.id);

              return (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className={`relative flex flex-col items-start p-3 md:p-4 rounded-xl shadow-sm border transition active:scale-[0.98] min-h-[100px] md:min-h-[120px] ${product.colorClass} hover:shadow-md cursor-pointer`}
                >
                  <span className="text-sm md:text-base font-bold mt-auto leading-tight text-left pr-4">
                    {product.name}
                  </span>
                  <span className="text-base md:text-lg font-black mt-2 opacity-90">
                    {formatPrice(product.price)}
                  </span>
                  {inCartItem && (
                    <span className="absolute top-2 right-2 bg-sky-600 text-white font-black w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 text-xs md:text-sm">
                      {inCartItem.quantity}
                    </span>
                  )}
                  {currentUser?.role === "admin" && (
                    <button
                      onClick={(e) => handleRemoveProduct(e, product.id)}
                      className="absolute top-2 left-2 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white rounded-full bg-white/50 backdrop-blur-sm transition-colors z-10"
                      title="Ürünü Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </button>
              );
            })}
            {currentUser?.role === "admin" && (
              <button
                onClick={() => {
                  setNewProduct({ ...newProduct, categoryId: activeCategory });
                  setIsAddProductOpen(true);
                }}
                className="relative flex flex-col items-center justify-center p-3 md:p-4 rounded-xl shadow-sm border-2 border-dashed border-slate-300 transition active:scale-[0.98] min-h-[100px] md:min-h-[120px] bg-slate-50/50 hover:bg-slate-50 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <PlusCircle size={28} className="mb-2 opacity-60" />
                <span className="text-sm font-bold opacity-80 text-center">
                  Yeni Ürün
                  <br />
                  Ekle
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: CART */}
      <div
        className={`
        md:w-96 lg:w-[420px] bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl z-20 
        ${isCartOpenMobile ? "fixed inset-0 w-full" : "hidden md:flex"}
      `}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0 bg-slate-50/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 bg-white border shadow-sm rounded-xl text-slate-700 font-bold active:scale-95 transition"
              onClick={() => setIsCartOpenMobile(false)}
            >
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-xl font-black text-slate-800">
              {activeTable?.name}
            </h2>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-rose-500 hover:bg-rose-50 p-2.5 rounded-xl transition border border-transparent hover:border-rose-100 active:scale-95"
              title="Adisyonu İptal Et"
            >
              <Trash2 size={22} />
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 shrink bg-slate-50/30">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="bg-slate-100 p-6 rounded-full">
                <ShoppingCart size={48} className="text-slate-300" />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg text-slate-500">Masa Boş</p>
                <p className="text-sm font-medium mt-1">
                  Ürün seçerek siparişe başlayın.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col p-4 border rounded-2xl shadow-sm bg-white"
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <span className="font-bold text-slate-800 text-lg leading-tight">
                      {item.product.name}
                    </span>
                    <span className="font-black text-slate-900 text-lg shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md text-sm border">
                      {formatPrice(item.product.price)} / adet
                    </span>

                    <div className="flex items-center bg-slate-100 rounded-xl p-1 border shadow-inner">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-2 md:p-1.5 hover:bg-white rounded-lg text-slate-700 transition shadow-sm active:scale-95"
                      >
                        <Minus size={20} />
                      </button>
                      <span className="w-12 text-center font-black text-slate-800 text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-2 md:p-1.5 hover:bg-white rounded-lg text-slate-700 transition shadow-sm active:scale-95"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Section */}
        <div className="p-5 border-t border-slate-200 bg-white shrink-0 pb-8 md:pb-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-600 font-bold text-lg">
              Toplam Tutar
            </span>
            <span className="text-3xl font-black text-sky-600 tracking-tight">
              {formatPrice(cartTotal)}
            </span>
          </div>
          {currentUser.role === "admin" ? (
            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-4 md:py-5 rounded-2xl flex items-center justify-center gap-2 text-xl shadow-lg transition active:scale-[0.98]"
            >
              <Banknote size={26} />
              <span className="tracking-wide">HESABI KAPAT</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setActiveTableId(null);
                setIsCartOpenMobile(false);
              }}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 md:py-5 rounded-2xl flex items-center justify-center gap-2 text-xl shadow-lg transition active:scale-[0.98]"
            >
              <ArrowLeft size={26} />
              <span className="tracking-wide">SİPARİŞİ ONAYLA</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-800">
                Yeni Ürün Ekle
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={handleAddProduct}
              className="p-5 flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="Örn: Çikolatalı Pasta"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Fiyat (₺)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProduct.price || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: Number(e.target.value),
                    })
                  }
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Kategori
                </label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, categoryId: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium transition appearance-none bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-3.5 rounded-xl mt-2 transition active:scale-[0.98] shadow-md"
              >
                EKLE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
