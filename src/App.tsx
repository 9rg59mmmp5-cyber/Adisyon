import React, { useState, useMemo } from 'react';
import { Utensils, Croissant, IceCream, CupSoda, Plus, Minus, Trash2, ShoppingCart, RefreshCcw, Banknote, ArrowLeft, Receipt, Coffee, BellRing } from 'lucide-react';
import { CATEGORIES, INITIAL_PRODUCTS, INITIAL_TABLES } from './data';
import { Product, Table, OrderItem } from './types';

const iconMap: Record<string, React.FC<any>> = {
  Utensils,
  Croissant,
  IceCream,
  CupSoda
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
}

export default function App() {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);
  const [isCartOpenMobile, setIsCartOpenMobile] = useState(false);

  const activeTable = useMemo(() => tables.find(t => t.id === activeTableId), [tables, activeTableId]);

  const toggleWaiterStatus = (tableId: string) => {
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, needsWaiter: !t.needsWaiter } : t
    ));
  };

  const activeProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(p => p.categoryId === activeCategory);
  }, [activeCategory]);

  const updateTableOrder = (tableId: string, updater: (orders: OrderItem[]) => OrderItem[]) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        const newOrders = updater(t.orders);
        return { ...t, orders: newOrders, status: newOrders.length > 0 ? 'occupied' : 'empty' };
      }
      return t;
    }));
  };

  const handleAddToCart = (product: Product) => {
    if (!activeTableId) return;
    updateTableOrder(activeTableId, (orders) => {
      const existing = orders.find(item => item.product.id === product.id);
      if (existing) {
        return orders.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...orders, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    if (!activeTableId) return;
    updateTableOrder(activeTableId, (orders) => {
      const existing = orders.find(item => item.product.id === productId);
      if (!existing) return orders;
      const newQuantity = existing.quantity + delta;
      
      if (newQuantity <= 0) {
        return orders.filter(item => item.product.id !== productId);
      }
      return orders.map(item => 
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
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
      updateTableOrder(activeTableId, () => []);
      setActiveTableId(null);
      setIsCartOpenMobile(false);
    }
  };

  const clearCart = () => {
    if (!activeTableId) return;
    if (confirm("Bu masadaki tüm siparişleri iptal etmek istediğinize emin misiniz?")) {
      updateTableOrder(activeTableId, () => []);
    }
  };

  const getTableTotal = (table: Table) => {
    return table.orders.reduce((acc, order) => acc + (order.product.price * order.quantity), 0);
  };

  if (!activeTableId) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
               <Coffee className="text-sky-600" size={32} />
               Masa Adisyon Yönetimi
             </h1>
             <p className="text-slate-500 font-medium">Aktif masaları ve siparişleri takip edin</p>
           </div>
           
           <button 
             onClick={() => {
               if(confirm('Tüm masaları ve kayıtları sıfırlamak istediğinize emin misiniz?')) {
                 setTables(INITIAL_TABLES);
               }
             }}
             className="flex items-center gap-2 bg-white border shadow-sm px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-50 active:scale-95 transition whitespace-nowrap self-start md:self-auto"
           >
             <RefreshCcw size={18} />
             Sistemi Sıfırla
           </button>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-5">
          {tables.map(table => {
            const isOccupied = table.status === 'occupied';
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
                  ${isOccupied 
                    ? 'bg-sky-600 border-sky-700 text-white shadow-sky-600/20 hover:bg-sky-500' 
                    : table.needsWaiter ? 'bg-amber-50 border-amber-300 text-slate-800' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}
                `}
              >
                 {isOccupied && (
                   <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                 )}
                 
                 <div className="font-bold text-lg md:text-xl mb-auto opacity-90">{table.name}</div>
                 
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
                   <div className="text-slate-400 font-medium mt-auto z-10">Boş</div>
                 )}
              </button>
            )
          })}
        </div>
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
      <div className={`flex-1 flex flex-col h-full bg-slate-50 ${isCartOpenMobile ? 'hidden md:flex' : 'flex'}`}>
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
               <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">{activeTable?.name}</h1>
               <p className="text-sm font-medium text-slate-500">Sipariş Ekranı</p>
             </div>
           </div>
           
           <div className="flex gap-2 md:gap-3">
             <button
               onClick={() => {
                 toggleWaiterStatus(activeTableId);
                 if (!activeTable?.needsWaiter) {
                   alert("Garsona kibarca haber verildi. Size en kısa sürede yardımcı olacağız.");
                 }
               }}
               className={`flex relative p-2 md:p-3 md:px-4 rounded-xl shadow-md items-center gap-2 font-bold active:scale-95 transition ${activeTable?.needsWaiter ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-white border text-slate-700 hover:bg-slate-50'}`}
             >
               <BellRing size={22} className={activeTable?.needsWaiter ? 'animate-pulse' : ''} />
               <span className="hidden md:inline">{activeTable?.needsWaiter ? 'Garson Çağrıldı' : 'Garson Çağır'}</span>
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
        <div className="bg-white/80 backdrop-blur-md px-4 py-3 border-b flex gap-2 overflow-x-auto shrink-0 touch-pan-x" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(category => {
            const Icon = iconMap[category.iconName] || Utensils;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap font-bold transition active:scale-95 ${
                  isActive 
                    ? 'bg-sky-600 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <Icon size={20} />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32">
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {activeProducts.map(product => {
              const inCartItem = cart.find(c => c.product.id === product.id);

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
                  {
                    inCartItem && (
                      <span className="absolute top-2 right-2 bg-sky-600 text-white font-black w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 text-xs md:text-sm">
                        {inCartItem.quantity}
                      </span>
                    )
                  }
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: CART */}
      <div className={`
        md:w-96 lg:w-[420px] bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl z-20 
        ${isCartOpenMobile ? 'fixed inset-0 w-full' : 'hidden md:flex'}
      `}>
        {/* Cart Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0 bg-slate-50/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 bg-white border shadow-sm rounded-xl text-slate-700 font-bold active:scale-95 transition" onClick={() => setIsCartOpenMobile(false)}>
              <ArrowLeft size={22} />
            </button>
            <h2 className="text-xl font-black text-slate-800">{activeTable?.name}</h2>
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
                 <p className="text-sm font-medium mt-1">Ürün seçerek siparişe başlayın.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map(item => (
                <div key={item.product.id} className="flex flex-col p-4 border rounded-2xl shadow-sm bg-white">
                   <div className="flex justify-between items-start mb-3 gap-2">
                     <span className="font-bold text-slate-800 text-lg leading-tight">{item.product.name}</span>
                     <span className="font-black text-slate-900 text-lg shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                   </div>
                   
                   <div className="flex items-center justify-between">
                     <span className="text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md text-sm border">{formatPrice(item.product.price)} / adet</span>
                     
                     <div className="flex items-center bg-slate-100 rounded-xl p-1 border shadow-inner">
                       <button
                         onClick={() => updateQuantity(item.product.id, -1)}
                         className="p-2 md:p-1.5 hover:bg-white rounded-lg text-slate-700 transition shadow-sm active:scale-95"
                       >
                         <Minus size={20} />
                       </button>
                       <span className="w-12 text-center font-black text-slate-800 text-lg">{item.quantity}</span>
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
            <span className="text-slate-600 font-bold text-lg">Toplam Tutar</span>
            <span className="text-3xl font-black text-sky-600 tracking-tight">{formatPrice(cartTotal)}</span>
          </div>
          <button
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-4 md:py-5 rounded-2xl flex items-center justify-center gap-2 text-xl shadow-lg transition active:scale-[0.98]"
          >
            <Banknote size={26} />
            <span className="tracking-wide">HESABI KAPAT</span>
          </button>
        </div>

      </div>
    </div>
  )
}
