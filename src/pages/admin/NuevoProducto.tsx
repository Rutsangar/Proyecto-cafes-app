import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Check, Plus, Minus, ChevronDown } from 'lucide-react';
import { useProductos } from '../../context/ProductosContext';
import { useTheme } from '../../context/ThemeContext';


export default function NuevoProducto() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { anadirProducto } = useProductos();


  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Bocadillo',
    alergenos: [] as string[],
    precio: 0.00, 
    precioEntero: 0.00, 
    precioMedio: 0.00,   
    ingredientes: [] as string[]
  });


  const [mostrandoExito, setMostrandoExito] = useState(false);
  // Nuevo estado para controlar el menú visual
  const [mostrarMenuCategoria, setMostrarMenuCategoria] = useState(false);


  const listaCategorias = ['Bocadillo', 'Bebidas frías', 'Bebida caliente', 'Bollería', 'Pack/Menú'];
  const listaAlergenos = ['Gluten', 'Crustáceos', 'Huevo', 'Pescado', 'Cacahuetes', 'Soja', 'Leche', 'Frutos con cáscara', 'Apio', 'Mostaza', 'Granos de sésamo', 'Dióxido de azufre y sulfitos', 'Altramuces', 'Moluscos'];
  const listaIngredientes = ['Queso', 'Jamón York', 'Pavo cocido'];


  // Validación
  const esFormularioValido = formData.nombre.trim() !== '' && (
    formData.categoria === 'Bocadillo'
      ? (formData.precioEntero > 0 && formData.precioMedio > 0)
      : formData.precio > 0
  );


  const ajustarPrecio = (campo: 'precio' | 'precioEntero' | 'precioMedio', cantidad: number) => {
    setFormData(prev => ({
      ...prev,
      [campo]: Math.max(0, parseFloat((prev[campo] + cantidad).toFixed(2)))
    }));
  };


  const toggleSelection = (campo: 'alergenos' | 'ingredientes', valor: string) => {
    setFormData(prev => {
      const listaActual = prev[campo];
      if (listaActual.includes(valor)) {
        return { ...prev, [campo]: listaActual.filter(item => item !== valor) };
      } else {
        return { ...prev, [campo]: [...listaActual, valor] };
      }
    });
  };


  const handleAñadir = () => {
    if (esFormularioValido) {
      const datosFinales = {
        ...formData,
        precioEntero: formData.categoria === 'Bocadillo' ? formData.precioEntero : undefined,
        precioMedio: formData.categoria === 'Bocadillo' ? formData.precioMedio : undefined,
        ingredientes: formData.categoria === 'Bocadillo' ? formData.ingredientes : [],
        img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=150&auto=format&fit=crop'
      };
      anadirProducto(datosFinales);
      setMostrandoExito(true);
    }
  };


  useEffect(() => {
    if (mostrandoExito) {
      const timer = setTimeout(() => {
        setMostrandoExito(false);
        navigate('/admin/menu-gestion');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [mostrandoExito, navigate]);


  const colores = {
    fondo: isDark ? '#1A120B' : '#F3EFE0',
    input: isDark ? '#2C1F14' : '#FFFFFF',
    borde: isDark ? '#423224' : '#E5E7EB',
    texto: isDark ? '#F5EBDC' : '#4B3F35',
    label: isDark ? '#D4B996' : '#6F4E37'
  };


  // Componente Reutilizable para el Selector de Precio
  const SelectorPrecio = ({ label, valor, onChange }: { label: string, valor: number, onChange: (n: number) => void }) => (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>{label}</label>
      <div className="flex items-center justify-between p-2 rounded-2xl border" style={{ backgroundColor: colores.input, borderColor: colores.borde }}>
        <button onClick={() => onChange(-0.50)} className="p-4 rounded-xl active:scale-90 transition-transform" style={{ backgroundColor: isDark ? '#1A120B' : '#F3F4F6', color: colores.texto }}><Minus size={24} /></button>
        <span className="text-3xl font-black" style={{ color: colores.texto }}>{valor.toFixed(2)}€</span>
        <button onClick={() => onChange(0.50)} className="p-4 rounded-xl active:scale-90 transition-transform" style={{ backgroundColor: isDark ? '#1A120B' : '#F3F4F6', color: colores.texto }}><Plus size={24} /></button>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen p-6 pb-32 flex flex-col transition-all duration-300" style={{ backgroundColor: colores.fondo }}>
      <header className="flex items-center mb-8 relative">
        <Link to="/admin/menu-gestion" className="absolute left-0 p-2 -ml-2" style={{ color: colores.texto }}><ChevronLeft size={28} /></Link>
        <h1 className="w-full text-center text-2xl font-bold" style={{ color: colores.texto }}>Nuevo producto</h1>
      </header>


      <div className="space-y-6 flex-1">
        {/* NOMBRE */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>Nombre del producto</label>
          <input
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            placeholder="Ej. Bocadillo de la casa"
            style={{ backgroundColor: colores.input, borderColor: colores.borde, color: colores.texto }}
            className="w-full border rounded-xl px-4 py-4 outline-none transition-all placeholder:opacity-20"
          />
        </div>


        {/* CATEGORÍA */}
        <div className="relative z-20">
          <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>Categoría</label>
          
          {/* Botón Trigger */}
          <button
            onClick={() => setMostrarMenuCategoria(!mostrarMenuCategoria)}
            className="w-full flex items-center justify-between border rounded-xl px-4 py-4 outline-none transition-all"
            style={{ backgroundColor: colores.input, borderColor: colores.borde, color: colores.texto }}
          >
            <span className="font-medium">{formData.categoria}</span>
            <ChevronDown 
              size={20} 
              style={{ color: colores.label }} 
              className={`transition-transform duration-300 ${mostrarMenuCategoria ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Menú Desplegable */}
          {mostrarMenuCategoria && (
            <div 
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-xl border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
              style={{ backgroundColor: colores.input, borderColor: colores.borde }}
            >
              {listaCategorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFormData({...formData, categoria: cat});
                    setMostrarMenuCategoria(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors hover:brightness-95 dark:hover:brightness-110"
                  style={{ 
                    color: colores.texto,
                    backgroundColor: formData.categoria === cat ? (isDark ? 'rgba(245, 235, 220, 0.05)' : 'rgba(78, 52, 46, 0.05)') : 'transparent'
                  }}
                >
                  {cat}
                  {formData.categoria === cat && <Check size={16} className="text-green-500" />}
                </button>
              ))}
            </div>
          )}
        </div>


        {/* PRECIOS DINÁMICOS */}
        {formData.categoria === 'Bocadillo' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <SelectorPrecio
              label="Precio Entero (€)"
              valor={formData.precioEntero}
              onChange={(n) => ajustarPrecio('precioEntero', n)}
            />
            <SelectorPrecio
              label="Precio Medio (€)"
              valor={formData.precioMedio}
              onChange={(n) => ajustarPrecio('precioMedio', n)}
            />
          </div>
        ) : (
          <SelectorPrecio
            label="Precio (€)"
            valor={formData.precio}
            onChange={(n) => ajustarPrecio('precio', n)}
          />
        )}


        {/* SECCIÓN ESPECIAL BOCADILLOS: INGREDIENTES */}
        {formData.categoria === 'Bocadillo' && (
          <div className="p-5 rounded-2xl border space-y-6 animate-in fade-in zoom-in-95 duration-300"
               style={{ backgroundColor: isDark ? 'rgba(111, 78, 55, 0.1)' : 'rgba(111, 78, 55, 0.05)', borderColor: colores.borde }}>
            <div>
               <label className="block text-sm font-bold mb-3" style={{ color: colores.label }}>Ingredientes principales</label>
               <div className="flex flex-wrap gap-2">
                  {listaIngredientes.map(ing => {
                    const isSelected = formData.ingredientes.includes(ing);
                    return (
                      <button
                        key={ing}
                        onClick={() => toggleSelection('ingredientes', ing)}
                        style={{
                          backgroundColor: isSelected ? '#6F4E37' : colores.fondo,
                          borderColor: isSelected ? '#6F4E37' : colores.borde,
                          color: isSelected ? '#FFFFFF' : colores.texto
                        }}
                        className="px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-2 shadow-sm"
                      >
                        {isSelected && <Check size={14} />} {ing}
                      </button>
                    );
                  })}
               </div>
            </div>
          </div>
        )}

        {/* ALÉRGENOS */}
        <div>
           <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>Alérgenos</label>
           <div className="flex flex-wrap gap-2">
              {listaAlergenos.map(alg => {
                const isSelected = formData.alergenos.includes(alg);
                return (
                  <button
                    key={alg}
                    onClick={() => toggleSelection('alergenos', alg)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.2)' : colores.input,
                      borderColor: isSelected ? '#22C55E' : colores.borde,
                      color: isSelected ? (isDark ? '#4ADE80' : '#166534') : colores.texto
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2"
                  >
                    {isSelected && <CheckCircle2 size={14} />} {alg}
                  </button>
                );
              })}
           </div>
        </div>
      </div>

      <div className="mt-10 mb-6 shrink-0">
        <button
          onClick={handleAñadir}
          disabled={!esFormularioValido}
          style={{
            backgroundColor: esFormularioValido ? '#6F4E37' : (isDark ? '#2C1F14' : '#D1D5DB'),
            color: esFormularioValido ? '#FFFFFF' : (isDark ? 'rgba(245, 235, 220, 0.1)' : '#9CA3AF'),
            boxShadow: esFormularioValido ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
          }}
          className="w-full text-xl font-bold py-5 rounded-2xl transition-all duration-300 active:scale-95"
        >
          Añadir
        </button>
      </div>
    </div>
  );
}