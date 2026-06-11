import React, { useState, useMemo } from 'react';
import { CATEGORIES } from './data';
import { Product } from './types';
import { Utensils, Croissant, IceCream, CupSoda, Info, Search, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

interface CustomerMenuProps {
  products: Product[];
}

export default function CustomerMenu({ products }: CustomerMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState("");

  const activeProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.categoryId === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 font-sans flex flex-col selection:bg-rose-200">
      {/* Hero Section */}
      <header className="relative bg-slate-900 text-white pt-16 pb-24 px-6 overflow-hidden shrink-0 shadow-2xl">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-rose-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute -left-20 top-20 w-72 h-72 bg-sky-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/10"
          >
            <Coffee size={32} className="text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          >
            Lezzet Menüsü
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
            className="text-slate-300 font-medium text-lg max-w-md"
          >
            Taptaze ürünler, özenle hazırlanan kahveler ve çok daha fazlası.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md mt-10 relative group"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-slate-400 px-12 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/15 transition-all text-lg shadow-inner"
            />
          </motion.div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl mx-auto w-full -mt-10 relative z-20 px-4 md:px-8 pb-16">
        
        {/* Categories Tab */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 p-2 mb-8 flex gap-2 overflow-x-auto border border-slate-100" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl whitespace-nowrap font-bold transition-all flex-shrink-0 ${
              activeCategory === 'all'
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <span>Tümü</span>
          </button>
          
          {CATEGORIES.map((category) => {
            const Icon = iconMap[category.iconName] || Utensils;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl whitespace-nowrap font-bold transition-all flex-shrink-0 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                    : "bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon size={18} className={isActive ? "text-indigo-400" : ""} />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {activeProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl border border-slate-100 border-dashed text-slate-400 shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Info size={32} className="text-slate-300" />
            </div>
            <p className="font-bold text-xl text-slate-600 mb-1">Ürün bulunamadı</p>
            <p className="text-slate-500 text-center max-w-sm">Arama kriterlerinize veya seçili kategoriye uygun ürün bulunmuyor. Lütfen farklı bir arama yapmayı deneyin.</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode='popLayout'>
              {activeProducts.map((product) => {
                const category = CATEGORIES.find(c => c.id === product.categoryId);
                const Icon = category ? (iconMap[category.iconName] || Utensils) : Utensils;
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
                    key={product.id}
                    className="group bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 border border-slate-100 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden relative"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 opacity-0 rounded-bl-full pointer-events-none transition-all duration-500 group-hover:opacity-10 scale-150 group-hover:scale-100 translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 ${product.colorClass}`}></div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className={`p-4 rounded-2xl transition-colors duration-300 shadow-sm ${product.colorClass}`}>
                        <Icon size={24} />
                      </div>
                      <div className="font-black text-2xl text-slate-800 tracking-tighter tabular-nums bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="font-bold text-xl text-slate-800 mb-1.5 group-hover:text-slate-900 transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${product.colorClass}`}>
                          {category?.name}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      
      <footer className="text-center py-10 px-6 text-slate-400 text-sm font-medium border-t border-slate-200 bg-white mt-auto">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
             <Coffee size={14} className="text-slate-500" />
          </div>
          <span className="font-bold text-slate-700 text-base">My Cafe</span>
        </div>
        <p>© {new Date().getFullYear()} Tüm hakları saklıdır.</p>
        <p className="mt-1 text-slate-300 hover:text-slate-400 transition-colors">qr-menu-system</p>
      </footer>
    </div>
  );
}
