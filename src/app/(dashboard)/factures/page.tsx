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

  // Chargement de html2canvas pour la capture d'image
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
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
    setFormData({ client: item.client, montant: item.montant, devise: item.devise, echeance: item.echeance, statut: item.statut });
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
    setFormData({ client: '', montant: '', devise: '€', echeance: '', statut: 'En attente' });
  };

  // --- LOGIQUE DE TÉLÉCHARGEMENT EN IMAGE (PNG) ---
  const downloadAsImage = (item: Facture) => {
    const savedInfo = localStorage.getItem('pichflow_sender_info');
    const sender = savedInfo ? JSON.parse(savedInfo) : {
      nomService: 'PichFlow Service',
      adresse: 'Adresse non configurée',
      contact: 'Contact non configuré'
    };

    // On crée l'élément de la facture de manière invisible pour la capture
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.backgroundColor = 'white';
    document.body.appendChild(container);

    container.innerHTML = `
      <div style="padding: 50px; font-family: Arial, sans-serif; color: #1a202c; background: white;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
          <div>
            <h1 style="color: #2563eb; font-size: 28px; font-weight: 800; margin: 0;">${sender.nomService.toUpperCase()}</h1>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px; line-height: 1.5;">
              ${sender.adresse}<br>${sender.contact}
            </p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 32px; color: #cbd5e1; font-weight: 300;">FACTURE</h2>
            <p style="margin: 0; font-weight: 700; color: #1a202c;">#${item.id}</p>
          </div>
        </div>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 40px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 50px;">
          <div style="width: 45%;">
            <p style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px;">Facturé à</p>
            <p style="margin: 0; font-size: 16px; font-weight: 700; color: #da0b0b;">${item.client}</p>
          </div>
          <div style="text-align: right; width: 45%;">
            <p style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px;">Détails</p>
            <p style="margin: 0; font-size: 13px;">Date : <strong>${item.date}</strong></p>
            <p style="margin: 5px 0; font-size: 13px;">Échéance : <strong style="color: #ef4444;">${item.echeance}</strong></p>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr style="background: #f8fafc;">
              <th style="padding: 12px; text-align: left; font-size: 11px; color: #64748b; border-bottom: 2px solid #e2e8f0;">DESCRIPTION</th>
              <th style="padding: 12px; text-align: right; font-size: 11px; color: #64748b; border-bottom: 2px solid #e2e8f0;">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 20px 12px; border-bottom: 1px solid #f1f5f9;">
                <p style="margin: 0; font-weight: 700; font-size: 14px;">Prestations de services digitaux</p>
                <p style="margin: 5px 0 0 0; font-size: 12px; color: #64748b;">Généré via PichFlow.</p>
              </td>
              <td style="padding: 20px 12px; text-align: right; border-bottom: 1px solid #f1f5f9; font-weight: 700;">
                ${item.montant} ${item.devise}
              </td>
            </tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: flex-end;">
          <div style="width: 250px; background: #f8fafc; padding: 20px; border-radius: 12px;">
            <div style="display: flex; justify-content: space-between; font-weight: 700;">
              <span>TOTAL NET</span>
              <span style="color: #2563eb;">${item.montant} ${item.devise}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // @ts-ignore
    window.html2canvas(container, { scale: 2, useCORS: true, backgroundColor: "#ffffff" }).then(canvas => {
      const link = document.createElement('a');
      link.download = `Facture_${item.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      document.body.removeChild(container);
    });
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

      {/* TON TABLEAU : Structure et CSS 100% préservés */}
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
                {/* Appel de la fonction IMAGE ici */}
                <button onClick={() => downloadAsImage(item)} title="Télécharger IMAGE"><i className="fa-solid fa-image" style={{color: '#10b981'}}></i></button>
                <button onClick={() => handleDelete(item.id)} title="Supprimer"><i className="fa-solid fa-trash-can" style={{color: '#ef4444'}}></i></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <br /><br /><br />
    </div>
  );
}