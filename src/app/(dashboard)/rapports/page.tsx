"use client";
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

export default function RapportsPage() {
  // États pour les filtres
  const [filterType, setFilterType] = useState('Cette année');
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const dataArea = [
    { name: 'Jan', rev: 4000, exp: 2000 }, { name: 'Fév', rev: 3000, exp: 2500 },
    { name: 'Mar', rev: 5000, exp: 4000 }, { name: 'Avr', rev: 4500, exp: 3800 },
    { name: 'Mai', rev: 4800, exp: 3200 }, { name: 'Juin', rev: 4200, exp: 3000 },
    { name: 'Juil', rev: 3800, exp: 4000 }, { name: 'Août', rev: 5200, exp: 3000 },
    { name: 'Sep', rev: 5000, exp: 3200 }, { name: 'Oct', rev: 5500, exp: 3500 },
    { name: 'Nov', rev: 5800, exp: 2800 }, { name: 'Déc', rev: 6300, exp: 3200 },
  ];

  const dataPie = [
    { name: 'Articles', value: 45, color: '#2563EB' },
    { name: 'Posts sociaux', value: 82, color: '#F97316' },
    { name: 'Emails', value: 34, color: '#10B981' },
    { name: 'Copies', value: 28, color: '#F59E0B' },
  ];

  const kpis = [
    { label: 'Revenus totaux', value: '52,400€', trend: '+24%', color: 'blue', icon: 'fa-chart-line' },
    { label: 'Dépenses totales', value: '38,500€', trend: '+8%', color: 'orange', icon: 'fa-arrow-trend-down' },
    { label: 'Bénéfice net', value: '13,900€', trend: '+36%', color: 'green', icon: 'fa-leaf' },
    { label: 'Contenus générés', value: '189', trend: '+15%', color: 'indigo', icon: 'fa-clock-rotate-left' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-container">
      {/* Filtres supérieurs - Masqués à l'impression */}
      <div className="reports-header-actions no-print">
        <div className="filter-group">
          <select 
            className="ia-select small"  
            value={filterType}
            onChange={(e) => {
                setFilterType(e.target.value);
                if(e.target.value !== 'Custom') setShowCustomDates(false);
            }}
          >
            <option>Cette année</option>
            <option>Ce mois</option>
          </select>
          
          <button 
            className={`btn-outline-blue ${showCustomDates ? 'active' : ''}`}
            onClick={() => setShowCustomDates(!showCustomDates)}
          >
            <i className="fa-regular fa-calendar"></i> Personnalisé
          </button>
        </div>
           
        <button className="btn-export" onClick={handlePrint}>
          <i className="fa-solid fa-file-pdf"></i> Exporter PDF
        </button>
      </div>

      {/* Inputs dates personnalisées - Masqués à l'impression */}
      {showCustomDates && (
        <div className="custom-date-filters no-print">
            <div className="date-input">
                <label>Du</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="date-input">
                <label>Au</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <button className="btn-apply">Filtrer</button>
        </div>
      )}

      {/* En-tête du rapport visible uniquement à l'impression */}
      <div className="print-only-header">
          <h2>Rapport d'activité PitchFlow</h2>
          <p>Période : {showCustomDates ? `Du ${startDate} au ${endDate}` : filterType}</p>
      </div>

      {/* Cartes KPI */}
      <div className="stats-grid">
        {kpis.map((kpi, i) => (
          <div key={i} className="stat-card report-kpi">
            <div className="kpi-top">
              <div className={`kpi-icon-box ${kpi.color}`}>
                <i className={`fa-solid ${kpi.icon}`}></i>
              </div>
              <span className="kpi-trend">{kpi.trend}</span>
            </div>
            <span className="stat-value">{kpi.value}</span>
            <span className="stat-label">{kpi.label}</span>
          </div>
        ))}
      </div>

      <div className="charts-main-grid">
        <div className="chart-card area-chart-section">
          <h4>Revenus vs Dépenses</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dataArea}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="rev" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="exp" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card donut-chart-section">
          <h4>Contenus par type</h4>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dataPie}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="custom-legend">
              {dataPie.map((item, i) => (
                <div key={i} className="legend-item">
                  <span className="dot" style={{backgroundColor: item.color}}></span>
                  <span className="label">{item.name}</span>
                  <span className="val">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <br />
        <br />
      </div>
    </div>
  );
}