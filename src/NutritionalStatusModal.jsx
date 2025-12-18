import React,  { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot
} from 'recharts';

// ==========================================
// 1. DATA (Adaptada de tu código Python)
// ==========================================
const LHFA_DATA = [
    { sex: "F", age_months: 0, L: 1.0, M: 49.1477, S: 0.0379 },
    { sex: "F", age_months: 1, L: 1.0, M: 53.6872, S: 0.0364 },
    { sex: "F", age_months: 2, L: 1.0, M: 57.0673, S: 0.03568 },
    { sex: "F", age_months: 3, L: 1.0, M: 59.8029, S: 0.0352 },
    { sex: "F", age_months: 4, L: 1.0, M: 62.0899, S: 0.03486 },
    { sex: "F", age_months: 5, L: 1.0, M: 64.0301, S: 0.03463 },
    { sex: "F", age_months: 6, L: 1.0, M: 65.7311, S: 0.03448 },
    { sex: "F", age_months: 7, L: 1.0, M: 67.2873, S: 0.03441 },
    { sex: "F", age_months: 8, L: 1.0, M: 68.7498, S: 0.0344 },
    { sex: "F", age_months: 9, L: 1.0, M: 70.1435, S: 0.03444 },
    { sex: "F", age_months: 10, L: 1.0, M: 71.4818, S: 0.03452 },
    { sex: "F", age_months: 11, L: 1.0, M: 72.771, S: 0.03464 },
    { sex: "F", age_months: 12, L: 1.0, M: 74.015, S: 0.03479 },
    { sex: "F", age_months: 13, L: 1.0, M: 75.2176, S: 0.03496 },
    { sex: "F", age_months: 14, L: 1.0, M: 76.3817, S: 0.03514 },
    { sex: "F", age_months: 15, L: 1.0, M: 77.5099, S: 0.03534 },
    { sex: "F", age_months: 16, L: 1.0, M: 78.6055, S: 0.03555 },
    { sex: "F", age_months: 17, L: 1.0, M: 79.671, S: 0.03576 },
    { sex: "F", age_months: 18, L: 1.0, M: 80.7079, S: 0.03598 },
    { sex: "F", age_months: 19, L: 1.0, M: 81.7182, S: 0.0362 },
    { sex: "F", age_months: 20, L: 1.0, M: 82.7036, S: 0.03643 },
    { sex: "F", age_months: 21, L: 1.0, M: 83.6654, S: 0.03666 },
    { sex: "F", age_months: 22, L: 1.0, M: 84.604, S: 0.03688 },
    { sex: "F", age_months: 23, L: 1.0, M: 85.5202, S: 0.03711 },
    { sex: "F", age_months: 24, L: 1.0, M: 86.4153, S: 0.03734 },
    { sex: "F", age_months: 25, L: 1.0, M: 86.5904, S: 0.03786 },
    { sex: "F", age_months: 26, L: 1.0, M: 87.4462, S: 0.03808 },
    { sex: "F", age_months: 27, L: 1.0, M: 88.283, S: 0.0383 },
    { sex: "F", age_months: 28, L: 1.0, M: 89.1004, S: 0.03851 },
    { sex: "F", age_months: 29, L: 1.0, M: 89.8991, S: 0.03872 },
    { sex: "F", age_months: 30, L: 1.0, M: 90.6797, S: 0.03893 },
    { sex: "F", age_months: 31, L: 1.0, M: 91.443, S: 0.03913 },
    { sex: "F", age_months: 32, L: 1.0, M: 92.1906, S: 0.03933 },
    { sex: "F", age_months: 33, L: 1.0, M: 92.9239, S: 0.03952 },
    { sex: "F", age_months: 34, L: 1.0, M: 93.6444, S: 0.03971 },
    { sex: "F", age_months: 35, L: 1.0, M: 94.3533, S: 0.03989 },
    { sex: "F", age_months: 36, L: 1.0, M: 95.0515, S: 0.04006 },
    { sex: "F", age_months: 37, L: 1.0, M: 95.7399, S: 0.04024 },
    { sex: "F", age_months: 38, L: 1.0, M: 96.4187, S: 0.04041 },
    { sex: "F", age_months: 39, L: 1.0, M: 97.0885, S: 0.04057 },
    { sex: "F", age_months: 40, L: 1.0, M: 97.7493, S: 0.04073 },
    { sex: "F", age_months: 41, L: 1.0, M: 98.4015, S: 0.04089 },
    { sex: "F", age_months: 42, L: 1.0, M: 99.0448, S: 0.04105 },
    { sex: "F", age_months: 43, L: 1.0, M: 99.6795, S: 0.0412 },
    { sex: "F", age_months: 44, L: 1.0, M: 100.3058, S: 0.04135 },
    { sex: "F", age_months: 45, L: 1.0, M: 100.9238, S: 0.0415 },
    { sex: "F", age_months: 46, L: 1.0, M: 101.5337, S: 0.04164 },
    { sex: "F", age_months: 47, L: 1.0, M: 102.136, S: 0.04179 },
    { sex: "F", age_months: 48, L: 1.0, M: 102.7312, S: 0.04193 },
    { sex: "F", age_months: 49, L: 1.0, M: 103.3197, S: 0.04206 },
    { sex: "F", age_months: 50, L: 1.0, M: 103.9021, S: 0.0422 },
    { sex: "F", age_months: 51, L: 1.0, M: 104.4786, S: 0.04233 },
    { sex: "F", age_months: 52, L: 1.0, M: 105.0494, S: 0.04246 },
    { sex: "F", age_months: 53, L: 1.0, M: 105.6148, S: 0.04259 },
    { sex: "F", age_months: 54, L: 1.0, M: 106.1748, S: 0.04272 },
    { sex: "F", age_months: 55, L: 1.0, M: 106.7295, S: 0.04285 },
    { sex: "F", age_months: 56, L: 1.0, M: 107.2788, S: 0.04298 },
    { sex: "F", age_months: 57, L: 1.0, M: 107.8227, S: 0.0431 },
    { sex: "F", age_months: 58, L: 1.0, M: 108.3613, S: 0.04322 },
    { sex: "F", age_months: 59, L: 1.0, M: 108.8948, S: 0.04334 },
    { sex: "F", age_months: 60, L: 1.0, M: 109.4233, S: 0.04347 },
    // DATOS MASCULINOS
    { sex: "M", age_months: 0, L: 1.0, M: 49.8842, S: 0.03795 },
    { sex: "M", age_months: 1, L: 1.0, M: 54.7244, S: 0.03557 },
    { sex: "M", age_months: 2, L: 1.0, M: 58.4249, S: 0.03424 },
    { sex: "M", age_months: 3, L: 1.0, M: 61.4292, S: 0.03328 },
    { sex: "M", age_months: 4, L: 1.0, M: 63.886, S: 0.03257 },
    { sex: "M", age_months: 5, L: 1.0, M: 65.9026, S: 0.03204 },
    { sex: "M", age_months: 6, L: 1.0, M: 67.6236, S: 0.03165 },
    { sex: "M", age_months: 7, L: 1.0, M: 69.1645, S: 0.03139 },
    { sex: "M", age_months: 8, L: 1.0, M: 70.5994, S: 0.03124 },
    { sex: "M", age_months: 9, L: 1.0, M: 71.9687, S: 0.03117 },
    { sex: "M", age_months: 10, L: 1.0, M: 73.2812, S: 0.03118 },
    { sex: "M", age_months: 11, L: 1.0, M: 74.5388, S: 0.03125 },
    { sex: "M", age_months: 12, L: 1.0, M: 75.7488, S: 0.03137 },
    { sex: "M", age_months: 13, L: 1.0, M: 76.9186, S: 0.03154 },
    { sex: "M", age_months: 14, L: 1.0, M: 78.0497, S: 0.03174 },
    { sex: "M", age_months: 15, L: 1.0, M: 79.1458, S: 0.03197 },
    { sex: "M", age_months: 16, L: 1.0, M: 80.2113, S: 0.03222 },
    { sex: "M", age_months: 17, L: 1.0, M: 81.2487, S: 0.0325 },
    { sex: "M", age_months: 18, L: 1.0, M: 82.2587, S: 0.03279 },
    { sex: "M", age_months: 19, L: 1.0, M: 83.2418, S: 0.0331 },
    { sex: "M", age_months: 20, L: 1.0, M: 84.1996, S: 0.03342 },
    { sex: "M", age_months: 21, L: 1.0, M: 85.1348, S: 0.03376 },
    { sex: "M", age_months: 22, L: 1.0, M: 86.0477, S: 0.0341 },
    { sex: "M", age_months: 23, L: 1.0, M: 86.941, S: 0.03445 },
    { sex: "M", age_months: 24, L: 1.0, M: 87.8161, S: 0.03479 },
    { sex: "M", age_months: 25, L: 1.0, M: 87.972, S: 0.03542 },
    { sex: "M", age_months: 26, L: 1.0, M: 88.8065, S: 0.03576 },
    { sex: "M", age_months: 27, L: 1.0, M: 89.6197, S: 0.0361 },
    { sex: "M", age_months: 28, L: 1.0, M: 90.412, S: 0.03642 },
    { sex: "M", age_months: 29, L: 1.0, M: 91.1828, S: 0.03674 },
    { sex: "M", age_months: 30, L: 1.0, M: 91.9327, S: 0.03704 },
    { sex: "M", age_months: 31, L: 1.0, M: 92.6631, S: 0.03733 },
    { sex: "M", age_months: 32, L: 1.0, M: 93.3753, S: 0.03761 },
    { sex: "M", age_months: 33, L: 1.0, M: 94.0711, S: 0.03787 },
    { sex: "M", age_months: 34, L: 1.0, M: 94.7532, S: 0.03812 },
    { sex: "M", age_months: 35, L: 1.0, M: 95.4236, S: 0.03836 },
    { sex: "M", age_months: 36, L: 1.0, M: 96.0835, S: 0.03858 },
    { sex: "M", age_months: 37, L: 1.0, M: 96.7337, S: 0.03879 },
    { sex: "M", age_months: 38, L: 1.0, M: 97.3749, S: 0.039 },
    { sex: "M", age_months: 39, L: 1.0, M: 98.0073, S: 0.03919 },
    { sex: "M", age_months: 40, L: 1.0, M: 98.631, S: 0.03937 },
    { sex: "M", age_months: 41, L: 1.0, M: 99.2459, S: 0.03954 },
    { sex: "M", age_months: 42, L: 1.0, M: 99.8515, S: 0.03971 },
    { sex: "M", age_months: 43, L: 1.0, M: 100.4485, S: 0.03986 },
    { sex: "M", age_months: 44, L: 1.0, M: 101.0374, S: 0.04002 },
    { sex: "M", age_months: 45, L: 1.0, M: 101.6186, S: 0.04016 },
    { sex: "M", age_months: 46, L: 1.0, M: 102.1933, S: 0.04031 },
    { sex: "M", age_months: 47, L: 1.0, M: 102.7625, S: 0.04045 },
    { sex: "M", age_months: 48, L: 1.0, M: 103.3273, S: 0.04059 },
    { sex: "M", age_months: 49, L: 1.0, M: 103.8886, S: 0.04073 },
    { sex: "M", age_months: 50, L: 1.0, M: 104.4473, S: 0.04086 },
    { sex: "M", age_months: 51, L: 1.0, M: 105.0041, S: 0.041 },
    { sex: "M", age_months: 52, L: 1.0, M: 105.5596, S: 0.04113 },
    { sex: "M", age_months: 53, L: 1.0, M: 106.1138, S: 0.04126 },
    { sex: "M", age_months: 54, L: 1.0, M: 106.6668, S: 0.04139 },
    { sex: "M", age_months: 55, L: 1.0, M: 107.2188, S: 0.04152 },
    { sex: "M", age_months: 56, L: 1.0, M: 107.7697, S: 0.04165 },
    { sex: "M", age_months: 57, L: 1.0, M: 108.3198, S: 0.04177 },
    { sex: "M", age_months: 58, L: 1.0, M: 108.8689, S: 0.0419 },
    { sex: "M", age_months: 59, L: 1.0, M: 109.417, S: 0.04202 },
    { sex: "M", age_months: 60, L: 1.0, M: 109.9638, S: 0.04214 },
];

