import { Category, Product } from './types';

export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Çiğköfte', iconName: 'Utensils' },
  { id: 'c2', name: 'Pastane', iconName: 'Croissant' },
  { id: 'c3', name: 'Dondurma', iconName: 'IceCream' },
  { id: 'c4', name: 'İçecekler', iconName: 'CupSoda' },
];

export const INITIAL_PRODUCTS: Product[] = [
  // Çiğköfte
  { id: 'p1', categoryId: 'c1', name: 'Çiğköfte Dürüm', price: 60, stock: 150, colorClass: 'bg-rose-100 border-rose-300 text-rose-800' },
  { id: 'p2', categoryId: 'c1', name: 'Çiğköfte Porsiyon', price: 90, stock: 100, colorClass: 'bg-rose-100 border-rose-300 text-rose-800' },
  { id: 'p3', categoryId: 'c1', name: 'Mega Dürüm', price: 80, stock: 80, colorClass: 'bg-rose-100 border-rose-300 text-rose-800' },
  { id: 'p4', categoryId: 'c1', name: '1 Kg Çiğköfte', price: 250, stock: 20, colorClass: 'bg-rose-100 border-rose-300 text-rose-800' },

  // Pastane
  { id: 'p5', categoryId: 'c2', name: 'Sade Poğaça', price: 15, stock: 200, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p6', categoryId: 'c2', name: 'Kaşarlı Poğaça', price: 20, stock: 120, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p7', categoryId: 'c2', name: 'Sokak Simidi', price: 15, stock: 150, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },
  { id: 'p8', categoryId: 'c2', name: 'Yaş Pasta', price: 350, stock: 10, colorClass: 'bg-amber-100 border-amber-300 text-amber-800' },

  // Dondurma
  { id: 'p9', categoryId: 'c3', name: 'Külah Dondurma', price: 40, stock: 300, colorClass: 'bg-pink-100 border-pink-300 text-pink-800' },
  { id: 'p10', categoryId: 'c3', name: 'Kutu (500g)', price: 150, stock: 50, colorClass: 'bg-pink-100 border-pink-300 text-pink-800' },
  { id: 'p11', categoryId: 'c3', name: 'Kutu (1kg)', price: 280, stock: 30, colorClass: 'bg-pink-100 border-pink-300 text-pink-800' },

  // İçecekler
  { id: 'p12', categoryId: 'c4', name: 'Ayran', price: 20, stock: 250, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p13', categoryId: 'c4', name: 'Şalgam Suyu', price: 25, stock: 120, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p14', categoryId: 'c4', name: 'Su (0.5L)', price: 10, stock: 500, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
  { id: 'p15', categoryId: 'c4', name: 'Kutu Kola', price: 40, stock: 150, colorClass: 'bg-blue-100 border-blue-300 text-blue-800' },
];
