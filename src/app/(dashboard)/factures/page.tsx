'use client';
import React, { useState, useEffect } from 'react';

interface Prestation {
  description: string;
  prixUnitaire: number;
  quantite: number;
}

interface Facture {
  id: string;
  client: string;
  prestations: Prestation[];
  devise: string;
  date: string;
  echeance: string;
}

export default function FacturesPage() {
  const [factures, setFactures] = useState<Facture[]>([
    { 
      id: 'INV-2026-034', 
      client: 'Client ABC', 
      prestations: [{ description: 'Développement Site', prixUnitaire: 1250, quantite: 1 }], 
      devise: '€', 
      date: '15 Jan 2026', 
      echeance: '2026-01-30' 
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);

  // Formulaire avec gestion de plusieurs prestations
  const [formData, setFormData] = useState({
    client: '',
    echeance: '',
    devise: '€',
    prestations: [{ description: '', prixUnitaire: 0, quantite: 1 }] as Prestation[]
  });

  useEffect(() => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    ];
    scripts.forEach(src => {
      const s = document.createElement("script");
      s.src = src; s.async = true; document.body.appendChild(s);
    });
  }, []);

  const addPrestationLine = () => {
    setFormData({ ...formData, prestations: [...formData.prestations, { description: '', prixUnitaire: 0, quantite: 1 }] });
  };

  const updatePrestation = (index: number, field: keyof Prestation, value: string | number) => {
    const newPrestations = [...formData.prestations];
    newPrestations[index] = { ...newPrestations[index], [field]: value };
    setFormData({ ...formData, prestations: newPrestations });
  };

  const calculateTotal = (prestations: Prestation[]) => {
    return prestations.reduce((acc, curr) => acc + (curr.prixUnitaire * curr.quantite), 0);
  };

  const downloadPDF = async (item: Facture) => {
    const savedInfo = localStorage.getItem('pichflow_sender_info');
    const sender = savedInfo ? JSON.parse(savedInfo) : { nomService: 'PichFlow Service', adresse: 'Adresse Pro', contact: 'Contact' };

    const totalHT = calculateTotal(item.prestations);
    const tva = totalHT * 0.05; // TVA 5%
    const totalTTC = totalHT + tva;

    const container = document.createElement('div');
    container.style.cssText = 'position:fixed; left:-9999px; width:800px; background:white;';
    document.body.appendChild(container);

    container.innerHTML = `
      <div style="padding: 50px; font-family: 'Helvetica', Arial; color: #000; border: 15px solid #fdf2f8; min-height: 1050px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
          <div>
            <h1 style="font-size: 32px; font-weight: 900; margin: 0;">${sender.nomService.toUpperCase()}</h1>
            <p style="font-size: 12px; margin-top: 10px;">${sender.adresse}<br>${sender.contact}</p>
          </div>
          <h2 style="font-size: 50px; font-weight: 900; color: #000; margin: 0;">FACTURE</h2>
        </div>

        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; font-weight: bold; font-size: 14px;">
          <div>DATE : ${item.date} <br> ÉCHÉANCE : ${item.echeance}</div>
          <div>FACTURE N° : ${item.id}</div>
        </div>

        <div style="margin-bottom: 50px; text-align: right;">
          <p style="font-size: 11px; font-weight: 900; text-transform: uppercase;">Destinataire :</p>
          <p style="font-size: 16px; font-weight: bold;">${item.client}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 2px solid #000;">
              <th style="text-align: left; padding: 10px; font-size: 12px;">DESCRIPTION</th>
              <th style="text-align: right; padding: 10px; font-size: 12px;">PRIX UNITAIRE</th>
              <th style="text-align: right; padding: 10px; font-size: 12px;">QTÉ</th>
              <th style="text-align: right; padding: 10px; font-size: 12px;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            ${item.prestations.map(p => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 15px 10px; font-weight: bold;">${p.description}</td>
                <td style="padding: 15px 10px; text-align: right;">${p.prixUnitaire} ${item.devise}</td>
                <td style="padding: 15px 10px; text-align: right;">${p.quantite}</td>
                <td style="padding: 15px 10px; text-align: right; font-weight: bold;">${(p.prixUnitaire * p.quantite).toFixed(2)} ${item.devise}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-left: auto; width: 300px; margin-top: 40px;">
          <div style="display: flex; justify-content: space-between; padding: 5px 0;"><span>TOTAL HT :</span><span>${totalHT.toFixed(2)} ${item.devise}</span></div>
          <div style="display: flex; justify-content: space-between; padding: 5px 0; color: #666;"><span>TVA (5%) :</span><span>${tva.toFixed(2)} ${item.devise}</span></div>
          <div style="display: flex; justify-content: space-between; border-top: 2px solid #000; padding: 10px 0; font-size: 20px; font-weight: 900;">
            <span>TOTAL TTC :</span><span>${totalTTC.toFixed(2)} ${item.devise}</span>
          </div>
        </div>
      </div>
    `;

    try {
      // @ts-ignore
      const canvas = await window.html2canvas(container, { scale: 3 });
      const imgData = canvas.toDataURL('image/png');
      // @ts-ignore
      const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`Facture_${item.id}.pdf`);
    } finally { document.body.removeChild(container); }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const id = isEditing ? currentInvoiceId! : `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice: Facture = {
      ...formData,
      id,
      date: new Date().toLocaleDateString('fr-FR')
    };

    if (isEditing) setFactures(factures.map(f => f.id === id ? newInvoice : f));
    else setFactures([newInvoice, ...factures]);

    setIsModalOpen(false);
  };

  const filtered = factures.filter(f => f.client.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="factures-container">
      {/* MODAL RESPONSIVE */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content custom-modal">
            <h3>{isEditing ? 'Modifier la Facture' : 'Nouvelle Facture'}</h3>
            <form onSubmit={handleSave} className="modern-form">
              <div className="form-section">
                <input type="text" placeholder="Nom du Client" required value={formData.client} onChange={(e)=>setFormData({...formData, client: e.target.value})} className="main-input" />
                <div className="row">
                  <input type="date" placeholder='date' required  onChange={(e)=>setFormData({...formData, echeance: e.target.value})} />
                  <select  value={formData.devise} onChange={(e)=>setFormData({...formData, devise: e.target.value})}>
                    <option value="€">EUR (€)</option>
                    <option value="FCFA">FCFA</option>
                    <option value="$">USD ($)</option>
                  </select>
                </div>
              </div>

            <div className="prestations-list">
  <label>Prestations</label>
  
  {/* Nouveau conteneur avec défilement */}
  <div className="prestations-scroll-area">
    {formData.prestations.map((p, index) => (
      <div key={index} className="prestation-row">
        <input type="text" placeholder="Description"  onChange={(e) => updatePrestation(index, 'description', e.target.value)} required />
        <div className="row-inner">
           <input type="number" placeholder="Prix unitaire"  onChange={(e) => updatePrestation(index, 'prixUnitaire', parseFloat(e.target.value))} required />
           <input type="number" placeholder="Qté"  onChange={(e) => updatePrestation(index, 'quantite', parseInt(e.target.value))} required />
        </div>
        <hr className="separator" />
      </div>
    ))}
  </div>
    
  <button type="button" onClick={addPrestationLine} className="btn-add-line">+ Ajouter une autre prestation</button>
</div>

              <div className="modal-actions">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="btn-cancel">Fermer</button>
                <button type="submit" className="btn-submit">Créer la facture</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOOLBAR */}
      <div className="table-toolbar">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Rechercher un client..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
        </div>
        <button className="btn-new" onClick={() => { setFormData({client:'', echeance:'', devise:'€', prestations:[{description:'', prixUnitaire:0, quantite:1}]}); setIsEditing(false); setIsModalOpen(true); }}>
          + Nouvelle Facture
        </button>
      </div>

      {/* TABLE */}
      <div className="div-table-container">
        <div className="div-table-header">
          <div className="col-id">ID</div>
          <div className="col-client">Client</div>
          <div className="col-desc">Description (Prestations)</div>
          <div className="col-date">Date Émission</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="div-table-body">
  {filtered.map((f) => (
    <div className="div-table-row" key={f.id}>
      <div className="col-id font-bold" data-label="ID :">{f.id}</div>
      <div className="col-client font-bold" data-label="Client :">{f.client}</div>
      <div className="col-desc" data-label="Prestations :">
        {f.prestations.map((p, i) => (
          <div key={i} className="desc-tag">{p.description} (x{p.quantite})</div>
        ))}
      </div>
      <div className="col-date" data-label="Émission :">{f.date}</div>
      <div className="col-actions">
        <button onClick={() => downloadPDF(f)} title="Télécharger"><i className="fa fa-download" style={{color: '#e11d48'}}></i></button>
        <button onClick={() => { setFormData(f); setIsEditing(true); setCurrentInvoiceId(f.id); setIsModalOpen(true); }} title="Modifier"><i className="fa-solid fa-pen-to-square" style={{color: '#2563eb'}}></i></button>
        <button onClick={() => setFactures(factures.filter(x => x.id !== f.id))} title="Supprimer"><i className="fa-solid fa-trash-can" style={{color: '#ef4444'}}></i></button>
      </div>
    </div>
  ))}
</div>
      </div>
    </div>
  );
}