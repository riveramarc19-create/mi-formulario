import React, { useState, useEffect } from 'react';
import { X, Calendar, Ruler, Activity, Calculator, Baby, ChevronRight, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ComposedChart } from 'recharts';

// --- DATOS SIMULADOS OMS (Para TALLA/EDAD) ---
// NOTA: Reemplaza esto con tus JSON reales de la OMS cuando los tengas.
// sd0 = Media, sd2 = +2 Desviaciones (Alto), sd2neg = -2 Desviaciones (Bajo)
const MOCK_WHO_BOYS = Array.from({ length: 61 }, (_, i) => ({
    month: i,
    sd0: 50 + (i * 0.8), 
    sd2: 54 + (i * 0.85), 
    sd2neg: 46 + (i * 0.75) 
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
    const [fecNac, setFecNac] = useState(initialData?.fecNac || '');
    const [fecAtencion, setFecAtencion] = useState(initialData?.fecAtencion || new Date().toISOString().split('T')[0]);
    const [talla, setTalla] = useState('');
    const [edadMeses, setEdadMeses] = useState('');
    
    // Estado para la gráfica y el resultado
    const [chartPoint, setChartPoint] = useState(null);
    const [classification, setClassification] = useState(null); // { label: '', color: '', icon: ... }

    // Seleccionar datos según sexo
    const chartData = sexo === 'M' ? MOCK_WHO_BOYS : MOCK_WHO_GIRLS;

    // 2. EFECTO: CALCULAR EDAD AUTOMÁTICAMENTE
    useEffect(() => {
        if (fecNac && fecAtencion) {
            const d1 = new Date(fecNac);
            const d2 = new Date(fecAtencion);
            if (d1 > d2) {
                setEdadMeses("Error");
                return;
            }
            let months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth();
            months += d2.getMonth();
            if (d2.getDate() < d1.getDate()) months--;
            setEdadMeses(months < 0 ? 0 : months);
        } else {
            setEdadMeses('');
        }
        // Limpiar resultado si cambian las fechas
        setChartPoint(null);
        setClassification(null);
    }, [fecNac, fecAtencion]);

    // 3. LÓGICA DE CÁLCULO Y CLASIFICACIÓN
    const handleCalculate = () => {
        const m = parseFloat(edadMeses);
        const t = parseFloat(talla);

        if (isNaN(m) || isNaN(t)) return;

        // A. Poner punto en gráfica
        setChartPoint({ x: m, y: t });

        // B. Clasificar según datos OMS
        // Buscamos el mes más cercano en la tabla de datos
        const refData = chartData.find(d => d.month === Math.round(m)) || chartData[chartData.length - 1];

        if (refData) {
            let result = {};
            
            // Reglas de Clasificación Talla/Edad (OMS/MINSA)
            if (t < refData.sd2neg) {
                // Menor a -2 DE
                result = { label: 'TALLA BAJA', color: 'bg-red-500', text: 'text-white', icon: <AlertTriangle size={24} /> };
            } else if (t > refData.sd2) {
                // Mayor a +2 DE
                result = { label: 'TALLA ALTA', color: 'bg-blue-500', text: 'text-white', icon: <Info size={24} /> };
            } else {
                // Rango Normal
                result = { label: 'NORMAL', color: 'bg-emerald-500', text: 'text-white', icon: <CheckCircle size={24} /> };
            }
            setClassification(result);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/50 max-h-[90vh]">
                
                {/* --- COLUMNA IZQUIERDA: DATOS --- */}
                <div className="w-full md:w-1/3 bg-slate-50 p-8 flex flex-col gap-5 border-r border-slate-200 overflow-y-auto">
                    
                    <div className="flex justify-between items-center md:hidden">
                        <h3 className="font-black text-slate-700">Calculadora Z</h3>
                        <button onClick={onClose}><X className="text-slate-400"/></button>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Activity className="text-emerald-500" /> Talla / Edad
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patrones OMS (0-5 Años)</p>
                    </div>

                    {/* SEXO */}
                    <div className="flex gap-2 bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
                        <button onClick={() => setSexo('M')} className={`flex-1 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${sexo === 'M' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}><Baby size={18} /> NIÑO</button>
                        <button onClick={() => setSexo('F')} className={`flex-1 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${sexo === 'F' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}><Baby size={18} /> NIÑA</button>
                    </div>

                    {/* INPUTS */}
                    <div className="space-y-3">
                        <div className="relative group">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase ml-2 mb-1 block">F. Nacimiento</label>
                            <input type="date" value={fecNac} onChange={(e) => setFecNac(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 outline-none font-bold text-slate-700 text-sm focus:border-blue-400 transition-all text-center"/>
                        </div>
                        <div className="relative group">
                            <label className="text-[9px] font-extrabold text-slate-400 uppercase ml-2 mb-1 block">F. Atención</label>
                            <input type="date" value={fecAtencion} onChange={(e) => setFecAtencion(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 outline-none font-bold text-slate-700 text-sm focus:border-blue-400 transition-all text-center"/>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative group flex-1">
                                <label className="text-[9px] font-extrabold text-slate-400 uppercase ml-2 mb-1 block">Edad (Meses)</label>
                                <input type="text" value={edadMeses} readOnly className="w-full px-4 py-3 rounded-xl bg-slate-200 border-2 border-transparent outline-none font-black text-slate-500 text-sm text-center cursor-not-allowed"/>
                            </div>
                            <div className="relative group flex-1">
                                <label className="text-[9px] font-extrabold text-slate-400 uppercase ml-2 mb-1 block">Talla (cm)</label>
                                <input type="number" value={talla} onChange={(e) => setTalla(e.target.value)} placeholder="0.0" className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 outline-none font-black text-slate-800 text-lg focus:border-blue-400 transition-all text-center placeholder-slate-300"/>
                            </div>
                        </div>
                    </div>

                    <button onClick={handleCalculate} disabled={!edadMeses || !talla} className="w-full py-4 rounded-xl bg-slate-800 text-white font-black text-xs tracking-widest shadow-lg hover:bg-slate-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex justify-center items-center gap-2">
                        <Calculator size={16}/> CALCULAR
                    </button>

                    {/* --- AQUÍ ESTÁ EL RECUADRO DE RESULTADO QUE PEDISTE --- */}
                    {classification && (
                        <div className={`mt-2 rounded-2xl p-4 shadow-xl animate-in zoom-in slide-in-from-bottom-2 duration-300 flex items-center justify-between border border-white/20 ${classification.color} ${classification.text}`}>
                            <div>
                                <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider mb-0.5">Diagnóstico Nutricional</p>
                                <h3 className="text-2xl font-black tracking-tight leading-none">{classification.label}</h3>
                            </div>
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                {classification.icon}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- COLUMNA DERECHA: GRÁFICA --- */}
                <div className="w-full md:w-2/3 bg-white p-6 relative flex flex-col">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-all hidden md:block z-10">
                        <X size={24} />
                    </button>

                    <div className="mb-4 pl-2">
                        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Curva de Crecimiento (OMS)</h4>
                    </div>

                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" type="number" domain={[0, 60]} tickCount={13} stroke="#94a3b8" tick={{fontSize: 10}} label={{ value: 'Edad (meses)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis domain={['auto', 'auto']} stroke="#94a3b8" tick={{fontSize: 10}} label={{ value: 'Talla (cm)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                
                                {/* LÍNEAS DE REFERENCIA */}
                                <Line type="monotone" dataKey="sd2" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" name="+2 SD" />
                                <Line type="monotone" dataKey="sd0" stroke="#3b82f6" strokeWidth={3} dot={false} name="Media" />
                                <Line type="monotone" dataKey="sd2neg" stroke="#fbbf24" strokeWidth={2} dot={false} strokeDasharray="5 5" name="-2 SD" />

                                {/* PUNTO DEL PACIENTE */}
                                {chartPoint && (
                                    <ReferenceDot x={chartPoint.x} y={chartPoint.y} r={6} fill={sexo === 'M' ? '#2563eb' : '#db2777'} stroke="#fff" strokeWidth={3} />
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NutritionalStatusModal;