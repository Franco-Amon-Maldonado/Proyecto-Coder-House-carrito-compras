export function formatearDineroARPesos(dinero) {
    const formatoPesos = {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    };
    
    return dinero.toLocaleString('es-AR', formatoPesos);
  }