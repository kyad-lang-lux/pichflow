'use client';
import React, { useState, useEffect } from 'react';

interface Facture {
  id: string;
  client: string;
  motif: string;
  montant: string;
  devise: string;
  date: string;
  echeance: string;
  statut: string;
}

export default function FacturesPage() {
  const [factures, setFactures] = useState<Facture[]>([
    { id: 'INV-2026-034', client: 'Client ABC', motif: 'Développement Site E-commerce', montant: '1250', devise: '€', date: '15 Jan 2026', echeance: '2026-01-30', statut: 'Payée' },
    { id: 'INV-2026-033', client: 'Startup XYZ', motif: 'Consulting Marketing IA', montant: '3500', devise: '$', date: '10 Jan 2026', echeance: '2026-01-25', statut: 'En attente' },
    { id: 'INV-2026-032', client: 'Agency Pro', motif: 'Maintenance Serveur Annuelle', montant: '850', devise: 'FCFA', date: '05 Jan 2026', echeance: '2026-01-20', statut: 'En retard' },
  ]);

  useEffect(() => {
    const s1 = document.createElement("script");
    s1.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    s1.async = true;
    document.body.appendChild(s1);

    const s2 = document.createElement("script");
    s2.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s2.async = true;
    document.body.appendChild(s2);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hideValues, setHideValues] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    client: '', 
    motif: '', 
    montant: '', 
    devise: '€', 
    echeance: '', 
    statut: 'En attente' 
  });

  const downloadPDF = async (item: Facture) => {
    const savedInfo = localStorage.getItem('pichflow_sender_info');
    const sender = savedInfo ? JSON.parse(savedInfo) : {
      nomService: 'PichFlow Service',
      adresse: 'Adresse non configurée',
      contact: 'Contact non configuré'
    };

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.background = 'white';
    document.body.appendChild(container);

    const isPaid = item.statut === 'Payée';

    // Badge "PAYÉE" en filigrane
    const paidBadge = isPaid ? `
      <div style="position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); 
                  border: 8px solid #10b981; color: #10b981; padding: 10px 30px; font-size: 60px; 
                  font-weight: 900; letter-spacing: 5px; text-transform: uppercase; opacity: 0.15; 
                  border-radius: 15px; pointer-events: none; z-index: 0;">
        PAYÉE
      </div>
    ` : '';

    // Gestion dynamique de la ligne d'échéance
    const echeanceHTML = isPaid 
      ? `<p style="margin: 6px 0 0 0; font-size: 14px; color: #10b981;">Statut : <strong>RÉGLÉE</strong></p>`
      : `<p style="margin: 6px 0 0 0; font-size: 14px; color: #475569;">À régler avant le : <strong style="color: #ef4444;">${item.echeance}</strong></p>`;

    container.innerHTML = `
      <div style="padding: 60px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a202c; background: white; position: relative;">
        ${paidBadge}
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; position: relative; z-index: 1;">
          <div>
            <h1 style="color: #2563eb; font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -1px;">${sender.nomService.toUpperCase()}</h1>
            <p style="margin: 8px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
              ${sender.adresse}<br>${sender.contact}
            </p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 40px; color: #e2e8f0; font-weight: 200; letter-spacing: 2px;">FACTURE</h2>
            <p style="margin: 5px 0 0 0; font-weight: 700; color: #1e293b; font-size: 18px;">nº  ${item.id}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 60px; position: relative; z-index: 1;">
          <div style="width: 45%;">
            <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 1px;">Destinataire</p>
            <p style="margin: 0; font-size: 20px; font-weight: 700; color: #1e293b;">${item.client}</p>
          </div>
          <div style="text-align: right; width: 45%;">
            <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 1px;">Émission & Statut</p>
            <p style="margin: 0; font-size: 14px; color: #475569;">Émise le : <strong>${item.date}</strong></p>
            ${echeanceHTML}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; position: relative; z-index: 1;">
          <thead>
            <tr>
              <th style="padding: 15px; text-align: left; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9;">Description des prestations</th>
              <th style="padding: 15px; text-align: right; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; border-bottom: 2px solid #f1f5f9;">Montant Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 30px 15px; border-bottom: 1px solid #f1f5f9;">
                <p style="margin: 0; font-weight: 700; font-size: 16px; color: #1e293b;">${item.motif}</p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #64748b; line-height: 1.5;">Prestation réalisée par ${sender.nomService} via l'interface PitchFlow.</p>
              </td>
              <td style="padding: 30px 15px; text-align: right; border-bottom: 1px solid #f1f5f9; font-weight: 700; font-size: 18px; color: #1e293b;">
                ${item.montant} ${item.devise}
              </td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; position: relative; z-index: 1;">
          <div style="width: 250px; text-align: center;">
            <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 40px; letter-spacing: 1px;">Signature & Cachet</p>
            <div style="border-bottom: 1px dashed #cbd5e1; width: 100%; height: 20px;"></div>
          </div>

          <div style="width: 300px; padding: 20px 0; border-top: 3px solid #2563eb;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 14px; font-weight: 700; color: #64748b;">TOTAL ${isPaid ? 'RÉGLÉ' : 'À PAYER'}</span>
              <span style="font-size: 26px; font-weight: 900; color: #2563eb;">${item.montant} ${item.devise}</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 100px; text-align: center; color: #94a3b8; font-size: 11px; position: relative; z-index: 1;">
          <p>Merci pour votre confiance. En cas de question, contactez-nous via ${sender.contact}.</p>
        </div>
      </div>
    `;

    try {
      // @ts-ignore
      const canvas = await window.html2canvas(container, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      // @ts-ignore
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Facture_${item.id}.pdf`);
    } catch (e) { console.error(e); } 
    finally { document.body.removeChild(container); }
  };

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
      motif: item.motif, 
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
    setFormData({ client: '', motif: '', montant: '', devise: '€', echeance: '', statut: 'En attente' });
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
    const matchSearch = f.client.toLowerCase().includes(searchTerm.toLowerCase()) || f.motif.toLowerCase().includes(searchTerm.toLowerCase());
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
                  <input type="text" placeholder="Nom de l'entreprise ou client" required value={formData.client} onChange={(e)=>setFormData({...formData, client: e.target.value})} />
                </div>
                <div className="input-group full">
                  <label>Motif de la facture</label>
                  <input type="text" placeholder="Ex: Création de logo, Maintenance..." required value={formData.motif} onChange={(e)=>setFormData({...formData, motif: e.target.value})} />
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
            <input type="text" placeholder="Rechercher un client ou motif..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
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
          <button className="btn-new" onClick={()=>{setIsEditing(false); setFormData({ client: '', motif: '', montant: '', devise: '€', echeance: '', statut: 'En attente' }); setIsModalOpen(true);}}>+ Nouvelle</button>
        </div>
      </div>

      <div className="div-table-container">
        <div className="div-table-header">
          <div className="col-id">ID</div>
          <div className="col-client">Client / Motif</div>
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
              <div className="col-client" data-label="Client">
                <div className="font-bold">{item.client}</div>
                <div style={{fontSize: '12px', color: '#64748b'}}>{item.motif}</div>
              </div>
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
                <button onClick={() => downloadPDF(item)} title="Télécharger PDF"> {/* <i className="fa-solid fa-file-pdf" style={{color: '#e11d48'}}></i>  */}  <i className="fa fa-download"  style={{color: '#e11d48'}} ></i> </button>
                <button onClick={() => handleDelete(item.id)} title="Supprimer"><i className="fa-solid fa-trash-can" style={{color: '#ef4444'}}></i></button>
              </div>
            </div>
          ))}
        </div>
        <br /> <br /> <br />
      </div>
    </div>
  );
}