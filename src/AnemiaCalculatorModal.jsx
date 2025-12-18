import React, { useState, useEffect } from 'react';
import { Calculator, X, Activity, Baby } from 'lucide-react';

// --- BASE DE DATOS DE LOCALIDADES (135 Registros) ---
const DB_LOCALIDADES = [
    { label: "AGURAN (PACAIPAMPA)", alt: 1480 }, { label: "ALFONSO UGARTE (PACAIPAMPA)", alt: 1708 },
    { label: "ALTAMISA (PACAIPAMPA)", alt: 2684 }, { label: "ALTO MILAGRO (PACAIPAMPA)", alt: 2413 },
    { label: "ALTO SANTA ROSA (PACAIPAMPA)", alt: 2072 }, { label: "ARANZA (PACAIPAMPA)", alt: 1332 },
    { label: "BELLAVISTA DE CACHIACO (PACAIPAMPA)", alt: 1758 }, { label: "BELLAVISTA DE SAN PABLO (PACAIPAMPA)", alt: 2065 },
    { label: "CALABOZO (PACAIPAMPA)", alt: 2390 }, { label: "CAMINO REAL (PACAIPAMPA)", alt: 2386 },
    { label: "CASCAJAL (PACAIPAMPA)", alt: 1757 }, { label: "CERRO PINTADO (PACAIPAMPA)", alt: 1735 },
    { label: "CHANGRA (PACAIPAMPA)", alt: 2796 }, { label: "CHULUCANITAS (PACAIPAMPA)", alt: 2690 },
    { label: "CORRAL DE PIEDRAS (PACAIPAMPA)", alt: 1865 }, { label: "CUMBICUS ALTO (PACAIPAMPA)", alt: 2421 },
    { label: "CUMBICUS BAJO (PACAIPAMPA)", alt: 1602 }, { label: "CURILCAS (PACAIPAMPA)", alt: 1518 },
    { label: "CURIRCA (PACAIPAMPA)", alt: 2595 }, { label: "EL ALGARROBO (PACAIPAMPA)", alt: 1830 },
    { label: "EL ALUMBRE (PACAIPAMPA)", alt: 1325 }, { label: "EL CARMEN (PACAIPAMPA)", alt: 2098 },
    { label: "EL CARMEN DE CURILCAS (PACAIPAMPA)", alt: 2070 }, { label: "EL CEIBO (PACAIPAMPA)", alt: 1812 },
    { label: "EL HUABO (PACAIPAMPA)", alt: 1780 }, { label: "EL LIMO (PACAIPAMPA)", alt: 1826 },
    { label: "EL MOLINO (PACAIPAMPA)", alt: 1871 }, { label: "EL PALMO (PACAIPAMPA)", alt: 2193 },
    { label: "EL PUERTO (PACAIPAMPA)", alt: 1455 }, { label: "EL SAUCE (PACAIPAMPA)", alt: 2576 },
    { label: "EL YAMBUR (PACAIPAMPA)", alt: 2414 }, { label: "FRANCISCO BOLOGNESI (PACAIPAMPA)", alt: 2100 },
    { label: "HUACAMUYOS (PACAIPAMPA)", alt: 2632 }, { label: "HUALANGA (PACAIPAMPA)", alt: 1948 },
    { label: "HUARACAS DE MATALACAS (PACAIPAMPA)", alt: 3030 }, { label: "LA COFRADIA (PACAIPAMPA)", alt: 2650 },
    { label: "LA COIPA DE CURILCAS (PACAIPAMPA)", alt: 1677 }, { label: "LA CRIA SAN PABLO (PACAIPAMPA)", alt: 1684 },
    { label: "LA FLORIDA (PACAIPAMPA)", alt: 2586 }, { label: "LA HUACA (PACAIPAMPA)", alt: 2537 },
    { label: "LA LAGUNA (PACAIPAMPA)", alt: 2190 }, { label: "LA LAGUNA (PACAIPAMPA)", alt: 2607 },
    { label: "LA LOMA (PACAIPAMPA)", alt: 1861 }, { label: "LA PALMA (PACAIPAMPA)", alt: 2753 },
    { label: "LA RAMADA DE MALACHE (PACAIPAMPA)", alt: 2960 }, { label: "LA UNION DE SAN PABLO (PACAIPAMPA)", alt: 2096 },
    { label: "LAGUNAS DE SAN PABLO (PACAIPAMPA)", alt: 2275 }, { label: "LAQUE MATALACAS (PACAIPAMPA)", alt: 1992 },
    { label: "LAS GREDAS (PACAIPAMPA)", alt: 1457 }, { label: "LAS JUNTAS (PACAIPAMPA)", alt: 1853 },
    { label: "LAS LOMAS (PACAIPAMPA)", alt: 3135 }, { label: "LAS MERCEDES (PACAIPAMPA)", alt: 3232 },
    { label: "LAS PALMERAS (PACAIPAMPA)", alt: 1984 }, { label: "LAS VEGAS DE CURIRCA (PACAIPAMPA)", alt: 2222 },
    { label: "LECHEROS (PACAIPAMPA)", alt: 3077 }, { label: "LETREROS-TUCAQUE (PACAIPAMPA)", alt: 2512 },
    { label: "LINDEROS CURILCAS (PACAIPAMPA)", alt: 1569 }, { label: "LIRIO (PACAIPAMPA)", alt: 2459 },
    { label: "LIVIN DE CURILCAS (PACAIPAMPA)", alt: 1908 }, { label: "LIVIN DE SAN PABLO (PACAIPAMPA)", alt: 1826 },
    { label: "LOS ALISOS (PACAIPAMPA)", alt: 2541 }, { label: "LOS CLAVELES DE MALACHE (PACAIPAMPA)", alt: 2250 },
    { label: "LUCUMO (PACAIPAMPA)", alt: 2640 }, { label: "MALACHE (PACAIPAMPA)", alt: 2770 },
    { label: "MANGAS DE CACHIACO (PACAIPAMPA)", alt: 2701 }, { label: "MARAY DE CURILCAS (PACAIPAMPA)", alt: 1819 },
    { label: "MARAY DE MATALACAS (PACAIPAMPA)", alt: 2270 }, { label: "MARAY DE SAN PABLO (PACAIPAMPA)", alt: 1997 },
    { label: "MEJICO (PACAIPAMPA)", alt: 2073 }, { label: "MEMBRILLO (PACAIPAMPA)", alt: 2768 },
    { label: "MIRAFLORES (PACAIPAMPA)", alt: 3104 }, { label: "MORE (PACAIPAMPA)", alt: 3095 },
    { label: "MUSHCAPAN (PACAIPAMPA)", alt: 2255 }, { label: "NANGAY DE MATALACAS (PACAIPAMPA)", alt: 2071 },
    { label: "NANGAY PAMPA (PACAIPAMPA)", alt: 1672 }, { label: "NARANJITO DE MATALACHE (PACAIPAMPA)", alt: 1180 },
    { label: "NARANJITO RAMADA DE VILCA (PACAIPAMPA)", alt: 2312 }, { label: "NARANJO DE CURILCAS (PACAIPAMPA)", alt: 1754 },
    { label: "NARANJO DE VILCAS (PACAIPAMPA)", alt: 1503 }, { label: "NOTA (PACAIPAMPA)", alt: 2400 },
    { label: "NUEVA ALIANZA (PACAIPAMPA)", alt: 1686 }, { label: "NUEVA ESPERANZA (PACAIPAMPA)", alt: 3267 },
    { label: "NUEVO FLORECER (PACAIPAMPA)", alt: 3027 }, { label: "NUEVO PORVENIR (PACAIPAMPA)", alt: 2100 },
    { label: "NUEVO PROGRESO (PACAIPAMPA)", alt: 2670 }, { label: "PACAIPAMPA (PACAIPAMPA)", alt: 1980 },
    { label: "PAGAY (PACAIPAMPA)", alt: 2306 }, { label: "PALO BLANCO (PACAIPAMPA)", alt: 2806 },
    { label: "PALO BLANCO DE MATALACAS (PACAIPAMPA)", alt: 2230 }, { label: "PALOBLANQUITO (PACAIPAMPA)", alt: 2969 },
    { label: "PALOMAR (PACAIPAMPA)", alt: 3303 }, { label: "PAMPAGRANDE (PACAIPAMPA)", alt: 2460 },
    { label: "PAPELILLO (PACAIPAMPA)", alt: 1753 }, { label: "PAPELILLO (PACAIPAMPA)", alt: 2051 },
    { label: "PAREDONES (PACAIPAMPA)", alt: 1302 }, { label: "PATA DE CACHIACO (PAJUL) (PACAIPAMPA)", alt: 2281 },
    { label: "PEDREGAL DE MATALACAS (PACAIPAMPA)", alt: 3092 }, { label: "PEÑA BLANCA (PACAIPAMPA)", alt: 2350 },
    { label: "PORTACHUELO DE MATALACAS (PACAIPAMPA)", alt: 2490 }, { label: "PORVENIR DE MATALACAS (PACAIPAMPA)", alt: 3285 },
    { label: "PUEBLO NUEVO DE MATALACAS (PACAIPAMPA)", alt: 1964 }, { label: "PUMURCO (PACAIPAMPA)", alt: 2120 },
    { label: "PUR PUR (PACAIPAMPA)", alt: 2176 }, { label: "RAMADAS VILCAS (PACAIPAMPA)", alt: 2270 },
    { label: "RAMON CASTILLA (PACAIPAMPA)", alt: 2057 }, { label: "SAN ANDRES DEL FAIQUE (PACAIPAMPA)", alt: 2130 },
    { label: "SAN FRANCISCO (PACAIPAMPA)", alt: 1761 }, { label: "SAN FRANCISCO (PACAIPAMPA)", alt: 2690 },
    { label: "SAN JOSE DE MATALACAS (PACAIPAMPA)", alt: 2275 }, { label: "SAN JUAN DE CACHIACO (PACAIPAMPA)", alt: 2234 },
    { label: "SAN LAZARO (PACAIPAMPA)", alt: 1620 }, { label: "SAN LUIS (PACAIPAMPA)", alt: 1839 },
    { label: "SAN MARTIN (PACAIPAMPA)", alt: 2539 }, { label: "SAN MIGUEL DE MATALACAS (PACAIPAMPA)", alt: 2838 },
    { label: "SAN MIGUEL DE SAN PABLO (PACAIPAMPA)", alt: 2081 }, { label: "SANTA CRUZ (PACAIPAMPA)", alt: 2840 },
    { label: "SANTA CRUZ DE LA VEGA (PACAIPAMPA)", alt: 1274 }, { label: "SANTA FE (PACAIPAMPA)", alt: 3108 },
    { label: "SANTA MARIA (PACAIPAMPA)", alt: 2433 }, { label: "SANTA ROSA (PACAIPAMPA)", alt: 1218 },
    { label: "TAILIN (PACAIPAMPA)", alt: 2251 }, { label: "TAUMA (PACAIPAMPA)", alt: 2264 },
    { label: "TAZAJERAS (PACAIPAMPA)", alt: 1850 }, { label: "TIERRA COLORADA (PACAIPAMPA)", alt: 2517 },
    { label: "TINGOS (PACAIPAMPA)", alt: 2418 }, { label: "TOJAS (PACAIPAMPA)", alt: 1966 },
    { label: "TOTORA (PACAIPAMPA)", alt: 2582 }, { label: "TULMAN DE MATALACAS (PACAIPAMPA)", alt: 1817 },
    { label: "TULMANCITO (PACAIPAMPA)", alt: 2096 }, { label: "UNION DE LA CRUZ (PACAIPAMPA)", alt: 2194 },
    { label: "VEGA DEL PUNTO (PACAIPAMPA)", alt: 1105 }, { label: "VILCAS (PACAIPAMPA)", alt: 1710 },
    { label: "YAMANGITO (PACAIPAMPA)", alt: 2237 }, { label: "YUMBE (PACAIPAMPA)", alt: 2434 },
    { label: "YUMBE DE CHANGRA (PACAIPAMPA)", alt: 2647 }
].sort((a, b) => a.label.localeCompare(b.label));

