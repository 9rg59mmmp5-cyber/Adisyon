import React, { useState, useMemo } from 'react';
import { Utensils, Croissant, IceCream, CupSoda, Plus, Minus, Trash2, ShoppingCart, RefreshCcw, Banknote } from 'lucide-react';
import { CATEGORIES, INITIAL_PRODUCTS } from './data';
import { Product, CartItem } from './types';

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
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(CATEGORIES[0].id);
  const [isCartOpenMobile, setIsCartOpenMobile] = useState(false);

  const activeProducts = useMemo(() => {
    return products.filter(p => p.categoryId === activeCategory);
  }, [products, activeCategory]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      if (product.stock > 0) {
        return [...prev, { product, quantity: 1 }];
      }
      return prev;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (!existing) return prev;

      const newQuantity = existing.quantity + delta;
      
      if (newQuantity <= 0) {
        return prev.filter(item => item.product.id !== productId);
      }
      
      if (newQuantity > existing.product.stock) {
        return prev;
      }

      return prev.map(item => 
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    setProducts(prevProducts => prevProducts.map(p => {
      const inCart = cart.find(c => c.product.id === p.id);
      if (inCart) {
        return { ...p, stock: p.stock - inCart.quantity };
      }
      return p;
    }));
    
    setCart([]);
    setIsCartOpenMobile(false);
    alert("Ödeme başarıyla alındı. Adisyon kapatıldı!");
  };

  const clearCart = () => {
    if (confirm("Mevcut siparişi iptal etmek istediğinize emin misiniz?")) {
      setCart([]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden select-none">
      
      {/* LEFT PANEL: PRODUCTS */}
      <div className={`flex-1 flex flex-col h-[100dvh] bg-slate-50 ${isCartOpenMobile ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
           <div>
             <h1 className="text-2xl font-black text-slate-800 tracking-tight">Hızlı Adisyon</h1>
             <p className="text-sm font-medium text-slate-500">POS & Stok Yönetimi</p>
           </div>
           
           <div className="flex gap-3">
             <button title="Stokları Sıfırla" onClick={() => setProducts(INITIAL_PRODUCTS)} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition shadow-sm border border-slate-200 active:scale-95">
                <RefreshCcw size={20} />
             </button>
             {/* Mobile Cart Toggle */}
             <button 
               className="md:hidden relative p-3 px-4 bg-sky-600 text-white rounded-xl shadow-md flex items-center gap-2 font-bold active:scale-95"
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
        <div className="bg-white/80 backdrop-blur-md px-4 py-3 border-b flex gap-2 overflow-x-auto shrink-0 touch-pan-x">
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
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4">
            {activeProducts.map(product => {
              const inCartItem = cart.find(c => c.product.id === product.id);
              const remainingStock = product.stock - (inCartItem?.quantity || 0);
              const isOutOfStock = remainingStock <= 0;

              return (
                <button
                  key={product.id}
                  disabled={isOutOfStock}
                  onClick={() => handleAddToCart(product)}
                  className={`
                    relative flex flex-col items-start p-4 md:p-5 rounded-2xl shadow-sm border transition active:scale-[0.98] h-32 md:h-36
                    ${isOutOfStock ? 'opacity-50 grayscale bg-slate-100 border-slate-200 cursor-not-allowed' : `${product.colorClass} hover:shadow-md cursor-pointer`}
                  `}
                >
                  <span className="absolute top-3 right-3 text-xs md:text-sm font-bold bg-white/60 px-2 py-1 rounded-lg backdrop-blur-sm shadow-sm border border-white/40">
                    {remainingStock} adet
                  </span>
                  
                  <span className="text-base md:text-lg font-bold mt-auto leading-tight text-left pr-4">
                    {product.name}
                  </span>
                  <span className="text-lg md:text-xl font-black mt-1 opacity-90">
                    {formatPrice(product.price)}
                  </span>
                  {
                    inCartItem && (
                      <span className="absolute -top-2 -left-2 bg-sky-600 text-white font-black w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-[3px] border-white shadow-md z-10 text-sm md:text-base">
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
        md:w-96 lg:w-[420px] bg-white border-l border-slate-200 flex flex-col h-[100dvh] shadow-2xl z-20 
        ${isCartOpenMobile ? 'fixed inset-0 w-full' : 'hidden md:flex'}
      `}>
        {/* Cart Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0 bg-slate-50/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 bg-white border shadow-sm rounded-xl text-slate-700 font-bold active:scale-95" onClick={() => setIsCartOpenMobile(false)}>
              Kapat
            </button>
            <h2 className="text-xl font-black text-slate-800">Adisyon</h2>
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
                 <p className="font-bold text-lg text-slate-500">Adisyon Boş</p>
                 <p className="text-sm font-medium mt-1">Ürün seçerek siparişe başlayın.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cart.map(item => (
                <div key={item.product.id} className="flex flex-col p-4 border rounded-2xl shadow-sm bg-white">
                   <div className="flex justify-between items-start mb-3">
                     <span className="font-bold text-slate-800 text-lg leading-tight">{item.product.name}</span>
                     <span className="font-black text-slate-900 text-lg">{formatPrice(item.product.price * item.quantity)}</span>
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
                         disabled={item.quantity >= item.product.stock}
                         className={`p-2 md:p-1.5 rounded-lg transition active:scale-95 shadow-sm ${item.quantity >= item.product.stock ? 'opacity-30 text-slate-400 cursor-not-allowed' : 'hover:bg-white text-slate-700'}`}
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
            <span className="tracking-wide">ÖDEME AL</span>
          </button>
        </div>

      </div>
    </div>
  )
}

