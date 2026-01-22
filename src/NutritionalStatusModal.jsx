import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Ruler, Activity, Calculator, Baby, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, Area, ComposedChart } from 'recharts';

// --- (AQUÍ DEBERÍAS TENER TUS DATOS DE LA OMS O IMPORTARLOS) ---
// Como el código es largo, usaré datos simulados para la gráfica Talla/Edad.
// Asegúrate de conectar esto con tus datos reales de la OMS si ya los tenías.
const MOCK_WHO_BOYS = Array.from({ length: 61 }, (_, i) => ({
    month: i,
    sd0: 50 + (i * 0.8), // Media simulada
    sd2: 54 + (i * 0.85), // +2 SD
    sd2neg: 46 + (i * 0.75) // -2 SD
}));

const MOCK_WHO_GIRLS = Array.from({ length: 61 }, (_, i) => ({
    month: i,
    sd0: 49 + (i * 0.8),
    sd2: 53 + (i * 0.85),
    sd2neg: 45 + (i * 0.75)
}));

const NutritionalStatusModal = ({ isOpen, onClose, initialData }) => {
    // 1. ESTADOS
    const [sexo, setSexo] = useState('M');
    // Fechas por defecto (hoy)
    const [fecNac, setFecNac] = useState(initialData?.fecNac || '');
    const [fecAtencion, setFecAtencion] = useState(initialData?.fecAtencion || new Date().toISOString().split('T')[0]);
    const [talla, setTalla] = useState('');
    
    // Estado calculado (Edad en meses)
    const [edadMeses, setEdadMeses] = useState('');
    
    // Estado para el punto en la gráfica
    const [chartPoint, setChartPoint] = useState(null);

    // 2. EFECTO: CALCULAR EDAD AUTOMÁTICAMENTE
    useEffect(() => {
        if (fecNac && fecAtencion) {
            const d1 = new Date(fecNac);
            const d2 = new Date(fecAtencion);
            
            // Validación básica de fechas
            if (d1 > d2) {
                setEdadMeses("Error: Nac. futura");
                return;
            }

            let months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth();
            months += d2.getMonth();
            
            // Ajuste por días (si el día de atención es menor al día de nacimiento, no ha cumplido el mes)
            if (d2.getDate() < d1.getDate()) {
                months--;
            }

            // Asegurar que no sea negativo (aunque la validación d1>d2 ayuda)
            const finalMonths = months < 0 ? 0 : months;
            setEdadMeses(finalMonths);
        } else {
            setEdadMeses('');
        }
    }, [fecNac, fecAtencion]);

    // 3. LÓGICA DE GRÁFICA
    const handleCalculate = () => {
        if (edadMeses === '' || !talla) return;
        setChartPoint({ x: parseFloat(edadMeses), y: parseFloat(talla) });
    };

    // Seleccionar datos según sexo (Reemplaza MOCK con tus datos reales si los tienes)
    const chartData = sexo === 'M' ? MOCK_WHO_BOYS : MOCK_WHO_GIRLS;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/50 max-h-[90vh]">
                
                {/* --- COLUMNA IZQUIERDA: CONTROLES --- */}
                <div className="w-full md:w-1/3 bg-slate-50/80 p-8 flex flex-col gap-6 border-r border-slate-100 overflow-y-auto">
                    
                    <div className="flex justify-between items-center md:hidden">
                        <h3 className="font-black text-slate-700 text-lg">Calculadora Z</h3>
                        <button onClick={onClose}><X className="text-slate-400"/></button>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Activity className="text-emerald-500" /> Talla / Edad
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patrones de Crecimiento OMS</p>
                    </div>

                    {/* SELECTOR DE SEXO (BOTONES GRANDES) */}
                    <div className="flex gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                        <button 
                            onClick={() => setSexo('M')}
                            className={`flex-1 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${sexo === 'M' ? 'bg-blue-500 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <Baby size={18} /> NIÑO
                        </button>
                        <button 
                            onClick={() => setSexo('F')}
                            className={`flex-1 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${sexo === 'F' ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <Baby size={18} /> NIÑA
                        </button>
                    </div>

                    {/* FORMULARIO DE FECHAS */}
                    <div className="space-y-4">
                        
                        {/* FECHA DE NACIMIENTO */}
                        <div className="relative group">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase ml-3 mb-1 block">Fecha Nacimiento</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input 
                                    type="date" 
                                    value={fecNac}
                                    onChange={(e) => setFecNac(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-100 outline-none font-bold text-slate-700 text-sm focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* FECHA DE ATENCIÓN */}
                        <div className="relative group">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase ml-3 mb-1 block">Fecha Atención</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input 
                                    type="date" 
                                    value={fecAtencion}
                                    onChange={(e) => setFecAtencion(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-100 outline-none font-bold text-slate-700 text-sm focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* EDAD CALCULADA (AUTOMÁTICA) */}
                        <div className="relative group">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase ml-3 mb-1 block">Edad Calculada (Meses)</label>
                            <div className="relative">
                                <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    value={edadMeses}
                                    readOnly // Solo lectura porque se calcula solo
                                    placeholder="Automático..."
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-100 border-2 border-transparent outline-none font-black text-slate-600 text-sm cursor-not-allowed shadow-inner"
                                />
                            </div>
                        </div>

                        {/* TALLA (CM) */}
                        <div className="relative group">
                            <label className="text-[10px] font-extrabold text-slate-400 uppercase ml-3 mb-1 block">Talla (cm)</label>
                            <div className="relative">
                                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input 
                                    type="number" 
                                    value={talla}
                                    onChange={(e) => setTalla(e.target.value)}
                                    placeholder="Ej. 75.5"
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border-2 border-slate-100 outline-none font-bold text-slate-700 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                    </div>

                    <div className="mt-auto pt-4">
                        <button 
                            onClick={handleCalculate}
                            disabled={!edadMeses || !talla}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm tracking-widest shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                        >
                            PROYECTAR EN GRÁFICA <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA: GRÁFICA --- */}
                <div className="w-full md:w-2/3 bg-white p-6 relative flex flex-col">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-all hidden md:block">
                        <X size={24} />
                    </button>

                    <div className="mb-6">
                        <h4 className="font-bold text-slate-800 text-sm uppercase">Curvas de Crecimiento (0-60 meses)</h4>
                        <div className="flex gap-4 mt-2 text-[10px] font-bold uppercase">
                            <span className="flex items-center gap-1 text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> +2 DE (Obesidad)</span>
                            <span className="flex items-center gap-1 text-blue-600"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Media</span>
                            <span className="flex items-center gap-1 text-amber-500"><span className="w-2 h-2 rounded-full bg-amber-400"></span> -2 DE (Desnutrición)</span>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="month" 
                                    type="number" 
                                    domain={[0, 60]} 
                                    tickCount={13} 
                                    stroke="#94a3b8" 
                                    tick={{fontSize: 10}} 
                                    label={{ value: 'Edad (meses)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
                                />
                                <YAxis 
                                    domain={['auto', 'auto']} 
                                    stroke="#94a3b8" 
                                    tick={{fontSize: 10}}
                                    label={{ value: 'Talla (cm)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} 
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                                />
                                
                                {/* ZONAS (Áreas sombreadas opcionales, aquí uso líneas para limpieza) */}
                                <Line type="monotone" dataKey="sd2" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" name="+2 SD" />
                                <Line type="monotone" dataKey="sd0" stroke="#3b82f6" strokeWidth={3} dot={false} name="Media" />
                                <Line type="monotone" dataKey="sd2neg" stroke="#fbbf24" strokeWidth={2} dot={false} strokeDasharray="5 5" name="-2 SD" />

                                {/* PUNTO DEL PACIENTE */}
                                {chartPoint && (
                                    <ReferenceDot 
                                        x={chartPoint.x} 
                                        y={chartPoint.y} 
                                        r={6} 
                                        fill={sexo === 'M' ? '#3b82f6' : '#ec4899'} 
                                        stroke="#fff" 
                                        strokeWidth={3}
                                    />
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    
                    {chartPoint && (
                        <div className="absolute bottom-6 right-6 bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg animate-in zoom-in">
                            RESULTADO: {chartPoint.y} cm a los {chartPoint.x} meses
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NutritionalStatusModal;