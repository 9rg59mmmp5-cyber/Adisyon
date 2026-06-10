import { Category, Product, Table } from './types';

export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Tatlılar', iconName: 'Croissant' },
  { id: 'c2', name: 'Dondurmalar', iconName: 'IceCream' },
  { id: 'c3', name: 'İçecekler', iconName: 'CupSoda' },
  { id: 'c4', name: 'Çiğköfte', iconName: 'Utensils' },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Tatlılar
  { id: 'p5', categoryId: 'c1', name: 'Sade Poğaça', price: 15, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p6', categoryId: 'c1', name: 'Kaşarlı Poğaça', price: 20, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p7', categoryId: 'c1', name: 'Sokak Simidi', price: 15, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p8', categoryId: 'c1', name: 'Yaş Pasta Porsiyon', price: 80, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p16', categoryId: 'c1', name: 'Baklava Porsiyon', price: 120, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p17', categoryId: 'c1', name: 'Fırın Sütlaç', price: 60, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p22', categoryId: 'c1', name: 'Kazandibi', price: 60, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p23', categoryId: 'c1', name: 'Tiramisu', price: 90, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p27', categoryId: 'c1', name: 'Künefe', price: 110, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p28', categoryId: 'c1', name: 'Profiterol', price: 85, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p29', categoryId: 'c1', name: 'Ekler (Porsiyon)', price: 75, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },

  // Dondurmalar
  { id: 'p9', categoryId: 'c2', name: 'Külah Dondurma', price: 40, colorClass: 'bg-pink-100 border-pink-300 text-pink-800' },
  { id: 'p10', categoryId: 'c2', name: 'Kutu (500g)', price: 150, colorClass: 'bg-pink-100 border-pink-300 text-pink-800' },
  { id: 'p11', categoryId: 'c2', name: 'Kutu (1kg)', price: 280, colorClass: 'bg-pink-100 border-pink-300 text-pink-800' },
  { id: 'p18', categoryId: 'c2', name: 'Dondurmalı İrmik', price: 90, colorClass: 'bg-pink-100 border-pink-300 text-pink-800' },
  { id: 'p24', categoryId: 'c2', name: 'Waffle Dondurma', price: 120, colorClass: 'bg-pink-100 border-pink-300 text-pink-800' },
  { id: 'p30', categoryId: 'c2', name: 'Çikolatalı Külah', price: 45, colorClass: 'bg-pink-100 border-pink-300 text-pink-800' },
  { id: 'p31', categoryId: 'c2', name: 'Meyveli Külah', price: 45, colorClass: 'bg-pink-100 border-pink-300 text-pink-800' },
  { id: 'p32', categoryId: 'c2', name: 'Maraş Kesme', price: 90, colorClass: 'bg-pink-100 border-pink-300 text-pink-800' },

  // İçecekler
  { id: 'p12', categoryId: 'c3', name: 'Ayran', price: 20, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p13', categoryId: 'c3', name: 'Şalgam', price: 25, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p14', categoryId: 'c3', name: 'Su (0.5L)', price: 10, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p15', categoryId: 'c3', name: 'Kola', price: 40, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p19', categoryId: 'c3', name: 'Limonata', price: 35, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p20', categoryId: 'c3', name: 'Çay', price: 15, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p21', categoryId: 'c3', name: 'Türk Kahvesi', price: 50, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p25', categoryId: 'c3', name: 'Maden Suyu', price: 20, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p26', categoryId: 'c3', name: 'Meyve Suyu', price: 35, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p33', categoryId: 'c3', name: 'Buzlu Kahve', price: 70, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p34', categoryId: 'c3', name: 'Milkshake', price: 80, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },

  // Çiğköfte
  { id: 'p1', categoryId: 'c4', name: 'Çiğköfte Dürüm', price: 60, colorClass: 'bg-rose-100 border-rose-300 text-rose-800' },
  { id: 'p2', categoryId: 'c4', name: 'Çiğköfte Porsiyon', price: 90, colorClass: 'bg-rose-100 border-rose-300 text-rose-800' },
  { id: 'p3', categoryId: 'c4', name: 'Mega Dürüm', price: 80, colorClass: 'bg-rose-100 border-rose-300 text-rose-800' },
  { id: 'p4', categoryId: 'c4', name: '1 Kg Çiğköfte', price: 250, colorClass: 'bg-rose-100 border-rose-300 text-rose-800' },
  { id: 'p35', categoryId: 'c4', name: 'Midye Dolma (10 Adet)', price: 70, colorClass: 'bg-rose-100 border-rose-300 text-rose-800' },
  { id: 'p36', categoryId: 'c4', name: 'İçli Köfte (Adet)', price: 40, colorClass: 'bg-rose-100 border-rose-300 text-rose-800' },
  { id: 'p37', categoryId: 'c4', name: 'Çiğköfte Sushi', price: 110, colorClass: 'bg-rose-100 border-rose-300 text-rose-800' },
];

export const INITIAL_TABLES: Table[] = Array.from({ length: 20 }, (_, i) => ({
  id: `t${i + 1}`,
  name: `Masa ${i + 1}`,
  orders: [],
  status: 'empty'
}));
