import { useNavigate } from 'react-router-dom';
import ConfiguracionBase from '../../components/ConfiguracionBase';

export default function AjustesAdmin() {
  const navigate = useNavigate();

  // Todo el contenido visual DEBE ir dentro de este único return
  return (
    <ConfiguracionBase
      rol="Administrador"
      nombreUsuario="Administrador"
    />
  );
}