// ==========================================
// 2. LÓGICA MATEMÁTICA (Port de Python a JS)
// ==========================================

// Calcula el valor esperado para una desviación Z específica (P3 es Z=-1.88, P97 es Z=1.88)
const valueFromLMS = (z, L, M, S) => {
  if (L === 0) {
    return M * Math.exp(S * z);
  } else {
    return M * Math.pow(1 + L * S * z, 1 / L);
  }
};

// Calcula el Z-Score de un paciente
const zscoreFromLMS = (x, L, M, S) => {
  if (L === 0) {
    return Math.log(x / M) / S;
  } else {
    return (Math.pow(x / M, L) - 1) / (L * S);
  }
};

// Clasificación según Z-Score
const clasificarZ = (z) => {
  if (z < -3) return "Desnutrición crónica severa";
  if (z < -2) return "Desnutrición crónica moderada";
  if (z <= 2) return "Talla adecuada";
  return "Talla alta";
};

const findRowByAge = (sex, ageMonths) => {
  let safeAge = ageMonths;
  if (safeAge > 60) safeAge = 60;
  
  const rows = LHFA_DATA.filter(r => r.sex === sex);
  
  // Buscar exacto
  const exact = rows.find(r => r.age_months === safeAge);
  if (exact) return exact;
  
  // O el anterior más cercano
  const smaller = rows.filter(r => r.age_months < safeAge);
  if (smaller.length > 0) return smaller[smaller.length - 1];
  
  return rows[0];
};

