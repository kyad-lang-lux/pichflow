"use client";
import React, { useState, useEffect } from 'react';

interface Facture {
  id: string;
  client: string;
  montant: string;
  devise: string;
  date: string;
  echeance: string;
  statut: string;
}

export default function FacturesPage() {
  const [factures, setFactures] = useState<Facture[]>([
    { id: 'INV-2026-034', client: 'Client ABC', montant: '1250', devise: '€', date: '15 Jan 2026', echeance: '2026-01-30', statut: 'Payée' },
    { id: 'INV-2026-033', client: 'Startup XYZ', montant: '3500', devise: '$', date: '10 Jan 2026', echeance: '2026-01-25', statut: 'En attente' },
    { id: 'INV-2026-032', client: 'Agency Pro', montant: '850', devise: 'FCFA', date: '05 Jan 2026', echeance: '2026-01-20', statut: 'En retard' },
  ]);

  // Charger la bibliothèque PDF dynamiquement 
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hideValues, setHideValues] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ client: '', montant: '', devise: '€', echeance: '', statut: 'En attente' });

  const handleDelete = (id: string) => {
    if (window.confirm("Voulez-vous supprimer cette facture ?")) {
      setFactures(factures.filter(f => f.id !== id));
    }
  };

  const handleEditClick = (item: Facture) => {
    setIsEditing(true);
    setCurrentInvoiceId(item.id);
    setFormData({
      client: item.client,
      montant: item.montant,
      devise: item.devise,
      echeance: item.echeance,
      statut: item.statut
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();

    if (isEditing && currentInvoiceId) {
      setFactures(factures.map(f => f.id === currentInvoiceId ? { ...f, ...formData } : f));
    } else {
      const idAuto = `INV-${currentYear}-${Math.floor(1000 + Math.random() * 9000)}`;
      const dateToday = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
      const newInvoice: Facture = { ...formData, id: idAuto, date: dateToday };
      setFactures([newInvoice, ...factures]);
    }

    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentInvoiceId(null);
    setFormData({ client: '', montant: '', devise: '€', echeance: '', statut: 'En attente' });
  };

  // --- LOGIQUE DE TÉLÉCHARGEMENT PDF RÉEL ---
  const downloadPDF = (item: Facture) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; color: #333;">
        <div style="display: flex; justify-content: space-between; border-bottom: 3px solid #2563eb; padding-bottom: 20px;">
          <h2 style="color: #2563eb; margin: 0;">PichFlow</h2>
          <div style="text-align: right;">
            <h1 style="margin: 0; font-size: 24px;">FACTURE</h1>
            <p style="margin: 0;">${item.id}</p>
          </div>
        </div>
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div>
            <p style="color: #666; margin-bottom: 5px;">ÉMETTEUR</p>
            <p><strong>Pichflow Service</strong><br></p>
          </div>
          <div style="text-align: right;">
            <p style="color: #666; margin-bottom: 5px;">CLIENT</p>
            <p><strong style="color: #da0b0b; ">${item.client}</strong></p>
            <p >Date: ${item.date}<br>Échéance: ${item.echeance}</p>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 50px;">
          <thead>
            <tr style="background: #f4f7fe;">
              <th style="padding: 15px; text-align: left; border-bottom: 2px solid #d1d5db;">Description</th>
              <th style="padding: 15px; text-align: right; border-bottom: 2px solid #d1d5db;">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 15px; border-bottom: 1px solid #eee;">Facture de prestation</td>
              <td style="padding: 15px; text-align: right;color: #da0b0b;  border-bottom: 1px solid #eeeeee;">${item.montant} ${item.devise}</td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top: 30px; text-align: right; font-size: 22px; font-weight: bold; color: #2563eb;">
          TOTAL : ${item.montant} ${item.devise}
        </div>
        <div style="margin-top: 100px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
          Facture officielle générée par PitchFlow. Statut : ${item.statut}
        </div>
      </div>
    `;

    // Configuration de html2pdf 
    const options = {
      margin: 0,
      filename: `Facture_${item.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // @ts-ignore
    window.html2pdf().set(options).from(element).save();
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setFactures(factures.map(f => f.id === id ? { ...f, statut: newStatus } : f));
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Payée': return 'status-paid';
      case 'En retard': return 'status-late';
      default: return 'status-pending';
    }
  };

  const filteredFactures = factures.filter(f => {
    const matchSearch = f.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Tous' || f.statut === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="factures-container">
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Modifier la Facture' : 'Nouvelle Facture'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="input-group full">
                  <label>Client</label>
                  <input type="text" required value={formData.client} onChange={(e)=>setFormData({...formData, client: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Montant</label>
                  <input type="number" required value={formData.montant} onChange={(e)=>setFormData({...formData, montant: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Devise</label>
                  <select value={formData.devise} onChange={(e)=>setFormData({...formData, devise: e.target.value})}>
                    <option value="€">EUR (€)</option>
                    <option value="FCFA">FCFA</option>
                    <option value="$">USD ($)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Échéance</label>
                  <input type="date" required value={formData.echeance} onChange={(e)=>setFormData({...formData, echeance: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Statut</label>
                  <select value={formData.statut} onChange={(e)=>setFormData({...formData, statut: e.target.value})}>
                    <option value="En attente">En attente</option>
                    <option value="Payée">Payée</option>
                    <option value="En retard">En retard</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={()=>{setIsModalOpen(false); setIsEditing(false);}}>Annuler</button>
                <button type="submit" className="btn-submit">{isEditing ? 'Mettre à jour' : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-toolbar">
        <div className="toolbar-actions">
          <div className="search-box">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Rechercher un client..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-group">
            <i className="fa-solid fa-filter"></i>
            <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}>
              <option value="Tous">Tous les statuts</option>
              <option value="Payée">Payée</option>
              <option value="En attente">En attente</option>
              <option value="En retard">En retard</option>
            </select>
          </div>
          <button className="btn-new" onClick={()=>{setIsEditing(false); setFormData({ client: '', montant: '', devise: '€', echeance: '', statut: 'En attente' }); setIsModalOpen(true);}}>+ Nouvelle</button>
        </div>
      </div>

      <div className="div-table-container">
        <div className="div-table-header">
          <div className="col-id">ID</div>
          <div className="col-client">Client</div>
          <div className="col-montant">Montant</div>
          <div className="col-date">Date</div>
          <div className="col-echeance">Échéance</div>
          <div className="col-statut">Statut (Modifiable)</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="div-table-body">
          {filteredFactures.map((item) => (
            <div className="div-table-row" key={item.id}>
              <div className="col-id font-bold" data-label="ID">{item.id}</div>
              <div className="col-client" data-label="Client">{item.client}</div>
              <div className="col-montant font-bold" data-label="Montant">
                {hideValues ? '****' : `${item.montant} ${item.devise}`}
              </div>
              <div className="col-date" data-label="Date">{item.date}</div>
              <div className="col-echeance" data-label="Échéance">{item.echeance}</div>
              <div className="col-statut" data-label="Statut">
                <select 
                  className={`status-select-inline ${getStatusClass(item.statut)}`}
                  value={item.statut}
                  onChange={(e) => handleStatusChange(item.id, e.target.value)}
                >
                  <option value="Payée">Payée</option>
                  <option value="En attente">En attente</option>
                  <option value="En retard">En retard</option>
                </select>
              </div> 
              <div className="col-actions">
                <button onClick={() => setHideValues(!hideValues)} title="Masquer"><i className={`fa-regular ${hideValues ? 'fa-eye-slash':'fa-eye'}`}></i></button>
                <button onClick={() => handleEditClick(item)} title="Modifier"><i className="fa-solid fa-pen-to-square" style={{color: '#2563eb'}}></i></button>
                <button onClick={() => downloadPDF(item)} title="Télécharger PDF"><i className="fa-solid fa-file-pdf" style={{color: '#e11d48'}}></i></button>
                <button onClick={() => handleDelete(item.id)} title="Supprimer"><i className="fa-solid fa-trash-can" style={{color: '#ef4444'}}></i></button>
              </div>
            </div>
          ))}
        </div>
      </div>


      <br />
      <br />
      <br />
    </div>
  );
}