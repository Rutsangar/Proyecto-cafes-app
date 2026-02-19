import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle, ShoppingBag } from 'lucide-react';
import { productos } from '../lib/data';
import { UiButton } from '../components/ui/Button';
import { useCarrito } from '../context/CarritoContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';


export default function DetalleProducto() {
  const { id } = useParams();
  const { anadirProducto } = useCarrito();
  const { isDark } = useTheme();


  const producto = productos.find(p => p.id === Number(id));


  // ESTADOS 
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<string[]>([]);
  const [tamanoSeleccionado, setTamanoSeleccionado] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);


  if (!producto) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-cafe-text">
        <p>Producto no encontrado</p>
        <Link to="/menu" className="text-cafe-primary font-bold mt-4">Volver al menú</Link>
      </div>
    );
  }


  // CONFIGURACIÓN 
  const listaExtras = producto.categoria === 'Bebida caliente'
    ? ['Para llevar (+0.10€)']
    : producto.categoria === 'Bocadillo'
    ? ['Sin extras', 'Queso (+0.50€)', 'Tomate y lechuga (+0.30€)', 'Pan especial (+0.20€)']
    : ['Sin extras'];


  // Lógica de precios del producto
  const precioEnteroReal = producto.precioEntero || producto.precio;
  const precioMedioReal = producto.precioMedio || (producto.precio / 2);


  const opcionesTamano = producto.categoria === 'Bocadillo' ? [
      { label: 'Entero', precio: precioEnteroReal },
      { label: 'Medio', precio: precioMedioReal }
  ] : [];


  const obtenerPrecioExtra = (textoExtra: string) => {
    const match = textoExtra.match(/\+(\d+\.\d+)€/);
    return match ? parseFloat(match[1]) : 0;
  };


  // CÁLCULO DEL PRECIO REAL 
  let precioBaseCalculado = producto.precio;
  
  if (producto.categoria === 'Bocadillo') {
      if (tamanoSeleccionado === 'Entero') precioBaseCalculado = precioEnteroReal;
      else if (tamanoSeleccionado === 'Medio') precioBaseCalculado = precioMedioReal;
      else precioBaseCalculado = precioEnteroReal;
  }


  const precioTotalExtras = extrasSeleccionados.reduce((total, extra) => {
    return total + obtenerPrecioExtra(extra);
  }, 0);


  const precioTotal = precioBaseCalculado + precioTotalExtras;


  // VALIDACIÓN 
  const esValido =
    (producto.categoria !== 'Bocadillo' || tamanoSeleccionado !== null) &&
    extrasSeleccionados.length > 0;


  const toggleExtra = (extra: string) => {
    const opcionesUnicas = ["Sin extras", "Taza"];
    if (opcionesUnicas.includes(extra)) {
      setExtrasSeleccionados([extra]);
    } else {
      let nuevos = extrasSeleccionados.filter(e => !opcionesUnicas.includes(e));
      if (nuevos.includes(extra)) {
        nuevos = nuevos.filter(e => e !== extra);
      } else {
        nuevos.push(extra);
      }
      if (nuevos.length === 0) {
         setExtrasSeleccionados([]);
      } else {
        setExtrasSeleccionados(nuevos);
      }
    }
  };


  const handleAnadir = () => {
    if (producto && esValido) {
      anadirProducto({
        id: producto.id,
        extras: tamanoSeleccionado ? [tamanoSeleccionado, ...extrasSeleccionados] : extrasSeleccionados,
        precio: precioTotal
      });
      setMostrarConfirmacion(true);
      setTimeout(() => setMostrarConfirmacion(false), 2500);
    }
  };


  return (
    <div className="h-screen overflow-y-auto overscroll-none bg-cafe-bg relative w-full max-w-[600px] mx-auto shadow-2xl transition-colors duration-300">
     
      <div className="relative h-72 w-full shrink-0">
        <img src={producto.img} alt={producto.nombre} className="w-full h-full object-cover" />
        <Link to="/menu" className={cn(
          "absolute top-4 left-4 p-2.5 rounded-full shadow-sm backdrop-blur-sm transition-all active:scale-95",
          "bg-white/90", isDark ? "text-[#1E1611]" : "text-cafe-text"
        )}>
          <ChevronLeft size={24} />
        </Link>
      </div>


      <div className="p-6 -mt-8 bg-cafe-bg rounded-t-[2rem] relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] min-h-full transition-colors duration-300">
       
        <div className="flex justify-between items-start gap-4 mb-2">
            <h1 className="text-2xl font-bold text-cafe-text leading-tight">{producto.nombre}</h1>
            <span className="text-2xl font-black text-cafe-primary whitespace-nowrap">
                 {producto.precio.toFixed(2)}€
            </span>
        </div>
       
        <p className="text-sm text-cafe-text opacity-80 mt-4 leading-relaxed">
          {producto.desc} <br/>
          <span className="block mt-2 italic text-xs opacity-70">
            Nota: Debido al tamaño reducido de nuestra cocina no podemos garantizar la ausencia total de trazas de otros alérgenos.
          </span>
        </p>


        {/* SECCIÓN TAMAÑO */}
        {producto.categoria === 'Bocadillo' && (
          <div className="mt-8 animate-in slide-in-from-left duration-300">
            <h3 className="font-bold text-lg text-cafe-primary mb-4 border-b-2 border-cafe-primary/20 inline-block pb-1">
              Tamaño <span className="text-red-500">*</span>
            </h3>
            <div className="flex gap-4">
              {opcionesTamano.map((opcion) => (
                <button
                  key={opcion.label}
                  onClick={() => setTamanoSeleccionado(opcion.label)}
                  className={cn(
                    "flex-1 py-4 px-2 rounded-2xl border-2 transition-all active:scale-95 flex flex-col items-center justify-center gap-1",
                    tamanoSeleccionado === opcion.label
                      ? "border-[#6F4E37] bg-[#6F4E37] text-white shadow-lg"
                      : "bg-transparent border-cafe-text/20 text-cafe-text/70 hover:border-[#6F4E37]/50 hover:text-cafe-text"
                  )}
                >
                  <span className="text-sm font-bold opacity-90">{opcion.label}</span>
                  <span className="text-3xl font-black tracking-tight">{opcion.precio.toFixed(2)}€</span>
                </button>
              ))}
            </div>
          </div>
        )}


        {/* Sección Extras */}
        <div className="mt-8">
            <h3 className="font-bold text-lg text-cafe-primary mb-4 border-b-2 border-cafe-primary/20 inline-block pb-1">
                Extras <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-4">
                {listaExtras.map((extra, index) => {
                    const isChecked = extrasSeleccionados.includes(extra);
                    return (
                        <label key={index} className="flex items-center gap-4 cursor-pointer group select-none py-1">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    className="peer appearance-none w-8 h-8 rounded-full border-2 border-gray-400 dark:border-gray-600 checked:border-cafe-primary checked:bg-cafe-primary transition-all"
                                    checked={isChecked}
                                    onChange={() => toggleExtra(extra)}
                                />
                                <div className="absolute w-3.5 h-3.5 bg-cafe-bg rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                            <span className={cn(
                                "text-base transition-colors",
                                isChecked ? "text-cafe-primary font-bold" : "text-cafe-text group-hover:text-cafe-primary"
                            )}>
                                {extra}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>

        <div className="mt-8">
            <UiButton
              onClick={handleAnadir}
              disabled={!esValido}
              className={cn(
                "shadow-lg flex justify-between px-8 transition-all",
                !esValido ? "opacity-50 grayscale cursor-not-allowed" : "shadow-cafe-primary/20"
              )}
            >
                <span>
                  {!esValido
                    ? (producto.categoria === 'Bocadillo' && !tamanoSeleccionado
                        ? 'Selecciona tamaño'
                        : 'Selecciona extras')
                    : 'Añadir'}
                </span>
                <span>{precioTotal.toFixed(2)}€</span>
            </UiButton>
        </div>
      </div>


      {/* VENTANA DE CONFIRMACIÓN */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={cn(
            "w-full max-w-xs rounded-3xl p-8 shadow-2xl border text-center animate-in zoom-in-95",
            isDark ? "bg-[#2C221C] border-[#F5EBDC20]" : "bg-white border-[#4E342E10]"
          )}>
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/20 p-4 rounded-full">
                <CheckCircle size={48} className="text-green-500" />
              </div>
            </div>
            <h3 className={cn("text-2xl font-bold mb-2", isDark ? "text-[#F5EBDC]" : "text-[#4E342E]")}>¡Añadido!</h3>
            <p className={cn("text-sm mb-6", isDark ? "text-[#F5EBDC80]" : "text-[#8D6E63]")}>Producto añadido a la cesta correctamente.</p>
            <button onClick={() => setMostrarConfirmacion(false)} className="w-full py-3 bg-[#8D6E63] text-white rounded-xl font-bold shadow-md active:scale-95 flex items-center justify-center gap-2">
              <ShoppingBag size={18} /> Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}