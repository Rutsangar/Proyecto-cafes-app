import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Moon, LogOut, Key, Clock, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export default function ConfiguracionCliente({ usuarioInicial }: { usuarioInicial?: any }) {
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();

  const [clave, setClave] = useState(''); 
  const [mostrarClave, setMostrarClave] = useState(false);
  const [turno, setTurno] = useState(usuarioInicial?.turno || 'Mañana');

  return (
    <div className={cn(
      "min-h-screen p-6 transition-colors duration-500",
      isDark ? "bg-[#1A120B]" : "bg-[#FDF8F3]"
    )}>
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className={cn(
            "p-2 rounded-full shadow-sm active:scale-95 transition-all",
            isDark ? "bg-[#2C221C] text-[#F5EBDC]" : "bg-white text-[#4E342E]"
          )}
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className={cn("text-2xl font-bold", isDark ? "text-[#F5EBDC]" : "text-[#4E342E]")}>
          Mi Perfil
        </h1>
      </header>

      <div className="space-y-4">
        {/* TARJETA IDENTIDAD */}
        <div className={cn(
          "p-6 rounded-[2.5rem] flex items-center gap-4 shadow-sm",
          isDark ? "bg-[#2C221C]" : "bg-white"
        )}>
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <User size={32} />
          </div>
          <div>
            <p className="text-xs opacity-50 font-medium">Estudiante / Docente</p>
            <p className={cn("text-lg font-bold", isDark ? "text-[#F5EBDC]" : "text-[#4E342E]")}>
              {usuarioInicial?.nombre || 'Usuario Invitado'}
            </p>
          </div>
        </div>

        {/* INFO EDITABLE */}
        <div className={cn(
          "rounded-[2.5rem] shadow-sm overflow-hidden",
          isDark ? "bg-[#2C221C]" : "bg-white"
        )}>
          <div className="p-5 flex items-center gap-4 border-b border-black/5 dark:border-white/5">
            <Key className="text-amber-500 shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold">Clave Docente / ID</p>
              <div className="flex items-center gap-2">
                <input 
                  type={mostrarClave ? "text" : "password"}
                  value={clave}
                  placeholder="Introduce tu clave"
                  onChange={(e) => setClave(e.target.value)}
                  className={cn(
                    "bg-transparent font-bold outline-none w-full",
                    isDark ? "text-[#F5EBDC]" : "text-[#4E342E]"
                  )}
                />
                <button onClick={() => setMostrarClave(!mostrarClave)} className="p-1 opacity-50">
                  {mostrarClave ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 flex items-center gap-4 relative">
            <Clock className="text-green-500 shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold">Turno asignado</p>
              <div className="relative flex items-center">
                <select 
                  value={turno}
                  onChange={(e) => setTurno(e.target.value)}
                  className={cn(
                    "bg-transparent font-bold outline-none w-full appearance-none cursor-pointer pr-8 z-10",
                    isDark ? "text-[#F5EBDC]" : "text-[#4E342E]"
                  )}
                >
                  <option value="Mañana" className="text-black">Mañana</option>
                  <option value="Tarde" className="text-black">Tarde</option>
                  <option value="Noche" className="text-black">Noche</option>
                </select>
                <ChevronDown size={18} className="absolute right-0 pointer-events-none opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* SWITCH MODO OSCURO (ACTUALIZADO) */}
        <button 
          type="button"
          onClick={() => setIsDark(!isDark)} // Ahora el clic está en toda la tarjeta
          className={cn(
            "w-full p-6 rounded-[2.5rem] flex items-center justify-between shadow-sm active:scale-[0.98] transition-all",
            isDark ? "bg-[#2C221C]" : "bg-white"
          )}
        >
          <div className="flex items-center gap-4 pointer-events-none">
            <Moon className={isDark ? "text-indigo-400" : "text-indigo-600"} size={24} />
            <span className={cn("font-bold", isDark ? "text-[#F5EBDC]" : "text-[#4E342E]")}>
              Modo Oscuro
            </span>
          </div>
          
          <div className="relative w-14 h-7 pointer-events-none">
            <div className={cn(
              "w-full h-full rounded-full transition-colors duration-300",
              isDark ? "bg-indigo-600" : "bg-gray-300"
            )} />
            <div className={cn(
              "absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md",
              isDark ? "translate-x-8" : "translate-x-1"
            )} />
          </div>
        </button>

        {/* BOTÓN CERRAR SESIÓN */}
        <button 
          onClick={() => navigate('/')}
          className={cn(
            "w-full p-6 rounded-[2.5rem] flex items-center gap-4 shadow-sm active:scale-95 transition-all text-left",
            isDark ? "bg-[#2C221C]" : "bg-white"
          )}
        >
          <LogOut className="text-red-500" size={24} />
          <span className="font-bold text-red-500">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}