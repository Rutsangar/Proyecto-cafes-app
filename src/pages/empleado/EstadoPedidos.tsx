import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Añadimos Settings a las importaciones
import { CheckCircle2, Flame, ChevronLeft, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

type EstadoPedido = 'ACEPTADO' | 'EN PREPARACIÓN' | 'FINALIZADO';

interface Pedido {
    id: string;
    cliente: string;
    estado: EstadoPedido;
    items: { nombre: string; precio: number; img: string }[];
}

const pedidosIniciales: Pedido[] = [
    {
        id: "1234",
        cliente: "Pepito de los Palotes",
        estado: "ACEPTADO",
        items: [{ nombre: "Bocadillo un embutido", precio: 1.50, img: "https://via.placeholder.com/50" }]
    },
    {
        id: "5678",
        cliente: "Manolo el del Bombo",
        estado: "ACEPTADO",
        items: [{ nombre: "Bocadillo dos embutidos", precio: 1.70, img: "https://via.placeholder.com/50" }]
    }
];

export default function EstadoPedidos() {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciales);
   
    const location = useLocation();
    const isAdminPath = location.pathname.includes('/admin');

    const cambiarEstado = (id: string, nuevoEstado: EstadoPedido) => {
        setPedidos(prev => prev.map(p =>
            p.id === id ? { ...p, estado: nuevoEstado } : p
        ));
    };

    const getStatusColor = (estado: EstadoPedido) => {
        switch (estado) {
            case 'FINALIZADO': return 'bg-green-500 text-white';
            case 'EN PREPARACIÓN': return 'bg-orange-500 text-white';
            case 'ACEPTADO': return 'bg-gray-500 text-white';
        }
    };

    return (
        <div className={cn(
            "p-6 min-h-screen pb-20 transition-colors duration-300 relative",
            isDark ? "bg-[#1A120B]" : "bg-[#FDF8F3]"
        )}>

            {/* BOTÓN RUEDECITA (Ajustes) */}
            <button 
                onClick={() => navigate(isAdminPath ? '/empleado/configuracion' : '/empleado/configuracion')}
                className={cn(
                    "absolute top-8 right-6 p-2 rounded-full shadow-sm transition-all active:scale-90 z-20",
                    isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white text-cafe-text"
                )}
            >
                <Settings size={24} />
            </button>

            {/* CABECERA CON FLECHA */}
            <div className="flex items-center mb-8 mt-4 relative">
                {isAdminPath && (
                    <button
                        onClick={() => navigate('/admin')}
                        className={cn(
                            "p-2 rounded-full shadow-sm transition-all active:scale-90 absolute left-0 z-10",
                            isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white text-cafe-text"
                        )}
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}
               
                <h1 className={cn(
                    "text-3xl font-bold text-center flex-1",
                    isDark ? "text-[#F5EBDC]" : "text-cafe-text"
                )}>
                    Estado de pedidos
                </h1>
            </div>

            <div className="space-y-6">
                {pedidos.map((pedido, index) => (
                    <div
                        key={pedido.id}
                        style={{
                            backgroundColor: isDark ? '#2C221C' : '#FFFFFF',
                            borderColor: isDark ? '#F5EBDC10' : '#4E342E10'
                        }}
                        className="rounded-3xl overflow-hidden border shadow-sm transition-all animate-in fade-in duration-500"
                    >
                        {/* Cabecera del Pedido */}
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-cafe-primary">Pedido {index + 1}</h3>
                                <p className={cn("text-sm opacity-70", isDark ? "text-[#F5EBDC]" : "text-cafe-text")}>{pedido.cliente}</p>
                                <p className={cn("text-[10px] opacity-40 font-mono", isDark ? "text-[#F5EBDC]" : "text-cafe-text")}>ID: {pedido.id}</p>
                            </div>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black tracking-wider transition-colors duration-300",
                                getStatusColor(pedido.estado)
                            )}>
                                {pedido.estado}
                            </span>
                        </div>

                        {/* Lista de productos */}
                        <div className="p-4 space-y-3">
                            {pedido.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <img src={item.img} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                    <div className="flex-1">
                                        <p className={cn("font-bold text-sm", isDark ? "text-[#F5EBDC]" : "text-cafe-text")}>{item.nombre}</p>
                                        <p className="text-xs text-cafe-primary">{item.precio.toFixed(2)}€</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botones de acción */}
                        <div className="flex border-t border-white/5 bg-black/5">
                            <button
                                onClick={() => cambiarEstado(pedido.id, 'EN PREPARACIÓN')}
                                className={cn(
                                    "flex-1 p-4 text-xs font-bold transition-colors flex items-center justify-center gap-2",
                                    pedido.estado === 'EN PREPARACIÓN' ? "bg-orange-500/20 text-orange-500" : "opacity-60 hover:bg-white/5",
                                    isDark ? "text-[#F5EBDC]" : "text-cafe-text"
                                )}
                            >
                                <Flame size={16} /> Preparar
                            </button>
                            <button
                                onClick={() => cambiarEstado(pedido.id, 'FINALIZADO')}
                                className={cn(
                                    "flex-1 p-4 text-xs font-bold border-l border-white/5 transition-colors flex items-center justify-center gap-2",
                                    pedido.estado === 'FINALIZADO' ? "bg-green-500/20 text-green-500" : "opacity-60 hover:bg-white/5",
                                    isDark ? "text-[#F5EBDC]" : "text-cafe-text"
                                )}
                            >
                                <CheckCircle2 size={16} /> Finalizar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}