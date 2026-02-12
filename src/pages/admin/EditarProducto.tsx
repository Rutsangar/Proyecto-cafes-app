import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Check, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useProductos } from '../../context/ProductosContext';
import { useTheme } from '../../context/ThemeContext';

export default function EditarProducto() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const { actualizarProducto } = useProductos();

  // Recuperamos el producto que viene desde la navegación
  const productoAEditar = location.state?.producto;

  // Si por algún motivo no hay producto, volvemos atrás
  if (!productoAEditar) {
    navigate('/admin/menu-gestion');
    return null;
  }

  const [formData, setFormData] = useState(productoAEditar);
  const [mostrarModal, setMostrarModal] = useState(false);

  const listaCategorias = ['Bocadillo', 'Bebidas frías', 'Bebida caliente', 'Bollería', 'Pack/Menú'];
  const listaAlergenos = ['Gluten', 'Crustáceos', 'Huevo', 'Pescado', 'Cacahuetes', 'Soja', 'Leche', 'Frutos con cáscara', 'Apio', 'Mostaza', 'Granos de sésamo', 'Dióxido de azufre y sulfitos', 'Altramuces', 'Moluscos'];
  const listaIngredientes = ['Chorizo', 'Salchichón', 'Queso', 'Jamón York', 'Pechuga de pavo'];
  const listaTamanos = ['Entero', 'Medio'];

  const esFormularioValido = formData.nombre.trim() !== '' && formData.precio > 0;

  const ajustarPrecio = (cantidad: number) => {
    setFormData((prev: any) => ({
      ...prev,
      precio: Math.max(0, parseFloat((prev.precio + cantidad).toFixed(2)))
    }));
  };

  const toggleSelection = (campo: 'alergenos' | 'ingredientes', valor: string) => {
    setFormData((prev: any) => {
      const listaActual = prev[campo] || [];
      if (listaActual.includes(valor)) {
        return { ...prev, [campo]: listaActual.filter((item: string) => item !== valor) };
      } else {
        return { ...prev, [campo]: [...listaActual, valor] };
      }
    });
  };

  const handleGuardar = () => {
    if (esFormularioValido) {
      actualizarProducto({
        ...formData,
        ingredientes: formData.categoria === 'Bocadillo' ? formData.ingredientes : [],
        tamano: formData.categoria === 'Bocadillo' ? formData.tamano : undefined,
      });
      setMostrarModal(true);
    }
  };

  const colores = {
    fondo: isDark ? '#1A120B' : '#FDF8F3',
    input: isDark ? '#2C1F14' : '#FFFFFF',
    borde: isDark ? '#423224' : '#E5E7EB',
    texto: isDark ? '#F5EBDC' : '#4B3F35',
    label: isDark ? '#D4B996' : '#6F4E37'
  };

  return (
    <div className="min-h-screen p-6 pb-32 flex flex-col transition-all duration-300" style={{ backgroundColor: colores.fondo }}>
      
      {/* MODAL DE ÉXITO (Diseño Moderno) */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-xs flex flex-col items-center text-center shadow-2xl animate-in zoom-in-90 duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="text-green-500" size={40} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-bold text-[#4E342E] mb-2">¡Actualizado!</h2>
            <p className="text-gray-500 mb-8 leading-tight">Los cambios se han guardado correctamente.</p>
            <button
              onClick={() => navigate('/admin/menu-gestion')}
              className="w-full bg-[#8D6E63] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <ShoppingBag size={20} />
              Continuar
            </button>
          </div>
        </div>
      )}

      <header className="flex items-center mb-8 relative">
        <Link to="/admin/menu-gestion" className="absolute left-0 p-2 -ml-2" style={{ color: colores.texto }}>
          <ChevronLeft size={28} />
        </Link>
        <h1 className="w-full text-center text-2xl font-bold" style={{ color: colores.texto }}>Editar producto</h1>
      </header>

      <div className="space-y-6 flex-1">
        {/* NOMBRE */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>Nombre del producto</label>
          <input
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            style={{ backgroundColor: colores.input, borderColor: colores.borde, color: colores.texto }}
            className="w-full border rounded-xl px-4 py-4 outline-none transition-all"
          />
        </div>

        {/* PRECIO */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>Precio (€)</label>
          <div className="flex items-center justify-between p-2 rounded-2xl border" style={{ backgroundColor: colores.input, borderColor: colores.borde }}>
            <button onClick={() => ajustarPrecio(-0.50)} className="p-4 rounded-xl active:scale-90 transition-transform" style={{ backgroundColor: isDark ? '#1A120B' : '#F3F4F6', color: colores.texto }}>
              <Minus size={24} />
            </button>
            <span className="text-3xl font-black" style={{ color: colores.texto }}>{formData.precio.toFixed(2)}€</span>
            <button onClick={() => ajustarPrecio(0.50)} className="p-4 rounded-xl active:scale-90 transition-transform" style={{ backgroundColor: isDark ? '#1A120B' : '#F3F4F6', color: colores.texto }}>
              <Plus size={24} />
            </button>
          </div>
        </div>

        {/* CATEGORÍA */}
        <div>
          <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>Categoría</label>
          <div className="relative">
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({...formData, categoria: e.target.value})}
              style={{ backgroundColor: colores.input, borderColor: colores.borde, color: colores.texto }}
              className="w-full border rounded-xl px-4 py-4 outline-none appearance-none"
            >
              {listaCategorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronLeft size={20} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none -rotate-90" style={{ color: colores.label }} />
          </div>
        </div>

        {/* BOCADILLO EXTRA */}
        {formData.categoria === 'Bocadillo' && (
          <div className="p-5 rounded-2xl border space-y-6" style={{ backgroundColor: isDark ? 'rgba(111, 78, 55, 0.1)' : 'rgba(111, 78, 55, 0.05)', borderColor: colores.borde }}>
            <div>
               <label className="block text-sm font-bold mb-3" style={{ color: colores.label }}>Tamaño</label>
               <div className="flex gap-3">
                  {listaTamanos.map(tam => (
                    <button
                      key={tam}
                      onClick={() => setFormData((prev:any) => ({ ...prev, tamano: tam }))}
                      style={{
                        backgroundColor: formData.tamano === tam ? '#6F4E37' : colores.fondo,
                        borderColor: formData.tamano === tam ? '#6F4E37' : colores.borde,
                        color: formData.tamano === tam ? '#FFFFFF' : colores.texto
                      }}
                      className="flex-1 py-3 rounded-xl text-sm font-bold border"
                    >
                      {tam}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* ALÉRGENOS */}
        <div>
           <label className="block text-sm font-bold mb-2 ml-1" style={{ color: colores.label }}>Alérgenos</label>
           <div className="flex flex-wrap gap-2">
              {listaAlergenos.map(alg => {
                const isSelected = formData.alergenos?.includes(alg);
                return (
                  <button
                    key={alg}
                    onClick={() => toggleSelection('alergenos', alg)}
                    style={{
                      backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.2)' : colores.input,
                      borderColor: isSelected ? '#22C55E' : colores.borde,
                      color: isSelected ? (isDark ? '#4ADE80' : '#166534') : colores.texto
                    }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2"
                  >
                    {isSelected && <CheckCircle2 size={14} />} {alg}
                  </button>
                );
              })}
           </div>
        </div>
      </div>

      {/* BOTÓN GUARDAR CAMBIOS */}
      <div className="mt-10 mb-6 shrink-0">
        <button
          onClick={handleGuardar}
          disabled={!esFormularioValido}
          style={{
            backgroundColor: esFormularioValido ? '#6F4E37' : '#D1D5DB',
            color: '#FFFFFF',
          }}
          className="w-full text-xl font-bold py-5 rounded-2xl transition-all active:scale-95 shadow-lg"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}