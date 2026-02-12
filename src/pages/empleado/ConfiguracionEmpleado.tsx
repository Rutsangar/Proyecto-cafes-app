import { Link, useNavigate } from 'react-router-dom';
import ConfiguracionBase from '../../components/ConfiguracionBase';

export default function ConfigEmpleado() {
  const navigate = useNavigate();
  return <ConfiguracionBase 
  rol="Empleado" 
  nombreUsuario="Personal de Barra"
  />;
}