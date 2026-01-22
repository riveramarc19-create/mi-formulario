// --- ARCHIVO: ZScoreData.js ---

// TABLA DE PUNTOS DE CORTE OMS (5 a 19 años)
// Formato: Meses: [ -2SD, -1SD, +1SD, +2SD ]
// Valores aproximados oficiales para IMC para la edad.
const WHO_BOYS = {
    60: [12.1, 13.0, 16.6, 18.2], // 5 años
    72: [12.1, 13.0, 16.8, 18.8], // 6 años
    84: [12.3, 13.1, 17.2, 19.6], // 7 años
    96: [12.4, 13.3, 17.7, 20.6], // 8 años
    108: [12.6, 13.6, 18.4, 21.8], // 9 años
    120: [12.8, 14.0, 19.2, 23.0], // 10 años
    132: [13.1, 14.4, 20.1, 24.5], // 11 años
    144: [13.4, 14.9, 21.0, 26.0], // 12 años
    156: [13.8, 15.4, 21.9, 27.2], // 13 años
    168: [14.3, 16.0, 22.7, 28.2], // 14 años
    180: [14.7, 16.6, 23.5, 29.0], // 15 años
    192: [15.1, 17.1, 24.2, 29.7], // 16 años
    204: [15.4, 17.6, 24.8, 30.2], // 17 años
    216: [15.8, 18.1, 25.3, 30.6], // 18 años
    228: [16.0, 18.4, 25.8, 31.0]  // 19 años
};

const WHO_GIRLS = {
    60: [11.8, 12.7, 16.9, 18.9], // 5 años
    72: [11.7, 12.7, 17.2, 19.6], // 6 años
    84: [11.8, 12.8, 17.7, 20.7], // 7 años
    96: [11.9, 13.1, 18.4, 22.0], // 8 años
    108: [12.2, 13.5, 19.3, 23.4], // 9 años
    120: [12.5, 14.0, 20.3, 24.8], // 10 años
    132: [12.9, 14.5, 21.4, 26.2], // 11 años
    144: [13.4, 15.2, 22.5, 27.6], // 12 años
    156: [13.8, 15.8, 23.4, 28.7], // 13 años
    168: [14.3, 16.3, 24.1, 29.4], // 14 años
    180: [14.6, 16.7, 24.6, 29.8], // 15 años
    192: [14.8, 16.9, 24.9, 30.0], // 16 años
    204: [14.8, 17.1, 25.1, 30.1], // 17 años
    216: [14.8, 17.2, 25.3, 30.3], // 18 años
    228: [14.8, 17.2, 25.4, 30.4]  // 19 años
};

// Función auxiliar para obtener los datos del mes más cercano
const getClosestData = (table, months) => {
    // Si tenemos el mes exacto, lo devolvemos
    if (table[months]) return table[months];

    // Si no, buscamos el mes registrado más cercano (Interpolación simple)
    const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
    
    // Si es menor al primer dato, devolvemos el primero
    if (months <= keys[0]) return table[keys[0]];
    // Si es mayor al último, devolvemos el último
    if (months >= keys[keys.length - 1]) return table[keys[keys.length - 1]];

    // Buscamos el más cercano
    const closest = keys.reduce((prev, curr) => 
        (Math.abs(curr - months) < Math.abs(prev - months) ? curr : prev)
    );
    return table[closest];
};

// --- FUNCIÓN PRINCIPAL QUE EXPORTAREMOS ---
export const getDiagnosticoNino = (sexo, edadMeses, imc) => {
    if (!sexo || !edadMeses || !imc) return "";

    const imcVal = parseFloat(imc);
    const isMale = sexo === 'M' || sexo === 'MASCULINO';
    
    // Seleccionar tabla correcta
    const table = isMale ? WHO_BOYS : WHO_GIRLS;
    
    // Obtener puntos de corte para esa edad [-2SD, -1SD, +1SD, +2SD]
    const cutoffs = getClosestData(table, edadMeses);

    // LÓGICA DE CLASIFICACIÓN (NTS N° 157-MINSA/2019)
    // cutoffs[0] = -2 SD
    // cutoffs[1] = -1 SD
    // cutoffs[2] = +1 SD
    // cutoffs[3] = +2 SD

    if (imcVal > cutoffs[3]) return "OBESIDAD";       // > +2 SD
    if (imcVal > cutoffs[2]) return "SOBREPESO";      // > +1 SD y <= +2 SD
    if (imcVal >= cutoffs[0]) return "NORMAL";        // >= -2 SD y <= +1 SD
    if (imcVal < cutoffs[0]) return "DELGADEZ";       // < -2 SD
    
    return "NORMAL"; // Fallback seguro
};