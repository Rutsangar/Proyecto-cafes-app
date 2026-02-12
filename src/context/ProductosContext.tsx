import { createContext, useContext, useState, ReactNode } from 'react';
import { productos as productosIniciales } from '../lib/data';


// 1. Añadimos 'disponible' a la interfaz
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  img: string;
  disponible?: boolean; // <--- AÑADIR ESTO (opcional para que no de error con datos viejos)
}


interface ProductosContextType {
  listaProductos: Producto[];
  anadirProducto: (nuevo: Omit<Producto, 'id'>) => void;
  eliminarProducto: (id: number) => void;
  actualizarProducto: (id: number, nuevosDatos: Partial<Producto>) => void; // <--- AÑADIR ESTO
}


const ProductosContext = createContext<ProductosContextType | undefined>(undefined);


export function ProductosProvider({ children }: { children: ReactNode }) {
  const [listaProductos, setListaProductos] = useState<Producto[]>(productosIniciales);


  const anadirProducto = (nuevo: Omit<Producto, 'id'>) => {
    const nuevoProducto = {
      ...nuevo,
      id: Date.now(),
      disponible: true, // <--- Por defecto, los nuevos productos están disponibles
    };
    setListaProductos((prev) => [...prev, nuevoProducto]);
  };


  const eliminarProducto = (id: number) => {
    setListaProductos((prev) => prev.filter(p => p.id !== id));
  };


  // --- ESTA ES LA FUNCIÓN QUE TE FALTABA ---
  const actualizarProducto = (id: number, nuevosDatos: Partial<Producto>) => {
    setListaProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...nuevosDatos } : p))
    );
  };


  return (
    <ProductosContext.Provider
      value={{
        listaProductos,
        anadirProducto,
        eliminarProducto,
        actualizarProducto // <--- PASARLA AQUÍ
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
}


export function useProductos() {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error('useProductos debe usarse dentro de un ProductosProvider');
  }
  return context;
}
