import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Activity, ArrowRight, ArrowLeft, X, Plus, LogOut, Database, Search, Trash2, FileSpreadsheet, Calendar, Edit, Download, Grid, Save, UserPlus, Users,User,UserRound,Stethoscope, Save as SaveIcon, FileText, AlertTriangle, Calculator, Siren, Baby, RefreshCw, CheckCircle, Droplets, Eye, EyeOff,Lock, Heart, Syringe, Brain, Smile, ArrowDown, CheckCircle2 } from 'lucide-react';

import NutritionalStatusModal from './NutritionalStatusModal';
import AnemiaCalculatorModal from './AnemiaCalculatorModal';


// --- IMPORTACIÓN DE DATOS ESTÁTICOS EXTERNOS ---
import { CIE10_LIST } from './Cie10Data';
import { PERSONAL_LIST } from './PersonalData';
// ------------------------------------------------------------------
import { pacientesFormateados } from './adaptador';
import { SEGUIMIENTO_GESTANTES } from './SEGUIMIENTO_GESTANTES';
import { SEGUIMIENTO_CRED } from './SEGUIMIENTO_CRED';
import { SEGUIMIENTO_ANEMIA } from './SEGUIMIENTO_ANEMIA_NI';


import * as XLSXStyle from 'xlsx-js-style';
import { jsPDF } from "jspdf";
import { getDiagnosticoNino } from './ZScoreData';

// Definición de constantes DESPUÉS de todos los imports
const XLSX = XLSXStyle.default || XLSXStyle;

// --- PARCHE DE SEGURIDAD ---
if (typeof global === 'undefined') { window.global = window; }

// --- LISTA DE LOCALIDADES ---
const LOCALIDADES_ALTITUD = {
    "AGURAN": 1480, "ALFONSO UGARTE": 1708, "ALTAMIZA": 2684, "ALTO EL MILAGRO": 1900, "ALTO MILAGRO": 2413, 
    "ALTO SANTA ROSA": 2072, "ARANZA": 1332, "BELLAVISTA DE CACHIACO": 1758, "BELLAVISTA DE SAN PABLO": 2065, 
    "CALABOZO": 2390, "CAMINO REAL": 2386, "CASCAJAL": 1757, "CERRO PINTADO": 1735, "CHANGRA": 2796, 
    "CHULUCANITAS": 2690, "CORRAL DE PIEDRAS": 1865, "CUMBICUS ALTO": 2421, "CUMBICUS BAJO": 1602, 
    "CURILCAS": 1518, "CURIRCA": 2595, "EL ALGARROBO": 1830, "EL ALUMBRE": 1325, "EL CARMEN": 2098, 
    "EL CARMEN DE CURILCAS": 2070, "EL CEIBO": 1812, "EL HUABO (EL HUABO DE CURILCAS)": 1780, 
    "EL LIMO": 1826, "EL MOLINO": 1871, "EL PALMO": 2193, "EL PUERTO": 1455, "EL SAUCE": 2576, 
    "EL YAMBUR": 2414, "FRANCISCO BOLOGNESI": 2100, "HUACAMUYOS": 2632, "HUALANGA": 1948, 
    "HUARACAS DE MATALACAS": 3030, "LA COFRADIA": 2650, "LA COIPA DE CURILCAS": 1677, "LA CRIA SAN PABLO": 1684, 
    "LA FLORIDA": 2586, "LA HUACA": 2537, "LA LAGUNA": 2190, "LA LAGUNA (2)": 2607, "LA LOMA": 1861, 
    "LA PALMA": 2753, "LA RAMADA DE MALACHE": 2960, "LA UNION DE SAN PABLO": 2096, "LAGUNAS DE SAN PABLO": 2275, 
    "LAQUE MATALACAS": 1992, "LAS GREDAS": 1457, "LAS JUNTAS": 1853, "LAS LOMAS": 3135, "LAS MERCEDES": 3232, 
    "LAS PALMERAS": 1984, "LAS VEGAS DE CURIRCA": 2222, "LECHEROS": 3077, "LETREROS-TUCAQUE": 2512, 
    "LINDEROS CURILCAS": 1569, "LIRIO": 2459, "LIVIN DE CURILCAS (EL ROYO)": 1908, "LIVIN DE SAN PABLO": 1826, 
    "LOS ALISOS": 2541, "LOS CLAVELES DE MALACHE": 2250, "LUCUMO": 2640, "MALACHE": 2770, "MANGAS DE CACHIACO": 2701, 
    "MARAY DE CURILCAS": 1819, "MARAY DE MATALACAS": 2270, "MARAY DE SAN PABLO": 1997, "MEJICO": 2073, 
    "MEMBRILLO": 2768, "MIRAFLORES": 3104, "MORE": 3095, "MUSHCAPAN": 2255, "NANGAY DE MATALACAS": 2071, 
    "NANGAY PAMPA": 1672, "NARANJITO DE MATALACHE": 1180, "NARANJITO RAMADA DE VILCA": 2312, 
    "NARANJO DE CURILCAS": 1754, "NARANJO DE VILCAS": 1503, "NOTA": 2400, "NUEVA ALIANZA": 1686, 
    "NUEVA ESPERANZA": 3267, "NUEVO FLORECER": 3027, "NUEVO PORVENIR": 2100, "NUEVO PROGRESO": 2670, 
    "PACAIPAMPA": 1980, "PAGAY": 2306, "PALO BLANCO": 2806, "PALO BLANCO DE MATALACAS": 2230, 
    "PALOBLANQUITO": 2969, "PALOMAR": 3303, "PAMPAGRANDE": 2460, "PAPELILLO": 1753, "PAPELILLO (2)": 2051, 
    "PAREDONES": 1302, "PATA DE CACHIACO (PAJUL)": 2281, "PEDREGAL DE MATALACAS": 3092, "PEÑA BLANCA": 2350, 
    "PORTACHUELO DE MATALACAS": 2490, "PORVENIR DE MATALACAS": 3285, "PUEBLO NUEVO DE MATALACAS": 1964, 
    "PUMURCO": 2120, "PUR PUR": 2176, "RAMADAS VILCAS": 2270, "RAMON CASTILLA": 2057, "SAN ANDRES DEL FAIQUE": 2130, 
    "SAN FRANCISCO": 1761, "SAN FRANCISCO (2)": 2690, "SAN JOSE DE MATALACAS": 2275, "SAN JUAN DE CACHIACO": 2234, 
    "SAN LAZARO": 1620, "SAN LUIS": 1839, "SAN MARTIN": 2539, "SAN MIGUEL DE MATALACAS": 2838, 
    "SAN MIGUEL DE SAN PABLO": 2081, "SANTA CRUZ": 2840, "SANTA CRUZ DE LA VEGA": 1274, "SANTA FE": 3108, 
    "SANTA MARIA": 2433, "SANTA ROSA": 1218, "TAILIN": 2251, "TAUMA": 2264, "TASAJERAS": 1850, 
    "TIERRA COLORADA": 2517, "TINGOS": 2418, "TOJAS": 1966, "TOTORA": 2582, "TULMAN DE MATALACAS": 1817, 
    "TULMANCITO": 2096, "UNION DE LA CRUZ": 2194, "VEGA DEL PUNTO": 1105, "VILCAS": 1710, "YAMANGITO": 2237, 
    "YUMBE": 2434, "YUMBE DE CHANGRA": 2647, "CACHIACO": 1000 
};

// --- SERVICIO INDEXEDDB ---
const DB_NAME = 'HisDatabase_V1';
const STORE_PACIENTES = 'pacientes';

const idb = {
  open: () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_PACIENTES)) {
          db.createObjectStore(STORE_PACIENTES, { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = (event) => resolve(event.target.result);
      request.onerror = (event) => reject(event.target.error);
    });
  },
  savePatients: async (patients) => {
    const db = await idb.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_PACIENTES], 'readwrite');
      const store = transaction.objectStore(STORE_PACIENTES);
      store.clear(); 
      patients.forEach(p => store.add(p));
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => reject(false);
    });
  },
  getPatients: async () => {
    const db = await idb.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_PACIENTES], 'readonly');
      const store = transaction.objectStore(STORE_PACIENTES);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject([]);
    });
  },
  clearPatients: async () => {
    const db = await idb.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_PACIENTES], 'readwrite');
      const store = transaction.objectStore(STORE_PACIENTES);
      const request = store.clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(false);
    });
  },
  addPatient: async (patient) => {
    const db = await idb.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_PACIENTES], 'readwrite');
      const store = transaction.objectStore(STORE_PACIENTES);
      const request = store.add(patient);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(false);
    });
  }
};

const getAgeComponents = (birthDate, attnDate) => {
    if (!birthDate || !attnDate) return { y: '', m: '', d: '' };
    const birth = new Date(birthDate);
    const attn = new Date(attnDate);
    if (isNaN(birth.getTime()) || isNaN(attn.getTime()) || birth > attn) return { y: '-', m: '-', d: '-' };
    let years = attn.getFullYear() - birth.getFullYear();
    let months = attn.getMonth() - birth.getMonth();
    let days = attn.getDate() - birth.getDate();
    if (days < 0) { months--; const prevMonth = new Date(attn.getFullYear(), attn.getMonth(), 0); days += prevMonth.getDate(); }
    if (months < 0) { years--; months += 12; }
    return { y: years, m: months, d: days };
};

// --- COMPONENTE CALENDARIO ---
const SimpleCalendar = ({ selectedDate, onSelectDate, onClose, themeColor }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = currentMonth.getFullYear();
  const monthIndex = currentMonth.getMonth();
  const monthName = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][monthIndex];
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [year, monthIndex, daysInMonth, firstDayOfMonth]);
  const handlePrevMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const handleDayClick = (day) => { if (day) { const date = new Date(year, monthIndex, day); const offset = date.getTimezoneOffset();
  const safeDate = new Date(date.getTime() - (offset*60*1000)); onSelectDate(safeDate.toISOString().split('T')[0]); onClose(); } };
  const selectedDateStr = selectedDate || today.toISOString().split('T')[0];
  const isDaySelected = (day) => day && new Date(year, monthIndex, day).toISOString().split('T')[0] === selectedDateStr;
  const isDayToday = (day) => day && new Date(year, monthIndex, day).toISOString().split('T')[0] === today.toISOString().split('T')[0];
  const primaryColorClass = `bg-${themeColor}-600 hover:bg-${themeColor}-700 text-white`;
  const todayColorClass = `border-${themeColor}-500 text-${themeColor}-600 bg-${themeColor}-50`;
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="p-4 bg-white rounded-xl shadow-2xl border border-slate-100 w-full animate-in zoom-in duration-300">
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3 text-center animate-pulse"><span className="text-red-600 font-extrabold text-xs uppercase block">⚠️ Seleccione Fecha de Atención</span></div>
        <div className="flex justify-between items-center mb-4"><button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><ArrowLeft size={16} /></button><h4 className="font-bold text-slate-800 text-base">{monthName} {year}</h4><button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100 text-slate-500"><ArrowRight size={16} /></button></div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2"><div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div></div>
        <div className="grid grid-cols-7 gap-1">{calendarDays.map((day, index) => (<div key={index} className="aspect-square">{day ?
        (<button onClick={() => handleDayClick(day)} className={`w-full h-full rounded-full flex items-center justify-center text-sm font-medium transition-all ${isDaySelected(day) ? primaryColorClass + ' shadow-md' : isDayToday(day) ? todayColorClass + ' border-2' : 'text-slate-700 hover:bg-slate-100'}`}>{day}</button>) : <div />}</div>))}</div>
      </div>
      <button onClick={onClose} className={`w-full mt-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors`}>Cerrar</button>
    </div>
  );
};

// --- COMPONENTE MODAL PARA VER SEGUIMIENTO CRED ---
const CredFollowUpModal = ({ isOpen, onClose }) => {
  const [credData, setCredData] = useState([]);
  const [columns, setColumns] = useState([]); 
  const [filterTerm, setFilterTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;
  const formatExcelDate = (value) => {
    if (typeof value === 'number' && value > 20000 && value < 60000) {
       const date = new Date(Math.round((value - 25569) * 86400 * 1000));
       date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
       if(!isNaN(date.getTime())) {
         return date.toLocaleDateString("es-PE");
       }
    }
    return value;
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (data.length > 0) {
            const headers = data[0];
            setColumns(headers); 
            const rows = data.slice(1).map((r, i) => {
                let obj = { id: i };
                headers.forEach((h, index) => {
                    obj[h] = r[index] !== undefined ? r[index] : "";
                });
                obj.searchStr = Object.values(obj).join(" ").toUpperCase();
                return obj;
            });
            setCredData(rows);
        }
      } catch (err) {
        alert("Error al leer el Excel CRED: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };
  const filteredData = credData.filter(row => 
    !filterTerm || row.searchStr.includes(filterTerm.toUpperCase())
  ).slice(0, 100);
  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95%] h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        
        {/* CABECERA */}
        <div className="bg-[#0F172A] p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-2 rounded-lg text-white"><FileSpreadsheet size={24}/></div>
                <div>
                    <h3 className="text-white font-bold text-lg">SEGUIMIENTO CRED</h3>
                    <p className="text-slate-400 text-xs">Visualización Completa del Archivo</p>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"><X size={24}/></button>
        </div>

        {/* BARRA DE HERRAMIENTAS */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-4 items-center shrink-0">
            {credData.length === 0 ?
            (
                <div className="relative group w-full">
                    <input type="file" id="fileCred" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                    <label htmlFor="fileCred" className="cursor-pointer w-full border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50 h-16 rounded-xl flex flex-col items-center justify-center transition-all group-hover:text-emerald-600 text-slate-500 font-bold">
                        {isLoading ? "Cargando..." : "📂 CLIC AQUÍ PARA CARGAR EL EXCEL 'SEGUIMIENTO CRED'"}
                    </label>
                </div>
            ) : (
                <div className="flex w-full gap-4">
                     <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-slate-400" size={20}/>
                        <input 
                            autoFocus
                            className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-slate-300 focus:border-emerald-500 outline-none font-bold uppercase text-sm" 
                            placeholder="BUSCAR EN CUALQUIER COLUMNA..." 
                            value={filterTerm}
                            onChange={e => setFilterTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => { setCredData([]); setColumns([]); }} className="px-4 bg-red-100 text-red-600 font-bold rounded-xl hover:bg-red-200 text-xs whitespace-nowrap">CAMBIAR ARCHIVO</button>
                </div>
            )}
        </div>

        {/* TABLA DE DATOS */}
        <div className="flex-1 overflow-auto bg-slate-100 p-4">
            {credData.length > 0 ?
            (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                             <tr>
                                {columns.map((col, i) => (
                                    <th key={i} className="px-4 py-3 border-b border-r border-slate-200 whitespace-nowrap min-w-[100px] bg-slate-50 sticky top-0 z-10">
                                             {col}
                                    </th>
                                ))}
                             </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.map((row) => (
                                <tr key={row.id} className="hover:bg-blue-50 transition-colors">
                                    {columns.map((col, i) => (
                                        <td key={i} className="px-4 py-2 text-slate-700 whitespace-nowrap border-r border-slate-100">
                                            {formatExcelDate(row[col])}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredData.length === 0 && <div className="p-10 text-center text-slate-400 font-bold">No se encontraron resultados para "{filterTerm}"</div>}
                </div>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-400 font-medium">
                    Esperando archivo...
                </div>
            )}
        </div>
        <div className="bg-slate-50 p-2 text-center text-[10px] text-slate-400 font-bold border-t border-slate-200">
            Mostrando {filteredData.length} registros.
            (Deslice horizontalmente para ver más columnas)
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE VISOR INTEGRADO (CON BOTÓN DE OJO) ---
const InlineFollowUpViewer = ({ type, data, onClose, onFileUpload, externalFilter, onView }) => {
  const [filter, setFilter] = useState(externalFilter || "");
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  useEffect(() => {setFilter(externalFilter || "");}, [externalFilter]);
  
  // Columnas (quitamos ID y searchStr)
  const columns = data && data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'id' && k !== 'searchStr') : [];
  const filtered = data ? data.filter(row => !filter || row.searchStr.includes(filter.toUpperCase())).slice(0, 100) : []; 

  const formatCell = (value) => {
      if (typeof value === 'number' && value > 20000 && value < 60000) {
          const date = new Date(Math.round((value - 25569) * 86400 * 1000));
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
          if(!isNaN(date.getTime())) {
              return date.toLocaleDateString("es-PE", { day: '2-digit', month: '2-digit', year: 'numeric' });
          }
      }
      return value;
  };

  return (
    <div className="mb-6 bg-white border-2 border-slate-200 rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 shadow-xl">
      {/* CABECERA */}
      <div className="bg-slate-100 p-3 flex justify-between items-center border-b border-slate-200">
        <h3 className="font-black text-slate-700 uppercase flex items-center gap-2">
           <Database size={18}/> SEGUIMIENTO: <span className="text-blue-600">{type}</span>
        </h3>
        <button onClick={onClose} className="text-xs font-bold bg-slate-200 hover:bg-red-100 text-slate-600 hover:text-red-600 px-3 py-1 rounded-lg transition-colors border border-slate-300">
            CERRAR VISOR
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="p-4">
        {(!data || data.length === 0) ? (
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                <p className="font-bold mb-3">No hay datos cargados para {type}</p>
                <input type="file" id={`file_${type}`} className="hidden" accept=".xlsx, .xls" onChange={(e) => onFileUpload(e, type)} />
                <label htmlFor={`file_${type}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold cursor-pointer text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95">
                    <Download size={16}/> CARGAR EXCEL {type}
                </label>
            </div>
        ) : (
            <>
                <div className="mb-3 relative">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16}/>
                    <input 
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs font-bold uppercase focus:ring-2 focus:ring-blue-100 outline-none" 
                        placeholder="BUSCAR EN ESTA LISTA..." 
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                    />
                </div>

                {/* SCROLLBAR SIEMPRE VISIBLE */}
                <div className="border border-slate-300 rounded-lg overflow-auto w-full max-h-[60vh] relative shadow-inner bg-slate-50">
                    <table className="w-full text-[10px] text-left border-collapse">
                        <thead className="bg-slate-100 text-slate-600 font-extrabold uppercase sticky top-0 z-20 shadow-sm">
                            <tr>
                                {/* COLUMNA DE ACCIÓN FIJA (OJO) */}
                                <th className="px-2 py-3 border-b border-r border-slate-300 bg-slate-200 text-center w-10 sticky left-0 z-30">
                                    VER
                                </th>
                                {columns.map((c, i) => (
                                    <th key={i} className="px-3 py-3 border-b border-r border-slate-300 whitespace-nowrap min-w-[100px] bg-slate-100">
                                         {c}
                                    </th>
                                ))}
                            </tr>
                        </thead>
               
			 <tbody className="bg-white">
                            {filtered.map((row, i) => {
                                // Determinamos si esta fila es la seleccionada
                                const isSelected = selectedRowIndex === row.id;

                                return (
                                    <tr 
                                        key={i} 
                                        // AL HACER CLIC: Si ya está seleccionada, la desmarca. Si no, la selecciona.
                                        onClick={() => setSelectedRowIndex(isSelected ? null : row.id)}
                                        // CLASES DINÁMICAS: Cambia el color de fondo si isSelected es true
                                        className={`transition-colors border-b cursor-pointer
                                            ${isSelected 
                                                ? 'bg-yellow-100 border-yellow-300'  // Color cuando está SELECCIONADO (Amarillo)
                                                : 'border-slate-200 hover:bg-blue-50' // Color normal y hover
                                            }
                                        `}
                                    >
                                        {/* BOTÓN OJO */}
                                        <td className={`px-2 py-2 border-r border-slate-200 text-center sticky left-0 z-20 shadow-sm
                                            ${isSelected ? 'bg-yellow-50' : 'bg-slate-50'}
                                        `}>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que al dar click al ojo se seleccione/deseleccione la fila
                                                    if (onView) onView(row);
                                                }} 
                                                className="bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white p-1.5 rounded-lg transition-all shadow-sm"
                                                title="Ver seguimiento gráfico"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                        
                                        {/* RESTO DE DATOS */}
                                        {columns.map((c, j) => (
                                            <td key={j} className="px-3 py-2 whitespace-nowrap border-r border-slate-200">
                                                {formatCell(row[c])}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>                            
                    </table>
                </div>
                
                <div className="mt-2 text-[10px] text-slate-400 font-bold text-right flex justify-between items-center">
                    <span>💡 Tip: Use Shift + Rueda del mouse para desplazarse horizontalmente.</span>
                    <span>Mostrando {filtered.length} coincidencias.</span>
                </div>
            </>
        )}
      </div>
    </div>
  );
};
// --- MODAL DE SEGUIMIENTO INDIVIDUAL (ESTILO PASTILLAS) ---
// --- MODAL DE SEGUIMIENTO INDIVIDUAL (CON SUPLEMENTACIÓN) ---
// --- MODAL DE SEGUIMIENTO INDIVIDUAL (CRED + GESTANTE) ---
// --- MODAL DE SEGUIMIENTO INDIVIDUAL (CRED + GESTANTE) ---
// --- MODAL DE SEGUIMIENTO INDIVIDUAL (ANEMIA CORRECTO + CRED/GESTANTE ORIGINAL) ---
// --- MODAL DE SEGUIMIENTO INDIVIDUAL (CORREGIDO: MUESTRA HB EN TODOS) ---
const SeguimientoIndividualModal = ({ paciente, onClose }) => {
  if (!paciente) return null;

  const eventos = paciente.historialControles;
  const suplementosTotal = paciente.historialSuplementos ? paciente.historialSuplementos.length : 0;
  
  // Tipos
  const esAnemia = paciente.tipoPaciente === 'ANEMIA';
  const isCred = paciente.tipoPaciente === 'CRED';
  const isGestante = paciente.tipoPaciente === 'GESTANTE';

  // Detectar anemia para alerta en cabecera
  const ultimaHb = !esAnemia ? paciente.historialControles.map(c => c.hb).filter(h => h).pop() : null;
  const tieneAnemiaAlerta = ultimaHb && parseFloat(ultimaHb) < 11.0;

  // --- TEMAS (TUS COLORES ORIGINALES) ---
  let theme = { gradient: 'bg-slate-700', border: 'border-slate-100', icon: <Activity size={48}/>, text: 'text-slate-700', badge: 'bg-slate-600' };
  
  if (isCred) theme = { gradient: 'bg-gradient-to-r from-emerald-500 to-teal-600', border: 'border-emerald-100', icon: <Baby size={48} strokeWidth={1.5}/>, text: 'text-emerald-600', badge: 'bg-emerald-500' };
  if (isGestante) theme = { gradient: 'bg-gradient-to-r from-pink-600 to-rose-700', border: 'border-pink-100', icon: <UserRound size={48} strokeWidth={1.5}/>, text: 'text-pink-600', badge: 'bg-pink-500' };
  if (esAnemia) theme = { gradient: 'bg-gradient-to-r from-red-800 to-red-950', border: 'border-red-100', icon: <Droplets size={48} strokeWidth={1.5}/>, text: 'text-red-800', badge: 'bg-red-600' };
  
  // Alerta visual en cabecera si corresponde
  if (tieneAnemiaAlerta) theme.gradient = 'bg-gradient-to-r from-orange-600 to-red-600 animate-pulse';

  // Helper para filas de Anemia
  const DataRow = ({ label, value, isHighlight }) => (
      <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-200 last:border-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase w-16">{label}:</span>
          <span className={`text-[11px] font-black uppercase text-right truncate flex-1 ${isHighlight ? 'text-sm text-slate-800' : 'text-slate-600'}`}>{value || '-'}</span>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-50 w-full max-w-6xl max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
        
        {/* CABECERA */}
        <div className={`relative px-8 py-6 shrink-0 overflow-hidden ${theme.gradient}`}>
          <div className="relative z-10 flex justify-between items-start text-white">
            <div className="flex gap-5 items-center">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-md shadow-inner border border-white/30">{theme.icon}</div>
              <div>
                <h2 className="text-2xl font-black tracking-tight leading-none mb-1">{paciente.nombre}</h2>
                <div className="flex gap-3 text-xs font-bold opacity-90 mt-1">
                  <span className="bg-black/20 px-3 py-1 rounded-lg">DNI: {paciente.dni}</span>
                  <span className="bg-black/20 px-3 py-1 rounded-lg">HC: {paciente.hc}</span>
                  {esAnemia && <span className="bg-black/20 px-3 py-1 rounded-lg">EDAD: {paciente.edad}</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all"><X size={24} /></button>
          </div>
        </div>

        {/* CUERPO */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-8">
          
          {/* SECCIÓN PRINCIPAL */}
          <div>
             <h3 className="text-slate-700 font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity size={18} className={theme.text}/> {esAnemia ? 'Ficha de Seguimiento' : 'Historial de Controles'}
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {eventos.map((ev, idx) => {
                 
                 // --- A. DISEÑO ANEMIA (FICHA TÉCNICA) ---
                 if (esAnemia) {
                     let headerColor = "bg-slate-600";
                     if (ev.tipo === 'DX') headerColor = "bg-red-700";
                     else if (ev.tipo === 'RECUPERADO') headerColor = "bg-emerald-600";
                     else if (ev.tipo === 'TERMINO') headerColor = "bg-slate-500";
                     else if (ev.tipo === 'CONTROL' && !ev.hb) headerColor = "bg-blue-600"; 

                     return (
                       <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full group">
                           <div className={`${headerColor} px-4 py-2 flex justify-between items-center text-white`}>
                               <span className="text-[10px] font-black uppercase tracking-wider">{ev.titulo}</span>
                               <div className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold flex gap-1"><Calendar size={10}/> {ev.fecha}</div>
                           </div>
                           <div className="p-4 flex-1 flex flex-col gap-1.5">
                               {ev.hb && ev.hb !== '-' && <DataRow label="HB" value={ev.hb} isHighlight={true} />}
                               {ev.detalle && <DataRow label={ev.etiqueta} value={ev.detalle} />}
                               <div className="mt-auto pt-2 border-t border-slate-50">
                                   <span className="text-[8px] font-bold text-slate-400 block uppercase mb-0.5">ATENDIÓ:</span>
                                   <div className="text-[9px] font-bold text-slate-600 uppercase leading-tight truncate" title={ev.responsable}>{ev.responsable}</div>
                               </div>
                           </div>
                           {ev.tipo === 'CONTROL' && <div className="h-1 bg-blue-400 w-full"></div>}
                       </div>
                     );
                 }

                 // --- B. DISEÑO CRED / GESTANTE (CON HB AGREGADA) ---
                 // Se detecta si este control específico tiene anemia
                 const isAnemiaCtrl = ev.hb && parseFloat(ev.hb) < 11.0;
                 
                 return (
                    <div key={idx} className={`bg-white rounded-2xl p-4 shadow-sm border-2 transition-all hover:shadow-lg ${isAnemiaCtrl ? 'border-red-200' : theme.border}`}>
                        <div className="flex justify-between items-center mb-3">
                           <span className={`text-xs font-black px-2 py-1 rounded-lg text-white shadow-sm ${isAnemiaCtrl ? 'bg-red-500' : theme.badge}`}>
                               {isCred ? `CRED ${ev.numero}` : `CPN ${ev.numero}`}
                           </span>
                           <span className="text-xs font-bold text-slate-500">{ev.fecha}</span>
                        </div>
                        
                        {/* AQUÍ ESTÁ EL CAMBIO: GRID DE 3 COLUMNAS PARA MOSTRAR LA HB */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                           <div className="bg-slate-50 rounded-xl p-1.5"><div className="text-[9px] font-bold text-slate-400">PESO</div><div className="font-black text-slate-700">{ev.peso||'-'}</div></div>
                           <div className="bg-slate-50 rounded-xl p-1.5"><div className="text-[9px] font-bold text-slate-400">TALLA</div><div className="font-black text-slate-700">{ev.talla||'-'}</div></div>
                           
                           {/* CAJA DE HEMOGLOBINA */}
                           <div className={`rounded-xl p-1.5 ${isAnemiaCtrl ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                               <div className="text-[9px] font-bold opacity-70">HB</div>
                               <div className="font-black">{ev.hb || '-'}</div>
                           </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-50 text-[9px] text-slate-400 font-medium truncate uppercase text-center">{ev.responsable}</div>
                    </div>
                 );
               })}
             </div>
          </div>

          {/* SECCIÓN SUPLEMENTACIÓN (SOLO CRED/GESTANTE) */}
          {!esAnemia && suplementosTotal > 0 && (
             <div className="mt-8">
                <h3 className="text-slate-700 font-black text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><Syringe size={18} className={theme.text}/> Suplementación</h3>
                <div className="flex flex-wrap gap-3">
                   {paciente.historialSuplementos.map((supl, idx) => (
                      <div key={idx} className={`border-2 rounded-2xl p-2 w-32 flex flex-col items-center justify-center bg-white ${theme.border}`}><div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-white shadow-sm ${theme.badge}`}><span className="font-black text-xs">{supl.numero}º</span></div><span className={`text-[9px] font-black uppercase mb-0.5 ${theme.text}`}>{supl.tipo}</span><span className="text-sm font-black text-slate-800">{supl.fecha}</span></div>
                   ))}
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
// --- CONFIGURACIÓN MAESTRA DE LABS (Con Etiquetas Personalizadas) ---
const LAB_CONFIG = {
    // CASOS SIMPLES (Array = Texto por defecto "LAB")
    'D509': { 1: ['LEV', 'MOD', 'SEV','PR'] }, 
    'D649': { 1: ['LEV', 'MOD', 'SEV'] },
    'O990': { 1: ['LEV', 'MOD', 'SEV'] },
   //'Z001': { 1: [''] },
   //'Z002': { 1: [''] },
   //'Z003': { 1: [''] },
    '99381.01': { 1: ['1', '2', '3', '4'] },
    '99381': { 1: ['1', '2', '3', '4', '5', '6', '7'] },
    '99382': { 1: ['1', '2', '3', '4', '5', '6'] },
    '99383': { 1: ['1', '2'] },
    '99199.17': { 1: ['1', '2', '3', '4', '5', '6', '7', '8', 'TA'] },
    '99199.18': { 1: ['1', '2', '3', '4', '5', '6', '7', '8'] },
    '99199.19': { 1: ['1', '2', '3', '4', '5', '6', '7', '8'] },
    '99199.26': { 1: ['1', '2', '3', '4', '5', '6', '7', '8','TA'] },
    '99199.27': { 1: ['1', '2', '3'] },
    '59401.05': { 1: ['1', '2', '3'] },
    '59401.06': { 1: ['1', '2', '3', 'TA'] },
    '59430': { 1: ['1', '2',''] },
    'Z359': { 1: ['1', '2','3'] },



//==============================================================================================
    // CASOS CON TEXTO PERSONALIZADO (Objeto con 'label')
    // Z359 cubre Z3591, Z3592, Z3593 gracias a la búsqueda parcial
    '99208': {
         1: { label: ['TIPO'] , options: ['TA', '']}
            },
    '99208.02': {
         1: { label: ['INSUMOS'] , options: ['10', '30']}
            },
    '99208.04': {
         1: { label: ['INSUMOS'] , options: ['1']}
            },
    '99208.05': {
         1: { label: ['INSUMOS'] , options: ['1']}
            },
    '11975': {
         1: { label: ['INSUMOS'] , options: ['1','']}
            },
    '99208.13': {
         1: { label: ['INSUMOS'] , options: ['1','4']}
            },

    'R456': {
         1: { label: ['TIPO'] , options: ['G', '']}
            },
'99402.05': {
         1: { label: ['N°'] , options: ['1','2']}
            },
'99401.02': {
         1: { label: ['N°'] , options: ['1','2','3']}
            },
'99208.14': {
         1: { label: ['TIPO'] , options: ['RSM','RSR','RSA']}
            },
'9940.14': {
         1: { label: ['TIPO'] , options: ['RSM','RSR','RSA']}
            },
'99402.01': {
         1: { label: ['N°'] , options: ['1','2','3']}
            },
'99402.03': {
         1: { label: ['N°'] , options: ['1','2','3']}
            },
'99209': {
         1: { label: ['N°'] , options: ['1','2','3','4','5','6','7','8','9','10']}
            },
'99501': {
         1: { label: ['N°'] , options: ['1','2']}
            },

'C0010': {
         1: { label: ['TIPO'] , options: ['']},
         2: { label: ['TIPO'] , options: ['']}
            },
'C0009': {
         1: { label: ['TIPO'] , options: ['']},
         2: { label: ['TIPO'] , options: ['']}
            },

'99502': {
         1: { label: ['N°'] , options: ['1','2']}
            },
'36416': {
         1: { label: ['N°'] , options: ['1','2']}
            },
'99199.28': {
         1: { label: ['N°'] , options: ['1','2']}
            },

'87342': {
         1: { label: ['TIPO'] , options: ['RN', 'RP']}
            },

    '88141': {
         1: { label: ['TIPO'] , options: ['N', '','A']}
            },
    '81000.02': {
         1: { label: ['TIPO'] , options: ['RN','RP']}
            },
    '82044': {
         1: { label: ['TIPO'] , options: ['RN','RP']}
            },

        '88141.01': {
         1: { label: ['TIPO'] , options: ['N','A']}
            },
'85018.01': {
         1: { label: ['LAB1'] , options: ['']}
            },
'85018': {
         1: { label: ['LAB1'] , options: ['']}
            },

   '99401.33': {
         1: { label: ['N°'] , options: ['1','2','']}
            },
    '99401.34': {
         1: { label: ['N°'] , options: ['1','2','']}
            },
'86318.01': { 
        1: { label: 'R.VIH', options: ['RN','RP'] }, 
        2: { label: 'R.SIFILIS', options: ['RN','RP'] } // 'SEM' es mejor para el espacio pequeño
    },
'86803.01': { 
        1: { label: 'RESULT', options: ['RN','RP'] }, 
            },
'99386.03': { 
        1: { label: 'RESULT', options: ['N','A'] }, 
            },
'Z006': { 
        1:  ['IMC','PRG','']  
            },
'Z019': { 
        1:  ['ALT','']
            },

'O261': { 
        1:  ['IMC','']  
            },

'O260': { 
        1:  ['IMC','']  
            },
'E660': { 
        1:  ['IMC','']  
            },
'E669': { 
        1:  ['IMC','']  
            },
'E6690': { 
        1:  ['IMC','']  
            },
'E6691': { 
        1:  ['IMC','']  
            },
'E6692': { 
        1:  ['IMC','']  
            },
'E6693': { 
        1:  ['IMC','']  
            },
'E440': { 
        1: [''], 
            },

'99402.08': { 
        1: { label: 'N°', options: ['1','2'] }, 
            },
'U2142': { 
        1: [''] , 
            },
'U310': { 
        1: [''] , 
            },
'99401.13': { 
        1: [''] , 
            },
'99403.01': { 
        1: [''] , 2: ['','RD','PD'] 
            },
'I10X': { 
        1: [''] ,2: [''] , 
            },
'E119': { 
        1: [''] ,2: [''] , 
            },
'99207': { 
        1: { label: 'N°', options: ['1','2','3','4','5'] }, 
            },
'99207.01': { 
        1: { label: 'N°', options: ['1','2','3','4','5'] }, 
            },

'C0011': { 
        1: [''] , 
            },
'E617': { 
        1: [''] , 
            },
'E631': { 
        1: [''] , 
            },

'T743': { 
        1: [''] , 
            },
'T748': { 
        1: [''] , 
            },
'F930': { 
        1: [''] , 
            },
'F931': { 
        1: [''] , 
            },
'F932': { 
        1: [''] , 
            },
'F064': { 
        1: [''] , 
            },
'D2392': { 
        1: [''] , 
            },
'K040': { 
        1: [''] , 
            },

'D0150': { 
        1: [''] , 
            },
'D0120': { 
        1: [''] , 
            },
'D1110': { 
        1: { label: 'N°', options: ['1','2'] }, 
            },
'D1310': { 
        1: { label: 'N°', options: ['1','2'] }, 
            },
'D1330': { 
        1: { label: 'N°', options: ['1','2'] }, 
            },

'99402.04': { 
        1: { label: 'N°', options: ['1','2'] }, 
            },

'E45X': { 
        1: { label: 'RESULT', options: ['TE'] }, 
            },
'A64X9': { 
        1: { label: 'TIPO', options: ['ITS',''] }, 
            },
'99199.11': { 
        1: { label: 'N°', options: ['TA','1','2','3','4'] }, 
            },
'99384': { 
        1: { label: 'N°', options: ['TA','1','2','3'] }, 
            },

'99209.04': { 
        1: { label: 'RIESGO', options: ['RSA','RSM','RSR'] }, 
            },
'99384': { 
        1: { label: 'N°', options: ['1','2','3'] }, 
            },

//==============================================================================================================
'99801': { 
        1: { label: 'N°', options: ['TA','1','2',] },
        2: { label: 'TIPO', options: ['1','2'] },
        3: { label: 'ESCEN.', options: ['1','2','3'] }, 
            },


'99173': { 
        1: { label: 'OJO DERECH', options: [''] }, 
        2: { label: 'OJO IZQU.', options: [] } 
    },

    'Z3591': { 
        1: { label: 'N° CPN', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] }, 
        2: { label: 'SEM<14', options: [] } // 'SEM' es mejor para el espacio pequeño
    },
    'Z3592': { 
        1: { label: 'N° CPN', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] }, 
        2: { label: 'SEM: 14-27', options: [] } // 'SEM' es mejor para el espacio pequeño
    },

    'Z3593': { 
        1: { label: 'N° CPN', options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] }, 
        2: { label: 'SEM>27', options: [] } // 'SEM' es mejor para el espacio pequeño
    },

    'Z3493': { 
        1: { label: 'CPN', options: ['1','2','3','4','5','6','7'] }, 
        2: { label: 'SEM', options: [] },
        3: { label: 'TA', options: ['TA'] } // <--- IMPORTANTE: HABILITAR LAB 3
    },
    'Z3593': { 
        1: { label: 'CPN', options: ['1','2','3','4','5','6','7'] }, 
        2: { label: 'SEM', options: [] },
        3: { label: 'TA', options: ['TA'] } // <--- IMPORTANTE: HABILITAR LAB 3
    },

    '99199.22': { 
        1: { label: 'SISTOLICA', options: [] }, 
        2: { label: 'DIASTOLICA', options: [] }
    }

};
export default function App() {
  const [showNutriModal, setShowNutriModal] = useState(false);
  const [showAnemiaModal, setShowAnemiaModal] = useState(false);
  const [focusedLab, setFocusedLab] = useState({ rowIndex: null, labNum: null });
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [lastClinicalData, setLastClinicalData] = useState({});
  const [isDataVerified, setIsDataVerified] = useState(false);
  const hcInputRef = useRef(null);
  // LISTA DE CASERÍOS
  const listaCaserios = useMemo(() => Object.keys(LOCALIDADES_ALTITUD).sort(), []);
  const calendarRef = useRef(null);
  const handleDateSelect = (date) => setPatientData(prev => ({ ...prev, fecAtencion: date }));
  const [showCredModal, setShowCredModal] = useState(false);
  const [isBatchFinished, setIsBatchFinished] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 1. Lógica del Calendario (Mantenemos la que tenías)
      if (isCalendarOpen && calendarRef.current && !calendarRef.current.contains(event.target) && event.target.tagName !== 'BUTTON') {
          setIsCalendarOpen(false);
      }

      // 2. Lógica de Sugerencias LAB (NUEVO)
      // Si haces clic en cualquier sitio que NO sea un Input ni un Botón, se cierran las sugerencias.
      // Usamos .closest('button') por si haces clic en un ícono dentro de un botón.
      if (event.target.tagName !== 'INPUT' && !event.target.closest('button')) {
          setFocusedLab({ rowIndex: null, labNum: null });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCalendarOpen]);
  const stepColors = ['blue', 'emerald', 'indigo', 'amber'];
  const getTheme = (s) => { const color = stepColors[s-1] || 'slate';
  return { border: `border-${color}-200`, focusBorder: `focus:border-${color}-500`, focusRing: `focus:ring-${color}-100`, text: `text-${color}-800`, labelText: `text-${color}-600`, bgHover: `hover:bg-${color}-50`, bgLight: `bg-${color}-50/50` }; };
  const baseInputStyle = "w-full h-9 px-3 border-2 rounded-xl bg-white font-bold outline-none transition-all shadow-sm text-sm";
  const dateInputStyle = "relative w-full h-9 px-3 py-1 border-2 rounded-xl bg-white font-bold outline-none transition-all shadow-sm text-sm cursor-pointer";
  const getInputStyle = (s) => `${baseInputStyle} ${getTheme(s).border} ${getTheme(s).text} ${getTheme(s).focusBorder} focus:ring-4 ${getTheme(s).focusRing} hover:border-opacity-80`;
  const getSelectStyle = (value, hasError = false) => {
    const baseStyle = getInputStyle(1);
    if (value === "" || hasError) return `${baseStyle.replace(getTheme(1).border, 'border-red-500').replace(getTheme(1).focusBorder, 'focus:border-red-600')} bg-red-50 text-red-900 animate-pulse`;
    return `${baseStyle.replace(getTheme(1).border, 'border-emerald-500').replace(getTheme(1).focusBorder, 'focus:border-emerald-600')} bg-emerald-50 text-emerald-900 font-black`;
  };

  const getLockedInputStyle = (s) => `${baseInputStyle} ${getTheme(s).border} ${getTheme(s).text} border-slate-200 bg-slate-50 cursor-default shadow-inner`;
  const getDateInputStyle = (s) => `${dateInputStyle} ${getTheme(s).border} ${getTheme(s).text} ${getTheme(s).focusBorder} focus:ring-4 ${getTheme(s).focusRing} hover:border-opacity-80`;
  const getLockedDateInputStyle = (s) => `${dateInputStyle} ${getTheme(s).border} ${getTheme(s).text} border-slate-200 bg-slate-50 cursor-default shadow-inner`;
  const getLabelStyle = (s) => `block text-[10px] font-bold uppercase ml-2 mb-0.5 ${getTheme(s).labelText}`;
  const borderlessInputStyle = "w-full h-9 px-3 rounded-xl bg-slate-50 font-bold outline-none text-sm text-slate-800 transition-all focus:bg-white focus:ring-2 focus:ring-emerald-100 shadow-sm";
  const MESES = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SETIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
  const ESTABLECIMIENTOS = ["E.S I-4 PACAIPAMPA", "P.S I-2 EL PUERTO", "P.S I-1 LAGUNAS DE SAN PABLO", "P.S I-1 CUMBICUS", "P.S I-1 CACHIACO"];
  const UPS_LIST = ["MEDICINA", "ENFERMERIA", "OBSTETRICIA", "NUTRICION", "ODONTOLOGIA", "PSICOLOGIA"];
  const [dbPacientes, setDbPacientes] = useState([]);
  
  // DATOS IMPORTADOS
  const [dbCie10, setDbCie10] = useState(CIE10_LIST); 
  const [dbPersonal, setDbPersonal] = useState(PERSONAL_LIST);
  const [dbStatus, setDbStatus] = useState('loading'); 

  // --- NUEVOS ESTADOS PARA LOGIN ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginDni, setLoginDni] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [loginError, setLoginError] = useState("");
  const handleLogin = (e) => {
    e.preventDefault();
    const user = dbPersonal.find(u => u.dni === loginDni);

    if (user && user.password === loginPass) {
      setIsAuthenticated(true);
      setLoginError("");
      
      // --- AQUÍ ESTÁ EL CAMBIO ---
      if (typeof setAdminData === 'function') {
        setAdminData(prev => ({ 
            ...prev, 
            dniResp: user.dni, 
            nombreResp: user.nombre,
            
            // Si el usuario tiene UPS definida, úsala. Si no, usa MEDICINA por defecto.
            ups: user.ups || 'MEDICINA' 
        }));
      }
      // ---------------------------

    } else {
      setLoginError("Credenciales incorrectas o usuario no encontrado");
    }
  };

  const [validationAlert, setValidationAlert] = useState({ isOpen: false, type: '', title: '', message: '', details: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [isPatientDataLocked, setIsPatientDataLocked] = useState(false); 

  const [isDxModalOpen, setIsDxModalOpen] = useState(false);
  const [currentDxRow, setCurrentDxRow] = useState(0); 
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [modalSuggestions, setModalSuggestions] = useState([]);
  const [tempDx, setTempDx] = useState({ desc: '', tipo: 'D', lab1: '', lab2: '', lab3: '', codigo: '' });
  const [dxSuggestions, setDxSuggestions] = useState([]);
  const [activeDxIndex, setActiveDxIndex] = useState(null);
  const [activeDxField, setActiveDxField] = useState(null);
  
  const dxListRef = useRef(null);
  const dxBottomRef = useRef(null); 
  const tipoRefs = useRef([]);
  const [dxErrors, setDxErrors] = useState({});

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualData, setManualData] = useState({ dni: '', nombres: '', fecNac: '2000-01-01', sexo: 'M', hc: '', distrito: '', direccion: '', financiador: '2-SIS', estOrigen: '' });
  const [showJurisdictionModal, setShowJurisdictionModal] = useState(false);
  const [jurisdictionErrorMsg, setJurisdictionErrorMsg] = useState("");
  const [showAdolescentModal, setShowAdolescentModal] = useState(false);

  const [anemiaLocation, setAnemiaLocation] = useState("");
  const [anemiaResult, setAnemiaResult] = useState("");
  const [anemiaColor, setAnemiaColor] = useState("bg-slate-200 text-slate-500");
  const [hbAdjusted, setHbAdjusted] = useState(null);
  const [isPremature, setIsPremature] = useState(false);

  const [adminData, setAdminData] = useState({ anio: '2026', mes: 'ENERO', establecimiento: 'E.S I-4 PACAIPAMPA', turno: 'MAÑANA', ups: 'MEDICINA', dniResp: '', nombreResp: '', isConfigured: false });
  const [printCount, setPrintCount] = useState(() => {
      const saved = localStorage.getItem('his_print_count');
      return saved ? parseInt(saved, 10) : 0;
  });
  const initialPatient = { dni: '', paciente: '', hc: '', fecNac: '', sexo: '', financiador: '', direccion: '', distrito: '', estAtencion: 'PACAIPAMPA', fecAtencion: '', condicion: '', fur: '', estOrigen: '', condEst: '', condServ: '' };
  const [patientData, setPatientData] = useState(initialPatient);
  //const [showNewBtn, setShowNewBtn] = useState(false);
  // --- CARGA DE DATOS GUARDADOS (PERSISTENCIA) ---
  const [savedPatients, setSavedPatients] = useState(() => {
      try {
          const datosGuardados = localStorage.getItem('HIS_LOTE_PENDIENTE');
          return datosGuardados ? JSON.parse(datosGuardados) : [];
      } catch (e) {
          console.error("Error cargando lote guardado", e);
          return [];
      }
  });
  const [showNewBtn, setShowNewBtn] = useState(false);
  // CAMBIO: Formato de edad extendido
  const ageString = useMemo(() => { 
      const { y, m, d } = getAgeComponents(patientData.fecNac, patientData.fecAtencion); 
      if (typeof y !== 'number') return "-";
      return `${y} AÑOS, ${m} MESES, ${d} DÍAS`; 
  }, [patientData.fecNac, patientData.fecAtencion]);
  const ageObj = useMemo(() => { return getAgeComponents(patientData.fecNac, patientData.fecAtencion); }, [patientData.fecNac, patientData.fecAtencion]);
  const ageInMonths = useMemo(() => { if (typeof ageObj.y === 'number' && typeof ageObj.m === 'number') { return (ageObj.y * 12) + ageObj.m; } return ''; }, [ageObj]);
  const initialClinical = { peso: '', talla: '', pAbd: '', pCef: '', imc: '', hb: '', dosaje: '', estNut: '', nivHb: '', riesgo: ' ', pPreGest: '' };
  const [clinicalData, setClinicalData] = useState(initialClinical);

  const [diagnoses, setDiagnoses] = useState([{ desc: '', tipo: '-', lab1: '', lab2: '', lab3: '', codigo: '' }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [ignorePreGestValidation, setIgnorePreGestValidation] = useState(false);
  const [showPreGestError, setShowPreGestError] = useState(false);
  const [showHbError, setShowHbError] = useState(false);
  const [ignorePAbdValidation, setIgnorePAbdValidation] = useState(false);
  const [showPAbdError, setShowPAbdError] = useState(false);
  const [ignorePCefValidation, setIgnorePCefValidation] = useState(false);
  const [showPCefError, setShowPCefError] = useState(false);
  const [activeFollowUp, setActiveFollowUp] = useState(null); 
  const [selectedGestanteForModal, setSelectedGestanteForModal] = useState(null);
  // 1. PREPARAR DATOS GESTANTES
  const dataGestantesInicial = useMemo(() => {
      if (typeof SEGUIMIENTO_GESTANTES !== 'undefined' && Array.isArray(SEGUIMIENTO_GESTANTES)) {
          return SEGUIMIENTO_GESTANTES.map((row, i) => ({ ...row, id: i, searchStr: Object.values(row).join(" ").toUpperCase() }));
      }
      return [];
  }, []);

  // 2. PREPARAR DATOS CRED (NUEVO)
  const dataCredInicial = useMemo(() => {
      if (typeof SEGUIMIENTO_CRED !== 'undefined' && Array.isArray(SEGUIMIENTO_CRED)) {
          return SEGUIMIENTO_CRED.map((row, i) => ({ ...row, id: i, searchStr: Object.values(row).join(" ").toUpperCase() }));
      }
      return [];
  }, []);
  
  // 3. PREPARAR DATOS ANEMIA (NUEVO)
  const dataAnemiaInicial = useMemo(() => {
      if (typeof SEGUIMIENTO_ANEMIA !== 'undefined' && Array.isArray(SEGUIMIENTO_ANEMIA)) {
          return SEGUIMIENTO_ANEMIA.map((row, i) => ({ ...row, id: i, searchStr: Object.values(row).join(" ").toUpperCase() }));
      }
      return [];
  }, []);

  // 3. INICIALIZAR EL ESTADO CON AMBOS
  const [followUpData, setFollowUpData] = useState({
      'GESTANTE': dataGestantesInicial,
      'CRED': dataCredInicial, // <--- ¡AQUÍ AGREGAMOS CRED!
      'ANEMIA': dataAnemiaInicial
  });
  useEffect(() => {
    const initDB = async () => {
        try {
            const patients = await idb.getPatients();
            if (patients && patients.length > 0) {
                setDbPacientes(patients);
                setDbStatus('ready');
            } else {
                setDbStatus('empty');
            }
        } catch (e) {
            console.error("Error cargando BD", e);
            setDbStatus('empty');
        }
    };
    initDB();
  }, []);
  const clearDatabase = async () => {
      if(window.confirm("¿Estás seguro de que deseas borrar la base de datos de pacientes local? Tendrás que subir el archivo nuevamente.")) {
          await idb.clearPatients();
          setDbPacientes([]);
          setDbStatus('empty');
          alert("Base de datos limpiada.");
      }
  };

  const isInvalidCombo = useMemo(() => {
        const { condEst, condServ } = patientData;
        if (!condEst || !condServ) return false;
        if ( (condEst === 'R' && condServ === 'C') || (condEst === 'N' && condServ === 'C') || (condEst === 'N' && condServ === 'R') ) return true;
        return false;
  }, [patientData.condEst, patientData.condServ]);
  // --- CALCULADORA DE IMC INTEGRADA CON TABLAS OMS (ARCHIVO EXTERNO) ---
  useEffect(() => {
    const p = parseFloat(clinicalData.peso);
    const t = parseFloat(clinicalData.talla);
    
    // Usamos el objeto de edad (ageObj) que ya calculaste
    const anios = typeof ageObj.y === 'number' ? ageObj.y : 0;
    const mesesTotales = (ageObj.y * 12) + (ageObj.m || 0);

    let imcCalc = "";
    let dx = "";

    // 1. CÁLCULO MATEMÁTICO (Solo si hay peso y talla)
    if (p > 0 && t > 0) {
        const t_m = t / 100;
        imcCalc = (p / (t_m * t_m)).toFixed(2);
    }

    if (imcCalc) {
        const imcVal = parseFloat(imcCalc);

        // --- CASO A: ADULTO MAYOR (>= 60 años) ---
        if (anios >= 60) {
            if (imcVal < 23.0) dx = "DELGADEZ";
            else if (imcVal <= 27.9) dx = "NORMAL";
            else if (imcVal <= 31.9) "SOBREPESO";
            else dx = "OBESIDAD";
        }
        
        // --- CASO B: ADULTO (20 a 59 años) ---
        else if (anios >= 20) {
            if (imcVal < 18.5) dx = "BAJO PESO";
            else if (imcVal <= 24.9) dx = "NORMAL";
            else if (imcVal <= 29.9) dx = "SOBREPESO";
            else if (imcVal <= 34.9) dx = "OBESIDAD I";
            else if (imcVal <= 39.9) dx = "OBESIDAD II";
            else dx = "OBESIDAD III";
        }
        
        // --- CASO C: NIÑOS Y ADOLESCENTES (5 a 19 años) ---
        // ¡AQUÍ ESTÁ LA MAGIA! LLAMAMOS AL ARCHIVO EXTERNO
        else if (anios >= 5) {
            dx = getDiagnosticoNino(patientData.sexo, mesesTotales, imcVal);
        }
        // Menores de 5 años (Usan curvas P/T, no IMC generalmente en este paso rápido)
        else {
            dx = ""; // O puedes poner lógica CRED si la tienes
        }
    }

    // 3. ACTUALIZAR ESTADO
    setClinicalData(prev => ({ 
        ...prev, 
        imc: imcCalc,
        riesgo: dx 
    }));
  }, [clinicalData.peso, clinicalData.talla, ageObj.y]);
  //useEffect(() => { if (patientData.condicion !== 'GESTANTE') setPatientData(prev => ({...prev, fur: ''})); }, [patientData.condicion]);
  useEffect(() => { if (adminData.isConfigured) setPatientData(prev => ({...prev, estAtencion: adminData.establecimiento})); }, [adminData.isConfigured, adminData.establecimiento]);
  useEffect(() => { setAnemiaResult(""); setAnemiaColor("bg-slate-200 text-slate-500"); setHbAdjusted(null); }, [patientData.dni]);
    // --- NUEVA LÓGICA PROACTIVA: DETECTAR GESTANTE POR FUR ---
 // --- NUEVA LÓGICA PROACTIVA: DETECTAR GESTANTE POR FUR (CORREGIDO) ---
  useEffect(() => {
      // Solo si estamos en el Paso 1, hay una FUR válida y la condición no está definida
      if (step === 1 && patientData.fur && (!patientData.condicion || patientData.condicion === 'NINGUNA')) {
          
          // Pequeño delay para que no choque con la renderización
          const timer = setTimeout(() => {
              const confirmacion = window.confirm(
                  `⚠️ ATENCIÓN: Sra. ${patientData.paciente}\n\n` +
                  `El sistema detectó una Fecha de Última Regla (FUR): ${patientData.fur}\n\n` +
                  `¿La paciente continúa con la condición de GESTANTE?\n` +
                  `[SÍ] = SÍ, marcar como GESTANTE.\n` +
                  `[NO, Ya no es gestante] = borrar FUR y continuar.`
              );

              if (confirmacion) {
                  // Opción SÍ: Marcar como GESTANTE
                  setPatientData(prev => ({ ...prev, condicion: 'GESTANTE' }));
              } else {
                  // Opción NO: Borrar FUR y dejar Condición vacía
                  setPatientData(prev => ({ ...prev, fur: '', condicion: '' }));
              }
          }, 200);
          
          return () => clearTimeout(timer); // Limpieza del timer
      }
  }, [patientData.fur, step]); // Se ejecuta cuando cambia la FUR o el paso
  const handleFileUpload = (e, type) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const wb = XLSX.read(evt.target.result, { type: 'binary' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });
          if (type === 'pacientes') {
            const procesados = rawData.slice(1).map(r => {
                if (!r[0] && !r[1]) return null;
                const historyRange = [];
                for(let i=9; i<=13; i++) { if(r[i]) historyRange.push(String(r[i]).trim().toUpperCase()); }

                return {
                    dni: r[0] ? String(r[0]).trim().padStart(8, '0') : "", 
                    nombre: r[1] ? String(r[1]).trim() : "", 
                    fecNac: r[2], 
                    sexo: r[3] ? String(r[3]).trim() : "M", 
                    financiador: r[4] ? String(r[4]).trim() : "SIS", 
                    hc: r[5] ? String(r[5]).trim().replace(/^'/, '') : "", 
                    distrito: r[6] ? String(r[6]).trim() : "", 
                    direccion: r[7] ? String(r[7]).trim() : "", 
                    estOrigen: r[8] ? String(r[8]).trim() : "", 
                    historialEst: historyRange,
                    
                    last_fec_talla: r[14], last_talla: r[15],
                    last_fec_peso:  r[16], last_peso:  r[17],
                    last_fec_pabd:  r[18], last_pabd:  r[19],
                    last_fec_pcef:  r[20], last_pcef:  r[21],
                    last_fec_hb:    r[22], last_hb:    r[23],
                    last_fur:       r[24],
                    last_fec_ppreg: r[25], last_ppreg: r[26],

                    busqueda: ((r[0] ? String(r[0]).trim().padStart(8, '0') : "") + " " + String(r[1]||"")).toUpperCase()
                };
            }).filter(p => p !== null);
            
            await idb.savePatients(procesados);
            setDbPacientes(procesados);
            setDbStatus('ready');
            alert(`✅ BASE DE DATOS ACTUALIZADA: ${procesados.length} pacientes cargados con sus históricos.`);
          } else if (type === 'cie10') {
            const procesados = rawData.slice(1).map(r => ({ CODIGO: r[0] ? String(r[0]).trim() : "", DESCRIPCION: r[1] ? String(r[1]).trim() : "", BUSQUEDA: (String(r[0]||"") + " " + String(r[1]||"")).toUpperCase() })).filter(d => d.CODIGO);
            setDbCie10(procesados);
            alert(`✅ ${procesados.length} diagnósticos cargados.`);
          } else if (type === 'personal') {
            const procesados = rawData.slice(1).map(r => ({ dni: r[0] ? String(r[0]).trim() : "", nombre: r[1] ? String(r[1]).trim() : "" })).filter(p => p.dni);
            setDbPersonal(procesados);
            alert(`✅ ${procesados.length} personal cargado.`);
          }
        } catch (err) { alert("Error leyendo el archivo: " + err.message);
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) { alert("Error subiendo el archivo: " + error.message);
    }
  };

  const handleFollowUpUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (data.length > 0) {
            const headers = data[0];
            const rows = data.slice(1).map((r, i) => {
                let obj = { id: i };
                headers.forEach((h, index) => { obj[h] = r[index] !== undefined ? r[index] : ""; });
                obj.searchStr = Object.values(obj).join(" ").toUpperCase();
                return obj;
             });
            setFollowUpData(prev => ({ ...prev, [type]: rows }));
        }
      } catch (err) { alert("Error al leer Excel: " + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };
  const handleSearchInput = (e) => {
      const val = e.target.value.toUpperCase();
      setSearchTerm(val);

      // 1. SI BORRAS TODO, RESETEA EL FORMULARIO
      if (val === "") {
          setPatientData(initialPatient); 
          setClinicalData(initialClinical);
          setDiagnoses([{ desc: '', tipo: '-', lab1: '', lab2: '', lab3: '', codigo: '' }]);
          setIsPatientDataLocked(false);
          setSuggestions([]);
          setShowSuggestions(false);
          return;
      }

      // 2. BUSCAR SOLO EN BASE DE DATOS LOCAL (dbPacientes)
      // Usamos dbPacientes que son los que TÚ has guardado o registrado manualmente
      if (val.length > 1 && dbPacientes.length > 0) {
        const resultados = dbPacientes.filter(p => p.busqueda.includes(val)).slice(0, 10);
        setSuggestions(resultados);
        setShowSuggestions(true);
      } else { 
        setSuggestions([]); 
        setShowSuggestions(false); 
      }
  };  
  const parseExcelDate = (d) => {
    if (!d) return '2000-01-01';
    try {
      if (typeof d === 'number') { const date = new Date(Math.round((d - 25569)*86400*1000));
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : '2000-01-01'; }
      if (typeof d === 'string') { if(d.includes('/')) { const p = d.split('/');
      if (p.length === 3) return `${p[2]}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`; } if(d.includes('-') && !isNaN(Date.parse(d))) return d;
      }
    } catch (e) { return '2000-01-01'; }
    return '2000-01-01'; 
  };
  const cleanStr = (str) => { if (!str) return ""; return str.replace(/[^A-Z0-9]/g, ''); };
  const getHighlightedText = (text, highlight) => {
      if (!highlight || !text) return text;
      const parts = text.toString().split(new RegExp(`(${highlight})`, 'gi'));
      return parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
          <span key={i} className="text-blue-600 font-black bg-blue-50/50 rounded px-0.5">{part}</span> : part
      );
  };
  const selectPatient = (p) => {
      setShowSuggestions(false); 
      setSuggestions([]); 
      
      // 1. DETECCIÓN DE JURISDICCIÓN
      let estConfigRaw = adminData.establecimiento.trim().toUpperCase();
      let estPatientRaw = p.estOrigen ? p.estOrigen.trim().toUpperCase() : "";
      
      let keyword = "";
      if (estConfigRaw.includes("PACAIPAMPA")) keyword = "PACAIPAMPA";
      else if (estConfigRaw.includes("PUERTO")) keyword = "PUERTO";
      else if (estConfigRaw.includes("LAGUNAS")) keyword = "LAGUNAS";
      else if (estConfigRaw.includes("CUMBICUS")) keyword = "CUMBICUS";
      else if (estConfigRaw.includes("CACHIACO")) keyword = "CACHIACO";
      else keyword = estConfigRaw;

      const isSameJurisdiction = estPatientRaw.includes(keyword);

      // 2. PREPARAR DATOS COMUNES
      setSearchTerm(p.nombre || "");
      const safeFecNac = parseExcelDate(p.fecNac);
      
      // Alerta Adolescente
      const currentAgeObj = getAgeComponents(safeFecNac, patientData.fecAtencion);
      if (currentAgeObj.y >= 12 && currentAgeObj.y <= 17) {
          setShowAdolescentModal(true);
      }

      // Cargar Historial Clínico Previo
      const formatLastDate = (val) => {
          if(!val) return "-";
          const isoDate = parseExcelDate(val); 
          if (!isoDate || isoDate === '2000-01-01') return "-";
          const partes = isoDate.split('-'); 
          if(partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`; 
          return isoDate;
      };

      setLastClinicalData({
          talla: { val: p.last_talla, date: formatLastDate(p.last_fec_talla) },
          peso:  { val: p.last_peso,  date: formatLastDate(p.last_fec_peso) },
          pAbd:  { val: p.last_pabd,  date: formatLastDate(p.last_fec_pabd) },
          pCef:  { val: p.last_pcef,  date: formatLastDate(p.last_fec_pcef) },
          hb:    { val: p.last_hb,    date: formatLastDate(p.last_fec_hb) },
          pPreg: { val: p.last_ppreg, date: formatLastDate(p.last_fec_ppreg) }
      });

      // --- VERIFICAR SI FALTAN DATOS CRÍTICOS (HC o DIRECCIÓN) ---
      const faltaHC = !p.hc || String(p.hc).trim() === "";
      const faltaDir = !p.direccion || String(p.direccion).trim() === "";
      const necesitaEdicion = faltaHC || faltaDir;

      // 3. LÓGICA DE CARGA
      // ... (código anterior dentro de selectPatient) ...

      // 1. DETECCIÓN MEJORADA: ¿Es APP? (Con o sin ceros)
      // Buscamos "APP" en el nombre o en el DNI
      const isActivityAPP = (p.dni && p.dni.includes("APP")) || (p.nombre && p.nombre.includes("APP"));

      // 3. LÓGICA DE CARGA (MODIFICADA)
      // Si es la misma jurisdicción O ES UNA ACTIVIDAD APP -> Carga Directa (Sin Alerta)
      if (isSameJurisdiction || isActivityAPP) {
          
          const esContinuador = p.historialEst.some(h => cleanStr(h).includes(cleanStr(keyword)));
          const furEncontrada = p.last_fur ? parseExcelDate(p.last_fur) : '';

          setPatientData(prev => ({ 
              ...prev,
              id: p.id, 
              dni: p.dni || "", 
              paciente: p.nombre || "", 
              hc: p.hc || "", // Si es APP y no tiene HC, pasará vacío y ya no importa
              fecNac: safeFecNac, 
              sexo: p.sexo || 'M', 
              financiador: p.financiador || '2-SIS', 
              direccion: p.direccion || '', 
              distrito: p.distrito || '', 
              estOrigen: p.estOrigen || '',  
              fur: furEncontrada, 
	      //condicion: furEncontrada ? 'GESTANTE' : '',
	      condicion: '',
              // Si es APP, forzamos que parezca Continuador para evitar rojos
              condEst: isActivityAPP ? "C" : (esContinuador ? "C" : "R"), 
              condServ: '' 
          }));
          
          // ¡ESTO ES CLAVE! Si es APP, bloqueamos los datos para que no pida editar
          // Si es paciente normal sin HC, pedimos edición.
          const necesitaEdicion = !isActivityAPP && (faltaHC || faltaDir);
          setIsPatientDataLocked(!necesitaEdicion); 

      } else {
          // LÓGICA DE PACIENTE FORÁNEO (SOLO SI NO ES APP)
          setPatientData(prev => ({ 
              ...prev,
              id: p.id, 
              dni: p.dni || "", 
              paciente: p.nombre || "", 
              fecNac: safeFecNac, 
              sexo: p.sexo || 'M', 
              financiador: p.financiador || '2-SIS', 
              direccion: p.direccion || '', 
              distrito: p.distrito || '', 
              condicion: '', 
              fur: p.last_fur ? parseExcelDate(p.last_fur) : '', 
              estOrigen: adminData.establecimiento, 
              hc: "",                        
              condEst: 'N',                   
              condServ: 'N'                   
          }));

          setIsPatientDataLocked(false); 

          setValidationAlert({
              isOpen: true,
              type: 'TRANSFER', 
              title: 'Paciente de Otro Establecimiento',
              message: `El paciente pertenece a: "${p.estOrigen || 'DESCONOCIDO'}".\nSe procederá a registrar en: "${adminData.establecimiento}".`,
              details: '✅ Se han cargado sus datos personales.\n✅ La condición cambió automáticamente a NUEVO.\n✏️ POR FAVOR: Ingrese el N° de HISTORIA CLÍNICA de este establecimiento.'
          });
      }      
      // Auto-Focus inteligente: Si falta HC, ir ahí. Si falta Dirección (y hay HC), ir ahí.
      setTimeout(() => { 
          const hcInput = document.querySelector('input[name="hc"]');
          const dirInput = document.querySelector('input[name="direccion"]');
          
          if (faltaHC && hcInput) {
               hcInput.focus();
          } else if (faltaDir && dirInput) {
               dirInput.focus();
          }
      }, 200);
  };
  const checkRowValidity = (row) => { return (row.desc && row.desc.trim() !== '' && row.tipo && row.tipo !== '-' && row.tipo !== '' && row.codigo && row.codigo.trim() !== '');
  };
  const openDxSearch = (index) => { 
      setCurrentDxRow(index); 
      const existing = diagnoses[index];
      
      setTempDx({ 
          desc: existing.desc || '', 
          codigo: existing.codigo || '', 
          // CAMBIO CRÍTICO: Forzamos vacío '' para que el usuario elija, 
          // a menos que ya tenga uno guardado distinto a 'D' por defecto.
          // Si quieres que SIEMPRE salten, pon: tipo: ''
          tipo: '', 
          lab1: existing.lab1 || '', 
          lab2: existing.lab2 || '', 
          lab3: existing.lab3 || '' 
      });
      
      setModalSearchTerm(""); 
      setModalSuggestions([]); 
      setIsDxModalOpen(true); 
  };  
  const handleModalSearch = (val) => { 
    setModalSearchTerm(val); 
    const upperVal = val.toUpperCase();
    setTempDx(prev => ({ ...prev, desc: upperVal })); 
    
    if (upperVal.length > 1) { 
        const matches = dbCie10.filter(item => {
            if (item.BUSQUEDA && item.BUSQUEDA.includes(upperVal)) return true;
            if (item.CODIGO && String(item.CODIGO).includes(upperVal)) return true;
            if (item.DESCRIPCION && item.DESCRIPCION.includes(upperVal)) return true;
            return false;
        }).slice(0, 20);
        setModalSuggestions(matches); 
    } else { 
        setModalSuggestions([]); 
    } 
  };
  const selectModalDx = (item) => { 
      setTempDx(prev => ({ 
          ...prev, 
          desc: item.DESCRIPCION, 
          codigo: item.CODIGO, 
          lab1: item.LAB1 || '', 
          lab2: item.LAB2 || '',
         // tipo: item.TIPO || prev.tipo || 'D'
          tipo: item.TIPO || ''
      }));
      setModalSearchTerm(item.DESCRIPCION); 
      setModalSuggestions([]); 
  };

  const saveModalSelection = () => { if (!tempDx.desc || !tempDx.codigo) { alert("Debe seleccionar un diagnóstico válido."); return;
  } const newDiagnoses = [...diagnoses]; newDiagnoses[currentDxRow] = { ...tempDx }; setDiagnoses(newDiagnoses); if (dxErrors[currentDxRow]) { const newErrors = { ...dxErrors };
  delete newErrors[currentDxRow]; setDxErrors(newErrors); } setIsDxModalOpen(false); };
  const handleAdmin = (e) => { const name = e.target.name; const val = e.target.value;
  if (name === 'dniResp') { const encontrado = dbPersonal.find(p => p.dni === val.trim());
  if (encontrado) { setAdminData(prev => ({ ...prev, dniResp: val, nombreResp: encontrado.nombre }));
  } else { setAdminData(prev => ({ ...prev, dniResp: val })); } } else { setAdminData({ ...adminData, [name]: val });
  } };
  
  const handlePatient = (e) => {
      setShowNewBtn(false);
      const { name, value } = e.target;
      let finalValue = value;
      if (name === 'condicion' && value !== 'GESTANTE') {
          setPatientData(prev => ({ ...prev, [name]: finalValue, fur: '' }));
          return; // Cortamos aquí para no repetir el setPatientData abajo
      }

      // --- VALIDACIÓN DE GESTANTE / PUÉRPERA ---
      if (name === "condicion" && (value === "GESTANTE" || value === "PUERPERA")) {
          const sexo = patientData.sexo ? patientData.sexo.toUpperCase() : "";
          const esHombre = sexo === "M" || sexo === "MASCULINO";

          // 1. REGLA ABSOLUTA: HOMBRES NO PUEDEN SER GESTANTES
          if (esHombre) {
              alert(`⛔ ERROR DE SEXO\n\nEl paciente está registrado como MASCULINO.\nNo puede asignarle la condición de ${value}.`);
              return; // DETIENE EL CAMBIO (El select no cambiará)
          }

          // 2. REGLA DE EDAD FÉRTIL (Aproximada 10-55 años)
          const currentAge = getAgeComponents(patientData.fecNac, patientData.fecAtencion).y;
          if (currentAge < 10 || currentAge > 55) {
               alert(`⚠️ ALERTA DE EDAD\n\nLa paciente tiene ${currentAge} años.\nVerifique si realmente corresponde la condición de ${value}.`);
               // Aquí no hacemos return, solo avisamos, por si es un caso excepcional.
          }
      }

      if (['direccion', 'distrito', 'estOrigen'].includes(name)) { 
          finalValue = value.toUpperCase();
      }
      
      setPatientData(prev => ({ ...prev, [name]: finalValue }));
  };
  const handleClinical = (e) => setClinicalData({ ...clinicalData, [e.target.name]: e.target.value });
  const handleNumericInput = (e, min, max) => {
      let val = e.target.value;
      if (val === '') { setClinicalData({ ...clinicalData, [e.target.name]: '' }); return; }
      if (!/^\d*\.?\d*$/.test(val)) return;
      const numVal = parseFloat(val);
      if (!isNaN(numVal)) { if (numVal > max) return;
      }
      setClinicalData({ ...clinicalData, [e.target.name]: val });
  };
  const handleSaveManualPatient = async () => {
      // --- VALIDACIÓN DE CAMPOS VACÍOS ---
      if (
          !manualData.dni || 
          !manualData.nombres || 
          !manualData.hc || 
          !manualData.fecNac ||
          !manualData.sexo || 
          !manualData.direccion || 
          !manualData.distrito || 
          !manualData.estOrigen || 
          !manualData.financiador
      ) {
          return alert("⚠️ TODOS LOS CAMPOS SON OBLIGATORIOS\n\nPor favor complete toda la información del formulario para poder guardar.");
      }

      const nuevoPacienteBD = {
          dni: manualData.dni.trim(),
          nombre: manualData.nombres.trim().toUpperCase(),
          fecNac: manualData.fecNac,
          sexo: manualData.sexo,
          financiador: manualData.financiador,
          hc: manualData.hc,
          distrito: manualData.distrito.trim().toUpperCase(),
          direccion: manualData.direccion.trim().toUpperCase(),
          estOrigen: manualData.estOrigen.trim().toUpperCase(),
          historialEst: [adminData.establecimiento], 
          busqueda: (manualData.dni.trim() + " " + manualData.nombres.trim()).toUpperCase()
      };
      
      try {
          await idb.addPatient(nuevoPacienteBD);
          markAsContinuadorOnSave(nuevoPacienteBD); 
          setDbPacientes(prev => [...prev, nuevoPacienteBD]);
          
          setPatientData(prev => ({ 
              ...prev, 
              dni: manualData.dni, 
              paciente: manualData.nombres.toUpperCase(), 
              hc: manualData.hc, 
              fecNac: manualData.fecNac, 
              sexo: manualData.sexo, 
              financiador: manualData.financiador, 
              direccion: manualData.direccion.toUpperCase(), 
              distrito: manualData.distrito.toUpperCase(), 
              estOrigen: manualData.estOrigen.toUpperCase(), 
              condEst: 'N', 
              condServ: 'N' 
          }));

          setSearchTerm(manualData.nombres.toUpperCase());
          setIsPatientDataLocked(true);
          setIsManualModalOpen(false);
          
          // Reseteamos con valores por defecto seguros
          setManualData({ dni: '', nombres: '', fecNac: '2000-01-01', sexo: 'M', hc: '', distrito: '', direccion: '', financiador: '2-SIS', estOrigen: '' });
          alert("✅ Paciente registrado. En futuras búsquedas aparecerá como CONTINUADOR.");

      } catch (error) {
          console.error(error);
          alert("Error al guardar el paciente en la base de datos.");
      }
  };
  const calculateAnemiaSimple = () => { 
      if (!clinicalData.hb || !anemiaLocation) return alert("Ingrese HB y seleccione localidad");
      const hb = parseFloat(clinicalData.hb); 
      const altitud = LOCALIDADES_ALTITUD[anemiaLocation] || 0; 
      let factorAjuste = 0;
      if (altitud >= 1000) { const valor = (altitud * 0.00328);
      const ajusteCalc = -0.032 * valor + 0.022 * (valor * valor); factorAjuste = Math.round(ajusteCalc * 10) / 10;
      if(factorAjuste < 0) factorAjuste = 0; } 
      const realHb = hb - factorAjuste; 
      setHbAdjusted(realHb.toFixed(1));
      let result = "SIN ANEMIA"; 
      let color = "bg-green-100 text-green-700 border-green-200"; 

      const { y, m } = ageObj;
      const months = (y * 12) + m; 
      const isPregnant = patientData.condicion === "GESTANTE"; 
      const isPuerpera = patientData.condicion === "PUERPERA";
      const isMale = patientData.sexo === "M"; 

      if (isPremature && months < 6) { if (realHb < 11.0) { result = "ANEMIA (PREMATURO)";
      color = "bg-purple-100 text-purple-700 border-purple-200"; } }
      else if (months >= 6 && months <= 59) { if (realHb < 7.0) { result = "ANEMIA SEVERA";
      color = "bg-red-600 text-white"; } else if (realHb >= 7.0 && realHb <= 9.9) { result = "ANEMIA MODERADA";
      color = "bg-orange-500 text-white"; } else if (realHb >= 10.0 && realHb <= 10.9) { result = "ANEMIA LEVE";
      color = "bg-yellow-400 text-black"; } } 
      else if (months >= 60 && months <= 131) { if (realHb < 8.0) { result = "ANEMIA SEVERA";
      color = "bg-red-600 text-white"; } else if (realHb >= 8.0 && realHb <= 10.9) { result = "ANEMIA MODERADA";
      color = "bg-orange-500 text-white"; } else if (realHb >= 11.0 && realHb <= 11.4) { result = "ANEMIA LEVE";
      color = "bg-yellow-400 text-black"; } } 
      else if (months >= 144 && months <= 179) { if (realHb < 8.0) { result = "ANEMIA SEVERA";
      color = "bg-red-600 text-white"; } else if (realHb >= 8.0 && realHb <= 10.9) { result = "ANEMIA MODERADA";
      color = "bg-orange-500 text-white"; } else if (realHb >= 11.0 && realHb <= 11.9) { result = "ANEMIA LEVE";
      color = "bg-yellow-400 text-black"; } } 
      else if (months >= 180) { if (isMale) { if (realHb < 8.0) { result = "ANEMIA SEVERA";
      color = "bg-red-600 text-white"; } else if (realHb >= 8.0 && realHb <= 10.9) { result = "ANEMIA MODERADA";
      color = "bg-orange-500 text-white"; } else if (realHb >= 11.0 && realHb <= 12.9) { result = "ANEMIA LEVE";
      color = "bg-yellow-400 text-black"; } } else if (!isPregnant && !isPuerpera) { if (realHb < 8.0) { result = "ANEMIA SEVERA";
      color = "bg-red-600 text-white"; } else if (realHb >= 8.0 && realHb <= 10.9) { result = "ANEMIA MODERADA";
      color = "bg-orange-500 text-white"; } else if (realHb >= 11.0 && realHb <= 11.9) { result = "ANEMIA LEVE";
      color = "bg-yellow-400 text-black"; } } } 
      if (isPregnant) { if (realHb < 7.0) { result = "ANEMIA SEVERA";
      color = "bg-red-600 text-white"; } else if (realHb >= 7.0 && realHb <= 9.9) { result = "ANEMIA MODERADA";
      color = "bg-orange-500 text-white"; } else if (realHb >= 10.0 && realHb <= 10.9) { result = "ANEMIA LEVE";
      color = "bg-yellow-400 text-black"; } else { result = "SIN ANEMIA"; color = "bg-green-100 text-green-700 border-green-200";
      } } 
      if (isPuerpera) { if (realHb < 8.0) { result = "ANEMIA SEVERA";
      color = "bg-red-600 text-white"; } else if (realHb >= 8.0 && realHb <= 10.9) { result = "ANEMIA MODERADA";
      color = "bg-orange-500 text-white"; } else if (realHb >= 11.0 && realHb <= 11.9) { result = "ANEMIA LEVE";
      color = "bg-yellow-400 text-black"; } else { result = "SIN ANEMIA"; color = "bg-green-100 text-green-700 border-green-200";
      } } 
      
      setAnemiaResult(result); 
      setAnemiaColor(color);
      setClinicalData(prev => ({...prev, nivHb: result, dosaje: realHb.toFixed(1)})); 
  };

  const addDx = () => { 
      const newIndex = diagnoses.length; 
      
      // 1. Agregamos la fila a la lista con tipo 'D' por defecto
      setDiagnoses([...diagnoses, { desc: '', tipo: '', lab1: '', lab2: '', lab3: '', codigo: '' }]);
      
      // 2. Preparamos el modal con tipo 'D' por defecto también
      setCurrentDxRow(newIndex);
      setTempDx({ desc: '', tipo: 'D', lab1: '', lab2: '', lab3: '', codigo: '' });
      setModalSearchTerm(""); 
      setModalSuggestions([]); 
      
      // 3. Abrimos el modal y hacemos scroll
      setIsDxModalOpen(true);
      setTimeout(() => { if (dxBottomRef.current) { dxBottomRef.current.scrollIntoView({ behavior: 'smooth' }); } }, 100); 
  };
  const removeDx = (i) => setDiagnoses(diagnoses.filter((_, idx) => idx !== i));
  const updateToContinuador = (idPaciente) => {
      if (!idPaciente) return;
      setDbPacientes(prev => prev.map(p => {
          if (p.id === idPaciente) {
              const nuevoHistorial = p.historialEst ? [...p.historialEst] : [];
              if (!nuevoHistorial.includes(adminData.establecimiento)) {
                  nuevoHistorial.push(adminData.establecimiento);
              }
              return { ...p, condEst: 'C', historialEst: nuevoHistorial };
          }
          return p;
      }));
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = (e) => {
          const db = e.target.result;
          const tx = db.transaction([STORE_PACIENTES], 'readwrite');
          const store = tx.objectStore(STORE_PACIENTES);
          const getReq = store.get(idPaciente);
          getReq.onsuccess = () => {
              const record = getReq.result;
              if (record) {
                  record.condEst = 'C';
                  if (!record.historialEst) record.historialEst = [];
                  if (!record.historialEst.includes(adminData.establecimiento)) {
                      record.historialEst.push(adminData.establecimiento);
                  }
                  store.put(record);
              }
          };
      };
  };
  const markAsContinuadorOnSave = (datosPaciente) => {
      if (!datosPaciente.id && !datosPaciente.dni) return;
      // CORRECCIÓN: Usar setDbPacientes en lugar de setAllPatients
      setDbPacientes(prevLista => prevLista.map(p => {
          if ((p.id && p.id === datosPaciente.id) || (p.dni && p.dni === datosPaciente.dni)) {
              return { ...p, condEst: 'C' }; 
          }
          return p;
      }));
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = (e) => {
          const db = e.target.result;
          const tx = db.transaction([STORE_PACIENTES], 'readwrite');
          const store = tx.objectStore(STORE_PACIENTES);
          if (datosPaciente.id) {
              const getReq = store.get(datosPaciente.id);
              getReq.onsuccess = () => {
                  const record = getReq.result;
                  if (record && (record.condEst === 'N' || record.condEst === 'R')) {
                      record.condEst = 'C';
                      store.put(record); 
                  }
              };
          }
      };
  };

  const validateDiagnoses = () => {
    if (!patientData.paciente || patientData.paciente.trim() === "") return true;
    for (let i = 0; i < diagnoses.length; i++) {
        const d = diagnoses[i];
        if(!d.codigo) continue; 
        const code = d.codigo.trim().toUpperCase();

        if (code === 'D509') {
            const validLabs = ['LEV', 'MOD', 'SEV', 'PR'];
            if (!validLabs.includes(d.lab1)) {
                setValidationAlert({
                    isOpen: true,
                    type: 'ANEMIA',
                    title: 'Validación de Anemia (D509)',
                    message: `En la fila ${i + 1}, el diagnóstico ANEMIA (D509) requiere especificar la severidad en el campo LAB 1.`,
                    details: 'Valores permitidos: LEV, MOD, SEV o PR.'
                });
                return false;
            }
        } 

        if (['85018', '85018.01'].includes(code)) {
            const valorHb = clinicalData.hb;
            if (!valorHb || valorHb === '' || parseFloat(valorHb) === 0) {
                 setValidationAlert({
                    isOpen: true,
                    type: 'LAB_MISSING', 
                    title: 'Falta Resultado de Hemoglobina',
                    message: `En la fila ${i + 1}, ha registrado el procedimiento de Dosaje (${code}), pero no ingresó el resultado.`,
                    details: 'El sistema detectó que el campo "Hemoglobina" en los Datos Clínicos (Paso 2) está vacío.\n\nRECUERDA QUE EL VALOR DE HEMOGLOBINA SE DEBE REGISTRAR SIN DESCUENTO.'
                });
                return false; 
            }
        }

        if (['Z3591', 'Z3592', 'Z3593'].includes(code)) {
            if (!d.lab1 || !d.lab2) {
                 setValidationAlert({
                    isOpen: true,
                    type: 'GESTANTE',
                    title: 'Supervisión de Embarazo (Riesgo)',
                    message: `En la fila ${i + 1}, el código ${code} requiere completar ambos campos de laboratorio.`,
                    details: 'LAB 1: Número de Control Prenatal\nLAB 2: Semanas de Gestación'
                  });
                return false;
            }
        }

        const femalePrefixes = ['O', 'Z34', 'Z35', 'N70', 'N71', 'N72', 'N73', 'N75', 'N76', 'Z32', 'Z39'];
        const malePrefixes = ['N40', 'N41', 'N42', 'N43', 'N44', 'N45', 'N49', 'N50'];
        if (patientData.sexo === 'M') {
            if (femalePrefixes.some(pre => code.startsWith(pre))) {
                setValidationAlert({
                    isOpen: true,
                    type: 'SEX_MISMATCH',
                    title: 'Inconsistencia de Sexo',
                    message: `En la fila ${i + 1}, el código ${code} es exclusivo para pacientes de sexo FEMENINO.`,
                    details: `El paciente actual está registrado como MASCULINO.\nNo se puede registrar diagnósticos ginecológicos o de embarazo en hombres.`
                });
                return false;
            }
        }

        if (patientData.sexo === 'F') {
            if (malePrefixes.some(pre => code.startsWith(pre))) {
                setValidationAlert({
                    isOpen: true,
                    type: 'SEX_MISMATCH',
                    title: 'Inconsistencia de Sexo',
                    message: `En la fila ${i + 1}, el código ${code} es exclusivo para pacientes de sexo MASCULINO.`,
                    details: `La paciente actual está registrada como FEMENINO.\nNo se pueden registrar patologías de próstata o testículos.`
                });
                return false;
            }
        }
    }
    return true;
  };
   useEffect(() => {
    if (step === 1 && patientData.dni) {
      const hcInput = document.querySelector('input[name="hc"]');
      
      const dniStr = String(patientData.dni).trim();
      const hcStr = String(patientData.hc || "").trim();

      // 1. LÓGICA MATEMÁTICA: Convertimos a número para ignorar ceros a la izquierda
      // Esto hace que "00373661" sea igual a "373661" -> DETECTA EL ERROR
      const dniNum = parseInt(dniStr, 10);
      const hcNum = parseInt(hcStr, 10);

      // Hay error si los números coinciden (y son válidos) O si el texto es idéntico
      const isError = ((dniNum === hcNum && dniNum > 0) || dniStr === hcStr) && hcStr.length > 0;

      if (isError) {
        // --- CASO ERROR: SON IGUALES (EL DNI NO DEBE SER LA HC) ---
        setIsPatientDataLocked(false); // 1. Activa el botón EDITAR automáticamente

        
        if (hcInput) {
          // 2. Pinta de ROJO (Error crítico)
          hcInput.style.borderColor = "red"; 
          hcInput.style.backgroundColor = "#fee2e2";
          hcInput.style.borderWidth = "3px";
          hcInput.classList.add("animate-pulse"); 
          
          // 3. Manda el cursor dentro
          if (document.activeElement !== hcInput) {
             setTimeout(() => { hcInput.focus(); hcInput.select(); }, 150);
          }
        }
      } else if (hcStr.length > 0 && hcInput) {
        // --- CASO CORRECTO: SON DIFERENTES ---
        // 4. Se pinta de VERDE
        hcInput.style.borderColor = "#10b981";
        // Verde
        hcInput.style.backgroundColor = "#ecfdf5";
        // Fondo verde suave
        hcInput.style.borderWidth = "2px";
        hcInput.classList.remove("animate-pulse");
      }
    }
  }, [patientData.dni, patientData.hc, step]);
  const handleNextStep = () => {
    // Función auxiliar visual para marcar errores
    const markError = (name) => {
        const input = document.querySelector(`[name="${name}"]`);
        if (input) {
            input.style.borderColor = "red";
            input.style.borderWidth = "2px";
            input.classList.add("animate-pulse");
            const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
            input.addEventListener(eventType, () => {
                input.style.borderColor = ""; 
                input.style.borderWidth = ""; 
                input.classList.remove("animate-pulse");
            }, { once: true });
        }
    };

    // ========================================================================
    // PASO 1: DATOS DEL PACIENTE
    // ========================================================================
    if (step === 1) {
        
        // --- 1. LÓGICA ESPECIAL PARA ACTIVIDADES (APP...) ---
        // Usamos .includes() para detectar si "APP" está en el nombre o en el DNI (ej: 000APP93)
        const nombreMayus = patientData.paciente ? patientData.paciente.toUpperCase() : "";
        const dniStr = patientData.dni ? String(patientData.dni).toUpperCase() : "";
        
        const esActividad = nombreMayus.includes("APP") || dniStr.includes("APP");

        if (esActividad) {
            // Si es una actividad APP, SOLO validamos que tenga fecha.
            if (!patientData.fecAtencion) {
                alert("⚠️ FALTA FECHA DE ATENCIÓN\n\nPor favor seleccione la fecha de la actividad.");
                setIsCalendarOpen(true);
                return;
            }
            
            // ¡SALTO MÁGICO! Ignoramos HC, Dirección, Condición, etc.
            setStep(prev => prev + 1);
            return; // Detenemos la función aquí para este caso.
        }

        // --- 2. LÓGICA NORMAL PARA PACIENTES REALES (ESTRICTA) ---
        
        const hayDatos = (patientData.dni && patientData.dni.trim().length > 0) || 
                         (patientData.paciente && patientData.paciente.trim().length > 0);

        if (!hayDatos) {
            setStep(prev => prev + 1);
            return;
        }

        // Identidad
        if (!patientData.dni) { 
            alert("⚠️ FALTAN DATOS\nComplete el DNI."); 
            markError("dni"); return; 
        }
        if (!patientData.paciente) { 
            alert("⚠️ FALTAN DATOS\nComplete el Nombre."); 
            markError("paciente"); return; 
        }
        
        // Fecha de Atención
        if (!patientData.fecAtencion) { 
            alert("⚠️ FALTA FECHA DE ATENCIÓN\n\nPor favor, seleccione Fecha de Atención para continuar."); 
            setIsCalendarOpen(true); 
            return; 
        }

        // Condiciones (Establecimiento y Servicio)
        if (!patientData.condEst || patientData.condEst === "") { 
            alert("⚠️ FALTA CONDICIÓN ESTABLECIMIENTO\nSeleccione: Nuevo, Continuador o Reingresante."); 
            markError("condEst"); return; 
        }
        if (!patientData.condServ || patientData.condServ === "") { 
            alert("⚠️ FALTA CONDICIÓN SERVICIO\nSeleccione: Nuevo, Continuador o Reingresante."); 
            markError("condServ"); return; 
        }

        // Validaciones de Consistencia
        if (patientData.condEst === 'N' && patientData.condServ !== 'N') {
            alert("⛔ ERROR DE CONSISTENCIA\n\nSi el paciente es NUEVO en el establecimiento, obligatoriamente debe ser NUEVO en el servicio.");
            markError("condServ"); return;
        }
        if (patientData.condEst === 'R' && patientData.condServ === 'C') {
             alert("⛔ ERROR DE CONSISTENCIA\n\nUn paciente REINGRESANTE al establecimiento no puede ser CONTINUADOR en el servicio inmediatamente.");
             markError("condServ"); return;
        }

        // Validación Gestante
        if (patientData.condicion === 'GESTANTE') {
            if (!patientData.fur) {
                alert("⚠️ ATENCIÓN: GESTANTE SIN FUR\n\nEs OBLIGATORIO registrar la Fecha de Última Regla (FUR).");
                markError("fur"); return;
            }
            const dFur = new Date(patientData.fur);
            const dAtencion = patientData.fecAtencion ? new Date(patientData.fecAtencion) : new Date();
            dFur.setHours(0,0,0,0); 
            dAtencion.setHours(0,0,0,0);
            if (dFur > dAtencion) {
                alert(`⛔ ERROR DE FECHAS\n\nLa FUR (${patientData.fur}) no puede ser futura.`);
                markError("fur"); return;
            }
        }

        // Historia Clínica vs DNI
        const hcVal = String(patientData.hc || '').trim();
        const dniVal = String(patientData.dni).trim();
        const dniNum = parseInt(dniVal, 10);
        const hcNum = parseInt(hcVal, 10);

        if (!hcVal) { 
            alert("⚠️ FALTA HISTORIA CLÍNICA\nIngrese el N° de Historia clínica."); 
            markError("hc"); return; 
        }
        
        if (dniVal === hcVal || (dniNum === hcNum && dniNum > 0)) {
             alert(`⛔ ERROR DE HISTORIA CLÍNICA\nLa H.C. no puede ser igual al DNI.`); 
             markError("hc"); setIsPatientDataLocked(false); return;
        }

        // Dirección
        if (!patientData.direccion || patientData.direccion.trim().length < 2) { 
            alert("⚠️ FALTA DIRECCIÓN\nEl campo dirección no puede estar vacío."); 
            markError("direccion"); return; 
        }
    }

    // ========================================================================
    // PASO 2: VALIDACIÓN MÉDICA INTELIGENTE (TU CÓDIGO ORIGINAL)
    // ========================================================================
    if (step === 2) {
      const { talla, peso, hb, pAbd } = clinicalData;
      const t = talla ? parseFloat(talla) : null;
      const p = peso ? parseFloat(peso) : null;
      const { y, m, d } = ageObj;

      // --- GRUPO 1: RECIÉN NACIDO (0 a 28 días) ---
      if (y === 0 && m === 0 && d >= 0) {
          if (t && (t < 40 || t > 62)) { 
              alert(`⛔ TALLA IRREAL (Neonato)\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 40 - 62 cm`); 
              markError("talla"); return; 
          }
          if (p && (p < 1.5 || p > 6)) { 
              alert(`⛔ PESO IRREAL (Neonato)\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 1.5 - 6.0 kg`); 
              markError("peso"); return; 
          }
      }
      // --- GRUPO 2: LACTANTE (1 mes a 11 meses) ---
      else if (y === 0 && m > 0) {
          if (t && (t < 45 || t > 85)) { 
              alert(`⛔ TALLA IRREAL (Lactante)\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 45 - 85 cm`); 
              markError("talla"); return; 
          }
          if (p && (p < 2.5 || p > 14)) { 
              alert(`⛔ PESO IRREAL (Lactante)\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 2.5 - 14.0 kg`); 
              markError("peso"); return; 
          }
      }
      // --- GRUPO 3: NIÑO PEQUEÑO (1 a 4 años) ---
      else if (y >= 1 && y < 5) {
          if (t && (t < 65 || t > 120)) { 
              alert(`⛔ TALLA IRREAL (Niño ${y} años)\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 65 - 120 cm`); 
              markError("talla"); return; 
          }
          if (p && (p < 7 || p > 28)) { 
              alert(`⛔ PESO IRREAL (Niño ${y} años)\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 7.0 - 28.0 kg`); 
              markError("peso"); return; 
          }
      }
      // --- GRUPO 4: ESCOLAR Y ADOLESCENTE (5 a 17 años) ---
      else if (y >= 5 && y < 18) {
          if (t && (t < 95 || t > 210)) { 
              alert(`⛔ TALLA IRREAL (Paciente ${y} años)\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 95 - 210 cm`); 
              markError("talla"); return; 
          }
          if (p && (p < 12 || p > 130)) { 
              alert(`⛔ PESO IRREAL (Paciente ${y} años)\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 12.0 - 130.0 kg`); 
              markError("peso"); return; 
          }
      }
      // --- GRUPO 5: ADULTO (18 años a más) ---
      else if (y >= 18) {
          if (t && (t < 130 || t > 250)) { 
              alert(`⛔ TALLA INVÁLIDA (Adulto)\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 130 - 250 cm`); 
              markError("talla"); return; 
          }
          if (p && (p < 35 || p > 300)) { 
              alert(`⛔ PESO INVÁLIDO (Adulto)\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 35.0 - 300.0 kg`); 
              markError("peso"); return; 
          }
      }

      // Validaciones Generales
      if (hb && (hb < 3 || hb > 24)) { 
          alert("⛔ HEMOGLOBINA ERRÓNEA\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 3.0 - 24.0"); 
          markError("hb"); return; 
      }
      if (pAbd && (parseFloat(pAbd) < 10 || parseFloat(pAbd) > 200)) { 
          alert("⛔ P. ABDOMINAL ERRÓNEO\nPOR FAVOR DEBE REGISTRAR VALORES ENTRE: 10 - 200 cm"); 
          markError("pAbd"); return; 
      }
    }

    // ========================================================================
    // PASO 3: VALIDACIÓN CIE-10 (TU CÓDIGO ORIGINAL)
    // ========================================================================
    if (step === 3) {
       for (let i = 0; i < diagnoses.length; i++) {
           const d = diagnoses[i];
           if (!d.codigo) continue;

           const currentCode = d.codigo.trim().toUpperCase();
           // A. BUSCAR CONFIGURACIÓN DE LABS
           const config = LAB_CONFIG[currentCode] || LAB_CONFIG[currentCode.substring(0, 4)];

           if (config) {
               // Función auxiliar para saber si el campo permite estar vacío
               const permiteVacio = (conf) => {
                   if (!conf) return false; // No configurado
                   const opciones = Array.isArray(conf) ? conf : (conf.options || []);
                   return opciones.includes(''); // ¿Existe la opción vacía en la lista?
               };

               // Validar LAB 1
               if (config[1] !== undefined) {
                   // Si NO tiene valor Y NO permite vacío -> Error
                   if ((!d.lab1 || d.lab1.trim() === '') && !permiteVacio(config[1])) {
                       setValidationAlert({
                           isOpen: true, type: 'LAB_MISSING',
                           title: `Falta LAB 1 en Fila ${i + 1}`,
                           message: `El diagnóstico ${currentCode} requiere valor en el LAB 1.`,
                           details: 'Seleccione una opción.'
                       });
                       return; 
                   }
               }

               // Validar LAB 2
               if (config[2] !== undefined) {
                   if ((!d.lab2 || d.lab2.trim() === '') && !permiteVacio(config[2])) {
                       setValidationAlert({
                           isOpen: true, type: 'LAB_MISSING',
                           title: `Falta LAB 2 en Fila ${i + 1}`,
                           message: `El diagnóstico ${currentCode} requiere valor en el LAB 2.`,
                           details: 'Seleccione una opción.'
                       });
                       return; 
                   }
               }

               // Validar LAB 3 (CON EXCEPCIÓN GESTANTES)
               if (config[3] !== undefined) {
                   const esExcepcionGestante = (currentCode === 'Z3593' || currentCode === 'Z3493' || currentCode === 'Z3591' || currentCode === 'Z3592');
                   
                   // Si NO tiene valor, NO es excepción gestante Y NO permite vacío -> Error
                   if ((!d.lab3 || d.lab3.trim() === '') && !esExcepcionGestante && !permiteVacio(config[3])) {
                       setValidationAlert({
                           isOpen: true, type: 'LAB_MISSING',
                           title: `Falta LAB 3 en Fila ${i + 1}`,
                           message: `El diagnóstico ${currentCode} requiere valor en el LAB 3.`,
                           details: 'Complete el campo.'
                       });
                       return; 
                   }
               }
           }

           // Lógica para Z3493 / Z3593 + Lab 7 -> TA
           if (currentCode === 'Z3493' || currentCode === 'Z3593') {
               const valorLab1 = d.lab1 ? d.lab1.trim().toUpperCase() : "";
               const valorLab3 = d.lab3 ? d.lab3.trim().toUpperCase() : "";
               if (valorLab1 === '7') {
                   if (valorLab3 !== 'TA') {
                       setValidationAlert({ isOpen: true, type: 'LAB_MISSING', title: 'Validación de Tamizaje (TA)', message: `En la fila ${i + 1}, para el diagnóstico ${currentCode} con Control Nº 7, es OBLIGATORIO registrar "TA" en el 3er LAB.`, details: '⚠️ REGLA:\nEn el 7mo control de gestante, se debe registrar el Tamizaje de Violencia o Alcohol.\n\nPor favor escriba "TA" en el campo LAB 3.' });
                       return; 
                   }
               }
           }
       }

       // VALIDACIÓN CRUZADA GESTANTE (Z359/Z349)
       const hasEmbarazoCode = diagnoses.some(d => d.codigo && (d.codigo.toUpperCase().startsWith('Z359') || d.codigo.toUpperCase().startsWith('Z349')));
       if (hasEmbarazoCode) {
           if (patientData.condicion !== 'GESTANTE' || !patientData.fur || patientData.fur.trim() === '') {
                setValidationAlert({ isOpen: true, type: 'GESTANTE_REQUIRED', title: 'Inconsistencia de Datos Maternos', message: 'Ha registrado códigos de Embarazo, pero faltan Datos.', details: '⚠️ REGLA:\nPara usar estos diagnósticos, es OBLIGATORIO:\n1. Que la Condición sea "GESTANTE".\n2. Que tenga registrada la FUR.\n\nEl sistema lo llevará al Paso 1 para corregirlo.' });
                return;
           }
       }

       if ((patientData.dni || patientData.paciente) && diagnoses.length === 0) { 
           alert("⚠️ FALTAN DIAGNÓSTICOS"); return; 
       }
       
       if (diagnoses.length > 0) {
           if (!validateDiagnoses()) return; 
       }
       
       for (let d of diagnoses) {
           const code = d.codigo.toUpperCase();
           if (code.startsWith('O') && patientData.sexo !== 'F') { 
               alert(`⛔ ERROR: Código ${code} es SOLO MUJERES.`); return; 
           }
       }
    }

    // AVANZAR (Si llegó hasta aquí es que todo está bien)
    setStep(prev => prev + 1);
  };
  const handleBack = () => { setDxErrors({}); setStep(s => s - 1); };
  const resetForm = () => { 
      setShowNewBtn(false);
      setPatientData({ ...initialPatient, fecAtencion: '', estAtencion: adminData.establecimiento, condEst: '', condServ: '' });
      setClinicalData(initialClinical); 
      setDiagnoses([{ desc: '', tipo: '-', lab1: '', lab2: '', lab3: '', codigo: '' }]); 
      setSearchTerm(""); 
      setIsPatientDataLocked(false); 
      setDxErrors({}); 
      setAnemiaResult("");
      setIsPremature(false);
      setIgnorePreGestValidation(false);
      setShowPreGestError(false);
      setShowHbError(false);
      setIgnorePAbdValidation(false);
      setShowPAbdError(false);
      setIgnorePCefValidation(false);
      setShowPCefError(false);
      setLastClinicalData({});
      setIsDataVerified(false);
      setIsBatchFinished(false);
  };
  // 1. FUNCIÓN PARA EL BOTÓN "REVISAR LA INFORMACIÓN"
  const handleReviewInfo = () => {
      setShowSaveConfirm(false);
      // Cierra la alerta
      setStep(1);
      // Regresa al paso 1 (Paciente)
      setIsCalendarOpen(false);
      // IMPORTANTE: Asegura que el calendario NO se abra
      // Nota: No llamamos a resetForm(), por lo que los datos se mantienen intactos.
  };

  // 2. FUNCIÓN PARA EL BOTÓN "SÍ, DESEO GUARDAR"
// 2. FUNCIÓN PARA EL BOTÓN "SÍ, DESEO GUARDAR" (LÓGICA HIS CORREGIDA)
    // 2. FUNCIÓN PARA EL BOTÓN "SÍ, DESEO GUARDAR" (LÓGICA INTELIGENTE)
   // 2. FUNCIÓN PARA EL BOTÓN "SÍ, DESEO GUARDAR" (CON PERSISTENCIA DE DATOS)
  const confirmSavePatient = () => {
      // 1. Empaquetamos los datos actuales
      const newRecord = { 
          patient: { ...patientData }, 
          clinical: { ...clinicalData }, 
          diagnoses: [...diagnoses], 
          ageObj: { ...ageObj } 
      };

      // 2. Actualizamos la lista Y GUARDAMOS EN EL DISCO (LocalStorage)
      setSavedPatients(prev => {
          const index = prev.findIndex(p => 
              p.patient.dni === newRecord.patient.dni &&
              p.patient.fecAtencion === newRecord.patient.fecAtencion &&
              JSON.stringify(p.diagnoses) === JSON.stringify(newRecord.diagnoses)
          );

          let updatedList; // Creamos una variable temporal

          if (index >= 0) {
              updatedList = [...prev];
              updatedList[index] = newRecord;
          } else {
              updatedList = [...prev, newRecord];
          }

          // >>> AQUÍ ESTÁ EL CAMBIO CLAVE: GUARDAR EN MEMORIA DEL NAVEGADOR <<<
          localStorage.setItem('HIS_LOTE_PENDIENTE', JSON.stringify(updatedList));
          
          return updatedList; // Retornamos la lista actualizada para que se vea en pantalla
      });

      // 3. Actualizamos estado de "Continuador" en base de datos local
      if (patientData.id) {
          updateToContinuador(patientData.id);
      } 
      
      // Limpieza del formulario visual
      setPatientData({ ...initialPatient, fecAtencion: patientData.fecAtencion, estAtencion: adminData.establecimiento, condEst: '', condServ: '' });
      setClinicalData(initialClinical);
      setDiagnoses([{ desc: '', tipo: '-', lab1: '', lab2: '', lab3: '', codigo: '' }]);
      setSearchTerm("");
      
      // Reactivamos botones y cerramos modal
      setShowNewBtn(true);
      setShowSaveConfirm(false); 
      alert("✅ Registro guardado. (Se mantendrá en memoria si cierra el navegador)."); 
  }; 
  const generatePDF = () => {
    try {
        const allPatients = [...savedPatients];
        // --- LÓGICA INTELIGENTE APLICADA AL PDF ---
        if (patientData.paciente) {
            const yaExiste = savedPatients.some(p => 
                p.patient.dni === patientData.dni &&
                p.patient.fecAtencion === patientData.fecAtencion &&
                JSON.stringify(p.diagnoses) === JSON.stringify(diagnoses)
            );
            if (!yaExiste) {
                allPatients.push({ 
                    patient: patientData, 
                    clinical: clinicalData, 
                    diagnoses: diagnoses, 
                    ageObj: ageObj 
                });
            }
        }
        if(allPatients.length === 0) return alert("No hay datos para exportar.");
        const visualBlocks = [];
        let globalIndex = 1;

        allPatients.forEach(rec => {
            const { patient, clinical, diagnoses: dxs, ageObj: age } = rec;
            const totalChunks = Math.ceil(Math.max(1, dxs.length) / 3);

            for (let c = 0; c < totalChunks; c++) {
                const start = c * 3;
                const chunkDxs = dxs.slice(start, start + 3);
                while(chunkDxs.length < 3) chunkDxs.push({});

                visualBlocks.push({
                    index: globalIndex,
                    isFirstChunk: c === 0,
                    patient,
                    clinical,
                    age,
                    diagnoses: chunkDxs
                });
            }
            globalIndex++;
        });

        const doc = new jsPDF('p', 'mm', 'a4'); 
        doc.setFont("helvetica", "normal"); 
        doc.setDrawColor(50, 50, 50); 
        doc.setLineWidth(0.15);        

        const mx = 5;
        const my = 5; 
        
        const hRowName = 4.5; 
        const hRowData = 5.5; 
        const hBlock = hRowName + (hRowData * 3);
        const w = {
            idx: 6,   dia: 6,   dni: 14,  fin: 5,   dist: 25, 
            edad: 10,  sex: 5,   
            antL: 7,  antV: 8,
            est: 4,   serv: 4,
            dx: 55,   
            tipo: 4,  lab: 5.9,   cie: 13
        };

        // --- CAMBIO 1: AUMENTAR ALTURA DE CASILLAS IZQUIERDAS (De 4 a 7) ---
        const hHeaderSmall = 7; 
        // -------------------------------------------------------------------
        
        const cell = (txt, x, y, cw, ch, styles = {}) => {
            const { fill, bold, align, fontSize, border, rotate, vAlign, textColor, wrap, drawColor } = styles;
            const originalDrawColor = doc.getDrawColor(); 

            if (drawColor) {
                doc.setDrawColor(drawColor[0], drawColor[1], drawColor[2]);
            }

            if (fill) { 
                doc.setFillColor(fill[0], fill[1], fill[2]);
                if (border === false) doc.rect(x, y, cw, ch, 'F'); 
                else doc.rect(x, y, cw, ch, 'FD');
            } 
            else if (border !== false) { 
                doc.rect(x, y, cw, ch);
            }

            if (drawColor) {
                doc.setDrawColor(originalDrawColor);
            }

            if (txt !== undefined && txt !== null && txt !== "") { 
                if(textColor) doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                else doc.setTextColor(0,0,0);

                doc.setFontSize(fontSize || 6);
                doc.setFont(styles.font ||"helvetica", bold ? "bold" : "normal"); 
                
                let text = String(txt);
                const sensitiveLabels = ["Talla", "Peso", "HB", "P.C.", "P.Abd", "P.Preg", "años", "meses", "días"];
                const isSensitive = sensitiveLabels.some(l => text.includes(l));
                if (!isSensitive && !styles.keepCase) text = text.toUpperCase();

                if (rotate) {
                    const xPos = x + (cw / 2);
                    const yPos = y + ch - 1.5;    
                    doc.text(text, xPos, yPos, { angle: 90, align: 'left' });
                } 
                else if (wrap) {
                    const lines = doc.splitTextToSize(text, cw - 1);
                    const lineHeight = (fontSize || 6) * 0.35; 
                    let yPos = y + 2.5;
                    lines.forEach((line) => {
                        if (yPos < y + ch) {
                            doc.text(line, x + 1, yPos);
                            yPos += lineHeight + 1; 
                         }
                    });
                } 
                else {
                    if (doc.getTextWidth(text) > cw - 1) { 
                        const charWidth = doc.getTextWidth("A");
                        const maxChars = Math.floor((cw - 1) / charWidth);
                        text = text.substring(0, maxChars) + "..";
                    }
                    
                    const txtWidth = doc.getTextWidth(text);
                    const xPos = align === 'left' ? x + 1 : 
                                 align === 'right' ?
                                 x + cw - 1 - txtWidth : 
                                 x + (cw / 2) - (txtWidth / 2);
                    let yPos = y + (ch / 2) + 1.2; 
                    if (vAlign === 'top') yPos = y + 2.5;
                    if (vAlign === 'middle') yPos = y + (ch / 2) + 1.2;
                    if (fontSize && fontSize < 6) yPos -= 0.1;

                    doc.text(text, xPos, yPos);
                }
            }
        };

        const drawHeader = (currY) => {
            let y = currY;
            const fullW = 201; 
            const xContent = mx + w.idx; 
            
            // --- DIMENSIONES EXTRA ---
            const wLabel = 7; 
            const wBox = 14;   
            // -------------------------

            doc.setFontSize(6);

            // === FILA 1: LOTE ===
            cell("Lote:", xContent, y, wLabel, hHeaderSmall, {bold:true, border:true, align:'left', fontSize:6});
            cell("", xContent + wLabel, y, wBox, hHeaderSmall, {border:true});
            
            cell("MINISTERIO DE SALUD", mx, y, fullW, hHeaderSmall, {bold:true, align:'center', fontSize:11, border:false});
            y += hHeaderSmall;

            // === FILA 2: PAG ===
            cell("Pag:", xContent, y, wLabel, hHeaderSmall, {bold:true, border:true, align:'left', fontSize:6});
            cell("", xContent + wLabel, y, wBox, hHeaderSmall, {border:true});
            
            cell("OFICINA GENERAL DE ESTADÍSTICA E INFORMÁTICA", mx, y, fullW, hHeaderSmall, {align:'center', fontSize:10, border:false});
            y += hHeaderSmall;

            // === SEPARADOR DOBLE LÍNEA ===
            y += 0.2; 

            // === FILA 3: REG ===
            cell("Reg", xContent, y, wLabel, hHeaderSmall, {bold:true, border:true, align:'left', fontSize:7});
            cell("", xContent + wLabel, y, wBox, hHeaderSmall, {border:true});
            
            cell("Registro Diario de Atención y Otras Actividades de Salud", mx, y, fullW, hHeaderSmall, {align:'center', fontSize:8, border:false});
            
            // === CUADRO DE FIRMA (AJUSTADO A LA NUEVA ALTURA) ===
            const grayColor = [180, 180, 180];
            doc.setDrawColor(180, 180, 180);
            
            // Dibujamos el rectángulo grande de la derecha (Alto total = 3 filas + separador)
            const signatureHeight = (hHeaderSmall * 3) + 0.2;
            doc.rect(mx + 161, currY, 40, signatureHeight); 
            
            // Texto de Firma (Centrado verticalmente)
            doc.setTextColor(180, 180, 180);
            doc.setFontSize(5);
            doc.text("FIRMA Y SELLO", mx + 161 + 20, currY + (signatureHeight * 0.4), {align:'center'});
            doc.text("DEL PERSONAL DE SALUD", mx + 161 + 20, currY + (signatureHeight * 0.6), {align:'center'});
            
            doc.setTextColor(0, 0, 0); // Restaurar negro
            doc.setDrawColor(50, 50, 50); // Restaurar borde negro
            
            y += hHeaderSmall; 
            
            // Espacio final antes de los encabezados de tabla
            y += 1; 

            const bgHead = [230, 230, 230]; 
            const hMeta = 6; 
            
            let cx = mx + w.idx;
            cell("AÑO", cx, y, 10, hMeta, {fill:bgHead, bold:true, align:'center'}); cx+=10;
            cell("MES", cx, y, 20, hMeta, {fill:bgHead, bold:true, align:'center'}); cx+=20;
            cell("ESTABLECIMIENTO DE SALUD", cx, y, 45, hMeta, {fill:bgHead, bold:true, align:'center'}); cx+=45;
            cell("UNIDAD PRESTADORA (UPS)", cx, y, 35, hMeta, {fill:bgHead, bold:true, align:'center'}); cx+=35;
            cell("DNI RESP.", cx, y, 20, hMeta, {fill:bgHead, bold:true, align:'center'});
            cx+=20;
            cell("RESPONSABLE DE LAS ATENCIONES", cx, y, 45, hMeta, {fill:bgHead, bold:true, align:'center'}); cx+=45;
            cell("TURNO", cx, y, 20, hMeta, {fill:bgHead, bold:true, align:'center'}); 
            y += hMeta;

            cx = mx + w.idx;
            cell(adminData.anio, cx, y, 10, hMeta, {align:'center', bold:false, fontSize:7}); cx+=10;
            cell(adminData.mes, cx, y, 20, hMeta, {align:'center', bold:false, fontSize:7}); cx+=20;
            cell(adminData.establecimiento, cx, y, 45, hMeta, {align:'center', bold:false, fontSize:7}); cx+=45;
            cell(adminData.ups, cx, y, 35, hMeta, {align:'center', bold:false, fontSize:7}); cx+=35;
            cell(adminData.dniResp, cx, y, 20, hMeta, {align:'center', bold:false, fontSize:7}); cx+=20;
            cell(adminData.nombreResp, cx, y, 45, hMeta, {align:'center', bold:false, fontSize:7}); cx+=45;
            cell(adminData.turno, cx, y, 20, hMeta, {align:'center', bold:false, fontSize:7}); 
            y += hMeta + 2;

            const hTable = 12; 
            cx = mx;
            cell("", cx, y, w.idx, hTable, {border:false}); cx+=w.idx;
            cell("F.A", cx, y, w.dia, hTable, {fill:bgHead, bold:true, align:'center'}); cx+=w.dia;
            cell("D.N.I / H.C.", cx, y, w.dni, hTable, {fill:bgHead, bold:true, align:'center'}); cx+=w.dni;
            cell("FINANC.", cx, y, w.fin, hTable, {fill:bgHead, bold:true, rotate:true}); cx+=w.fin;
            cell("DISTRITO DE PROCEDENCIA", cx, y, w.dist, hTable, {fill:bgHead, bold:true, align:'center'}); cx+=w.dist;
            cell("EDAD", cx, y, w.edad, hTable, {fill:bgHead, bold:true, rotate:true}); cx+=w.edad;
            cell("SEXO", cx, y, w.sex, hTable, {fill:bgHead, bold:true, rotate:true}); cx+=w.sex;
            cell("ANTROPOMETRÍA", cx, y, (w.antL*2 + w.antV*2), hTable, {fill:bgHead, bold:true, align:'center'});
            cx+=(w.antL*2 + w.antV*2);
            cell("EST", cx, y, w.est, hTable, {fill:bgHead, bold:true, rotate:true}); cx+=w.est;
            cell("SERV", cx, y, w.serv, hTable, {fill:bgHead, bold:true, rotate:true});
            cx+=w.serv;
            cell("DIAGNÓSTICO MOTIVO DE CONSULTA", cx, y, w.dx, hTable, {fill:bgHead, bold:true, align:'center'}); cx+=w.dx;
            cell("TIPO", cx, y, w.tipo, hTable, {fill:bgHead, bold:true, rotate:true}); cx+=w.tipo;
            cell("LAB", cx, y, w.lab * 3, hTable, {fill:bgHead, bold:true, align:'center'});
            cx+=(w.lab * 3);
            cell("CÓDIGO", cx, y, w.cie, hTable, {fill:bgHead, bold:true, align:'center'}); 

            return y + hTable;
        };

        const BLOCKS_PER_PAGE = 11;
        const totalPages = Math.ceil(visualBlocks.length / BLOCKS_PER_PAGE) || 1;

        for (let page = 0; page < totalPages; page++) {
            if (page > 0) doc.addPage();
            let y = drawHeader(my);
            
            for (let i = 0; i < BLOCKS_PER_PAGE; i++) {
                const globalIdx = (page * BLOCKS_PER_PAGE) + i;
                const block = visualBlocks[globalIdx] || null;
                
                const p = block ? block.patient : {};
                const c = block ? block.clinical : {};
                const a = block ? block.age : {};
                const dxs = block ? block.diagnoses : [{},{},{}];
                const isFirst = block ? block.isFirstChunk : false;

                const d1 = dxs[0] || {};
                const d2 = dxs[1] || {};
                const d3 = dxs[2] || {};
                
                let cx = mx;
                
                // ==================================================================
                // DIBUJAR CÍRCULO GRIS PARA EL ÍNDICE (Solo en el primer bloque del paciente)
                // ==================================================================
                if (block && isFirst) {
                    // 1. Calcular el centro exacto donde iría el texto
                    const circleCenterX = cx + (w.idx / 2);
                    const circleCenterY = y + (hBlock / 2);
                    
                    // 2. Definir radio pequeño (donde "quepa justo" el número)
                    // Radio 2.8mm = Diámetro 5.6mm (Cabe perfecto en la columna de 6mm)
                    const circleRadius = 2.8; 

                    // 3. Guardar colores actuales
                    const prevDrawColor = doc.getDrawColor();
                    const prevFillColor = doc.getFillColor();

                    // 4. Configurar color GRIS y dibujar
                    doc.setDrawColor(180, 180, 180); // Borde gris medio
                    doc.setFillColor(220, 220, 220); // Relleno gris claro
                    // 'FD' significa Fill (rellenar) y Draw (dibujar borde)
                    doc.circle(circleCenterX, circleCenterY, circleRadius, 'FD');

                    // 5. Restaurar colores originales
                    doc.setDrawColor(prevDrawColor);
                    doc.setFillColor(prevFillColor);
                }

                // DIBUJAR EL NÚMERO ENCIMA (El código original, ligeramente ajustado)
                const idxText = (block && isFirst) ? block.index : "";
                // Bajé un poco el fontSize a 7.5 para asegurar que entre bien en el círculo
                cell(idxText, cx, y, w.idx, hBlock, {align:'center', bold:true, vAlign:'middle', border:false, fontSize:7.5}); 
                
                // Avanzar el cursor X
                cx += w.idx;
                
                // --- BLOQUE CORREGIDO CON FECHAS Y wFNVal ---
		if (isFirst) {
                    // 1. NOMBRE DEL PACIENTE (Se mantiene igual, ocupa las primeras 4 columnas)
                    const wName = w.dia + w.dni + w.fin + w.dist;
                    cell(p.paciente, cx, y, wName, hRowName, {font: 'helvetica', bold:true, align:'left', fontSize: 7.5, border: false});
                    cx += wName;
                    
                    // --- CAMBIO: MOVER F.N. A LA DERECHA ---
                    
                    // 2. DIBUJAMOS CELDAS VACÍAS (Saltamos EDAD y SEXO donde antes estaba F.N.)
                    // Esto crea el espacio en blanco de "2 casillas"
                    const wEmptySpace = w.edad + w.sex; 
                    cell("", cx, y, wEmptySpace, hRowName, {border: false}); 
                    cx += wEmptySpace;

                    // 3. AHORA SÍ DIBUJAMOS "F.N:" (Alineado bajo Antropometría)
                    // Usamos el ancho de las primeras 2 columnas de antropometría para la etiqueta
                    const wFNLabel = w.antL + w.antV; 
                    cell("F.N:", cx, y, wFNLabel, hRowName, {align:'right', bold:true, border: false, fontSize:6}); 
                    cx += wFNLabel;
                    
                    // 4. DIBUJAMOS EL VALOR DE LA FECHA (Alineado siguiente bloque)
                    const wFNVal = w.antL + w.antV;
                    cell(p.fecNac ? p.fecNac.split('-').reverse().join('/') : "", cx, y, wFNVal, hRowName, {align:'center', fill:[240,240,240], border:true, bold:true, fontSize:7}); 
                    cx += wFNVal;

                    // ---------------------------------------

                    // 5. RESTO DE LA FILA (DOSAJE, FUR, ETC.)
                    // Calculamos el espacio restante para DOSAJE.
                    // Antes era w.antL + w.antV + w.est + w.serv... 
                    // Como hemos "gastado" 2 bloques de antropometría en F.N., ajustamos el ancho de DOSAJE.
                    const wCenter = w.est + w.serv + w.dx + w.tipo;
                    cell(c.dosaje ? `DOSAJE: ${c.dosaje}` : "", cx, y, wCenter, hRowName, {align:'center', fontSize:6, border: false}); 
                    cx += wCenter;

                    const wFURLabel = w.lab * 2;
                    cell("FUR:", cx, y, wFURLabel, hRowName, {align:'right', bold:true, border: false, fontSize:6}); 
                    cx += wFURLabel;

                    const wFURVal = w.lab + w.cie;
                    cell(p.fur ? p.fur.split('-').reverse().join('/') : "", cx, y, wFURVal, hRowName, {align:'center', fill:[240,240,240], border:true, bold:true, fontSize:7});
                } else {
                    let cxEmpty = cx;
                    cell("", cxEmpty, y, w.dia + w.dni + w.fin + w.dist, hRowName, {border: true});
                    cxEmpty += (w.dia + w.dni + w.fin + w.dist);
                    cell("", cxEmpty, y, w.edad + w.sex, hRowName, {border: true});
                    cxEmpty += (w.edad + w.sex);
                    cell("", cxEmpty, y, w.antL + w.antV, hRowName, {fill:[240,240,240], border:true}); cxEmpty += (w.antL + w.antV);
                    cell("", cxEmpty, y, w.antL + w.antV + w.est + w.serv + w.dx + w.tipo, hRowName, {border: true});
                    cxEmpty += (w.antL + w.antV + w.est + w.serv + w.dx + w.tipo);
                    cell("", cxEmpty, y, w.lab * 2, hRowName, {border: true}); cxEmpty += (w.lab * 2);
                    cell("", cxEmpty, y, w.lab + w.cie, hRowName, {fill:[240,240,240], border:true});
                    
	                                
                }
                // --------------------------------------------
                
                const yData = y + hRowName;
                const hDataBlock = hRowData * 3; 

                cx = mx + w.idx;
                cell(p.fecAtencion ? p.fecAtencion.split('-')[2] : "", cx, yData, w.dia, hDataBlock, {align:'center', vAlign:'middle', fontSize:7, bold:false}); 
                cx += w.dia;
                cell(p.dni, cx, yData, w.dni, hRowData, {align:'center', fontSize:7, bold:true});
                cell(p.hc, cx, yData + hRowData, w.dni, hRowData, {align:'center', fontSize:7, bold:true});
                cell(p.condicion, cx, yData + (hRowData*2), w.dni, hRowData, {align:'center', fontSize:5.5, bold:false});
                cx += w.dni;
                const fRaw = (p.financiador || '').toString().trim().toUpperCase();

                // 1. Buscamos si el texto empieza con un número
                const numeroEncontrado = fRaw.match(/^(\d+)/);
                let codigoFinanciador = '1'; 
                if (numeroEncontrado) {
                    codigoFinanciador = numeroEncontrado[1]; 
                } else if (fRaw === 'SIS') {
                    codigoFinanciador = '2'; 
                }

                // Dibujamos solo el número en el PDF
                cell(codigoFinanciador, cx, yData, w.fin, hDataBlock, {align:'center', vAlign:'middle', fontSize:7, bold:false});
                cx += w.fin;
                cell(p.distrito, cx, yData, w.dist, hRowData, {align:'left', fontSize:5, bold:false});
                let direccionTexto = p.direccion || "";
                if(p.centroPoblado) direccionTexto += " " + p.centroPoblado;
                
                cell(direccionTexto, cx, yData + hRowData, w.dist, hRowData * 2, {
                    align:'left', 
                    fontSize:5, 
                    vAlign:'top', 
                    bold:false, 
                    wrap: true 
                });
                cx += w.dist;

                cell(a.y ? a.y + " años" : "", cx, yData, w.edad, hRowData, {align:'center', fontSize: 6, bold:true});
                cell(a.m ? a.m + " meses" : "", cx, yData + hRowData, w.edad, hRowData, {align:'center', fontSize: 6, bold:true});
                cell(a.d ? a.d + " días" : "", cx, yData + (hRowData*2), w.edad, hRowData, {align:'center', fontSize: 6, bold:true});
                cx += w.edad;

                cell(p.sexo, cx, yData, w.sex, hDataBlock, {align:'center', vAlign:'middle', fontSize:7, bold:false});
                cx += w.sex;

                let cxAntro = cx;
                cell("Talla", cxAntro, yData, w.antL, hRowData, {align:'center', fontSize:5, bold:true}); cxAntro+=w.antL;
                cell(isFirst ? c.talla : "", cxAntro, yData, w.antV, hRowData, {align:'center', bold:true, fontSize:7});
                cxAntro+=w.antV;
                cell("P.C.", cxAntro, yData, w.antL, hRowData, {align:'center', fontSize:5, bold:true}); cxAntro+=w.antL;
                cell(isFirst ? c.pCef : "", cxAntro, yData, w.antV, hRowData, {align:'center', bold:true, fontSize:7});
                
                cxAntro = cx;
                cell("Peso", cxAntro, yData+hRowData, w.antL, hRowData, {align:'center', fontSize:5, bold:true}); cxAntro+=w.antL;
                cell(isFirst ? c.peso : "", cxAntro, yData+hRowData, w.antV, hRowData, {align:'center', bold:true, fontSize:7});
                cxAntro+=w.antV;
                cell("P.Abd", cxAntro, yData+hRowData, w.antL, hRowData, {align:'center', fontSize:5, bold:true}); cxAntro+=w.antL;
                cell(isFirst ? c.pAbd : "", cxAntro, yData+hRowData, w.antV, hRowData, {align:'center', bold:true, fontSize:7});

                cxAntro = cx;
                cell("HB", cxAntro, yData+(hRowData*2), w.antL, hRowData, {align:'center', fontSize:5, bold:true}); cxAntro+=w.antL;
                cell(isFirst ? c.hb : "", cxAntro, yData+(hRowData*2), w.antV, hRowData, {align:'center', bold:true, fontSize:7});
                cxAntro+=w.antV;
                cell("P.Preg", cxAntro, yData+(hRowData*2), w.antL, hRowData, {align:'center', fontSize:5, bold:true}); cxAntro+=w.antL;
                cell(isFirst ? c.pPreGest : "", cxAntro, yData+(hRowData*2), w.antV, hRowData, {align:'center', bold:true, fontSize:7});
                
                cx += (w.antL*2 + w.antV*2);
                cell(p.condEst, cx, yData, w.est, hDataBlock, {align:'center', vAlign:'middle', bold:false, fontSize:7}); cx += w.est;
                cell(p.condServ, cx, yData, w.serv, hDataBlock, {align:'center', vAlign:'middle', bold:false, fontSize:7}); cx += w.serv;

                let cxDx = cx;
                cell(d1.desc, cxDx, yData, w.dx, hRowData, {align:'left', fontSize:5.5, bold:false}); cxDx+=w.dx;
                cell(d1.tipo, cxDx, yData, w.tipo, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.tipo;
                cell(d1.lab1, cxDx, yData, w.lab, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.lab;
                cell(d1.lab2, cxDx, yData, w.lab, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.lab;
                cell(d1.lab3, cxDx, yData, w.lab, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.lab;
                cell(d1.codigo, cxDx, yData, w.cie, hRowData, {align:'center', bold:true, fontSize:7});

                cxDx = cx;
                cell(d2.desc, cxDx, yData+hRowData, w.dx, hRowData, {align:'left', fontSize:5.5, bold:false}); cxDx+=w.dx;
                cell(d2.tipo, cxDx, yData+hRowData, w.tipo, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.tipo;
                cell(d2.lab1, cxDx, yData+hRowData, w.lab, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.lab;
                cell(d2.lab2, cxDx, yData+hRowData, w.lab, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.lab;
                cell(d2.lab3, cxDx, yData+hRowData, w.lab, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.lab;
                cell(d2.codigo, cxDx, yData+hRowData, w.cie, hRowData, {align:'center', bold:true, fontSize:7});

                cxDx = cx;
                cell(d3.desc, cxDx, yData+(hRowData*2), w.dx, hRowData, {align:'left', fontSize:5.5, bold:false}); cxDx+=w.dx;
                cell(d3.tipo, cxDx, yData+(hRowData*2), w.tipo, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.tipo;
                cell(d3.lab1, cxDx, yData+(hRowData*2), w.lab, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.lab;
                cell(d3.lab2, cxDx, yData+(hRowData*2), w.lab, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.lab;
                cell(d3.lab3, cxDx, yData+(hRowData*2), w.lab, hRowData, {align:'center', bold:false, fontSize:6}); cxDx+=w.lab;
                cell(d3.codigo, cxDx, yData+(hRowData*2), w.cie, hRowData, {align:'center', bold:true, fontSize:7});

                y += hBlock;
            }
               // ==================================================================
            // PIE DE PÁGINA: CÍRCULO DERECHA + NUMERACIÓN IZQUIERDA
            // ==================================================================
            
            // 1. Configuración de posición vertical (común para ambos)
            const centerY = 292; // 290mm (Muy pegado abajo, alto A4=297)

            // 2. DIBUJAR CÍRCULO (EXTREMO DERECHO)
            const radius = 5.3; 
            const centerX = 200; // 205mm (Derecha)

            doc.setDrawColor(120, 120, 120); 
            doc.setLineWidth(0.4); 
            doc.circle(centerX, centerY, radius);
            
            // 3. DIBUJAR NUMERACIÓN DE PÁGINA (EXTREMO IZQUIERDO)
            // Formato: "1/3", "2/3", etc.
            doc.setFontSize(7); // Tamaño pequeño
            doc.setTextColor(80, 80, 80); // Color gris oscuro
            doc.text(`${page + 1}/${totalPages}`, 5, centerY + 1); // x=5 (Margen izq), y ajustado para alinear texto
            
            // 4. Restaurar estilos para siguiente página
            doc.setDrawColor(50, 50, 50); 
            doc.setLineWidth(0.15);
            doc.setTextColor(0, 0, 0);
        }

        // === NUEVO NOMBRE DE ARCHIVO ÚNICO ===
        const nextCount = printCount + 1; // Aumentamos 1 al contador actual
        
        // Formato: HIS_cantidadPacientes_PACIENTES_MESnumeroImpresion.pdf
        const fileName = `HIS_${allPatients.length}_PACIENTES_${adminData.mes}${nextCount}.pdf`;
        
        doc.save(fileName); // Guardamos con el nuevo nombre

        // Guardamos el nuevo número en el Estado y en la Memoria del navegador
        setPrintCount(nextCount);
        localStorage.setItem('his_print_count', nextCount);
        // =====================================
        // --- LIMPIEZA DE MEMORIA ---
        localStorage.removeItem('HIS_LOTE_PENDIENTE'); // <--- AGREGA ESTO
        
        setSavedPatients([]);
        resetForm();               
        setStep(1);                 
        setIsBatchFinished(false);  
        setIsCalendarOpen(true);
        
    } catch(err) { 
        alert("Error al generar PDF: " + err.message);
        console.error(err);
    }
};
  const generateExcel = () => {
    try {
        if (typeof global === 'undefined') window.global = window;
        if (savedPatients.length === 0 && !patientData.paciente) return alert("No hay datos para exportar.");
        const wb = XLSX.utils.book_new();
        const grayBorderColor = { rgb: "595959" }; const thinBorder = { top: { style: "thin", color: grayBorderColor }, bottom: { style: "thin", color: grayBorderColor }, left: { style: "thin", color: grayBorderColor }, right: { style: "thin", color: grayBorderColor } };
        const centerStyle = { alignment: { horizontal: "center", vertical: "center", wrapText: true }, font: { sz: 10.5, name: "Arial" }, border: thinBorder };
        const leftStyle = { alignment: { horizontal: "left", vertical: "center", wrapText: true }, font: { sz: 10.5, name: "Arial" }, border: thinBorder };
        const boxHeaderStyle = { alignment: { horizontal: "center", vertical: "center", wrapText: true }, font: { sz: 10, bold: true }, border: thinBorder, fill: { fgColor: { rgb: "FFFFFF" } } };
        const smallTextStyle = { alignment: { horizontal: "left", vertical: "center", wrapText: true }, font: { sz: 9, name: "Arial" }, border: thinBorder };
        const centerSmallStyle = { alignment: { horizontal: "center", vertical: "center", wrapText: true }, font: { sz: 9, name: "Arial" }, border: thinBorder };
        const descStyle = { alignment: { horizontal: "left", vertical: "center", wrapText: true }, font: { sz: 9.5, name: "Arial" }, border: thinBorder };
        const bahnschriftStyle = { alignment: { horizontal: "center", vertical: "center", wrapText: true }, font: { sz: 11, name: "Bahnschrift SemiBold", bold: true }, border: thinBorder };
        const levenimStyle = { alignment: { horizontal: "left", vertical: "center", wrapText: true }, font: { sz: 9, name: "Levenim MT", bold: false }, border: thinBorder };
        const ageStyle = { alignment: { horizontal: "center", vertical: "center", wrapText: true }, font: { sz: 9, name: "Bahnschrift SemiBold", color: { rgb: "404040" }, bold: true }, border: thinBorder };
        const headerStyle = { alignment: { horizontal: "center", vertical: "center" }, font: { bold: true, sz: 10, name: "Arial" } };
        const labelHeaderStyle = { alignment: { horizontal: "right", vertical: "center" }, font: { bold: true, sz: 9, name: "Arial" }, border: thinBorder };
        const signatureStyle = { alignment: { horizontal: "center", vertical: "bottom", wrapText: true }, font: { sz: 8, name: "Arial", color: { rgb: "D9D9D9" }, bold: true }, border: thinBorder };
        const signatureText = "FIRMA Y SELLO\nDEL PERSONAL DE SALUD";
        const hRow1 = new Array(19).fill(""); hRow1[1]="Lote:"; hRow1[4]="MINISTERIO DE SALUD"; hRow1[14]=signatureText;
        const hRow2 = new Array(19).fill(""); hRow2[1]="Pag:"; hRow2[4]="OFICINA GENERAL DE ESTADÍSTICA E INFORMÁTICA";
        const hRow3 = new Array(19).fill("");
        const hRow4 = new Array(19).fill(""); hRow4[1]="Reg:"; hRow4[4]="Registro Diario de Atención y Otras Actividades de Salud";
        const hRow6 = ["", "AÑO", "MES", "ESTABLECIMIENTO DE SALUD", "", "UNIDAD PRESTADORA (UPS)", "", "", "", "DNI DEL RESP.", "", "", "RESPONSABLE DE LAS ATENCIONES", "", "TURNO"];
        const hRow7 = ["", adminData.anio, adminData.mes, adminData.establecimiento, "", adminData.ups, "", "", "", adminData.dniResp, "", "", adminData.nombreResp, "", adminData.turno];
        const hRow9 = ["", "F.A", "D.N.I. / H.C.", "FINANC.", "DISTRITO DE PROCEDENCIA", "EDAD", "SEXO", "ANTROPOMETRÍA", "", "", "", "EST", "SERV", "DIAGNÓSTICO MOTIVO DE CONSULTA", "TIPO", "LAB", "LAB", "LAB", "CÓDIGO"];
        const fullHeaderBlock = [ hRow1, hRow2, hRow3, hRow4, [""], hRow6, hRow7, [""], hRow9 ];
        const headerMergesTemplate = [
            { s: {r:0, c:4}, e: {r:0, c:13} }, { s: {r:1, c:4}, e: {r:1, c:13} }, { s: {r:3, c:4}, e: {r:3, c:13} },
            { s: {r:0, c:2}, e: {r:0, c:3} }, { s: {r:1, c:2}, e: {r:1, c:3} }, { s: {r:2, c:1}, e: {r:2, c:3} }, { s: {r:3, c:2}, e: {r:3, c:3} },
            { s: {r:0, c:14}, e: {r:3, c:18} },
            { s: {r:5, c:3}, e: {r:5, c:4} }, { s: {r:6, c:3}, e: {r:6, c:4} }, { s: {r:5, c:5}, e: {r:5, c:8} }, { s: {r:6, c:5}, e: {r:6, c:8} },
            { s: {r:5, c:9}, e: {r:5, c:11} }, { s: {r:6, c:9}, e: {r:6, c:11} }, { s: {r:5, c:12}, e: {r:5, c:13} }, { s: {r:6, c:12}, e: {r:6, c:13} },
            { s: {r:5, c:14}, e: {r:5, c:18} }, { s: {r:6, c:14}, e: {r:6, c:18} },
            { s: {r:8, c:7}, e: {r:8, c:10} }, { s: {r:8, c:15}, e: {r:8, c:17} }
        ];
        const ws_data = []; const merges = [];
        const insertHeaderBlock = (startRowIndex) => {
            fullHeaderBlock.forEach(row => ws_data.push([...row]));
            headerMergesTemplate.forEach(m => { merges.push({ s: { r: m.s.r + startRowIndex, c: m.s.c }, e: { r: m.e.r + startRowIndex, c: m.e.c } }); });
        };
        insertHeaderBlock(0);
        
        const allPatients = [...savedPatients];
        if (patientData.paciente) { allPatients.push({ patient: patientData, clinical: clinicalData, diagnoses: diagnoses, ageObj: ageObj });
        }
        
        let currentRow = 9;
        let globalBlockIndex = 1; let blocksOnCurrentPage = 0; let patientHeaderIndices = []; let pageStartRows = [0]; const rowBreaks = [];
        const addBlockToSheet = (rec = null) => {
             const isEmpty = !rec;
             const p = rec ? rec.patient : {};
             const c = rec ? rec.clinical : {};
             const dxs = rec ? rec.diagnoses : [];
             const age = rec ? rec.ageObj : {};

             let chunks = [];
             if (!isEmpty) {
                 const totalDxs = Math.max(1, dxs.length);
                 for (let i = 0; i < totalDxs; i += 3) { chunks.push(dxs.slice(i, i + 3));
                 } 
                 if (chunks.length === 0) chunks.push([{},{},{}]);
             } else {
                 chunks.push([{},{},{}]);
             }

             for(let k = 0; k < chunks.length; k++) {
                const chunkDxs = chunks[k];
                while(chunkDxs.length < 3) chunkDxs.push({});

                if (blocksOnCurrentPage === 11) {
                    ws_data.push([""]);
                    merges.push({ s: {r:currentRow, c:0}, e: {r:currentRow, c:18} });
                    rowBreaks.push(currentRow); currentRow++; pageStartRows.push(currentRow);
                    insertHeaderBlock(currentRow); currentRow += 9; blocksOnCurrentPage = 0;
                }

                const patientRow = new Array(19).fill("");
                patientRow[0] = globalBlockIndex;
                if (k === 0) {
                    if (!isEmpty) {
                        patientRow[1] = p.paciente;
                        patientRow[8] = p.fecNac ? p.fecNac.split('-').reverse().join('/') : "";
                        if (c.dosaje) patientRow[10] = `F.U.DOSAJE: ${c.dosaje}`; 
                        if (p.fur) patientRow[16] = p.fur.split('-').reverse().join('/');
                    }
                    patientRow[6] = "F.N:";
                    patientRow[14] = "FUR:";
                }
                ws_data.push(patientRow);
                patientHeaderIndices.push(currentRow);

                merges.push({ s: {r:currentRow, c:1}, e: {r:currentRow, c:5} }); 
                merges.push({ s: {r:currentRow, c:6}, e: {r:currentRow, c:7} });
                merges.push({ s: {r:currentRow, c:8}, e: {r:currentRow, c:9} }); 
                merges.push({ s: {r:currentRow, c:10}, e: {r:currentRow, c:13} });
                merges.push({ s: {r:currentRow, c:14}, e: {r:currentRow, c:15} }); 
                merges.push({ s: {r:currentRow, c:16}, e: {r:currentRow, c:18} });
                merges.push({ s: {r:currentRow, c:0}, e: {r:currentRow+3, c:0} }); 

                currentRow++;

                for(let i = 0; i < 3; i++) {
                    const d = chunkDxs[i] || {}; 
                    const row = new Array(19).fill(""); 
                    if (!isEmpty) {
                        row[13] = d.desc || ""; row[14] = d.tipo || ""; row[15] = d.lab1 || ""; row[16] = d.lab2 || ""; row[17] = d.lab3 || ""; row[18] = d.codigo || "";
                        if (i === 0) { row[1] = p.fecAtencion ? p.fecAtencion.split('-')[2] : "";
                        row[2] = p.dni; row[3] = p.financiador === 'SIS' ? '1' : '2'; row[4] = p.distrito;
                        row[5] = (age.y || age.y === 0) ? `${age.y} años` : ''; row[6] = p.sexo; row[7] = "Talla";
                        row[8] = (k===0 ? parseFloat(c.talla)||'' : ''); row[9] = "P.C."; row[10] = (k===0 ? parseFloat(c.pCef)||'' : ''); row[11] = p.condEst;
                        row[12] = p.condServ; } 
                        else if (i === 1) { row[2] = p.hc;
                        row[4] = p.direccion; row[5] = (age.m || age.m === 0) ? `${age.m} meses` : ''; row[7] = "Peso";
                        row[8] = (k===0 ? parseFloat(c.peso)||'' : ''); row[9] = "P.Abd"; row[10] = (k===0 ? parseFloat(c.pAbd)||'' : '');
                        } 
                        else if (i === 2) { row[2] = p.condicion || "-"; row[4] = "CENTRO POBLADO"; row[5] = (age.d || age.d === 0) ? `${age.d} días` : ''; row[7] = "HB";
                        row[8] = (k===0 ? parseFloat(c.hb)||'' : ''); row[9] = "P.Preg";
                        }
                    } else {
                        if (i === 0) { row[7] = "Talla";
                        row[9] = "P.C."; }
                        else if (i === 1) { row[7] = "Peso";
                        row[9] = "P.Abd"; }
                        else if (i === 2) { row[7] = "HB";
                        row[9] = "P.Preg"; }
                    }
                    ws_data.push(row);
                }
                const start = currentRow;
                const end = currentRow + 2;
                merges.push( { s: {r:start, c:1}, e: {r:end, c:1} }, { s: {r:start, c:3}, e: {r:end, c:3} }, { s: {r:start+1, c:4}, e: {r:end, c:4} }, { s: {r:start, c:6}, e: {r:end, c:6} }, { s: {r:start, c:11}, e: {r:end, c:11} }, { s: {r:start, c:12}, e: {r:end, c:12} } );
                currentRow += 3; globalBlockIndex++; blocksOnCurrentPage++;
             }
        };

        allPatients.forEach(rec => addBlockToSheet(rec));
        while (blocksOnCurrentPage > 0 && blocksOnCurrentPage < 11) {
            addBlockToSheet(null);
        }
        
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        ws['!cols'] = [ { wch: 2.22 }, { wch: 4 }, { wch: 10 }, { wch: 2 }, { wch: 19.5 }, { wch: 5.44 }, { wch: 2 }, { wch: 4.5 }, { wch: 5.88 }, { wch: 5.1 }, { wch: 5.88 }, { wch: 1.78 }, { wch: 1.78 }, { wch: 42 }, { wch: 2.33 }, { wch: 3.56 }, { wch: 3.56 }, { wch: 3.56 }, { wch: 8.5 } ];
        ws['!merges'] = merges; ws['!pageSetup'] = { scale: 65, paperSize: 9, orientation: 'portrait' };
        ws['!margins'] = { left: 0.3, right: 0.3, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 };
        ws['!rowBreaks'] = rowBreaks.map(r => ({id: r}));
        const rowHeights = [];
        for(let i=0; i<ws_data.length; i++) {
            let isHeader = false;
            for(let start of pageStartRows) { 
                if (i >= start && i < start + 9) { 
                    isHeader = true;
                    let rel = i - start; 
                    if (rel === 0 || rel === 1 || rel === 3) { rowHeights.push({ hpx: 25 });
                    }
                    else if(rel===2 || rel===4 || rel===7) rowHeights.push({ hpx: 4 });
                    else if (rel===8) rowHeights.push({ hpx: 40.8 }); 
                    else rowHeights.push({ hpx: 20 }); 
                    break;
                } 
            }
            if (!isHeader) { 
                if(patientHeaderIndices.includes(i)) { rowHeights.push({ hpx: 18 });
                } 
                else { rowHeights.push({ hpx: 24 });
                } 
            }
        }
        ws['!rows'] = rowHeights;
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_ref = XLSX.utils.encode_cell({c:C, r:R});
            if (!ws[cell_ref]) ws[cell_ref] = { t: 's', v: '' }; 
            let headerStart = -1;
            for(let start of pageStartRows) { if (R >= start && R < start + 9) { headerStart = start; break;
            } }
            const isHeaderBlock = (headerStart !== -1);
            const relativeR = isHeaderBlock ? (R - headerStart) : -1;
            if (isHeaderBlock) {
                if (relativeR === 0 && C === 4) { ws[cell_ref].s = { font: { name: "Arial Black", sz: 14, bold: true }, alignment: { horizontal: "center", vertical: "center" } };
                }
                else if (relativeR === 1 && C === 4) { ws[cell_ref].s = { font: { name: "Arial", sz: 12, bold: true}, alignment: { horizontal: "center", vertical: "center" } };
                }
                else if (relativeR <= 3) { if (C >= 1 && C <= 3) { ws[cell_ref].s = { border: thinBorder };
                if (C === 1) ws[cell_ref].s = labelHeaderStyle; } else if (C >= 14) { ws[cell_ref].s = { border: thinBorder };
                if (C === 14 && relativeR === 0) ws[cell_ref].s = signatureStyle;
                } else if (C >= 4 && C <= 13) { if (C === 4) ws[cell_ref].s = headerStyle;
                } }
                else if (relativeR >= 5 && relativeR <= 6 && C > 0) { ws[cell_ref].s = boxHeaderStyle;if (relativeR === 5 && C === 3) { 
        ws[cell_ref].s = { ...boxHeaderStyle, font: { sz: 9, bold: true } };
        }
 if (relativeR === 5 && C >= 5 && C <= 8) { ws[cell_ref].s = { ...boxHeaderStyle, font: { sz: 9, bold: true } };
 } } 
                else if (relativeR === 8) { ws[cell_ref].s = { ...centerStyle, font: { bold: true, sz: 8, name: "Arial" }, fill: { fgColor: { rgb: "CCCCCC" } } };
                if ([3, 5, 6, 11, 12, 14].includes(C)) { ws[cell_ref].s.alignment = { textRotation: 90, horizontal: "center", vertical: "center", wrapText: true };
                } if (C === 0) { ws[cell_ref].s.fill = { fgColor: { rgb: "FFFFFF" } }; ws[cell_ref].s.border = {};
                } }
                if (C === 0 && (relativeR === 5 || relativeR === 6)) { ws[cell_ref].s = { fill: { fgColor: { rgb: "FFFFFF" } } };
                }
            } else {
                ws[cell_ref].s = centerStyle;
                if (C === 0) { ws[cell_ref].s = { alignment: { horizontal: "center", vertical: "center" }, font: { bold: true, sz: 11, name: "Arial" }, border: {} };
                }
                if (C === 4) ws[cell_ref].s = leftStyle;
                if (C === 13) ws[cell_ref].s = levenimStyle; 
                if ([1, 8, 10, 11, 12, 14, 15, 16, 17, 18].includes(C)) { ws[cell_ref].s = bahnschriftStyle;
                }
                if (C === 2 && !patientHeaderIndices.includes(R)) { ws[cell_ref].s = bahnschriftStyle;
                }
                if (C === 5) { ws[cell_ref].s = ageStyle;
                }
                let currentPh = -1;
                for(let ph of patientHeaderIndices) { if (ph <= R) currentPh = ph; else break;
                }
                
                if (currentPh !== -1) { 
                    const offset = R - currentPh;
                    if (offset === 0) { 
                        ws[cell_ref].s = { alignment: { vertical: "center" } };
                        if (C === 1) { 
                             ws[cell_ref].s = { ...ws[cell_ref].s, font: { name: "Bahnschrift SemiBold", sz: 11, bold: true }, alignment: { horizontal: "left", vertical: "center" } };
                        } 
                        if (C === 6) { 
                             ws[cell_ref].s = { ...ws[cell_ref].s, font: { name: "Arial", sz: 9, bold: true }, alignment: { horizontal: "right", vertical: "center" } };
                        }
                        if (C === 8) { 
                             ws[cell_ref].s = { ...ws[cell_ref].s, font: { name: "Arial", sz: 10, bold: false }, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "F2F2F2" } }, border: thinBorder };
                        }
                        if (C === 14) { 
                             ws[cell_ref].s = { ...ws[cell_ref].s, font: { name: "Arial", sz: 9, bold: true }, alignment: { horizontal: "right", vertical: "center" } };
                        }
                        if (C === 16) { 
                             ws[cell_ref].s = { ...ws[cell_ref].s, font: { name: "Arial", sz: 10 }, alignment: { horizontal: "center", vertical: "center" }, fill: { fgColor: { rgb: "F2F2F2" } }, border: thinBorder };
                        }

                    } else if (offset === 1) { 
                        if (C === 4) ws[cell_ref].s = smallTextStyle;
                    } else if (offset === 2) { 
                        if (C === 4) ws[cell_ref].s = smallTextStyle;
                    } else if (offset === 3) { 
                        if (C === 2) ws[cell_ref].s = centerSmallStyle;
                    } 
                    if (offset >= 1 && offset <= 3) { 
                        if (C === 7 || C === 9) ws[cell_ref].s = centerSmallStyle;
                        if ([15, 16, 17].includes(C)) ws[cell_ref].s = centerSmallStyle; 
                    } 
                }
            }
            }
        }
        XLSX.utils.book_append_sheet(wb, ws, "HIS_Export");
        XLSX.writeFile(wb, `HIS_${adminData.mes}_${allPatients.length}_PACIENTES.xlsx`);
    
        // --- INICIO DEL CAMBIO: LIMPIEZA AUTOMÁTICA SIN PREGUNTAR ---
        localStorage.removeItem('HIS_LOTE_PENDIENTE'); // <--- AGREGA ESTO
        setSavedPatients([]);
        
        resetForm();
        setStep(1);
        setIsBatchFinished(false);
        setIsCalendarOpen(true);
        setSavedPatients([]);
        // 1. Borra la lista de pacientes (Limpia el visor)
        resetForm();
        // 2. Resetea el formulario
        setStep(1);
        // 3. Vuelve al paso 1
        setIsBatchFinished(false);
        // 4. Reactiva los botones de edición
        setIsCalendarOpen(true);
        // 5. Abre el calendario para el siguiente lote
        
        // Opcional: Un mensaje simple que no requiere confirmación
        // alert("✅ Excel descargado. Lista limpiada automáticamente.");
        // --- FIN DEL CAMBIO ---
    } catch(err) { alert("Error al exportar Excel: " + err.message);
    }  
  };

  // --- PANTALLA DE LOGIN REDISEÑADA (MODERNA) ---
  // --- PANTALLA DE LOGIN REDISEÑADA (CORREGIDA) ---
  if (!isAuthenticated) {
    return (
      // CONTENEDOR PRINCIPAL CON FONDO DEGRADADO OSCURO
      <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black flex items-center justify-center p-4">
        
        {/* TARJETA DE LOGIN CON EFECTO GLASSMORPHISM */}
        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl shadow-black/20 w-full max-w-md border border-white/20 relative overflow-hidden">
          
          {/* Elemento decorativo de fondo (brillo superior) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none"></div>

          <div className="relative z-10">
            {/* LOGO Y TÍTULO */}
            <div className="text-center mb-10">
              {/* Ícono con brillo */}
              <div className="inline-block relative mb-4">
                 <div className="absolute inset-0 bg-blue-500 blur-xl opacity-30 rounded-2xl scale-110"></div>
                 <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-24 h-24 rounded-2xl flex items-center justify-center text-white relative shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-500">
                   <Stethoscope size={44} strokeWidth={2} />
                 </div>
              </div>
              
              <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">SMART HIS</h1>
              <p className="text-slate-500 font-medium text-sm uppercase tracking-widest">Acceso Personal de Salud</p>
            </div>

            {/* FORMULARIO */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* INPUT USUARIO (CON ÍCONO INTEGRADO) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase ml-1 tracking-wider">DNI Usuario</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <User size={20} />
                  </div>
                  <input 
                    type="number" 
                    value={loginDni} // <--- CORREGIDO: Antes decía username
                    onChange={(e) => setLoginDni(e.target.value)} // <--- CORREGIDO: Antes decía setUsername
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none text-lg font-bold text-slate-700 transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 shadow-sm placeholder:text-slate-300"
                    placeholder="Ingrese su DNI..."
                    autoFocus
                  />
                </div>
              </div>

              {/* INPUT CONTRASEÑA (CON ÍCONOS INTEGRADOS) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase ml-1 tracking-wider">Contraseña</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Lock size={20} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={loginPass} // <--- CORREGIDO: Antes decía password
                    onChange={(e) => setLoginPass(e.target.value)} // <--- CORREGIDO: Antes decía setPassword
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 outline-none text-lg font-bold text-slate-700 transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 shadow-sm placeholder:text-slate-300 font-mono"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none p-1"
                  >
                    {showPassword ? <EyeOff size={22}/> : <Eye size={22}/>}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg text-center border border-red-100 flex items-center justify-center gap-2 animate-pulse">
                   <AlertTriangle size={14}/> {loginError}
                </div>
              )}

              {/* BOTÓN DE INGRESO (CON DEGRADADO Y BRILLO) */}
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-4 rounded-2xl font-black text-lg tracking-wide shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4 relative overflow-hidden group"
              >
                <span className="relative z-10">INICIAR SESIÓN</span>
                {/* Efecto de brillo al pasar el mouse */}
                <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
              </button>
            </form>
          </div>
          
          {/* FOOTER */}
          <p className="text-center text-slate-400 text-xs font-medium mt-8 opacity-80 relative z-10">
            Versión 1.0 | Smart HIS System
          </p>
        </div>
      </div>
    );
  }
    if (!adminData.isConfigured) {
    const cfgInputStyle = "w-full h-10 px-3 border-2 border-slate-200 rounded-xl bg-white text-slate-700 font-bold focus:border-slate-500 focus:ring-4 focus:ring-slate-100 outline-none transition-all shadow-sm text-sm hover:border-slate-300";
    const cfgLabelStyle = "block text-xs font-bold text-slate-400 uppercase ml-2 mb-1";
    return (
      <div className="min-h-screen w-full bg-[#f0f2f5] font-sans flex items-center justify-center p-4">
        <div className="w-full max-w-5xl bg-white shadow-2xl rounded-[30px] overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-300 mx-auto">
          <div className="bg-[#0F172A] px-10 py-6 flex justify-between items-end">
            <div><h1 className="text-2xl font-bold text-white tracking-wide">REGISTRO HIS</h1><p className="text-slate-400 text-xs mt-1">Configuración de Sesión</p></div>
            <div className="flex gap-2">
              <div className="relative group"><input type="file" id="filePac" className="hidden" onChange={(e) => handleFileUpload(e, 'pacientes')} /><label htmlFor="filePac" className={`cursor-pointer px-5 py-2.5 rounded-xl border ${dbPacientes.length ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'} flex items-center gap-2 text-xs font-bold transition-all shadow-lg`}><Database size={16}/> {dbPacientes.length ?
                `BD OK (${dbPacientes.length})` : "Cargar Pacientes"}</label></div>
              <div className="relative group"><input type="file" id="fileCie" className="hidden" onChange={(e) => handleFileUpload(e, 'cie10')} /><label htmlFor="fileCie" className={`cursor-pointer px-5 py-2.5 rounded-xl border ${dbCie10.length ?
                'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'} flex items-center gap-2 text-xs font-bold transition-all shadow-lg`}><FileSpreadsheet size={16}/> {dbCie10.length ?
                `BD OK (${dbCie10.length})` : "Cargar CIE-10"}</label></div>
              <div className="relative group"><input type="file" id="filePersonal" className="hidden" onChange={(e) => handleFileUpload(e, 'personal')} /><label htmlFor="filePersonal" className={`cursor-pointer px-5 py-2.5 rounded-xl border ${dbPersonal.length ?
                'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'} flex items-center gap-2 text-xs font-bold transition-all shadow-lg`}><Users size={16}/> {dbPersonal.length ?
                `Personal OK` : "Cargar Personal"}</label></div>
              
              {dbStatus === 'ready' && (
                  <button onClick={clearDatabase} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2.5 rounded-xl border border-red-400 flex items-center gap-2 text-xs font-bold transition-all shadow-lg ml-2" title="Borrar Base de Datos Local de Pacientes">
                      <Trash2 size={16}/> Borrar BD
                  </button>
              )}
            </div>
          </div>
          <div className="p-10 grid grid-cols-1 md:grid-cols-4 gap-6 bg-white">
            <div className="flex flex-col gap-1"><label className={cfgLabelStyle}>Año</label><select name="anio" className={cfgInputStyle} value={adminData.anio} onChange={handleAdmin}><option>2025</option><option>2026</option></select></div>
            <div className="flex flex-col gap-1"><label className={cfgLabelStyle}>Mes</label><select name="mes" className={cfgInputStyle} value={adminData.mes} onChange={handleAdmin}>{MESES.map(m=><option key={m}>{m}</option>)}</select></div>
            <div className="md:col-span-2 flex flex-col gap-1"><label className={cfgLabelStyle}>Establecimiento</label><select name="establecimiento" className={cfgInputStyle} value={adminData.establecimiento} onChange={handleAdmin}>{ESTABLECIMIENTOS.map(e=><option key={e}>{e}</option>)}</select></div>
            <div className="flex flex-col gap-1"><label className={cfgLabelStyle}>Turno</label><select name="turno" className={cfgInputStyle} value={adminData.turno} onChange={handleAdmin}><option>MAÑANA</option><option>TARDE</option><option>NOCHE</option></select></div>
            <div className="flex flex-col gap-1"><label className={cfgLabelStyle}>UPS</label><select name="ups" className={cfgInputStyle} value={adminData.ups} onChange={handleAdmin}>{UPS_LIST.map(u=><option key={u}>{u}</option>)}</select></div>
            
            <div className="flex flex-col gap-1">
                <label className={cfgLabelStyle}>DNI Responsable</label>
                <input 
                    name="dniResp" 
                    className={cfgInputStyle + " bg-slate-200 text-slate-600 cursor-not-allowed border-slate-300 shadow-inner"} 
                    value={adminData.dniResp} 
                    readOnly={true} 
                />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1">
                <label className={cfgLabelStyle}>Nombre Responsable</label>
                <input 
                    name="nombreResp" 
                    className={cfgInputStyle + " uppercase bg-slate-200 text-slate-600 cursor-not-allowed border-slate-300 shadow-inner"} 
                    value={adminData.nombreResp} 
                    readOnly={true} 
                />
            </div>
          </div>
          <div className="bg-slate-50 px-10 py-6 flex justify-end border-t border-slate-100">
            <button onClick={() => setAdminData({...adminData, isConfigured: true})} className="bg-[#0F172A] hover:bg-slate-800 text-white px-8 py-3 rounded-xl shadow-xl font-bold flex items-center gap-3 transition-transform hover:scale-[1.02] text-sm">INGRESAR AL SISTEMA <ArrowRight size={18}/></button>
          </div>
        </div>
      </div>
    );
  }

  const consolidatedPatients = [...savedPatients];
  if (patientData.paciente) {
      consolidatedPatients.push({ patient: patientData, clinical: clinicalData, diagnoses: diagnoses, ageObj: ageObj });
  }
  const totalGridRows = consolidatedPatients.reduce((acc, p) => {
      const chunks = Math.ceil(Math.max(1, p.diagnoses.length) / 3);
      return acc + (chunks * 4); 
  }, 0);
  let visualBlockIndex = 1; 

  return (
    <div className="h-screen w-full bg-slate-100 font-sans flex flex-col overflow-hidden">
      {/* BARRA SUPERIOR AZUL OSCURO */}
      <div className="h-16 bg-[#0F172A] text-white flex justify-between items-center px-6 shadow-md z-20 shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/50">
                <Activity size={20} className="text-white" />
            </div>
            <div>
                <h2 className="font-black text-sm tracking-widest text-white mb-0.5">REGISTRO HIS</h2>
                <div className="flex gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    <span>ESTABLECIMIENTO: <span className="text-blue-300">{adminData.establecimiento}</span></span>
                    <span className="text-slate-700">|</span>
                    <span>TURNO: <span className="text-emerald-300">{adminData.turno}</span></span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">USUARIO ACTIVO</span>
                <span className="uppercase text-white font-black tracking-wide text-sm md:text-base">
                    {adminData.nombreResp || "INVITADO"}
                </span>
            </div>
            <button 
                onClick={() => setAdminData({...adminData, isConfigured: false})} 
                className="bg-red-500/10 hover:bg-red-500/20 text-red-200 px-4 py-2 rounded-xl border border-red-500/30 flex gap-2 transition-all hover:border-red-400 font-bold text-xs items-center"
            >
                <LogOut size={16}/> SALIR A CONFIGURACIÓN
            </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 w-full relative bg-slate-100 overflow-hidden">
        {!isModalOpen ?
        (
          /* VISTA DASHBOARD (Botones de colores y PDF) */
          <div className="w-full h-full flex flex-col items-center overflow-y-auto py-6 gap-6 pb-40 px-4 animate-in fade-in zoom-in duration-300">
            
            {/* 1. PANELES DE SEGUIMIENTO */}
            <div className="w-full max-w-6xl bg-white p-4 rounded-2xl shadow-sm border border-slate-200 shrink-0 relative z-20">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest text-center">ACCESO RÁPIDO A SEGUIMIENTOS</p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {[
                        { id: 'CRED', label: 'CRED', icon: <Baby size={16}/>, color: 'emerald' },
                        { id: 'GESTANTE', label: 'GESTANTES', icon: <UserPlus size={16}/>, color: 'pink' },
                        { id: 'ANEMIA', label: 'ANEMIA', icon: <Activity size={16}/>, color: 'red' },
                        { id: 'ANEMIA_GEST', label: 'ANEMIA GEST.', icon: <Activity size={16}/>, color: 'rose' },
                        { id: 'HIPER', label: 'HIPERTENSOS', icon: <Heart size={16}/>, color: 'orange' },
                        { id: 'DIABETES', label: 'DIABETES', icon: <Droplets size={16}/>, color: 'blue' },
                        { id: 'PSICOLOGIA', label: 'PSICOLOGÍA', icon: <Brain size={16}/>, color: 'indigo' },
                      //{ id: 'BUCAL', label: 'ODONTO', icon: <span className="text-base leading-none grayscale">🦷</span>, color: 'cyan' },
			{ id: 'BUCAL', label: 'ODONTO', icon: null, color: 'cyan' },
                        { id: 'VACUNAS', label: 'VACUNAS', icon: <Syringe size={16}/>, color: 'purple' },
                    ].map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveFollowUp(activeFollowUp === item.id ? null : item.id)} 
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all border shadow-sm
                                ${activeFollowUp === item.id 
                                    ? `bg-${item.color}-100 border-${item.color}-500 text-${item.color}-700 ring-2 ring-${item.color}-200` 
                                    : `bg-slate-50 border-slate-200 text-slate-600 hover:bg-white hover:border-${item.color}-300 hover:text-${item.color}-600`
                                }`}
                        >
                            {item.icon} {item.label}
                            {followUpData[item.id] && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1"></span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. BIBLIOTECA DE NORMAS TÉCNICAS (PDFs) */}
            <div className="w-full max-w-6xl bg-white p-6 rounded-2xl shadow-sm border border-slate-200 shrink-0 relative z-20">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest text-center flex items-center justify-center gap-2">
                    <FileText size={14}/> BIBLIOTECA NORMATIVA (LECTURA RÁPIDA)
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    {[
                        { titulo: 'NORMA TÉCNICA CRED', archivo: '/normas/cred.pdf' },
                        { titulo: 'GUÍA DE ANEMIA 2025', archivo: '/normas/anemia.pdf' },
                        { titulo: 'MANUAL GESTANTES', archivo: '/normas/gestante.pdf' },
                        { titulo: 'CALENDARIO VACUNAS', archivo: '/normas/vacunas.pdf' },
                    ].map((pdf, idx) => (
                        <a 
                            key={idx}
                            href={pdf.archivo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center justify-center w-24 h-24 bg-slate-50 border-2 border-slate-100 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 text-center p-2 no-underline"
                            title="Clic para leer documento"
                        >
                            <div className="mb-2 text-slate-400 group-hover:text-red-500 transition-colors">
                                <FileText size={28} strokeWidth={1.5} />
                            </div>
                            <span className="text-[9px] font-bold text-slate-600 group-hover:text-red-700 uppercase leading-tight">
                                {pdf.titulo}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
                        
                      
                        {/* 3. VISOR DE TABLA DE SEGUIMIENTOS */}
            {activeFollowUp && (
                <div className="w-full max-w-6xl animate-in slide-in-from-top-5 fade-in duration-300 z-10 shrink-0">
                    <InlineFollowUpViewer 
                        type={activeFollowUp} 
                        data={followUpData[activeFollowUp]} 
                        onClose={() => setActiveFollowUp(null)}
                        onFileUpload={handleFollowUpUpload}
                        externalFilter={""} 
                        
                        // LÓGICA PARA EL BOTÓN "VER DETALLE" (OJO)
                        // LÓGICA MEJORADA: CONTROLES + SUPLEMENTACIÓN
                        // LÓGICA CORREGIDA PARA SF (SULFATO) Y AF (ÁCIDO FÓLICO)
			// LÓGICA MAESTRA: GESTANTES + CRED
                        // LÓGICA TODOTERRENO: GESTANTES + CRED (BLINDADA)
                        // LÓGICA TODOTERRENO: GESTANTES + CRED (BLINDADA)
                        onView={(row) => {
                            // ================= CASO 1: GESTANTE =================
                            if (activeFollowUp === 'GESTANTE') {
                                const controles = [];
                                for (let i = 1; i <= 20; i++) {
                                    const fecha = row[`CPN_${i}`] || row[`CONT_${i}`];
                                    if (fecha) {
                                        controles.push({
                                            numero: i,
                                            fecha: fecha,
                                            peso: row[`PESO_${i}`],
                                            talla: row[`TALLA_${i}`],
                                            hb: row[`HB_${i}`],
                                            responsable: row[`ATENDIO_${i}`]
                                        });
                                    }
                                }
                                const suplementos = [];
                                for (let j = 1; j <= 30; j++) {
                                    const fechaSF = row[`SF_${j}`] || row[`SF${j}`] || row[`SULFATO_${j}`];
                                    if (fechaSF) suplementos.push({ tipo: 'SULFATO', numero: j, fecha: fechaSF });
                                    
                                    const fechaAF = row[`AF_${j}`] || row[`AF${j}`] || row[`ACIDO_${j}`];
                                    if (fechaAF) suplementos.push({ tipo: 'AC. FÓLICO', numero: j, fecha: fechaAF });
                                }
                                
                                setSelectedGestanteForModal({
                                    tipoPaciente: 'GESTANTE',
                                    nombre: row.Nombre_P || row.Nombres_P,
                                    dni: row.N_DNI_HIS || row.DNI,
                                    hc: row.HC,
                                    edad: row.Edad,
                                    establecimiento: row.IPRESS_HIS || row.Establecimiento,
                                    historialControles: controles,
                                    historialSuplementos: suplementos,
                                    ultimaAtencion: controles.length > 0 ? controles[controles.length - 1].fecha : "SIN DATOS"
                                });
                            } 
                            
                            // ================= CASO 2: CRED (NIÑO) =================
                            else if (activeFollowUp === 'CRED') {
                                const controles = [];
                                
                                // A. CONTROLES RECIÉN NACIDO (RN)
                                for (let i = 1; i <= 4; i++) {
                                    const fechaRN = row[`CREDRN_${i}`] || row[`RN_${i}`] || row[`RN${i}`];
                                    if (fechaRN) {
                                        controles.push({
                                            numero: `RN${i}`,
                                            fecha: fechaRN,
                                            peso: row[`PESO_${i}RN`] || row[`PESO_RN${i}`], 
                                            talla: row[`TALLA_${i}RN`] || row[`TALLA_RN${i}`], 
                                            hb: null,
                                            responsable: row[`ATENDIO_${i}RN`] || row[`RESP_RN${i}`]
                                        });
                                    }
                                }

                                // B. CONTROLES CRED MENSUALES
                                for (let i = 1; i <= 24; i++) {
                                    const fechaCred = row[`CRED_${i}`] || row[`CONT_${i}`] || row[`CPN_${i}`];
                                    if (fechaCred) { 
                                        controles.push({
                                            numero: i,
                                            fecha: fechaCred,
                                            peso: row[`PESO_${i}`] || row[`P_${i}`],
                                            talla: row[`TALLA_${i}`] || row[`T_${i}`],
                                            hb: row[`DOSAJE_${i}`] || row[`HB_${i}`],
                                            responsable: row[`ATENDIO_${i}`] || row[`RESP_${i}`]
                                        });
                                    }
                                }

                                const suplementos = [];
                                // C. SUPLEMENTOS (BÚSQUEDA DOBLE)
                                const meses = [4,5,6,7,8,9,10,11,12,18,24,36];
                                meses.forEach(m => {
                                    if(row[`SUP_${m}M_SF`]) suplementos.push({ tipo: 'SULFATO', numero: `${m}m`, fecha: row[`SUP_${m}M_SF`] });
                                    if(row[`SUP_${m}M_MN`]) suplementos.push({ tipo: 'MICRONUT.', numero: `${m}m`, fecha: row[`SUP_${m}M_MN`] });
                                });

                                for (let k = 1; k <= 30; k++) {
                                    const fSF = row[`SF_${k}`] || row[`SF${k}`] || row[`SULFATO_${k}`];
                                    if (fSF) suplementos.push({ tipo: 'SULFATO', numero: k, fecha: fSF });

                                    const fMN = row[`MN_${k}`] || row[`MN${k}`] || row[`MICRONUT_${k}`];
                                    if (fMN) suplementos.push({ tipo: 'MICRONUT.', numero: k, fecha: fMN });
                                }

                                const suplementosUnicos = suplementos.filter((v,i,a)=>a.findIndex(t=>(t.fecha===v.fecha && t.tipo===v.tipo))===i);

                                setSelectedGestanteForModal({
                                    tipoPaciente: 'CRED',
                                    nombre: row.Nombres_P || row.Nombre_P,
                                    dni: row.N_DNI_HIS || row.DNI,
                                    hc: row.HC,
                                    edad: (row.Edad_Meses || row.Edad) + " " + (row.Edad_Meses ? "MESES" : "AÑOS"),
                                    establecimiento: row.IPRESS_HIS || row.Establecimiento,
                                    historialControles: controles,
                                    historialSuplementos: suplementosUnicos,
                                    ultimaAtencion: controles.length > 0 ? controles[controles.length - 1].fecha : "SIN DATOS"
                                });
                            }
				// 3. ANEMIA (LÓGICA BASADA EN TU ARCHIVO REAL)
                else if (activeFollowUp === 'ANEMIA') {
                    const controles = [];

                    // A. DIAGNÓSTICO (Usa DOSAJE_1 y TIPO_ANEMIA)
                    if (row.DIAGNOSTICO) {
                        controles.push({
                            tipo: 'DX',
                            titulo: 'DIAGNÓSTICO',
                            fecha: row.DIAGNOSTICO,
                            hb: (row.DOSAJE_1 && row.DOSAJE_1 > 0) ? row.DOSAJE_1 : '-',
                            etiqueta: 'TIPO',
                            detalle: row.TIPO_ANEMIA || 'S/D', 
                            responsable: row.ATENDIO_DIAGNOSTICO || '-'
                        });
                    }

                    // B. SEGUIMIENTOS (TTO 1 al 6)
                    // Mapeo específico según tu archivo:
                    // TTO 2 -> DOSAJE_2
                    // TTO 4 -> DOSAJE_3
                    const mapHb = { 2: 'DOSAJE_2', 4: 'DOSAJE_3' };

                    for (let k = 1; k <= 6; k++) {
                        const fTto = row[`TTO_${k}`];
                        if (fTto) {
                            // Buscar HB si corresponde a este control
                            const colHb = mapHb[k];
                            const valHb = (colHb && row[colHb] && row[colHb] > 0) ? row[colHb] : null;

                            controles.push({
                                tipo: 'CONTROL',
                                titulo: `CONTROL ${k}`,
                                fecha: fTto,
                                hb: valHb,
                                etiqueta: 'ESQUEMA',
                                detalle: row[`TIPO_TTO_${k}`] || 'HIERRO',
                                responsable: row[`ATENDIO_TTO_${k}`] || '-'
                            });
                        }
                    }

                    // C. RECUPERADO (Usa DOSAJE_4)
                    if (row.Recuperado) {
                        controles.push({
                            tipo: 'RECUPERADO',
                            titulo: 'RECUPERADO',
                            fecha: row.Recuperado,
                            hb: (row.DOSAJE_4 && row.DOSAJE_4 > 0) ? row.DOSAJE_4 : 'OK',
                            etiqueta: 'ESTADO',
                            detalle: 'ALTA',
                            responsable: row.ATENDIO_Recuperado || '-'
                        });
                    }
                    
                    // D. TÉRMINO (Opcional)
                    // Nota: Tu archivo usa "Término_Act" o "T rmino_Act", revisamos ambos por seguridad
                    const fTerm = row['Término_Act'] || row['T rmino_Act'];
                    if (fTerm) {
                         controles.push({
                            tipo: 'TERMINO',
                            titulo: 'TÉRMINO',
                            fecha: fTerm,
                            hb: 'FIN',
                            etiqueta: 'MOTIVO',
                            detalle: 'ADMIN.',
                            responsable: row['ATENDIO_Término_Act'] || row['ATENDIO_T rmino_Act'] || '-'
                        });
                    }

                    setSelectedGestanteForModal({
                        tipoPaciente: 'ANEMIA',
                        nombre: row.Nombres_P,
                        dni: row.N_DNI_HIS,
                        hc: row.HC,
                        edad: row.Edad + " AÑOS",
                        establecimiento: row.IPRESS_HIS,
                        historialControles: controles,
                        historialSuplementos: [] // No se usa en este modo
                    });
                }
                            else {
                                alert("Vista no configurada para este tipo.");
                            }
                        }}
                    />
                </div>
            )}                                


            {/* 4. TARJETA PRINCIPAL (NUEVA ATENCIÓN) */}
            <div className="bg-white rounded-[30px] shadow-xl border border-white p-8 text-center max-w-xl w-full relative z-0 shrink-0 mb-10">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 shadow-inner">
                <Plus size={32}/>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 mb-2">Nueva Atención</h3>
              <p className="text-slate-500 mb-6 text-xs font-medium">
                Estado de Base de datos: {dbPacientes.length > 0 ?
                <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-xl">Conectada ({dbPacientes.length})</span> : <span className="text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-xl">Sin datos</span>}
              </p>
              <button 
               onClick={() => {
		//resetForm();
                setIsCalendarOpen(true); setIsModalOpen(true);}} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-xl shadow-blue-600/20 text-sm transition-all hover:-translate-y-1 active:scale-[0.98]"
              >
                REGISTRAR PACIENTE
              </button>
            </div>
          </div>
        ) : (
          /* VISTA FORMULARIO MODAL PRINCIPAL */
          <div className="bg-white rounded-[30px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col w-full max-w-[95%] h-[90vh] animate-in zoom-in-95 duration-200 ring-1 ring-black/5 m-auto">
            {/* CABECERA DEL FORMULARIO */}
            <div className="flex border-b border-slate-100 bg-white px-6 shrink-0 justify-between items-center">
              <div className="flex-1 flex">
                  {['Paciente', 'Datos Clínicos', 'Diagnósticos', 'Finalizar'].map((label, idx) => (
                      <div key={idx} 
                       //onClick={() => setStep(idx + 1)} // <--- ESTO PERMITE SALTAR AL HACER CLIC
                       className={`flex-1 text-center py-4 text-xs font-bold border-b-[3px] transition-colors ${step === idx + 1 ?
                      `border-${stepColors[idx]}-600 text-${stepColors[idx]}-700` : 'border-transparent text-slate-300'}`}>
                          <span className="mr-2 opacity-40">{idx + 1}.</span>{label}
                      </div>
                  ))}
              </div>
		<button 
    onClick={() => setIsModalOpen(false)} // Solo cierra, no borra nada
    className="px-4 py-4 hover:bg-slate-50 text-slate-300 hover:text-red-500 transition-colors border-l border-slate-100 ml-4" 
    title="Cerrar y mantener datos en memoria"
>
    <X size={24}/>
</button>
            </div>
             {/* --- BARRA FIJA DE DATOS DEL PACIENTE (VISIBLE EN PASOS 1, 2, 3) --- */}
             {/* --- BARRA FIJA DE DATOS DEL PACIENTE (DISEÑO LIMPIO) --- */}
             {/* --- BARRA FIJA DE DATOS DEL PACIENTE (DISEÑO LIMPIO + ÍCONO MODERNO) --- */}
             {/* --- CINTILLO FIJO DE DATOS (DINÁMICO POR SEXO) --- */}
            {patientData.paciente && step < 4 && (
              <div className={`
                  border-b px-6 py-3 flex justify-between items-center shrink-0 animate-in slide-in-from-top-2 z-30 shadow-sm transition-colors duration-300
                  ${(patientData.sexo === 'M' || patientData.sexo === 'MASCULINO') 
                      ? 'bg-sky-100 border-sky-300'  // ESTILO MASCULINO (Celeste Intenso)
                      : (patientData.sexo === 'F' || patientData.sexo === 'FEMENINO')
                          ? 'bg-pink-100 border-pink-300' // ESTILO FEMENINO (Rosado Intenso)
                          : 'bg-slate-100 border-slate-200' // ESTILO NEUTRO
                  }
              `}>
                 <div className="flex items-center gap-4">
                    {/* ÍCONO DINÁMICO */}
                    <div className={`
                        p-2.5 rounded-xl shadow-sm border border-white/50
                        ${(patientData.sexo === 'M' || patientData.sexo === 'MASCULINO') ? 'bg-sky-200 text-sky-800' : 
                          (patientData.sexo === 'F' || patientData.sexo === 'FEMENINO') ? 'bg-pink-200 text-pink-800' : 'bg-slate-200 text-slate-600'}
                    `}>
                        <UserRound size={20} strokeWidth={2.5}/>
                    </div>

                    {/* DATOS DE TEXTO */}
                    <div>
                       <h3 className={`text-sm font-black leading-none tracking-wide mb-1.5 uppercase
                           ${(patientData.sexo === 'M' || patientData.sexo === 'MASCULINO') ? 'text-sky-900' : 
                             (patientData.sexo === 'F' || patientData.sexo === 'FEMENINO') ? 'text-pink-900' : 'text-slate-800'}
                       `}>
                           {patientData.paciente}
                       </h3>

                       <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wide opacity-80">
                           <span className={(patientData.sexo === 'M' || patientData.sexo === 'MASCULINO') ? 'text-sky-800' : (patientData.sexo === 'F' || patientData.sexo === 'FEMENINO') ? 'text-pink-800' : 'text-slate-600'}>
                              DNI: <span className="font-black">{patientData.dni}</span>
                           </span>

                           <span className="opacity-40">|</span>

                           <span className={(patientData.sexo === 'M' || patientData.sexo === 'MASCULINO') ? 'text-sky-800' : (patientData.sexo === 'F' || patientData.sexo === 'FEMENINO') ? 'text-pink-800' : 'text-slate-600'}>
                              EDAD: <span className="font-black">{ageObj.y} AÑOS, {ageObj.m} MESES, {ageObj.d} DÍAS</span>
                           </span>

                           <span className="opacity-40">|</span>

                           <span className={(patientData.sexo === 'M' || patientData.sexo === 'MASCULINO') ? 'text-sky-800' : (patientData.sexo === 'F' || patientData.sexo === 'FEMENINO') ? 'text-pink-800' : 'text-slate-600'}>
                              SEXO: <span className="font-black">{patientData.sexo}</span>
                           </span>
                       </div>
                    </div>
                 </div>

                 {/* INDICADOR H. CLÍNICA */}
                 <div className="text-right hidden sm:block">
                    <div className={`text-[9px] font-bold uppercase tracking-wider ${(patientData.sexo === 'M' || patientData.sexo === 'MASCULINO') ? 'text-sky-600' : (patientData.sexo === 'F' || patientData.sexo === 'FEMENINO') ? 'text-pink-600' : 'text-slate-400'}`}>H. Clínica</div>
                    <div className={`text-lg font-black ${(patientData.sexo === 'M' || patientData.sexo === 'MASCULINO') ? 'text-sky-900' : (patientData.sexo === 'F' || patientData.sexo === 'FEMENINO') ? 'text-pink-900' : 'text-slate-700'}`}>
                        {patientData.hc || "---"}
                    </div>
                 </div>
              </div>
            )}
            {/* CONTENIDO SCROLLABLE DEL FORMULARIO */}
            <div className="flex-grow overflow-y-auto p-6 bg-[#FAFAFA] no-scrollbar relative" ref={dxListRef}>
              
              {/* --- ALERTA DE VALIDACIÓN FLOTANTE (FIXED) --- */}
{/* --- ALERTA DE VALIDACIÓN FLOTANTE (FIXED) --- */}
{validationAlert.isOpen && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setValidationAlert({ ...validationAlert, isOpen: false })}></div>

    {/* LÓGICA DE COLORES SEGÚN TIPO */}
    <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border-2 animate-in zoom-in duration-300 
        ${validationAlert.type === 'GESTANTE' ? 'border-pink-200' : validationAlert.type === 'TRANSFER' ? 'border-indigo-200' : 'border-orange-200'}`}>
      
      {/* CABECERA */}
      <div className={`px-8 py-6 border-b flex items-center gap-4 
          ${validationAlert.type === 'GESTANTE' ? 'bg-pink-50 border-pink-100' : validationAlert.type === 'TRANSFER' ? 'bg-indigo-50 border-indigo-100' : 'bg-orange-50 border-orange-100'}`}>
        
        <div className={`p-4 rounded-full shrink-0 shadow-sm 
            ${validationAlert.type === 'GESTANTE' ? 'bg-pink-200 text-pink-700' : validationAlert.type === 'TRANSFER' ? 'bg-indigo-200 text-indigo-700' : 'bg-orange-200 text-orange-700'}`}>
          {validationAlert.type === 'GESTANTE' ? <Baby size={40} strokeWidth={2} /> : validationAlert.type === 'TRANSFER' ? <RefreshCw size={40} strokeWidth={2}/> : <Activity size={40} strokeWidth={2} />}
        </div>
        
        <div>
          <h3 className={`text-2xl font-black 
              ${validationAlert.type === 'GESTANTE' ? 'text-pink-700' : validationAlert.type === 'TRANSFER' ? 'text-indigo-800' : 'text-orange-800'}`}>
              {validationAlert.title}
          </h3>
          <p className={`text-xs font-bold mt-1 uppercase 
              ${validationAlert.type === 'GESTANTE' ? 'text-pink-400' : validationAlert.type === 'TRANSFER' ? 'text-indigo-400' : 'text-orange-400'}`}>
              {validationAlert.type === 'TRANSFER' ? 'Acción Requerida: Asignar HC' : 'Corrección requerida'}
          </p>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-8 max-h-[60vh] overflow-y-auto">
        <p className="text-slate-700 font-bold text-lg mb-6 leading-snug">{validationAlert.message}</p>
        <div className={`p-5 rounded-2xl border flex items-start gap-4 shadow-sm 
            ${validationAlert.type === 'GESTANTE' ? 'bg-pink-50 border-pink-200' : validationAlert.type === 'TRANSFER' ? 'bg-indigo-50 border-indigo-200' : 'bg-orange-50 border-orange-200'}`}>
          <div className={`mt-1 
              ${validationAlert.type === 'GESTANTE' ? 'text-pink-500' : validationAlert.type === 'TRANSFER' ? 'text-indigo-500' : 'text-orange-500'}`}>
              <AlertTriangle size={24}/>
          </div>
          <div className="text-sm font-medium text-slate-600 whitespace-pre-line leading-relaxed">{validationAlert.details}</div>
        </div>
      </div>

      {/* BOTÓN */}
      <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end">
         {/* BOTÓN DE ACCIÓN EN LA ALERTA */}
         <button 
            onClick={() => { 
                setValidationAlert({ ...validationAlert, isOpen: false });
                
                // --- LÓGICA NUEVA: SI ES ERROR DE HEMOGLOBINA ---
                if (validationAlert.title.includes('Hemoglobina')) {
                    setStep(2); // 1. Te lleva al Paso 2 (Datos Clínicos)
                    setShowHbError(true); // 2. Activa la "Alarma" visual para pintar de rojo
                    
                    // Pequeño delay para enfocar el input automáticamente
                    setTimeout(() => {
                        const hbInput = document.querySelector('input[name="hb"]');
                        if(hbInput) hbInput.focus();
                    }, 300);
                    return;
                }

                // Lógica existente de Transferencia
                if (validationAlert.type === 'TRANSFER') {
                    setTimeout(() => {
                        const hcInput = document.querySelector('input[name="hc"]');
                        if (hcInput) { hcInput.focus(); hcInput.select(); }
                    }, 100);
                }
                // Lógica existente de Gestante
                if (validationAlert.type === 'GESTANTE_REQUIRED') {
                    setStep(1); 
                }
            }}
            className={`px-8 py-3 rounded-xl font-black shadow-lg transition-transform active:scale-95 text-sm tracking-wide text-white 
                ${validationAlert.type === 'GESTANTE' ? 'bg-pink-500 hover:bg-pink-600' : validationAlert.type === 'TRANSFER' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-orange-500 hover:bg-orange-600'}`}
        >
            {validationAlert.type === 'TRANSFER' ? 'ENTENDIDO, INGRESARÉ HC' : 'ENTENDIDO, VOY A CORREGIR'}
        </button>
      </div>
    </div>
  </div>
)}

              {/* MODALES INTERNOS (Manual, Adolescente, Jurisdicción) */}
              {isManualModalOpen && (
                  <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-in zoom-in duration-200">
                          <div className="flex justify-between items-center mb-6 border-b pb-2">
                              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><UserPlus className="text-blue-600"/> Registrar Nuevo Paciente</h3>
                              <button onClick={() => setIsManualModalOpen(false)}><X className="text-slate-400 hover:text-red-500"/></button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              {/* DNI y HC */}
                              <div><label className={getLabelStyle(1)}>DNI</label><input className={borderlessInputStyle + " border border-slate-200"} value={manualData.dni} onChange={(e) => setManualData({...manualData, dni: e.target.value})} /></div>
                              <div><label className={getLabelStyle(1)}>H. Clínica</label><input className={borderlessInputStyle + " border border-slate-200"} value={manualData.hc} onChange={(e) => setManualData({...manualData, hc: e.target.value})} /></div>
                              
                              {/* NOMBRES */}
                              <div className="col-span-2"><label className={getLabelStyle(1)}>Apellidos y Nombres</label><input className={borderlessInputStyle + " border border-slate-200 uppercase"} value={manualData.nombres} onChange={(e) => setManualData({...manualData, nombres: e.target.value})} /></div>
                              
                              {/* FECHA Y SEXO */}
                              <div><label className={getLabelStyle(1)}>Fecha Nac.</label><input type="date" className={borderlessInputStyle + " border border-slate-200"} value={manualData.fecNac} onChange={(e) => setManualData({...manualData, fecNac: e.target.value})} /></div>
                              <div><label className={getLabelStyle(1)}>Sexo</label><select className={borderlessInputStyle + " border border-slate-200"} value={manualData.sexo} onChange={(e) => setManualData({...manualData, sexo: e.target.value})}><option value="M">MASCULINO</option><option value="F">FEMENINO</option></select></div>
                              
                              {/* DIRECCION Y DISTRITO */}
                              <div className="col-span-2"><label className={getLabelStyle(1)}>Dirección</label><input className={borderlessInputStyle + " border border-slate-200 uppercase"} value={manualData.direccion} onChange={(e) => setManualData({...manualData, direccion: e.target.value})} /></div>
                              <div><label className={getLabelStyle(1)}>Distrito</label><input className={borderlessInputStyle + " border border-slate-200 uppercase"} value={manualData.distrito} onChange={(e) => setManualData({...manualData, distrito: e.target.value})} /></div>
                              
                              {/* COMBOBOX: ESTABLECIMIENTO ORIGEN */}
                              <div>
                                <label className={getLabelStyle(1)}>Establecimiento Origen</label>
                                <select 
                                    className={borderlessInputStyle + " border border-slate-200 uppercase cursor-pointer"} 
                                    value={manualData.estOrigen} 
                                    onChange={(e) => setManualData({...manualData, estOrigen: e.target.value})}
                                >
                                    <option value="">SELECCIONE...</option>
                                    <option value="I-4 PACAIPAMPA">I-4 PACAIPAMPA</option>
                                    <option value="I-2 EL PUERTO">I-2 EL PUERTO</option>
                                    <option value="I-1 LAGUNAS DE SAN PABLO">I-1 LAGUNAS DE SAN PABLO</option>
                                    <option value="I-1 CUMBICUS">I-1 CUMBICUS</option>
                                    <option value="I-1 CACHIACO">I-1 CACHIACO</option>
                                </select>
                              </div>
                          {/* COMBOBOX: FINANCIADOR */}
                          <div className="col-span-2 mt-4">
                            <label className={getLabelStyle(1)}>Financiador</label>
                            <select 
                                className={borderlessInputStyle + " border border-slate-200 uppercase cursor-pointer"} 
                                value={manualData.financiador} 
                                onChange={(e) => setManualData({...manualData, financiador: e.target.value})}
                            >
                                <option value="2-SIS">2-SIS</option>
                                <option value="1-PAGANTE">1-PAGANTE</option>
                                <option value="3-ESSALUD">3-ESSALUD</option>
                                <option value="10-OTROS">10-OTROS</option>
                            </select>
                          </div>
                        </div>
		      <div className="mt-6 flex justify-end">
                              <button onClick={handleSaveManualPatient} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg"><Save size={18}/> GUARDAR DATOS</button>
                     </div>
                   </div>
                 </div>
              )}
              {showAdolescentModal && (
                <div className="absolute inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-amber-200 animate-in zoom-in duration-300">
                        <div className="bg-amber-50 px-8 py-6 border-b border-amber-200 flex items-center gap-4">
                            <div className="bg-amber-100 p-3 rounded-full shrink-0"><Siren size={32} className="text-amber-600" /></div>
                            <div><h3 className="text-xl font-extrabold text-amber-800">Alerta de Paciente Adolescente</h3><p className="text-xs text-amber-600 font-bold mt-1 uppercase">Verificación de Indicadores FED</p></div>
                        </div>
                        <div className="p-8">
                            <p className="text-slate-700 font-bold text-lg mb-4 leading-tight">Estimado usuario, debe tener cuidado con el paciente que está registrando puesto que es <span className="text-amber-600 underline decoration-2">ADOLESCENTE ({ageObj.y} años)</span>.</p>
                            <div className="bg-purple-50 border border-purple-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
                                <Activity size={32} className="text-purple-600 mt-1 shrink-0"/>
                                <p className="text-sm text-purple-900 leading-relaxed font-medium">Debe registrar con mucho detalle la <b>condición al establecimiento</b>.<br/><br/>Recordarle que las <b>ADOLESCENTES MUJERES REINGRESANTES O NUEVAS</b> al establecimiento deben tener un <b>DOSAJE DE HEMOGLOBINA</b>, según indicador FED.</p>
                            </div>
                        </div>
                        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end"><button onClick={() => setShowAdolescentModal(false)} className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-black shadow-lg transition-transform active:scale-95 text-sm tracking-wide">ENTENDIDO</button></div>
                    </div>
                </div>
              )}

              {showJurisdictionModal && (
                <div className="absolute inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-red-100 animate-in zoom-in duration-300">
                        <div className="bg-red-50 px-8 py-6 border-b border-red-100 flex items-center gap-4">
                            <div className="bg-red-100 p-3 rounded-full shrink-0"><AlertTriangle size={32} className="text-red-600" /></div>
                            <div><h3 className="text-xl font-extrabold text-red-700">Advertencia de Jurisdicción</h3><p className="text-xs text-red-500 font-bold mt-1 uppercase">Conflicto de Establecimiento</p></div>
                        </div>
                        <div className="p-8">
                            <div className="text-slate-600 text-sm font-medium leading-relaxed whitespace-pre-line mb-6">{jurisdictionErrorMsg}</div>
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3"><div className="bg-blue-100 p-1.5 rounded-full mt-0.5"><Plus size={16} className="text-blue-600"/></div><p className="text-xs text-blue-800 font-bold leading-relaxed">RECUERDE: Si no lo encuentra en el establecimiento que usted está buscando, debe ingresarlo como <span className="underline decoration-2 decoration-blue-400">PACIENTE NUEVO</span> usando el botón azul (+).<br/><br/>Al hacerlo, quedará activa automáticamente la opción: <br/><span className="bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-600 mt-1 inline-block">COND. EST: NUEVO</span> y <span className="bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-600 inline-block">COND. SERV: NUEVO</span>.</p></div>
                        </div>
                        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end"><button onClick={() => setShowJurisdictionModal(false)} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 text-sm">Entendido, cerraré esta ventana</button></div>
                    </div>
                </div>
              )}

              {/* PASO 1: PACIENTE */}
              {/* PASO 1: PACIENTE - DISEÑO MODERNO */}
              {/* PASO 1: PACIENTE - DISEÑO MODERNO COMPACTO */}
              {/* PASO 1: PACIENTE - DISEÑO MODERNO COMPACTO (CON ESTABLECIMIENTO EN BUSCADOR) */}
              {/* PASO 1: PACIENTE - DISEÑO MODERNO COMPACTO (ALINEACIÓN VERTICAL CORREGIDA) */}
              {/* PASO 1: PACIENTE - DISEÑO MODERNO (CON CINTILLO DE SEXO DINÁMICO) */}
              {step === 1 && (
        <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300 pb-4">
            
            {/* 1. BARRA SUPERIOR: BUSCADOR + BOTÓN + FECHA */}
            <div className="flex flex-col md:flex-row gap-3 mb-2 relative z-50">
                
                {/* A. BUSCADOR */}
                <div className="flex-1 bg-blue-50 rounded-xl p-1.5 shadow-sm border-2 border-blue-200 relative flex items-center gap-2">
                    <div className="flex-1 flex gap-2 items-center">
                        <div className="bg-blue-600 text-white p-2 rounded-lg shrink-0 shadow-md">
                            <Search size={18} strokeWidth={2.5}/>
                        </div>
                        <input 
                            className="flex-1 h-9 px-3 rounded-lg border-2 border-blue-200 bg-white text-sm font-black text-blue-900 placeholder-blue-300 outline-none uppercase transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
                            placeholder="BUSCAR PACIENTE (DNI O APELLIDOS)..."
                            autoFocus
                            value={searchTerm}
                            onChange={handleSearchInput}
                            onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                        />
                    </div>
                    <button 
                        onClick={() => setIsManualModalOpen(true)} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white w-9 h-9 rounded-lg flex items-center justify-center shadow-md transition-transform active:scale-95 group mr-1 shrink-0 border border-indigo-400" 
                        title="Registrar Paciente Nuevo Manualmente"
                    >
                        <UserPlus size={18} className="group-hover:scale-110 transition-transform"/>
                    </button>
                    {/* LISTA DE SUGERENCIAS */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-xl shadow-xl border-2 border-blue-100 max-h-[300px] overflow-y-auto p-1 z-[100]">
                            {suggestions.map((p) => {
                                const adminEst = adminData.establecimiento.trim().toUpperCase();
                                const patientEst = (p.estOrigen || "").trim().toUpperCase();
                                let keyword = "";
                                if (adminEst.includes("PACAIPAMPA")) keyword = "PACAIPAMPA";
                                else if (adminEst.includes("PUERTO")) keyword = "PUERTO";
                                else if (adminEst.includes("LAGUNAS")) keyword = "LAGUNAS";
                                else if (adminEst.includes("CUMBICUS")) keyword = "CUMBICUS";
                                else if (adminEst.includes("CACHIACO")) keyword = "CACHIACO";
                                else keyword = adminEst;
                                const isSameJurisdiction = patientEst.includes(keyword);

                                return (
                                    <div key={p.id} onMouseDown={() => selectPatient(p)} className="p-2 cursor-pointer rounded-lg group hover:bg-blue-50 transition-all border-b border-slate-100 last:border-0 flex items-start gap-3">
                                        <div className={`mt-1 p-1.5 rounded-full shrink-0 ${isSameJurisdiction ? 'bg-emerald-200 text-emerald-700' : 'bg-orange-200 text-orange-700'}`}>
                                            <Users size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-black text-xs uppercase ${isSameJurisdiction ? 'text-blue-900' : 'text-slate-600'}`}>
                                                {getHighlightedText(p.nombre, searchTerm)}
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-1 text-[9px] font-bold uppercase">
                                                <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                                                    DNI: <span className="text-blue-900 font-black">{getHighlightedText(p.dni, searchTerm)}</span>
                                                </span>
                                                <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                                                    HC: {p.hc || "S/D"}
                                                </span>
                                                <span className={`px-1.5 py-0.5 rounded border flex items-center gap-1 ${isSameJurisdiction ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-orange-100 text-orange-800 border-orange-200'}`}>
                                                    {!isSameJurisdiction && <AlertTriangle size={8} />} EST: {p.estOrigen || "DESCONOCIDO"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* B. CALENDARIO */}
                <div className="bg-blue-50 rounded-xl p-1.5 shadow-sm border-2 border-blue-200 flex items-center gap-2 min-w-[200px]">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-lg shrink-0 border border-blue-200">
                        <Calendar size={18} strokeWidth={2.5}/>
                    </div>
                    <div className="flex flex-col justify-center w-full pr-2">
                        <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none mb-0.5">FECHA ATENCIÓN</label>
                        <input 
                            type="text"
			    readOnly
                            name="fecAtencion"
                            value={patientData.fecAtencion? patientData.fecAtencion.split('-').reverse().join('/') : '' }
                            //onChange={handlePatient}
                            onClick={() => setIsCalendarOpen(true)}
                            className="w-full h-8 rounded-lg bg-white border-2 border-blue-100 px-2 font-black text-base text-center text-blue-900 outline-none focus:border-blue-400 cursor-pointer shadow-sm placeholder-blue-300"
			placeholder="SELECCIONAR"
                        />
                    </div>
                </div>
            </div>

            {/* --- 2. ÁREA DE DATOS DEL PACIENTE --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                
                {/* COLUMNA IZQUIERDA: ADMISIÓN */}
                <div className="lg:col-span-3 space-y-2">
                    <div className="bg-violet-100/80 rounded-2xl p-3 border-2 border-violet-300 h-full shadow-md flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-violet-200 rounded-bl-full opacity-70 pointer-events-none"></div>

                        <div className="space-y-2.5 relative z-10">
                            <div>
                                <label className="text-[9px] font-extrabold text-violet-700 uppercase ml-1 mb-0.5 block">Cond. Estab.</label>
                                <select name="condEst" value={patientData.condEst} onChange={handlePatient} className="w-full h-8 px-2 rounded-lg border-2 border-violet-200 bg-white font-bold text-xs text-violet-900 outline-none focus:border-violet-500 transition-all cursor-pointer shadow-sm">
                                    <option value="">SELECCIONAR...</option><option value="N">NUEVO</option><option value="C">CONTINUADOR</option><option value="R">REINGRESANTE</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] font-extrabold text-violet-700 uppercase ml-1 mb-0.5 block">Cond. Serv.</label>
                                <select name="condServ" value={patientData.condServ} onChange={handlePatient} className="w-full h-8 px-2 rounded-lg border-2 border-violet-200 bg-white font-bold text-xs text-violet-900 outline-none focus:border-violet-500 transition-all cursor-pointer shadow-sm">
                                    <option value="">SELECCIONAR...</option><option value="N">NUEVO</option><option value="C">CONTINUADOR</option><option value="R">REINGRESANTE</option>
                                </select>
                            </div>
                            
                            {/* FINANCIADOR REINTEGRADO */}
                            <div>
                                <label className="text-[9px] font-extrabold text-violet-700 uppercase ml-1 mb-0.5 block">Financiador</label>
                                <select name="financiador" value={patientData.financiador} onChange={handlePatient} className="w-full h-8 px-2 rounded-lg border-2 border-violet-200 bg-white font-bold text-xs text-violet-900 outline-none focus:border-violet-500 transition-all cursor-pointer shadow-sm">
                                    <option value="">SELECCIONAR...</option>
                                    <option value="1-PAGANTE">1-PAGANTE</option>
                                    <option value="2-SIS">2-SIS</option>
                                    <option value="3-ESSALUD">3-ESSALUD</option>
                                    <option value="10-OTROS">10-OTROS</option>
                                </select>
                            </div>

                            <div className="pt-2 border-t-2 border-violet-200/50 mt-1">
                                <label className="text-[9px] font-extrabold text-rose-600 uppercase ml-1 block mb-0.5">Condición</label>
                                <select name="condicion" value={patientData.condicion} onChange={handlePatient} className="w-full h-8 px-2 rounded-lg border-2 border-rose-200 bg-white font-bold text-xs text-rose-700 outline-none focus:border-rose-500 transition-all cursor-pointer shadow-sm bg-rose-50/50">
                                    <option value="">NINGUNA</option>
                                    <option value="GESTANTE" disabled={patientData.sexo === 'M' || patientData.sexo === 'MASCULINO'}>GESTANTE</option>
                                    <option value="PUERPERA" disabled={patientData.sexo === 'M' || patientData.sexo === 'MASCULINO'}>PUERPERA</option>
                                </select>
                            </div>

                            <div className="relative">
                                 <label className="text-[9px] font-extrabold text-violet-600 uppercase ml-1 flex justify-between mb-0.5">
                                    <span>FUR</span>
                                    {patientData.condicion === 'GESTANTE' && <span className="text-rose-600 font-black animate-pulse bg-rose-100 px-1 rounded">REQUERIDO</span>}
                                 </label>
                                 <input 
                                    type="date" 
                                    name="fur"
                                    value={patientData.fur} 
                                    onChange={handlePatient}
                                    disabled={patientData.condicion !== 'GESTANTE'}
                                    className={`w-full h-8 px-2 rounded-lg border-2 outline-none font-bold text-xs text-center transition-all relative z-10 shadow-sm
                                        ${patientData.condicion === 'GESTANTE' 
                                            ? (!patientData.fur ? 'border-red-500 bg-red-50 text-red-700 animate-pulse' : 'border-rose-300 bg-white text-rose-800') 
                                            : 'bg-violet-50/50 border-violet-200 text-violet-300 cursor-not-allowed'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA CENTRAL: IDENTIFICACIÓN */}
                <div className="lg:col-span-9 space-y-3">
                    
                    {/* TARJETA DE IDENTIDAD */}
                    <div className="bg-blue-50 rounded-2xl p-3 shadow-md border-2 border-blue-200 relative overflow-hidden group">
                        
                        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start mt-1">
                            {/* AVATAR DINÁMICO */}
                            <div className="shrink-0 flex flex-col items-center">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-4 border-white ring-2 ring-blue-100
                                    ${(patientData.sexo === 'M' || patientData.sexo === 'MASCULINO') ? 'bg-blue-200 text-blue-600' : (patientData.sexo === 'F' || patientData.sexo === 'FEMENINO') ? 'bg-pink-200 text-pink-600' : 'bg-slate-200 text-slate-500'}`}>
                                    {(patientData.sexo === 'F' || patientData.sexo === 'FEMENINO') ? <UserRound size={32}/> : <User size={32}/>}
                                </div>
                            </div>

                            <div className="flex-1 w-full space-y-3">
                                {/* NOMBRE */}
                                <div>
                                    <label className="text-[9px] font-extrabold text-blue-500 uppercase tracking-wider ml-1">Apellidos y Nombres</label>
                                    <input 
                                        name="paciente" 
                                        value={patientData.paciente} 
                                        readOnly={isPatientDataLocked}
                                        className="w-full h-11 px-4 rounded-xl border-2 border-blue-200 bg-white font-black text-xl text-blue-900 outline-none shadow-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all uppercase placeholder-blue-200"
                                        placeholder="NOMBRE DEL PACIENTE..."
                                    />
                                </div>

                                {/* GRID DNI / HC / EDAD / F.NAC */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div className="relative group">
                                        <label className="text-[9px] font-extrabold text-blue-500 uppercase block mb-0.5 ml-1">DNI</label>
                                        <input value={patientData.dni} readOnly className="w-full bg-white h-9 rounded-lg border-2 border-blue-200 px-2 font-black text-blue-800 outline-none text-base shadow-sm focus:border-blue-500 transition-all"/>
                                    </div>
                                    
                                    <div className="relative group">
                                        <label className={`text-[9px] font-extrabold uppercase block mb-0.5 ml-1 ${!patientData.hc ? 'text-red-600' : 'text-blue-600'}`}>H. Clínica</label>
                                        <input 
                                            name="hc"
                                            value={patientData.hc} 
                                            onChange={handlePatient}
                                            readOnly={isPatientDataLocked}
                                            className={`w-full h-9 rounded-lg border-2 px-2 font-black text-base outline-none bg-white shadow-sm transition-all
                                                ${!patientData.hc ? 'text-red-600 placeholder-red-300 border-red-300 focus:border-red-500 bg-red-50 animate-pulse' : 'text-blue-800 border-blue-200 focus:border-blue-500'}`}
                                            placeholder="FALTA HC"
                                        />
                                    </div>

                                    {/* EDAD EN SU PROPIO INPUT */}
                                    <div className="relative group">
                                        <label className="text-[9px] font-extrabold text-blue-500 uppercase block mb-0.5 ml-1">Edad Actual</label>
                                        <input 
                                            value={ageString} 
                                            readOnly 
                                            className="w-full bg-white h-9 rounded-lg border-2 border-blue-200 px-2 font-bold text-blue-900 outline-none text-[10px] shadow-sm truncate"
                                            title={ageString}
                                        />
                                    </div>

                                    <div className="relative group">
                                        <label className="text-[9px] font-extrabold text-blue-500 uppercase block mb-0.5 ml-1">F. Nacimiento</label>
                                        <input type="date" value={patientData.fecNac} readOnly className="w-full bg-white h-9 rounded-lg border-2 border-blue-200 px-2 font-bold text-blue-700 outline-none text-xs shadow-sm"/>
                                    </div>
                                </div>

                                {/* GRID 2: SEXO | DISTRITO (4 Columnas) */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                     <div className="relative group md:col-span-1">
                                        <label className="text-[9px] font-extrabold text-blue-500 uppercase block mb-0.5 ml-1">Sexo</label>
                                        <input 
                                            name="sexo" 
                                            value={patientData.sexo || "S/D"} 
                                            readOnly 
                                            className="w-full bg-white h-9 rounded-lg border-2 border-blue-200 px-2 font-bold text-center text-blue-800 outline-none text-xs shadow-sm"
                                        />
                                    </div>
                                    <div className="relative group md:col-span-3">
                                        <label className="text-[9px] font-extrabold text-blue-500 uppercase block mb-0.5 ml-1">Distrito Procedencia</label>
                                        <input 
                                            name="distrito" 
                                            value={patientData.distrito} 
                                            readOnly={isPatientDataLocked}
                                            className="w-full bg-white h-9 rounded-lg border-2 border-blue-200 px-2 font-bold text-blue-800 outline-none text-xs shadow-sm focus:border-blue-500 transition-all uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN UBICACIÓN (ESMERALDA FUERTE) Y ORIGEN (ÍNDIGO FUERTE) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-emerald-100/80 rounded-2xl p-3 border-2 border-emerald-300 shadow-md relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-200 rounded-bl-full opacity-60 pointer-events-none"></div>
                            <label className="text-[10px] font-extrabold text-emerald-800 uppercase ml-1 mb-1.5 flex gap-2 items-center relative z-10"><Database size={12}/> Ubicación Actual</label>
                            
                            <div className="space-y-2 relative z-10">
                                {/* LÓGICA DE COLOR CORREGIDA: Si hay longitud > 0, es VERDE. Si no, ROJO. */}
                                <input 
                                    name="direccion"
                                    value={patientData.direccion} 
                                    onChange={handlePatient}
                                    readOnly={isPatientDataLocked}
                                    placeholder="DIRECCIÓN..."
                                    className={`w-full h-8 px-3 rounded-lg bg-white border-2 font-bold text-xs outline-none transition-all uppercase shadow-sm
                                        ${(patientData.direccion && patientData.direccion.length > 0) 
                                            ? 'border-emerald-500 text-emerald-900 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100' 
                                            : 'border-red-500 text-red-800 placeholder-red-400 bg-red-50 animate-pulse' 
                                        }`}
                                />
                                <select 
                                    className="w-full h-8 px-2 rounded-lg bg-white border-2 border-emerald-200 font-bold text-xs outline-none cursor-pointer text-emerald-700 hover:border-emerald-400 transition-all shadow-sm"
                                    value={listaCaserios.includes(patientData.direccion) ? patientData.direccion : ""}
                                    onChange={(e) => {
                                        const newVal = e.target.value;
                                        if(newVal && newVal !== "") {
                                            setPatientData(prev => ({...prev, direccion: newVal}));
                                            // Esto elimina el estilo de error forzado si el usuario usa la lista
                                            const inputDir = document.querySelector('input[name="direccion"]');
                                            if(inputDir) {
                                                inputDir.style.borderColor = ""; 
                                                inputDir.style.borderWidth = "";
                                                inputDir.classList.remove("animate-pulse");
                                            }

                                            // Activar bloqueo automático si HC ya existe
                                            if (patientData.hc && patientData.hc.trim() !== "") {
                                                 setTimeout(() => setIsPatientDataLocked(true), 100);
                                            }
                                        }
                                    }}
                                >
                                     <option value="">▼ SELECCIONAR CASERÍO</option>
                                     {listaCaserios.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="bg-indigo-100/80 rounded-2xl p-3 border-2 border-indigo-300 shadow-md relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-200 rounded-bl-full opacity-60 pointer-events-none"></div>
                            <label className="text-[10px] font-extrabold text-indigo-800 uppercase ml-1 mb-1.5 flex gap-2 items-center relative z-10"><ArrowRight size={12}/> EE.SS DE ATENCIÓN</label>
                            <div className="space-y-2 relative z-10">
                                 <select 
                                    name="estOrigen"
                                    value={patientData.estOrigen} 
                                    onChange={handlePatient}
                                    className="w-full h-8 px-2 rounded-lg bg-white border-2 border-indigo-200 font-bold text-xs text-indigo-900 outline-none cursor-pointer hover:border-indigo-400 transition-all shadow-sm"
                                >
                                    <option value="">SELECCIONE EE.SS DE ATENCIÓN...</option>
                                    <option value="E.S I-4 PACAIPAMPA">E.S I-4 PACAIPAMPA</option>
                                    <option value="P.S I-2 EL PUERTO">P.S I-2 EL PUERTO</option>
			            <option value="P.S I-1 LAGUNAS DE SAN PABLO">P.S I-1 LAGUNAS DE SAN PABLO</option>
				    <option value="P.S I-1 CUMBICUS">P.S I-1 CUMBICUS</option>
				    <option value="P.S I-1 CACHIACO">P.S I-1 CACHIACO</option>
                                    {/* ... resto de opciones ... */}
                                </select>
                                 <div className="flex justify-between items-center px-1 pt-1">
                                     <span className="text-[11px] font-bold text-slate-400">¿Datos Incorrectos?</span>
                                     <button onClick={() => setIsPatientDataLocked(!isPatientDataLocked)} className="text-[11px] font-black text-indigo-800 hover:text-indigo-600 hover:underline bg-indigo-200/50 px-2 py-0.5 rounded transition-colors">
                                         {isPatientDataLocked ? 'EDITAR DATOS' : 'BLOQUEAR DATOS'}
                                     </button>
                                 </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      )}
              {/* PASO 2: DATOS CLÍNICOS */}
	      {/* PASO 2: DATOS CLÍNICOS - DISEÑO DASHBOARD MODERNO */}
              {/* PASO 2: DATOS CLÍNICOS - DISEÑO COMPACTO Y EFICIENTE */}
              {/* PASO 2: DATOS CLÍNICOS - DISEÑO ULTRA REDONDEADO (SOFT UI) */}
              {/* PASO 2: DATOS CLÍNICOS - DISEÑO 'BURBUJA' (FULL ROUNDED) */}
              {/* PASO 2: DATOS CLÍNICOS - INPUTS INTERNOS REDONDEADOS */}
              {/* PASO 2: DATOS CLÍNICOS - CON CLASIFICACIÓN DE P. ABDOMINAL */}
              {/* PASO 2: DATOS CLÍNICOS - REORGANIZADO Y COMPACTO */}
              {step === 2 && (
                <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300 pb-2">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                      
                      {/* ================= COLUMNA IZQUIERDA (INPUTS) ================= */}
                      {/* (Esta parte no ha cambiado, mantiene la lógica de P. Abd) */}
                      <div className="lg:col-span-8">
                          <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-200">
                              <h3 className="font-bold text-sm text-slate-700 mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 ml-2">
                                  <Activity size={20} className="text-teal-600"/> ANTROPOMETRÍA Y FUNCIONES VITALES
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: "Talla", name: "talla", unit: "cm", icon: <ArrowRight className="rotate-[-45deg]" size={20}/>, min: 30, max: 200, hist: lastClinicalData.talla, color: 'blue' },
                                    { label: "Peso", name: "peso", unit: "Kg", icon: <span className="text-lg font-black leading-none">⚖️</span>, min: 0.5, max: 180, hist: lastClinicalData.peso, color: 'indigo' },
                                    { label: "P. Abdominal", name: "pAbd", unit: "cm", icon: <RefreshCw size={18}/>, min: 10, max: 200, hist: lastClinicalData.pAbd, checkAge: ageObj.y >= 12, specialBtn: true, color: 'emerald' },
                                    { label: "P. Cefálico", name: "pCef", unit: "cm", icon: <Smile size={18}/>, min: 20, max: 60, hist: lastClinicalData.pCef, checkAge: ageObj.y <= 5, specialBtn: true, color: 'orange' },
                                    { label: "Hemoglobina", name: "hb", unit: "g/dl", icon: <Droplets size={18}/>, min: 0, max: 24, hist: lastClinicalData.hb, isHb: true, color: 'rose' },
                                    { label: "P. Pre-Gest.", name: "pPreGest", unit: "Kg", icon: <Baby size={18}/>, min: 30, max: 150, hist: lastClinicalData.pPreg, checkCond: patientData.condicion === 'GESTANTE', specialBtn: true, color: 'pink' }
                                ].map((item, idx) => {
                                    if (item.checkAge === false) return null;
                                    const isLocked = item.checkCond === false || (item.name === 'pAbd' && ageObj.y < 12) || (item.name === 'pCef' && ageObj.y > 5);
                                    const hasHist = item.hist && item.hist.val;
                                    
                                    // Lógica P. Abdominal
                                    let pAbdStatus = { text: "", color: `border-${item.color}-200`, bg: "bg-slate-50", textCol: "text-slate-700" };
                                    if (item.name === 'pAbd' && clinicalData.pAbd && !isLocked) {
                                        const val = parseFloat(clinicalData.pAbd); const sex = patientData.sexo;
                                        if (sex === 'M' || sex === 'MASCULINO') {
                                            if (val >= 102) pAbdStatus = { text: "RIESGO MUY ALTO", color: "border-red-500", bg: "bg-red-50", textCol: "text-red-700" };
                                            else if (val >= 94) pAbdStatus = { text: "RIESGO ALTO", color: "border-orange-400", bg: "bg-orange-50", textCol: "text-orange-700" };
                                            else pAbdStatus = { text: "NORMAL", color: "border-emerald-400", bg: "bg-emerald-50", textCol: "text-emerald-700" };
                                        } else {
                                            if (val >= 88) pAbdStatus = { text: "RIESGO MUY ALTO", color: "border-red-500", bg: "bg-red-50", textCol: "text-red-700" };
                                            else if (val >= 80) pAbdStatus = { text: "RIESGO ALTO", color: "border-orange-400", bg: "bg-orange-50", textCol: "text-orange-700" };
                                            else pAbdStatus = { text: "NORMAL", color: "border-emerald-400", bg: "bg-emerald-50", textCol: "text-emerald-700" };
                                        }
                                    }
                                    const isHbAlert = (item.isHb && showHbError && !clinicalData.hb);
				    return (
        <div key={idx} className={`relative group transition-all ${isLocked ? 'opacity-60 grayscale' : ''}`}>
            <div className="flex items-center gap-3 p-2 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all h-[5.5rem]">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ml-1 ${isLocked ? 'bg-slate-200 text-slate-400' : `bg-${item.color}-100 text-${item.color}-600`}`}>
                    {item.icon}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase truncate">{item.label}</label>
                        {item.specialBtn && !clinicalData[item.name] && !isLocked && ( <button onClick={() => { if(item.name==='pAbd') setIgnorePAbdValidation(true); if(item.name==='pCef') setIgnorePCefValidation(true); if(item.name==='pPreGest') setIgnorePreGestValidation(true); }} className="text-[8px] bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500 px-2 py-0.5 rounded-full font-bold transition-colors">OMITIR</button> )}
                        {pAbdStatus.text && ( <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg ${pAbdStatus.bg} ${pAbdStatus.textCol} animate-in fade-in zoom-in`}>{pAbdStatus.text}</span> )}
                    </div>
                    <div className="relative">
                        {/* --- AQUÍ ESTÁ LA LÓGICA DE COLORES CORREGIDA --- */}
                        {(() => {
                            // Variables de estado visual
                            const isHbError = item.isHb && showHbError && !clinicalData.hb;
                            const isHbSuccess = item.isHb && clinicalData.hb && clinicalData.hb.length > 0;
                            const isPAbdError = item.name === 'pAbd' && !isLocked && pAbdStatus.color.includes('red');
                            
                            // Definir clases base
                            let inputClasses = "w-full h-10 border-2 rounded-2xl px-3 text-xl font-black outline-none transition-all placeholder-slate-300 disabled:cursor-not-allowed ";
                            
                            // Aplicar estilos condicionales
                            if (isHbError) {
                                // ROJO: Si falta HB y se activó el error
                                inputClasses += "border-red-500 bg-red-50 text-red-600 placeholder-red-300 animate-pulse";
                            } else if (isHbSuccess) {
                                // VERDE: Si es HB y ya tiene valor
                                inputClasses += "border-emerald-500 bg-emerald-50 text-emerald-700";
                            } else if (item.name === 'pAbd' && !isLocked) {
                                // Lógica especial P. Abdominal
                                inputClasses += `${pAbdStatus.bg} ${pAbdStatus.color} ${pAbdStatus.textCol}`;
                            } else {
                                // Estilo por defecto (Azul/Slate)
                                inputClasses += `bg-slate-50 border-slate-200 text-slate-700 focus:border-${item.color}-400 focus:bg-white focus:ring-4 focus:ring-${item.color}-50`;
                            }

                            return (
                                <input 
                                    name={item.name} 
                                    disabled={isLocked} 
                                    value={clinicalData[item.name] || ''} 
                                    onChange={(e) => handleNumericInput(e, item.min, item.max)} 
                                    placeholder="0.0" 
                                    className={inputClasses}
                                />
                            );
                        })()}
                        
                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase pointer-events-none ${item.name === 'pAbd' && !isLocked && clinicalData.pAbd ? pAbdStatus.textCol : 'text-slate-400'}`}>{item.unit}</span>
                    </div>
                </div>
                <div className="w-20 flex flex-col items-end justify-center border-l border-slate-200 pl-2 h-14 mr-1">
                    {hasHist ? ( <><span className="text-[8px] text-slate-400 leading-none mb-1.5">{item.hist.date}</span><div className="text-sm font-black text-teal-700 bg-teal-100 px-2 py-1.5 rounded-2xl border border-teal-200 text-center w-full shadow-sm flex items-center justify-center">{item.hist.val}</div></>) : ( <span className="text-[8px] font-bold text-slate-300 bg-slate-100 px-3 py-1.5 rounded-2xl block text-center w-full">---</span> )}
                </div>
            </div>
        </div>
    );
                                    
                                 })}
                              </div>
                          </div>
                      </div>

                      {/* ================= COLUMNA DERECHA (WIDGETS REORGANIZADOS) ================= */}
                      <div className="lg:col-span-4 space-y-5">
                          
                          {/* --- BLOQUE 1: ESTADO NUTRICIONAL (SOLO) --- */}
                          <div className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-200">
                              <h4 className="text-slate-700 font-bold text-xs mb-4 flex items-center gap-2 ml-1">
                                  <Heart size={16} className="text-rose-500"/> Estado Nutricional
                              </h4>
                              {/* Solo IMC y Diagnóstico */}
                              <div className="flex gap-3">
                                  <div className="w-20 bg-slate-50 rounded-2xl p-2 border border-slate-100 text-center flex flex-col justify-center">
                                      <span className="text-[8px] font-bold text-slate-400 block mb-0.5">IMC</span>
                                      <div className="text-base font-black text-slate-700">{clinicalData.imc || '--'}</div>
                                  </div>
                                  <div className="flex-1">
					<div 
    className="w-full h-full border-2 rounded-2xl px-3 flex items-center justify-center text-[10px] font-black uppercase shadow-sm transition-all"
    style={{
        /* LÓGICA DE COLOR SÓLIDO (USANDO UN DIV NO FALLA) */
        backgroundColor: clinicalData.riesgo === 'NORMAL' 
            ? '#10b981'  // VERDE SÓLIDO
            : (clinicalData.riesgo && clinicalData.riesgo.includes('TABLA')) 
                ? '#fcd34d' // AMARILLO SÓLIDO
                : (clinicalData.riesgo && clinicalData.riesgo.length > 0)
                    ? '#dc2626' // ROJO SÓLIDO (Obesidad, Sobrepeso...)
                    : '#f8fafc', // GRIS (Vacío)

        color: (clinicalData.riesgo && !clinicalData.riesgo.includes('TABLA') && clinicalData.riesgo.length > 0)
            ? '#ffffff'  // TEXTO BLANCO (Para Rojo y Verde)
            : '#475569', // TEXTO GRIS (Para Amarillo o Vacío)

        borderColor: clinicalData.riesgo === 'NORMAL' 
            ? '#047857' 
            : (clinicalData.riesgo && !clinicalData.riesgo.includes('TABLA') && clinicalData.riesgo.length > 0)
                ? '#991b1b' 
                : '#cbd5e1'
    }}
>
    {clinicalData.riesgo || "DIAGNÓSTICO..."} </div>
        
                                      
                                  </div>
                              </div>
                          </div>

                          {/* --- BLOQUE 2: CALCULADORAS CLÍNICAS (AGRUPADAS) --- */}
                          <div className="bg-slate-50/80 rounded-[2.5rem] p-4 shadow-inner border border-slate-100 space-y-3">
                              <h4 className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-3 ml-2 flex items-center gap-2">
                                  <Calculator size={14}/> Herramientas
                              </h4>

                              {/* BOTÓN 1: CALCULADORA ANEMIA (Color Violeta) */}
                              <button onClick={() => setShowAnemiaModal(true)} className="w-full group bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-3.5 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-left flex justify-between items-center relative overflow-hidden">
                                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                  <div className="pl-1">
                                      <div className="text-[9px] font-bold opacity-80 mb-0.5 flex items-center gap-1">
                                          <Droplets size={10}/> Calculadora Anemia
                                      </div>
                                      {/* Muestra el resultado actual de forma compacta */}
                                      <div className="text-sm font-black truncate leading-tight">
                                        {anemiaResult && anemiaResult !== "---" ? anemiaResult : "EVALUAR"}
                                      </div>
                                  </div>
                                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shrink-0">
                                      <ArrowRight size={16} />
                                  </div>
                              </button>

                              {/* BOTÓN 2: TABLA Z-SCORE (Color Esmeralda, mismo tamaño) */}
                              <button onClick={() => setShowNutriModal(true)} className="w-full group bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-3.5 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-left flex justify-between items-center relative overflow-hidden">
                                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                  <div className="pl-1">
                                      <div className="text-[9px] font-bold opacity-80 mb-0.5 flex items-center gap-1">
                                          <FileText size={10}/> Tabla Z-Score (OMS)
                                      </div>
                                      <div className="text-sm font-black truncate leading-tight">VER GRÁFICAS</div>
                                  </div>
                                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm shrink-0">
                                      <ArrowRight size={16} />
                                  </div>
                              </button>
                          </div>

                      </div>
                  </div>
                </div>
              )}
              {/* PASO 3: DIAGNÓSTICOS */}
              {/* PASO 3: DIAGNÓSTICOS CON LAB INTERACTIVO */}
              {/* PASO 3: DIAGNÓSTICOS CON LAB INTERACTIVO (CORREGIDO) */}
        {/* PASO 3: DIAGNÓSTICOS (DISEÑO MEJORADO + PRIMERA FILA PROTEGIDA) */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-300 w-full max-w-[95%] mx-auto pb-10">
           
           {/* CABECERA */}
           <div className="flex justify-between items-end mb-6 p-6 rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white shadow-sm">
              <div>
                  <h3 className="font-black text-indigo-900 text-xl tracking-tight">Diagnósticos y Procedimientos (CIE-10)</h3>
                  <p className="text-xs mt-1.5 font-bold text-indigo-400 uppercase tracking-wider">
                      Registre los diagnósticos.
                  </p>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border border-indigo-100 shadow-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Registros:</span>
                  <span className="ml-2 text-lg font-black text-indigo-600">{diagnoses.length}</span>
              </div>
           </div>

           {/* ENCABEZADOS DE LA TABLA */}
           <div className="hidden md:grid grid-cols-12 gap-4 px-4 mb-2 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
              <div className="col-span-1 text-center">Buscar</div>
              <div className="col-span-6 pl-2">Descripción del Diagnóstico</div>
              <div className="col-span-1 text-center">Tipo</div>
              <div className="col-span-2 text-center">Campos LAB</div>
              <div className="col-span-2 text-center">Código / Acción</div>
           </div>

           <div className="space-y-3">
            {diagnoses.map((dx, idx) => {
              const hasError = dxErrors[idx];
              const containerClass = hasError 
                  ? "border-red-500 ring-2 ring-red-100 bg-red-50/10" 
                  : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md";
              
              const showAddButton = (idx === diagnoses.length - 1);
              
              // --- ESTA VARIABLE PROTEGE LA PRIMERA FILA ---
              const isFirstRow = idx === 0; 

              return (
              <div key={idx} className={`grid grid-cols-12 gap-4 items-center p-2 pr-4 rounded-2xl border transition-all duration-300 group relative ${containerClass}`}>
                
                {/* 1. BOTÓN LUPA */}
                <div className="col-span-1 flex justify-center">
                    <button 
                        onClick={() => openDxSearch(idx)} 
                        className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 hover:bg-indigo-600 hover:text-white border border-indigo-100 flex items-center justify-center transition-all active:scale-95 shadow-sm"
                    >
                        <Search size={18} strokeWidth={2.5}/>
                    </button>
                </div>
                
                {/* 2. BARRA DE DESCRIPCIÓN */}
                {/* 2. BARRA DE DESCRIPCIÓN (CON BORRADOR TIPO "X") */}
                <div className="col-span-6 relative group/input" onClick={() => openDxSearch(idx)}>
                    <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 rounded-l-xl opacity-0 group-hover/input:opacity-100 transition-opacity"></div>
                    
                    {/* Contenedor principal */}
                    <div className="w-full h-12 pl-4 pr-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center cursor-pointer group-hover/input:bg-white group-hover/input:border-indigo-300 transition-all shadow-sm relative">
                        
                        {/* Texto del Diagnóstico */}
                        {dx.desc ? (
                            <span className="text-xs font-bold text-slate-700 truncate uppercase tracking-tight w-full">
                                {dx.desc}
                            </span>
                        ) : (
                            <span className="text-xs font-bold text-slate-300 italic flex items-center gap-2">
                                <Search size={12}/> Seleccionar diagnóstico...
                            </span>
                        )}

                        {/* --- BOTÓN DE BORRAR (X) --- */}
                        {/* Solo aparece si hay un diagnóstico seleccionado */}
                        {dx.desc && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // ¡IMPORTANTE! Evita que se abra el modal al borrar
                                    
                                    // Reseteamos esta fila a valores vacíos
                                    const newDx = [...diagnoses];
                                    newDx[idx] = { 
                                        desc: '', 
                                        tipo: '', // O el valor por defecto que prefieras
                                        lab1: '', lab2: '', lab3: '', 
                                        codigo: '' 
                                    };
                                    setDiagnoses(newDx);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-500 transition-all z-10 hover:scale-110"
                                title="Borrar selección"
                            >
                                <X size={16} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                </div>
                {/* 3. TIPO */}
                <div className="col-span-1 flex justify-center">
                    <div className={`
                        w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-sm border-2 border-white ring-2 ring-opacity-50 transition-all cursor-pointer hover:scale-110
                        ${dx.tipo === 'P' ? 'bg-amber-500 ring-amber-100' : 
                          dx.tipo === 'D' ? 'bg-blue-600 ring-blue-100' : 
                          dx.tipo === 'R' ? 'bg-emerald-500 ring-emerald-100' : 'bg-slate-200 text-slate-400 ring-slate-100'}
                    `}
                    onClick={() => openDxSearch(idx)}
                    >
                        {dx.tipo || '-'}
                    </div>
                </div>
                
                {/* 4. CAMPOS LAB */}
                {/* 4. CAMPOS LAB (REDSEÑADOS: ETIQUETA ADENTRO + ALERTA ROJA) */}
		{/* 4. CAMPOS LAB (TEXTO LIBRE, SIN ETIQUETAS, O CON MENÚ) */}
                {/* 4. CAMPOS LAB (CON LÓGICA DE COLOR PARA "VACÍO") */}
                <div className="col-span-2 flex gap-1.5 justify-center">
                    {[1, 2, 3].map((n) => {
                        // 1. Obtener configuración
                        const currentCode = dx.codigo ? dx.codigo.trim().toUpperCase() : "";
                        const codeConfig = LAB_CONFIG[currentCode] || LAB_CONFIG[currentCode.substring(0, 4)];
                        const configItem = codeConfig ? codeConfig[n] : undefined;
                        
                        // 2. Determinar estado y opciones
                        const isSlotActive = configItem !== undefined;
                        const slotOptions = Array.isArray(configItem) ? configItem : (configItem?.options || []);
                        
                        // ¿Este campo permite estar vacío?
                        const canBeEmpty = slotOptions.includes('');

                        // Etiqueta (Placeholder)
                        const slotLabel = (!Array.isArray(configItem) && configItem?.label) ? configItem.label : `LAB ${n}`;
                        
                        const isFocused = focusedLab.rowIndex === idx && focusedLab.labNum === n;
                        const hasValue = dx[`lab${n}`] && dx[`lab${n}`].length > 0;

                        return (
                            <div key={n} className="relative group/lab">
                                
                                {/* MENÚ DE SUGERENCIAS */}
                                {isFocused && isSlotActive && slotOptions.length > 0 && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-slate-200 shadow-xl rounded-xl p-1.5 flex gap-1 z-50 animate-in zoom-in duration-200 min-w-[80px] justify-center flex-wrap">
                                        {slotOptions.map(sug => (
                                            <button 
                                                key={sug}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    const newDx = [...diagnoses];
                                                    newDx[idx][`lab${n}`] = sug;
                                                    setDiagnoses(newDx);
                                                    setFocusedLab({ rowIndex: null, labNum: null });
                                                }}
                                                className={`px-2 py-1 text-[9px] font-bold rounded-md transition-colors border
                                                    ${sug === '' 
                                                        ? 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200' 
                                                        : 'bg-indigo-50 hover:bg-indigo-500 hover:text-white text-indigo-700 border-indigo-100'
                                                    }`}
                                            >
                                                {sug === '' ? '(VACÍO)' : sug}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* INPUT CON LÓGICA TRICOLOR (VERDE, ROJO, GRIS) */}
                                <input 
                                    className={`
                                        w-14 h-11 border-2 rounded-xl text-center text-[10px] font-black outline-none transition-all uppercase shadow-sm
                                        ${!isSlotActive 
                                            ? 'border-slate-50 bg-slate-50 text-transparent cursor-default' // Deshabilitado
                                            : isFocused 
                                                ? 'border-indigo-500 bg-white ring-4 ring-indigo-100 z-20 relative placeholder:text-indigo-200' // Foco
                                                : hasValue
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800' // Lleno (Verde)
                                                    : canBeEmpty
                                                        ? 'border-slate-300 bg-white text-slate-600 placeholder:text-slate-300' // Vacío PERMITIDO (Gris) <--- ESTO PEDISTE
                                                        : 'border-red-300 bg-red-50 text-red-900 placeholder:text-red-400/70' // Vacío OBLIGATORIO (Rojo)
                                        } 
                                    `}
                                    // Placeholder visible si está activo
                                    placeholder={isSlotActive ? slotLabel : ""}
                                    
                                    disabled={!isSlotActive}
                                    maxLength={4}
                                    value={dx[`lab${n}`] || ''}
                                    onFocus={() => setFocusedLab({ rowIndex: idx, labNum: n })}
                                    onChange={(e) => {
                                        const val = e.target.value.toUpperCase().slice(0, 4);
                                        const newDx = [...diagnoses];
                                        newDx[idx][`lab${n}`] = val;
                                        setDiagnoses(newDx);
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                {/* 5. CÓDIGO + ACCIONES */}
                <div className="col-span-2 flex justify-end items-center gap-3">
                    <div className={`px-3 py-2 rounded-lg font-black text-xs min-w-[70px] text-center shadow-sm border
                        ${dx.codigo ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-100 text-slate-300 border-slate-200'}`}>
                        {dx.codigo || '---'}
                    </div>

                    <div className="flex items-center gap-1">
                        {showAddButton && ( 
                            <button 
                                onClick={addDx} 
                                title="Agregar nueva fila" 
                                className="w-9 h-9 bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg hover:scale-110 active:scale-95 animate-in zoom-in"
                            >
                                <Plus size={18} strokeWidth={3} />
                            </button> 
                        )}
                        
                        {/* BOTÓN ELIMINAR (SOLO SI NO ES LA PRIMERA FILA) */}
                        {!isFirstRow ? (
                            <button 
                                onClick={(e) => { e.stopPropagation(); removeDx(idx); }} 
                                className="w-9 h-9 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full flex items-center justify-center transition-all"
                                title="Eliminar fila"
                            >
                                <Trash2 size={18}/>
                            </button>
                        ) : (
                            <div className="w-9 h-9"></div> // Espacio vacío
                        )}
                    </div>
                  </div>
               </div>
            )})}
            <div ref={dxBottomRef} className="h-32 w-full bg-transparent"></div>
          </div>
        </div>
      )}     
              {/* PASO 4: EXCEL PREVIEW */}
              {/* PASO 4: EXCEL PREVIEW (MEJORADO PRO) */}
      {/* PASO 4: EXCEL PREVIEW (ALINEACIÓN PERFECTA) */}
      {/* PASO 4: VISTA PREVIA FORMATO HIS (TABLA REAL CON CELDAS FUSIONADAS) */}
                {/* PASO 4: VISTA PREVIA FORMATO HIS (CON NOMBRE DE PACIENTE) */}
      {/* PASO 4: VISTA PREVIA FORMATO HIS (OPTIMIZADO PARA ESPACIO DE DIAGNÓSTICO) */}
      {/* PASO 4: VISTA PREVIA FORMATO HIS (CORREGIDO: ANTROPOMETRÍA ESTRECHA, DIAGNÓSTICO ANCHO) */}
      {/* PASO 4: VISTA PREVIA DEFINITIVA (HEADERS MINIMIZADOS) */}
      {step === 4 && (
        <div className="w-full h-full bg-gray-100 flex flex-col animate-in fade-in duration-300 font-sans">
          
          {/* CABECERA VERDE */}
          <div className="h-12 bg-emerald-800 flex items-center px-6 justify-between shrink-0 shadow-md text-white z-20">
             <div className="flex items-center gap-3 font-bold text-sm">
                <FileSpreadsheet size={20} />
                <span>VISTA PREVIA HIS (FORMATO COMPACTO)</span>
             </div>
             <div className="text-xs opacity-80 uppercase font-mono">
                {adminData.establecimiento} | {adminData.mes}
             </div>
          </div>

          <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-200">
            <div className="bg-white shadow-2xl w-full max-w-[1900px] min-h-[800px] p-8 border border-gray-300">
                
                {/* TABLA: table-fixed es CLAVE para que respete los anchos */}
                <table className="w-full border-collapse border border-black font-sans table-fixed">
                    
                    {/* DEFINICIÓN DE ANCHOS DE COLUMNA (Colgroup) */}
                    <colgroup>
                        <col className="w-6" />  {/* DÍA */}
                        <col className="w-16" /> {/* DNI */}
                        <col className="w-48" /> {/* NOMBRES */}
                        <col className="w-6" />  {/* FIN */}
                        <col className="w-24" /> {/* DISTRITO */}
                        <col className="w-6" />  {/* EDAD */}
                        <col className="w-6" />  {/* SEXO */}
                        <col className="w-8" />  {/* PESO (Muy angosto) */}
                        <col className="w-8" />  {/* TALLA */}
                        <col className="w-8" />  {/* P.C */}
                        <col className="w-8" />  {/* P.AB */}
                        <col className="w-6" />  {/* HB */}
                        <col className="w-6" />  {/* EST */}
                        <col className="w-6" />  {/* SER */}
                        <col className="w-auto" /> {/* DIAGNÓSTICO (El resto del espacio) */}
                        <col className="w-6" />  {/* TIPO */}
                        <col className="w-8" />  {/* LAB 1 */}
                        <col className="w-8" />  {/* LAB 2 */}
                        <col className="w-8" />  {/* LAB 3 */}
                        <col className="w-10" /> {/* CIE */}
                    </colgroup>

                    <thead>
                        <tr className="bg-gray-100 text-gray-800 font-bold text-center uppercase text-[9px]">
                            <th className="border border-black p-0 align-middle" rowSpan={2}>DÍA</th>
                            <th className="border border-black p-0 align-middle" rowSpan={2}>DNI</th>
                            <th className="border border-black p-0 align-middle" rowSpan={2}>PACIENTE</th>
                            <th className="border border-black p-0 align-middle" rowSpan={2}>FIN</th>
                            <th className="border border-black p-0 align-middle" rowSpan={2}>DISTRITO</th>
                            <th className="border border-black p-0 align-middle" rowSpan={2}>EDAD</th>
                            <th className="border border-black p-0 align-middle" rowSpan={2}>SEX</th>
                            
                            {/* CABECERA ANTROPOMETRÍA */}
                            <th className="border border-black p-0 h-4 align-middle" colSpan={4}>ANTROPOMETRÍA</th>
                            
                            <th className="border border-black p-0 align-middle" rowSpan={2}>HB</th>
                            <th className="border border-black p-0 align-middle" rowSpan={2}>EST</th>
                            <th className="border border-black p-0 align-middle" rowSpan={2}>SER</th>
                            <th className="border border-black p-1 align-middle text-[10px]" rowSpan={2}>DIAGNÓSTICO MOTIVO DE CONSULTA</th>
                            <th className="border border-black p-0 align-middle" rowSpan={2}>TIPO</th>
                            <th className="border border-black p-0 align-middle" colSpan={3}>LAB</th>
                            <th className="border border-black p-0 align-middle" rowSpan={2}>CIE</th>
                        </tr>
                        
                        {/* SUB-CABECERAS MUY PEQUEÑAS (text-[7px]) PARA QUE QUEPAN */}
                        <tr className="bg-gray-50 text-gray-700 font-bold text-center uppercase text-[7px]">
                            <th className="border border-black p-0 h-4 align-middle">PESO</th>
                            <th className="border border-black p-0 h-4 align-middle">TALLA</th>
                            <th className="border border-black p-0 h-4 align-middle">P.C.</th>
                            <th className="border border-black p-0 h-4 align-middle">P.AB</th>
                            <th className="border border-black p-0 h-4 align-middle">1</th>
                            <th className="border border-black p-0 h-4 align-middle">2</th>
                            <th className="border border-black p-0 h-4 align-middle">3</th>
                        </tr>
                    </thead>

                    <tbody className="text-[10px]">
                        {consolidatedPatients.length === 0 ? (
                             <tr><td colSpan={20} className="text-center p-10 font-bold text-gray-400 border border-black">SIN DATOS</td></tr>
                        ) : (
                            consolidatedPatients.map((rec, idx) => {
                                const p = rec.patient;
                                const c = rec.clinical;
                                const dxs = rec.diagnoses;
                                const a = rec.ageObj;
                                
                                const totalRows = Math.ceil(Math.max(dxs.length, 1) / 3) * 3;
                                const dxRows = Array.from({length: totalRows}, (_, i) => dxs[i] || { desc: '', tipo: '', lab1: '', lab2: '', lab3: '', codigo: '' });
                                const blocks = [];
                                for (let i = 0; i < dxRows.length; i += 3) blocks.push(dxRows.slice(i, i + 3));

                                return blocks.map((block, blockIdx) => (
                                    <React.Fragment key={`${idx}-${blockIdx}`}>
                                        
                                        {/* FILA 1 */}
                                        <tr className="hover:bg-blue-50 transition-colors h-5">
                                            <td className="border border-black text-center font-bold align-middle bg-white" rowSpan={3}>{(p.fecAtencion || "").split('-')[2]}</td>
                                            <td className="border border-black text-center font-bold align-middle bg-white text-[9px]" rowSpan={3}>{p.dni}</td>
                                            <td className="border border-black px-1 align-middle font-bold bg-white uppercase truncate text-[9px]" rowSpan={3} title={p.paciente}>{p.paciente}</td>
                                            <td className="border border-black text-center align-middle bg-white" rowSpan={3}>{p.financiador === 'SIS' ? '2' : '1'}</td>
                                            <td className="border border-black px-1 align-middle text-[8px] bg-white truncate" rowSpan={3} title={p.distrito}>{p.distrito}</td>
                                            <td className="border border-black text-center font-bold align-middle bg-white" rowSpan={3}>{a.y > 0 ? a.y : a.m > 0 ? a.m + 'm' : a.d + 'd'}</td>
                                            <td className="border border-black text-center align-middle bg-white" rowSpan={3}>{p.sexo}</td>
                                            
                                            {/* ANTROPOMETRÍA (SOLO NÚMEROS PEQUEÑOS) */}
                                            <td className="border border-black text-center align-middle bg-white font-mono text-[9px]" rowSpan={3}>{c.peso}</td>
                                            <td className="border border-black text-center align-middle bg-white font-mono text-[9px]" rowSpan={3}>{c.talla}</td>
                                            <td className="border border-black text-center align-middle bg-white font-mono text-[9px]" rowSpan={3}>{c.pCef}</td>
                                            <td className="border border-black text-center align-middle bg-white font-mono text-[9px]" rowSpan={3}>{c.pAbd}</td>
                                            
                                            <td className="border border-black text-center font-bold align-middle bg-white" rowSpan={3}>{c.hb}</td>
                                            <td className="border border-black text-center align-middle bg-white" rowSpan={3}>{p.condEst}</td>
                                            <td className="border border-black text-center align-middle bg-white" rowSpan={3}>{p.condServ}</td>

                                            {/* DIAGNÓSTICO 1 (EXPANDIDO) */}
                                            <td className="border border-black px-1 align-middle uppercase text-[9px] truncate">{block[0].desc}</td>
                                            <td className="border border-black text-center font-bold align-middle">{block[0].tipo}</td>
                                            <td className="border border-black text-center align-middle font-mono text-[9px]">{block[0].lab1}</td>
                                            <td className="border border-black text-center align-middle font-mono text-[9px]">{block[0].lab2}</td>
                                            <td className="border border-black text-center align-middle font-mono text-[9px]">{block[0].lab3}</td>
                                            <td className="border border-black text-center font-bold align-middle text-[9px]">{block[0].codigo}</td>
                                        </tr>

                                        {/* FILA 2 */}
                                        <tr className="hover:bg-blue-50 transition-colors h-5">
                                            <td className="border border-black px-1 align-middle uppercase text-[9px] truncate">{block[1].desc}</td>
                                            <td className="border border-black text-center font-bold align-middle">{block[1].tipo}</td>
                                            <td className="border border-black text-center align-middle font-mono text-[9px]">{block[1].lab1}</td>
                                            <td className="border border-black text-center align-middle font-mono text-[9px]">{block[1].lab2}</td>
                                            <td className="border border-black text-center align-middle font-mono text-[9px]">{block[1].lab3}</td>
                                            <td className="border border-black text-center font-bold align-middle text-[9px]">{block[1].codigo}</td>
                                        </tr>

                                        {/* FILA 3 */}
                                        <tr className="hover:bg-blue-50 transition-colors h-5">
                                            <td className="border border-black px-1 align-middle uppercase text-[9px] truncate">{block[2].desc}</td>
                                            <td className="border border-black text-center font-bold align-middle">{block[2].tipo}</td>
                                            <td className="border border-black text-center align-middle font-mono text-[9px]">{block[2].lab1}</td>
                                            <td className="border border-black text-center align-middle font-mono text-[9px]">{block[2].lab2}</td>
                                            <td className="border border-black text-center align-middle font-mono text-[9px]">{block[2].lab3}</td>
                                            <td className="border border-black text-center font-bold align-middle text-[9px]">{block[2].codigo}</td>
                                        </tr>
                                        
                                        <tr className="h-[2px] bg-black"><td colSpan={20} className="bg-black p-0 border-0"></td></tr>
                                    </React.Fragment>
                                ));
                            })
                        )}
                        {consolidatedPatients.length < 5 && Array.from({length: 3}).map((_, i) => (
                             <tr key={`filler-${i}`}><td className="border border-black h-16" colSpan={7}></td><td className="border border-black" colSpan={4}></td><td className="border border-black" colSpan={3}></td><td className="border border-black" colSpan={6}></td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      )}
           </div>

            {/* PIE DE PÁGINA (FOOTER) */}
            {/* PIE DE PÁGINA (FOOTER) */}
      <div className="bg-white p-6 border-t border-slate-100 flex justify-between items-center shrink-0">
        
        {/* BOTÓN IZQUIERDO (ATRÁS / SALIR) */}
        {step > 1 ? (
          <button 
            onClick={handleBack} 
            className="px-6 py-2 rounded-xl hover:bg-slate-50 text-slate-500 font-bold flex gap-2 transition-all hover:text-slate-800 text-xs h-10 items-center"
          >
            <ArrowLeft size={18} /> Atrás
          </button>
          ) : (
          <button 
            onClick={() => setIsModalOpen(false)} 
            className="px-6 py-2 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600 font-bold flex gap-2 transition-all text-xs h-10 items-center border border-transparent hover:border-blue-100"
          >
            <LogOut size={18} /> IR A SEGUIMIENTO
          </button>
        )}
        {/* BOTONES DERECHOS (ACCIONES PRINCIPALES) */}
        <div className="flex gap-3">
          {/* LÓGICA DEL PASO 4: FLUJO DE CIERRE DE LOTE */}
          {step === 4 && (
            <>
              {/* CASO A: AÚN NO SE HA TERMINADO EL LOTE (isBatchFinished = false) */}
              {!isBatchFinished ? (
                <>
                   {showNewBtn && (
    <button
        onClick={() => {
            resetForm();
            setStep(1);
            setTimeout(() => setIsCalendarOpen(true), 100); // Agregué esto para que abra el calendario igual que antes
        }}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 animate-fadeIn text-xs h-10"
    >
        <UserPlus size={18} />
        NUEVO PACIENTE
    </button>
)}
                  <button
                    onClick={() => setShowSaveConfirm(true)}
                    className="px-6 py-2 rounded-xl font-bold shadow-lg flex gap-2 items-center transition-all text-xs h-10 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <SaveIcon size={18} /> GUARDAR PACIENTE
                  </button>

                  {/* BOTÓN "TERMINAR": SOLO APARECE SI YA HAY AL MENOS 1 PACIENTE GUARDADO */}
                  {savedPatients.length > 0 && (
                    <button
                      onClick={() => setIsBatchFinished(true)}
                      className="px-6 py-2 rounded-xl font-bold shadow-lg flex gap-2 items-center transition-all text-xs h-10 bg-amber-500 hover:bg-amber-600 text-white animate-in fade-in slide-in-from-right-4"
                    >
                      <CheckCircle size={18} /> TERMINAR DIGITACIÓN
                    </button>
                  )}
                </>
              ) : (
                /* CASO B: LOTE FINALIZADO (isBatchFinished = true) - MOSTRAR EXPORTACIONES */
                <>
                  <button
                    onClick={() => setIsBatchFinished(false)}
                    className="px-4 py-2 rounded-xl font-bold border-2 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all text-xs h-10 mr-2"
                    title="Volver a agregar más pacientes"
                  >
                    ↩ SEGUIR EDITANDO
                  </button>

                  {/* BOTÓN EXPORTAR EXCEL - (Aquí estaba tu error principal, faltaba la etiqueta de apertura) */}
                  <button
                    onClick={generateExcel}
                    className="px-10 py-2 rounded-xl font-bold shadow-xl flex gap-2 items-center transition-all text-xs h-10 bg-emerald-600 hover:bg-emerald-700 text-white hover:-translate-y-1 animate-in zoom-in"
                  >
                    {/* AQUI ESTA EL CAMBIO: Usamos consolidatedPatients.length */}
                    <Download size={20} /> EXPORTAR EXCEL ({consolidatedPatients.length})
                  </button>

                  {/* BOTÓN EXPORTAR PDF (CORREGIDO) */}
                  <button
                    onClick={generatePDF}
                    className="px-6 py-2 rounded-xl font-bold shadow-xl flex gap-2 items-center transition-all text-xs h-10 bg-red-600 hover:bg-red-700 text-white hover:-translate-y-1 ml-2 animate-in zoom-in"
                  >
                    {/* AQUI ESTA EL CAMBIO: Usamos consolidatedPatients.length */}
                    <FileText size={20} /> EXPORTAR PDF ({consolidatedPatients.length})
                  </button>
                </>
              )}
            </>
          )}

          {/* BOTÓN SIGUIENTE (VISUALIZAR EN PASOS 1, 2 Y 3) */}
          {step < 4 && (
            <button 
              onClick={handleNextStep} 
              className="bg-[#0F172A] hover:bg-slate-800 text-white px-8 py-2 rounded-xl font-bold shadow-xl flex gap-2 items-center transition-all hover:translate-x-1 hover:shadow-2xl text-xs h-10"
            >
              Siguiente <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
          </div>
        )}
      </div>
       {/* --- MODAL DE DIAGNÓSTICOS (CIE-10) --- */}
      {/* --- MODAL DE DIAGNÓSTICOS (CIE-10) --- */}
      {/* --- MODAL DE DIAGNÓSTICOS (CIE-10) --- */}
      {/* --- MODAL DE DIAGNÓSTICOS (CIE-10) --- */}
      {/* --- MODAL DE DIAGNÓSTICOS (CIE-10) --- */}
      {/* --- MODAL DE DIAGNÓSTICOS (CIE-10) --- */}
      {/* --- MODAL DE DIAGNÓSTICOS (CIE-10) --- */}
      {/* --- MODAL DE DIAGNÓSTICOS (CIE-10) --- */}
      {isDxModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
                
                {/* CABECERA */}
                <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Buscar Diagnóstico</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full w-fit">
                            <span className="uppercase tracking-wider">Editando Fila {currentDxRow + 1}</span>
                        </div>
                    </div>
                    <button onClick={() => setIsDxModalOpen(false)} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-slate-100 hover:rotate-90 duration-300"><X size={22}/></button>
                </div>

                {/* CUERPO */}
                <div className="p-8 space-y-8 overflow-y-auto flex-1 bg-slate-50/30">
                    <div className="flex flex-col gap-6">
                        
                        {/* INPUT DE BÚSQUEDA Y LABS */}
                        {/* INPUT DE BÚSQUEDA MEJORADO (CON BORRADOR) */}
                        <div className="flex gap-4 items-start">
                            <div className="flex-1 relative group z-20">
                                <input 
                                    autoFocus 
                                    value={modalSearchTerm} 
                                    onChange={(e) => handleModalSearch(e.target.value)} 
                                    placeholder="Escribe el código o nombre de la enfermedad..." 
                                    // CAMBIO CLAVE: "pr-32" da mucho espacio a la derecha para que el texto no toque los iconos
                                    className="w-full h-16 pl-6 pr-32 rounded-2xl bg-slate-100 border-2 border-transparent focus:border-blue-400 focus:bg-white outline-none font-semibold text-base text-slate-700 uppercase transition-all shadow-sm focus:shadow-md placeholder:text-slate-400 placeholder:font-medium placeholder:normal-case" 
                                />
                                
                                {/* CONTENEDOR DE ICONOS (DERECHA) */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    
                                    {/* BOTÓN BORRAR (Solo aparece si escribes algo) */}
                                    {modalSearchTerm.length > 0 && (
                                        <button 
                                            onClick={() => {
                                                setModalSearchTerm(''); // Borra el texto
                                                setModalSuggestions([]); // Cierra las sugerencias
                                                // Enfocamos de nuevo el input por si acaso (opcional)
                                                document.querySelector('input[placeholder^="Escribe el código"]')?.focus();
                                            }}
                                            className="p-2 rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-red-500 transition-colors animate-in zoom-in duration-200 shadow-sm"
                                            title="Borrar todo"
                                        >
                                            <X size={18} strokeWidth={3} />
                                        </button>
                                    )}

                                    {/* SEPARADOR VERTICAL */}
                                    <div className="w-px h-6 bg-slate-300 mx-1"></div>

                                    {/* ICONO LUPA (Decorativo) */}
                                    <div className="text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                                        <Search size={24} />
                                    </div>
                                </div>

                                {/* LISTA DE SUGERENCIAS (DROPDOWN) */}
                                {modalSuggestions.length > 0 && (
                                    <div className="absolute top-[4.5rem] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 max-h-80 overflow-y-auto z-30 p-2 no-scrollbar animate-in slide-in-from-top-2">
                                        {modalSuggestions.map((item, i) => ( 
                                            <div key={i} onClick={() => selectModalDx(item)} className="p-4 hover:bg-blue-50/80 rounded-xl cursor-pointer flex flex-col group transition-colors border-b border-slate-50 last:border-0"> 
                                                <div className="font-black text-blue-600 text-lg mb-1 flex items-center gap-2">
                                                    {item.CODIGO}
                                                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">CIE-10</span>
                                                </div> 
                                                <div className="text-sm font-medium text-slate-600 group-hover:text-blue-800 leading-snug">{item.DESCRIPCION}</div> 
                                            </div> 
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* LABS SUPERIORES (Sigue igual, no tocar) */}
                            <div className="flex gap-2 shrink-0 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 h-16 items-center">
                                {[1, 2, 3].map(n => (
                                    <input 
                                        key={n} 
                                        maxLength={3} 
                                        placeholder={`LAB ${n}`} 
                                        value={tempDx[`lab${n}`]} 
                                        onChange={(e) => setTempDx({...tempDx, [`lab${n}`]: e.target.value.toUpperCase()})} 
                                        className="w-20 h-12 rounded-xl bg-slate-100 border-2 border-transparent focus:border-blue-400 focus:bg-white text-center font-bold text-slate-700 outline-none uppercase text-sm placeholder:text-slate-400 placeholder:font-bold transition-all focus:shadow-sm"
                                    />
                                ))}
                            </div>
                        </div>
                        {/* --- ZONA DE CONFIRMACIÓN Y SELECTOR "MALABARISTA" --- */}
                        <div className={`rounded-[2rem] p-6 transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden
                            ${tempDx.codigo ? 'bg-gradient-to-br from-blue-50 via-white to-blue-50 border border-blue-100 shadow-lg shadow-blue-50/50' : 'bg-slate-50 border border-slate-100 opacity-60 grayscale'}
                        `}>
                            {/* CÓDIGO SELECCIONADO (TEXTO COMPLETO) */}
                             {/* CÓDIGO SELECCIONADO (CON ANCHO AUTO-AJUSTABLE) */}
                            <div className="flex items-center gap-6 flex-1 w-full relative z-10"> 
                                <div className="bg-white w-auto min-w-[5rem] h-20 px-4 flex items-center justify-center rounded-2xl shadow-md border border-blue-100/50 font-black text-blue-600 text-2xl md:text-3xl tracking-tight shrink-0 whitespace-nowrap">
                                    {tempDx.codigo || '---'}
                                </div> 
                                <div className="flex flex-col min-w-0 pt-1"> 
                                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                                        Diagnóstico Seleccionado
                                    </span> 
                                    <span className="font-bold text-slate-800 text-base leading-snug break-words">
                                        {tempDx.desc || 'Busque y seleccione un diagnóstico arriba...'}
                                    </span> 
                                </div> 
                            </div>

                            {/* SELECTOR DE TIPO */}
                            {tempDx.codigo && (
                                <div className="flex flex-col items-center animate-in zoom-in slide-in-from-bottom-8 duration-500 relative z-10 shrink-0 p-4 bg-white/50 rounded-3xl border border-blue-50 backdrop-blur-sm">
                                    
                                    {/* INSTRUCCIONES */}
                                    {/* INSTRUCCIONES (SIN FLECHAS) */}
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        {!tempDx.tipo ? (
                                            // SOLO EL TEXTO, SIN FLECHAS
                                            <span className="text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent drop-shadow-sm animate-pulse">
                                                ELEGIR TIPO DE DIAGNOSTICO
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                                                <CheckCircle size={12} /> TIPO SELECCIONADO:
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* BOLAS SALTARINAS */}
                                    <div className="flex gap-4 p-1">
                                        {[
                                            { id: 'P', label: 'PRESUNTIVO', color: 'amber', delay: '0s' },
                                            { id: 'D', label: 'DEFINITIVO', color: 'blue', delay: '0.15s' },
                                            { id: 'R', label: 'REPETIDO', color: 'emerald', delay: '0.3s' }
                                        ].map((opt) => {
                                            const isSelected = tempDx.tipo === opt.id;
                                            const animationClass = !tempDx.tipo ? 'animate-bounce' : '';
                                            
                                            return (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setTempDx({ ...tempDx, tipo: opt.id })}
                                                    style={{ animationDelay: !tempDx.tipo ? opt.delay : '0s' }}
                                                    className={`
                                                        w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-300 border-4
                                                        ${animationClass} 
                                                        ${isSelected 
                                                            ? `bg-${opt.color}-500 border-${opt.color}-200 text-white scale-110 ring-4 ring-${opt.color}-100 -translate-y-2 shadow-xl shadow-${opt.color}-400/30`
                                                            : `bg-${opt.color}-100 border-${opt.color}-300 text-${opt.color}-600 shadow-md shadow-${opt.color}-100/50 hover:bg-${opt.color}-200 hover:scale-105`
                                                        }
                                                    `}
                                                    title={opt.label}
                                                >
                                                    {opt.id}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* ETIQUETA INFERIOR */}
                                    <div className="h-6 mt-2 text-center flex items-center justify-center">
                                        {tempDx.tipo === 'P' && <span className="text-xs font-bold text-amber-700 bg-amber-100/80 border border-amber-200 px-3 py-1 rounded-full animate-in zoom-in shadow-sm">PRESUNTIVO</span>}
                                        {tempDx.tipo === 'D' && <span className="text-xs font-bold text-blue-700 bg-blue-100/80 border border-blue-200 px-3 py-1 rounded-full animate-in zoom-in shadow-sm">DEFINITIVO</span>}
                                        {tempDx.tipo === 'R' && <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-3 py-1 rounded-full animate-in zoom-in shadow-sm">REPETIDO</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* BOTONES INFERIORES */}
                <div className="px-10 py-5 bg-white border-t border-slate-50 flex justify-between items-center shrink-0 min-h-[80px]">
                    <button onClick={() => setIsDxModalOpen(false)} className="px-8 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors text-sm tracking-wide">CANCELAR</button>
                    
                    {tempDx.tipo && tempDx.tipo !== '' && (
                        <button onClick={saveModalSelection} className="px-10 py-3 rounded-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl shadow-emerald-200/50 hover:scale-[1.02] hover:-translate-y-0.5 transition-all text-sm flex items-center gap-2 animate-in zoom-in slide-in-from-right-10 duration-300 tracking-wide">
                            <Save size={20} strokeWidth={2.5}/> GUARDAR SELECCIÓN
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
      {/* --- CALENDARIO FLOTANTE (FIXED) --- */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsCalendarOpen(false)}>
            <div ref={calendarRef} onClick={(e) => e.stopPropagation()}>
                <SimpleCalendar selectedDate={patientData.fecAtencion} onSelectDate={handleDateSelect} onClose={() => setIsCalendarOpen(false)} themeColor="blue" />
            </div>
        </div>
      )}

      {/* --- ALERTA DE CONFIRMACIÓN DE GUARDADO --- */}
      {showSaveConfirm && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border-2 border-orange-300 overflow-hidden animate-in zoom-in duration-300">
                <div className="bg-orange-50 p-6 border-b border-orange-100 flex flex-col items-center text-center gap-3">
                    <div className="bg-orange-100 p-3 rounded-full text-orange-600 mb-1"> <AlertTriangle size={32} strokeWidth={2.5}/> </div>
                    <h3 className="text-xl font-black text-orange-900 uppercase leading-tight">Antes de Guardar</h3>
                    <p className="text-sm font-bold text-orange-700">POR FAVOR VERIFIQUE LA INFORMACIÓN</p>
                </div>
                <div className="p-6 bg-white space-y-3">
                    <button onClick={handleReviewInfo} className="w-full py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-extrabold hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-sm"> <Eye size={18}/> REVISAR LA INFORMACIÓN </button>
                    <button onClick={confirmSavePatient} className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 text-sm transform hover:scale-[1.02]"> <SaveIcon size={18}/> SÍ, DESEO GUARDAR </button>
                </div>
                <div className="bg-slate-50 p-3 text-center"> <button onClick={() => setShowSaveConfirm(false)} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 underline">Cancelar operación</button> </div>
            </div>
        </div>
      )}

      {/* --- OTROS MODALES --- */}
      <AnemiaCalculatorModal isOpen={showAnemiaModal} onClose={() => setShowAnemiaModal(false)} initialData={{ fecNac: patientData.fecNac, fecAtencion: patientData.fecAtencion }} />
      <NutritionalStatusModal isOpen={showNutriModal} onClose={() => setShowNutriModal(false)} />
      <CredFollowUpModal isOpen={showCredModal} onClose={() => setShowCredModal(false)} />
      
      {/* MODAL DE SEGUIMIENTO INDIVIDUAL */}
      {selectedGestanteForModal && (
        <SeguimientoIndividualModal 
           paciente={selectedGestanteForModal} 
           onClose={() => setSelectedGestanteForModal(null)} 
        />
      )}

      <style>{` .no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } input[type="date"]::-webkit-calendar-picker-indicator { opacity: 1; display: block; width: 1em; height: 1em; position: absolute; top: 50%; right: 12px; transform: translateY(-50%); color: #475569; cursor: pointer; } input[type="date"] { text-align: center; padding-left: 0.5rem; padding-right: 2.5rem; } `}</style>
    </div>
  );
}