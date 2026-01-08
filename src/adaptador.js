// adaptador.js
import { SEGUIMIENTO_GESTANTES } from './SEGUIMIENTO_GESTANTES.js';

export const pacientesFormateados = SEGUIMIENTO_GESTANTES.map(gestante => {
    
    // 1. Procesar controles (igual que antes)
    const controles = [];
    for (let i = 1; i <= 15; i++) {
        if (gestante[`CPN_${i}`]) {
            controles.push({
                numero: i,
                fecha: gestante[`CPN_${i}`],
                responsable: gestante[`ATENDIO_${i}`],
                peso: gestante[`PESO_${i}`],
                talla: gestante[`TALLA_${i}`],
                hb: gestante[`HB_${i}`]
            });
        }
    }

    // Ordenar controles por fecha (opcional pero recomendado)
    // controles.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const ultimoControl = controles.length > 0 ? controles[controles.length - 1] : {};

    // 2. RETORNAR OBJETO COMPATIBLE CON TU APP.JSX
    return {
        id: gestante.n,
        // Nombres que tu App ya usa:
        nombre: gestante.Nombre_P,
        dni: String(gestante.N_DNI_HIS),
        hc: String(gestante.HC),
        fecNac: gestante.FECHA_NAC, // CAMBIO: App usa 'fecNac'
        edad: gestante.Edad,
        direccion: gestante.Domicilio,
        estOrigen: gestante.IPRESS_HIS, // CAMBIO: App usa 'estOrigen'
        sexo: 'F', // Como es base de gestantes, asumimos Femenino
        
        // Datos para las funciones inteligentes
        historialEst: [gestante.IPRESS_HIS], // Para detectar si es continuador
        last_fur: '', // Si tu Excel tiene columna FUR, ponla aquí: gestante.FUR
        
        // Datos del último control para llenar historial
        last_peso: ultimoControl.peso,
        last_talla: ultimoControl.talla,
        last_hb: ultimoControl.hb,
        
        // Guardamos la lista completa por si acaso
        historialControles: controles
    };
});