// Prepara la data para Recharts (dibuja las curvas de fondo)
const generateChartData = (sex) => {
  const rows = LHFA_DATA.filter(r => r.sex === sex).sort((a, b) => a.age_months - b.age_months);
  
  return rows.map(r => ({
    age: r.age_months,
    p50: r.M, // Mediana
    p3: valueFromLMS(-1.88, r.L, r.M, r.S), // ~Percentil 3
    p97: valueFromLMS(1.88, r.L, r.M, r.S)  // ~Percentil 97
  }));
};

// ==========================================
// 3. COMPONENTE REACT (MODAL)
// ==========================================

const NutritionalStatusModal = ({ isOpen, onClose }) => {
  // Estados del formulario
  const [sex, setSex] = useState("M");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  
  // Estados de resultados
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Actualizar curvas si cambia el sexo
  useEffect(() => {
    setChartData(generateChartData(sex));
  }, [sex]);

  const handleCalculate = () => {
    if (!age || !height) {
      alert("Por favor ingrese edad y talla");
      return;
    }

    const ageVal = parseInt(age);
    const heightVal = parseFloat(height);

    const ref = findRowByAge(sex, ageVal);
    const z = zscoreFromLMS(heightVal, ref.L, ref.M, ref.S);
    const diagnosis = clasificarZ(z);

    setResult({
      sex,
      age: ageVal,
      height: heightVal,
      refM: ref.M,
      zScore: z.toFixed(2),
      diagnosis
    });
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Encabezado */}
        <div style={styles.header}>
          <h2 style={{margin:0}}>Talla para la Edad - OMS</h2>
          <button onClick={onClose} style={styles.closeBtn}>X</button>
        </div>

        <div style={styles.body}>
          {/* Panel Izquierdo: Formulario */}
          <div style={styles.leftPanel}>
            <h3 style={styles.subTitle}>Datos del niño</h3>
            
            <label style={styles.label}>Sexo:</label>
            <select 
              value={sex} 
              onChange={e => setSex(e.target.value)}
              style={styles.input}
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>

            <label style={styles.label}>Edad (meses):</label>
            <input 
              type="number" 
              value={age}
              onChange={e => setAge(e.target.value)}
              style={styles.input}
              placeholder="0 - 60"
            />

            <label style={styles.label}>Talla (cm):</label>
            <input 
              type="number" 
              step="0.1"
              value={height}
              onChange={e => setHeight(e.target.value)}
              style={styles.input}
              placeholder="Ej. 75.5"
            />

            <button onClick={handleCalculate} style={styles.calcBtn}>
              CALCULAR
            </button>

            {/* Caja de Resultados (Texto) */}
            <div style={styles.outputBox}>
              {result ? (
                <>
                  <p><strong>Sexo:</strong> {result.sex} | <strong>Edad:</strong> {result.age}m</p>
                  <p><strong>Talla:</strong> {result.height} cm</p>
                  <hr style={{borderColor: '#ccc', margin: '5px 0'}}/>
                  <p>Ref OMS (M): {result.refM.toFixed(1)} cm</p>
                  <p>Z-Score: {result.zScore}</p>
                  <p style={{fontWeight: 'bold', color: '#007bff'}}>{result.diagnosis}</p>
                </>
              ) : (
                <p style={{color: '#666'}}>Ingresa los datos y presiona CALCULAR.</p>
              )}
            </div>
          </div>

          {/* Panel Derecho: Gráfica */}
          <div style={styles.rightPanel}>
            <h4 style={{textAlign: 'center', marginTop:0}}>
              Curvas OMS (0-60 meses)
            </h4>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                  <XAxis dataKey="age" type="number" label={{ value: 'Edad (meses)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Talla (cm)', angle: -90, position: 'insideLeft' }} domain={['auto', 'auto']} />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36}/>
                  
                  {/* Curvas de Referencia */}
                  <Line type="monotone" dataKey="p97" stroke="#28a745" strokeDasharray="5 5" name="~P97 (+2 SD)" dot={false} strokeWidth={2}/>
                  <Line type="monotone" dataKey="p50" stroke="#007bff" name="P50 (Media)" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="p3" stroke="#ffc107" strokeDasharray="5 5" name="~P3 (-2 SD)" dot={false} strokeWidth={2}/>

                  {/* Punto del Paciente (solo si hay resultado) */}
                  {result && (
                    <ReferenceDot 
                      x={result.age} 
                      y={result.height} 
                      r={6} 
                      fill="red" 
                      stroke="none" 
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilos básicos en línea (puedes pasarlos a CSS/Tailwind)
const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modal: {
    backgroundColor: 'white', width: '900px', height: '600px', borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
  },
  header: {
    backgroundColor: '#f1f1f1', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd'
  },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold'
  },
  body: {
    display: 'flex', flex: 1, padding: '20px'
  },
  leftPanel: {
    width: '30%', paddingRight: '20px', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column'
  },
  rightPanel: {
    width: '70%', paddingLeft: '20px'
  },
  subTitle: { marginTop: 0, marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '500', fontSize: '14px' },
  input: { width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' },
  calcBtn: {
    width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none',
    borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '15px'
  },
  outputBox: {
    backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', flex: 1, fontSize: '13px'
  }
};

export default NutritionalStatusModal;