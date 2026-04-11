'use client';
import React, { useState, useEffect } from 'react';
import { createFactureAction, getFacturesAction, deleteFactureAction, getClientsAction } from './factureAction';

interface Prestation {
  description: string;
  prixUnitaire: number;
  quantite: number;
}

interface ClientSuggestion {
  nom: string;
  contact: string;
  adresse: string;
}

interface Facture {
  dbId?: string;
  id: string;
  client: string;
  clientContact: string;
  clientAdresse: string;
  senderNom?: string;
  senderAdresse?: string;
  senderContact?: string;
  senderIfu?: string;      // Ajouté
  senderAutre?: string;    // Ajouté
  tvaRate: number; 
  prestations: Prestation[];
  devise: string;
  date: string;
  echeance: string;
}

export default function FacturesPage() {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [savedClients, setSavedClients] = useState<ClientSuggestion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    clientContact: '',
    clientAdresse: '',
    echeance: '',
    devise: 'FCFA',
    prestations: [{ description: '', prixUnitaire: 0, quantite: 1 }] as Prestation[]
  });

  const loadData = async () => {
    const [factData, clientData] = await Promise.all([
      getFacturesAction(),
      getClientsAction()
    ]);
    setFactures(factData as Facture[]);
    setSavedClients(clientData as any);
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (isModalOpen) {
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);
      const echeanceAuto = nextMonth.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, echeance: echeanceAuto }));
    }
  }, [isModalOpen]);

  useEffect(() => {
    const scripts = [
      "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    ];
    scripts.forEach(src => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const s = document.createElement("script");
        s.src = src; s.async = true; document.body.appendChild(s);
      }
    });
  }, []);


  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

  const handleSelectSavedClient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNom = e.target.value;
    if (!selectedNom) return;
    const clientFound = savedClients.find(c => c.nom === selectedNom);
    if (clientFound) {
      setFormData({
        ...formData,
        client: clientFound.nom,
        clientContact: clientFound.contact,
        clientAdresse: clientFound.adresse
      });
    }
  };

  const addPrestationLine = () => {
    setFormData({ ...formData, prestations: [...formData.prestations, { description: '', prixUnitaire: 0, quantite: 1 }] });
  };

  const removePrestationLine = (index: number) => {
    const newPrestations = formData.prestations.filter((_, i) => i !== index);
    setFormData({ ...formData, prestations: newPrestations });
  };

  const updatePrestation = (index: number, field: keyof Prestation, value: string | number) => {
    const newPrestations = [...formData.prestations];
    newPrestations[index] = { ...newPrestations[index], [field]: value };
    setFormData({ ...formData, prestations: newPrestations });
  };

  const calculateTotalHT = (prestations: Prestation[]) => {
    return prestations.reduce((acc, curr) => acc + (curr.prixUnitaire * curr.quantite), 0);
  };

  const downloadPDF = async (item: Facture) => {
    setShowDownloadPopup(true); // <--- AJOUTÉ ICI
    const totalHT = calculateTotalHT(item.prestations);
    const montantTVA = totalHT * (item.tvaRate / 100);
    const totalTTC = totalHT + montantTVA; 

    const container = document.createElement('div');
    container.style.cssText = 'position:fixed; left:-9999px; width:800px; background:white;';
    document.body.appendChild(container);

    container.innerHTML = `
      <div style="padding: 50px; font-family: 'Open Sans', sans-serif; color: #000; border-left: 15px solid #c1daec; min-height: 1130px; position: relative; background: #eef3f7;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
          <div>
            <h2 style="font-family: 'Antonio', sans-serif; font-size: 26px; font-weight: bold; margin: 0; color: #000;">${(item.senderNom || "PichFlow Service").toUpperCase()}</h2>
            <p style="font-size: 12px; margin-top: 5px; color: #444; line-height: 1.4;">
    ${item.senderAdresse}<br>
    ${item.senderContact}
    ${item.senderIfu ? `<br>${item.senderIfu}` : ''}
    ${item.senderAutre ? `<br>${item.senderAutre}` : ''}
</p>
          </div>
          <div style="text-align: right;">
            <h2 style="font-family: 'Antonio', sans-serif; font-size: 45px; font-weight: 900; color: #000; margin: 0; line-height: 1;">FACTURE</h2>
            <p style="font-weight: bold; margin-top: 10px;">N°: ${item.id}</p>
          </div>
        </div> 

        <div style="display: flex; justify-content: space-between; margin-bottom: 40px; gap: 20px;">
          <div style="flex: 1; border: 1.5px solid #e9edf0; padding: 15px; border-radius: 2px;">
            <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px; color: #666; ">Informations</p>
            <p style="font-size: 13px; margin: 0;"><strong>DATE :</strong> ${item.date}</p>
            <p style="font-size: 13px; margin: 5px 0 0 0;"><strong>ÉCHÉANCE :</strong> ${item.echeance}</p>
          </div>
          <div style="flex: 1; border: 1.5px solid #e9edf0; text-align: right; padding: 15px; border-radius: 2px; background: #fdf2f822;">
            <p style="font-size: 10px; font-weight: 900; text-transform: uppercase; margin-bottom: 8px; color: #666; ">Destinataire</p>
            <p style="font-size: 16px; font-weight: 800; margin: 0;">${item.client.toUpperCase()}</p>
            <p style="font-size: 12px; margin-top: 5px; color: #444;">${item.clientContact}<br>${item.clientAdresse}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #a5d1f0; color: #000;">
              <th style="font-family: 'Antonio', sans-serif; text-align: left; padding: 12px; font-size: 12px; color: #333232; text-transform: uppercase; letter-spacing: 0.5px;">Libellé / Description</th>
              <th style="font-family: 'Antonio', sans-serif; text-align: right; padding: 12px; font-size: 12px; color: #333232; border-left: 1px solid #d8d8d8; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">Prix Unitaire</th>
              <th style="font-family: 'Antonio', sans-serif; text-align: right; padding: 12px; font-size: 12px; color: #333232; border-left: 1px solid #d8d8d8; text-transform: uppercase; letter-spacing: 0.5px; width: 60px;">Qté</th>
              <th style="font-family: 'Antonio', sans-serif; text-align: right; padding: 12px; font-size: 12px; color: #333232; border-left: 1px solid #d8d8d8; text-transform: uppercase; letter-spacing: 0.5px; width: 120px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${item.prestations.map((p, index) => {
              const verticalDivider = 'border-left: 1px solid #eceaea;';
              return `
                <tr style="border-bottom: 1px solid #eceaea;">
                  <td style="padding: 15px 12px; border: none; vertical-align: top;">
                    <div style="font-weight: 700; font-size: 13px; color: #000;">${p.description}</div>
                  </td>
                  <td style="padding: 15px 12px; text-align: right; ${verticalDivider} font-size: 13px; vertical-align: top;">${p.prixUnitaire.toLocaleString()} ${item.devise}</td>
                  <td style="padding: 15px 12px; text-align: right; ${verticalDivider} font-size: 13px; vertical-align: top;">${p.quantite}</td>
                  <td style="padding: 15px 12px; text-align: right; font-weight: 700; ${verticalDivider} font-size: 13px; color: #000; vertical-align: top;">${(p.prixUnitaire * p.quantite).toLocaleString()} ${item.devise}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="margin-left: auto; width: 300px; margin-top: 30px; border: 1.5px solid #313030; background: #fff;">
          <div style="display: flex; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #eceaea;">
            <span style="font-size: 13px; color: #666;">Total HT :</span>
            <span style="font-size: 13px; font-weight: 700;">${totalHT.toLocaleString()} ${item.devise}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #eceaea;">
            <span style="font-size: 13px; color: #666;">TVA (${item.tvaRate}%) :</span>
            <span style="font-size: 13px; font-weight: 700;">${montantTVA.toLocaleString()} ${item.devise}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 15px 12px; background: #313030; color: #fff;">
            <span style="font-family: 'Antonio', sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase;">Total TTC :</span>
            <span style="font-size: 18px; font-weight: 900;">${totalTTC.toLocaleString()} ${item.devise}</span>
          </div>
        </div>

        <div style="position: absolute; bottom: 40px; left: 50px; width: calc(100% - 100px);">
          <div style="font-size: 11px; color: #555; line-height: 1.6; margin-bottom: 25px; max-width: 80%;">
            <p style="margin: 0 0 5px 0;">La facture devra être payée automatiquement ou dans les 30 jours à compter de la réalisation de la prestation ou de la réception de la marchandise.</p>
            <p style="margin: 0;">Le règlement par espèce, par chèque et par carte bancaire est accepté.</p>
          </div>
          <div style="text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px;">
             <p style="font-style: italic; font-size: 13px; color: #000; font-weight: 600; margin: 0;">Merci pour votre confiance !</p>
          </div>
        </div>
      </div>
    `;

    try {
      const canvas = await (window as any).html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new (window as any).jspdf.jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save(`Facture_${item.id}.pdf`);
    } finally { document.body.removeChild(container); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await createFactureAction(formData);
    if (res.success) {
      await loadData();
      setIsModalOpen(false);
      setFormData({
        client:'', clientContact:'', clientAdresse:'', echeance:'', devise:'FCFA',
        prestations:[{description:'', prixUnitaire:0, quantite:1}]
      });
    } else {
      alert(res.error || "Erreur lors de la création");
    }
    setIsLoading(false);
  };

  const handleDelete = async (dbId: string) => {
    if (confirm("Supprimer définitivement cette facture ?")) {
      const res = await deleteFactureAction(dbId);
      if (res.success) await loadData();
    }
  };

  const filtered = factures.filter(f => 
    f.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="factures-container"> 
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content custom-modal">
            <h3>Nouvelle Facture</h3>
            <form onSubmit={handleSave} className="modern-form">
              <div className="form-section">
                <div style={{marginBottom: '10px'}}>
                    <label style={{fontSize: '11px', color: '#666', marginBottom: '4px', display: 'block'}}>CHOISIR UN CLIENT EXISTANT (OPTIONNEL)</label>
                    <select 
                        style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
                        onChange={handleSelectSavedClient}
                        defaultValue=""
                    >
                        <option value="" disabled>-- Sélectionner un client --</option>
                        {savedClients.map((c, i) => (
                            <option key={i} value={c.nom}>{c.nom}</option>
                        ))}
                    </select>
                </div>

                <input type="text" placeholder="Nom du Client" required value={formData.client} onChange={(e)=>setFormData({...formData, client: e.target.value})} className="main-input" />
                <div className="row">
                  <input style={{width: '100%'}} type="text" placeholder="Contact (Tél/Email)" required value={formData.clientContact} onChange={(e)=>setFormData({...formData, clientContact: e.target.value})} /> 
                  <input style={{width: '100%'}} type="text" placeholder="Adresse Client" required value={formData.clientAdresse} onChange={(e)=>setFormData({...formData, clientAdresse: e.target.value})} />
                </div>
                <div className="row">
                  <div style={{width: '100%'}}>
                    <label style={{fontSize: '11px', color: '#666', marginBottom: '4px', display: 'block'}}>DATE D'ÉCHÉANCE (Auto +30j)</label>
                    <input style={{textTransform: 'uppercase', width: '100%'}} type="date" required value={formData.echeance} onChange={(e)=>setFormData({...formData, echeance: e.target.value})} />
                  </div>
                  <div style={{width: '100%'}}>
                    <label style={{fontSize: '11px', color: '#666', marginBottom: '4px', display: 'block'}}>DEVISE</label>
                    <select style={{width: '100%'}} value={formData.devise} onChange={(e)=>setFormData({...formData, devise: e.target.value})}>
                       <option value="FCFA">FCFA</option>
                       <option value="€">EUR (€)</option>
                       <option value="$">USD ($)</option>
                    </select>
                  </div>
                </div>
              </div>  

              <div className="prestations-list">
                <label>Prestations</label>
                <div className="prestations-scroll-area">
                  {formData.prestations.map((p, index) => (
                    <div key={index} className="prestation-row" style={{position: 'relative'}}>
                      <input type="text" placeholder="Description" value={p.description} onChange={(e) => updatePrestation(index, 'description', e.target.value)} required />
                      <div className="row-inner" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                         <input type="number" placeholder="Prix unitaire" min="0" step="1" onChange={(e) => updatePrestation(index, 'prixUnitaire', Math.max(0, parseFloat(e.target.value)))} required />
                         <input type="number" placeholder="Qté" min="1" onChange={(e) => updatePrestation(index, 'quantite', Math.max(1, parseInt(e.target.value)))} required />
                         {index !== 0 && (
                           <button type="button" onClick={() => removePrestationLine(index)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px'}}>
                             <i className="fa-solid fa-trash-can"></i>
                           </button>
                         )}
                      </div>
                      <hr className="separator" />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addPrestationLine} className="btn-add-line">+ Ajouter une autre prestation</button>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={()=>setIsModalOpen(false)} className="btn-cancel">Fermer</button>
                <button type="submit" disabled={isLoading} className="btn-submit">
                  <i className="fa-solid fa-coins"></i> 5 {isLoading ? "Création..." : "Créer "} 
                </button>
              </div>
            </form>
          </div>
        </div>
      )} 

      <div className="table-toolbar">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Rechercher par nom ou numéro..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
        </div>
        <button className="btn-new" onClick={() => { setIsModalOpen(true); }}>
          + Nouvelle Facture 
        </button>
      </div>

      <div className="div-table-container">
        <div className="div-table-header">
          <div className="col-id">N°</div>
          <div className="col-client">Client</div>
          <div className="col-desc">Description (Prestations)</div>
          <div className="col-date">Date Émission</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="div-table-body">  
          {filtered.length > 0 ? filtered.map((f) => (
            <div className="div-table-row" key={f.dbId}>
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
                <button onClick={() => f.dbId && handleDelete(f.dbId)} title="Supprimer"><i className="fa-solid fa-trash-can" style={{color: '#ef4444'}}></i></button>
              </div>
            </div>
          )) : (
            <div style={{padding:'20px', textAlign:'center', color:'#888'}}>Aucune facture trouvée.</div>
          )} 
        </div> <br /> <br /> <br />
      </div> 

      {/* --- POPUP DE TÉLÉCHARGEMENT AJOUTÉ ICI --- */}
      {showDownloadPopup && (
        <div className="download-popup-overlay">
          <div className="download-popup-content">
            <button className="download-popup-close" onClick={() => setShowDownloadPopup(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="download-popup-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h4>Téléchargement lancé</h4>
            <p>Votre facture est en cours de préparation.</p>
            <button className="download-popup-btn" onClick={() => setShowDownloadPopup(false)}>
              D'accord
            </button>
          </div>
        </div>
      )}
    </div>
  );
}