// LOGICA DE AJUSTE EXACTA DE LA TABLA CSV/HTML
const getFactorAjuste = (altitud) => {
    if (!altitud || altitud < 1000) return 0;
    if (altitud < 1250) return 0.2;
    if (altitud < 1500) return 0.8;
    if (altitud < 2000) return 1.1;
    if (altitud < 2500) return 1.4;
    if (altitud < 3000) return 1.8;
    if (altitud < 3500) return 2.3;
    if (altitud < 4000) return 3.1;
    return 4.0;
};

const AnemiaCalculatorModal = ({ isOpen, onClose, initialData }) => {
    // ESTADOS DE LA CALCULADORA
    const [dob, setDob] = useState('');
    const [dosajeDate, setDosajeDate] = useState(new Date().toISOString().split('T')[0]);
    const [edadCalculada, setEdadCalculada] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [altitud, setAltitud] = useState(0);
    const [ajuste, setAjuste] = useState(0);
    const [grupo, setGrupo] = useState('');
    const [semanaPrematuro, setSemanaPrematuro] = useState('sem_1');
    const [hbObservada, setHbObservada] = useState('');
    const [resultado, setResultado] = useState(null);

    // EFECTO: Sincronizar datos iniciales cuando se abre el modal
    useEffect(() => {
        if (isOpen && initialData) {
            if (initialData.fecNac) setDob(initialData.fecNac);
            if (initialData.fecAtencion) setDosajeDate(initialData.fecAtencion);
        }
    }, [isOpen, initialData]);

    // EFECTO: Calcular Edad Automáticamente (Lógica del HTML)
    useEffect(() => {
        if (!dob || !dosajeDate) {
            setEdadCalculada('');
            return;
        }
        const d1 = new Date(dob);
        const d2 = new Date(dosajeDate);
        if (d2 < d1) {
            setEdadCalculada('Error');
            return;
        }
        let years = d2.getFullYear() - d1.getFullYear();
        let months = d2.getMonth() - d1.getMonth();
        let days = d2.getDate() - d1.getDate();
        if (days < 0) {
            months--;
            const prev = new Date(d2.getFullYear(), d2.getMonth(), 0);
            days += prev.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }
        let txt = "";
        if (years > 0) txt += `${years}a `;
        if (months > 0 || years > 0) txt += `${months}m `;
        txt += `${days}d`;
        setEdadCalculada(txt);
    }, [dob, dosajeDate]);

    // MANEJADORES
    const handleLocalidadChange = (e) => {
        const alt = parseFloat(e.target.value) || 0;
        setLocalidad(e.target.value);
        setAltitud(alt);
        setAjuste(getFactorAjuste(alt));
    };

    const calcular = () => {
        if (!hbObservada || !grupo) {
            alert("Complete los campos de Grupo y Hemoglobina");
            return;
        }
        const hbObs = parseFloat(hbObservada);
        const factor = getFactorAjuste(altitud);
        const hbAjustada = parseFloat((hbObs - factor).toFixed(1));

        let corte = 11.0; 
        let sev = 7.0;

        if (grupo === 'prematuro') {
            if (semanaPrematuro === 'sem_1') { corte = 13.0; sev = 10.0; }
            else if (semanaPrematuro === 'sem_2_4') { corte = 10.0; sev = 7.0; }
            else { corte = 8.0; sev = 6.0; }
        } else if (grupo === 'termino_menor_2m') { corte = 13.5; sev = 10.0; }
        else if (grupo === 'termino_2_5m') { corte = 9.5; sev = 7.0; }
        else if (grupo === 'nino_6_23m') { corte = 11.0; sev = 7.0; }
        else if (grupo === 'nino_24_59m') { corte = 11.0; sev = 7.0; }
        else if (grupo === 'nino_5_11a') { corte = 11.5; sev = 8.0; }
        else if (grupo.includes('adol') || grupo === 'mujer_15_mas' || grupo === 'puerpera') { corte = 12.0; sev = 8.0; }
        else if (grupo === 'varon_15_mas') { corte = 13.0; sev = 8.0; }
        else if (grupo === 'gestante_t2') { corte = 10.5; sev = 7.0; }
        else if (grupo === 'gestante_t1' || grupo === 'gestante_t3') { corte = 11.0; sev = 7.0; }

        let dx = "NORMAL";
        let colorClass = "bg-emerald-500 border-emerald-800 text-white"; // Verde por defecto
        let msg = "Sin anemia. Valores adecuados.";

        if (hbAjustada < corte) {
            if (hbAjustada < sev) {
                dx = "ANEMIA SEVERA";
                colorClass = "bg-red-500 border-red-800 text-white"; // Rojo
                msg = "Requiere atención urgente y suplementación terapéutica inmediata.";
            } else {
                let isChildOrGest = (grupo.includes('nino') || grupo.includes('gestante') || grupo === 'prematuro');
                let esModerada = false;
                if (isChildOrGest) {
                    if (hbAjustada <= 9.9 && corte >= 11) esModerada = true;
                    else if (hbAjustada < 10.0 && corte === 10.5) esModerada = true;
                } else {
                    if (hbAjustada <= 10.9) esModerada = true;
                }

                if (esModerada) {
                    dx = "ANEMIA MODERADA";
                    colorClass = "bg-orange-500 border-orange-800 text-white"; // Naranja
                    msg = "Anemia moderada, requiere tratamiento.";
                } else {
                    dx = "ANEMIA LEVE";
                    colorClass = "bg-yellow-400 border-yellow-700 text-black"; // Amarillo
                    msg = "Anemia leve, requiere seguimiento.";
                }
            }
        }
        setResultado({ dx, hbAjustada: hbAjustada.toFixed(1), msg, css: colorClass });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden font-sans relative animate-in zoom-in duration-200 border-2 border-white">
                <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-10"><X size={24} /></button>
                
                {/* Header Gradiente */}
                <div className="bg-gradient-to-r from-purple-800 to-green-600 p-4 flex justify-between items-center text-white">
                    <div>
                        <h1 className="text-xl font-bold tracking-wide">CALCULADORA ANEMIA 2025</h1>
                        <p className="text-green-100 text-xs opacity-90">Ayabaca / Pacaipampa</p>
                    </div>
                </div>

                <div className="p-5 space-y-5 max-h-[85vh] overflow-y-auto">
                    {/* Fila 1: Fechas y Edad */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Fecha Nacimiento</label>
                                <input type="date" className="w-full p-2 border border-gray-300 rounded focus:border-purple-500 outline-none bg-white" value={dob} onChange={(e) => setDob(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Fecha de Dosaje</label>
                                <input type="date" className="w-full p-2 border border-gray-300 rounded focus:border-purple-500 outline-none bg-white" value={dosajeDate} onChange={(e) => setDosajeDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-800 mb-1 uppercase">Edad Calculada</label>
                                <input type="text" readOnly className="w-full p-2 bg-blue-100 text-blue-800 font-bold text-center rounded border border-blue-200" value={edadCalculada} placeholder="--" />
                            </div>
                        </div>
                    </div>

                    {/* Fila 2: Localidad y Altitud */}
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                            <div className="md:col-span-8">
                                <label className="block text-xs font-bold text-purple-900 mb-1 uppercase">📍 Localidad / C.P.</label>
                                <select className="w-full p-2 border border-purple-300 rounded font-medium focus:border-purple-600 outline-none bg-white" onChange={handleLocalidadChange} value={localidad}>
                                    <option value="">-- Buscar Localidad --</option>
                                    {DB_LOCALIDADES.map((loc, i) => ( <option key={i} value={loc.alt}>{loc.label}</option> ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Altitud (msnm)</label>
                                <input type="number" readOnly className="w-full p-2 bg-gray-50 text-center rounded border border-gray-200 text-gray-500" value={altitud} placeholder="0" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Ajuste Hb</label>
                                <input type="text" readOnly className="w-full p-2 bg-gray-50 text-center font-bold text-purple-700 rounded border border-gray-200" value={ajuste > 0 ? `-${ajuste.toFixed(1)}` : '0.0'} placeholder="0.0" />
                            </div>
                        </div>
                    </div>

                    {/* Fila 3: Grupo y Hb */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Grupo Poblacional</label>
                            <select className="w-full h-12 p-2 border border-gray-300 rounded focus:border-purple-500 outline-none bg-white" value={grupo} onChange={(e) => setGrupo(e.target.value)}>
                                <option value="">-- Seleccione Grupo --</option>
                                <optgroup label="Niños">
                                    <option value="prematuro">Niño Prematuro</option>
                                    <option value="termino_menor_2m">Nacido a Término (&lt; 2 meses)</option>
                                    <option value="termino_2_5m">Nacido a Término (2 a 5 meses)</option>
                                    <option value="nino_6_23m">Niños de 6 a 23 meses</option>
                                    <option value="nino_24_59m">Niños de 24 a 59 meses</option>
                                    <option value="nino_5_11a">Niños de 5 a 11 años</option>
                                </optgroup>
                                <optgroup label="Adolescentes y Adultos">
                                    <option value="adol_mujer_12_14">Adol. Mujer (12-14 a)</option>
                                    <option value="adol_varon_12_14">Adol. Varón (12-14 a)</option>
                                    <option value="varon_15_mas">Varón (15 a+)</option>
                                    <option value="mujer_15_mas">Mujer No Gest. (15 a+)</option>
                                </optgroup>
                                <optgroup label="Gestantes/Puérperas">
                                    <option value="gestante_t1">Gestante (1° Trim)</option>
                                    <option value="gestante_t2">Gestante (2° Trim)</option>
                                    <option value="gestante_t3">Gestante (3° Trim)</option>
                                    <option value="puerpera">Puérpera</option>
                                </optgroup>
                            </select>
                            {grupo === 'prematuro' && (
                                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded animate-fade-in">
                                    <label className="block text-xs font-bold text-yellow-800 mb-1">Semana de Vida</label>
                                    <select className="w-full p-2 border border-yellow-300 rounded text-sm outline-none bg-white" value={semanaPrematuro} onChange={(e) => setSemanaPrematuro(e.target.value)}>
                                        <option value="sem_1">1° Semana</option>
                                        <option value="sem_2_4">2° a 4° Semana</option>
                                        <option value="sem_5_8">5° a 8° Semana</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col justify-end">
                            <div className="flex gap-4 items-end">
                                <div className="w-1/3">
                                    <label className="block text-xs font-bold text-gray-600 mb-1 uppercase text-center">Hb (g/dL)</label>
                                    <input type="number" step="0.1" className="w-full h-12 text-center text-xl font-bold border border-gray-400 rounded focus:border-purple-600 outline-none bg-white" placeholder="0.0" value={hbObservada} onChange={(e) => setHbObservada(e.target.value)} />
                                </div>
                                <div className="w-2/3">
                                    <button onClick={calcular} className="w-full h-12 bg-purple-800 hover:bg-purple-900 text-white font-bold rounded shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                                        <span>CALCULAR</span>
                                        <Activity size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {resultado && (
                        <div className={`mt-4 p-6 rounded-lg shadow-md flex flex-col md:flex-row justify-between items-center gap-4 border-l-8 transition-all ${resultado.css}`}>
                            <div className="text-left flex-1">
                                <h2 className="text-3xl font-bold uppercase tracking-tight">{resultado.dx}</h2>
                                <p className="text-sm opacity-90 mt-1 font-medium">{resultado.msg}</p>
                            </div>
                            <div className="text-right bg-white/20 p-3 rounded-lg min-w-[180px] text-center backdrop-blur-sm">
                                <span className="text-xs uppercase font-semibold block opacity-80">Hb Ajustada</span>
                                <span className="text-4xl font-bold">{resultado.hbAjustada}</span>
                                <span className="text-sm font-medium ml-1">g/dL</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnemiaCalculatorModal;