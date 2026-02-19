// import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { UiButton } from '../components/ui/Button';
import { UiInput } from '../components/ui/Input';

export default function Registro() {
  // const [rol, setRol] = useState("alumno");

  return (
    <div className="min-h-screen bg-cafe-bg p-6 text-cafe-text font-sans w-full max-w-[600px] mx-auto shadow-2xl shadow-black/5 dark:shadow-black/20">
      
      {/* Cabecera con flecha atrás */}
      <header className="flex items-center mb-8 relative">
        <Link to="/" className="absolute left-0 p-2 -ml-2 text-gray-600">
          <ChevronLeft size={28} />
        </Link>
        <h1 className="w-full text-center text-2xl font-bold">Registro</h1>
      </header>

      <form className="space-y-4 max-w-sm mx-auto flex flex-col h-full">

        <UiInput placeholder="Nombre y apellidos" />
        <UiInput type="email" placeholder="Correo electrónico" />
        <UiInput type="password" placeholder="Contraseña" />
        <UiInput type="password" placeholder="Confirmar contraseña" />

        <div className="pt-6">
          <UiButton>Registrarse</UiButton>
        </div>
      </form>
    </div>
  );
}