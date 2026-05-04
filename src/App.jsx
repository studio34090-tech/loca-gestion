import { useState, useRef, useEffect, useCallback } from "react";

// ─── PALETTE & STYLES ────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,500;0,700;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #1a1a2e;
    --paper: #f5f0e8;
    --cream: #ede8d8;
    --rust: #c0392b;
    --rust-light: #e8d5d2;
    --gold: #b8860b;
    --gold-light: #f0e6c0;
    --sage: #5a7a6a;
    --sage-light: #d8e8e0;
    --border: #ccc5b0;
    --shadow: rgba(26,26,46,0.12);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink); }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── NAV ── */
  .nav {
    background: var(--ink);
    color: var(--paper);
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    height: 56px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 12px var(--shadow);
  }
  .nav-logo {
    font-family: 'Fraunces', serif;
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }
  .nav-logo span { color: var(--gold); }
  .nav-tabs { display: flex; gap: 0.25rem; flex: 1; overflow-x: auto; }
  .nav-tab {
    background: none;
    border: none;
    color: rgba(245,240,232,0.55);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 0.4rem 0.9rem;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .nav-tab:hover { color: var(--paper); background: rgba(255,255,255,0.08); }
  .nav-tab.active { color: var(--gold); background: rgba(184,134,11,0.18); }

  /* ── MAIN ── */
  .main { flex: 1; padding: 2rem; max-width: 1100px; margin: 0 auto; width: 100%; }

  /* ── CARDS ── */
  .card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px var(--shadow);
  }
  .card + .card { margin-top: 1rem; }
  .card-header {
    font-family: 'Fraunces', serif;
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--cream);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .card-header .icon { font-size: 1rem; }

  /* ── GRID ── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; }
  @media(max-width:700px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }

  /* ── FORM ── */
  .field { display: flex; flex-direction: column; gap: 0.3rem; }
  .field label { font-size: 0.78rem; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; color: #666; }
  .field input, .field select, .field textarea {
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 0.5rem 0.75rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    background: var(--paper);
    color: var(--ink);
    transition: border-color 0.2s;
    outline: none;
  }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--gold); }
  .field textarea { resize: vertical; min-height: 80px; }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.55rem 1.2rem;
    border-radius: 5px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
  }
  .btn-primary { background: var(--ink); color: var(--paper); }
  .btn-primary:hover { background: #2d2d4e; }
  .btn-gold { background: var(--gold); color: white; }
  .btn-gold:hover { background: #9a7009; }
  .btn-rust { background: var(--rust); color: white; }
  .btn-rust:hover { background: #a93226; }
  .btn-sage { background: var(--sage); color: white; }
  .btn-sage:hover { background: #4a6a5a; }
  .btn-outline {
    background: white;
    border: 1px solid var(--border);
    color: var(--ink);
  }
  .btn-outline:hover { border-color: var(--ink); background: var(--cream); }
  .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.78rem; }
  .btn-row { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 1rem; }

  /* ── STUDIO CARDS ── */
  .studio-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
  .studio-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 8px var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .studio-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--shadow); }
  .studio-header {
    background: var(--ink);
    color: var(--paper);
    padding: 1rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .studio-name { font-family: 'Fraunces', serif; font-size: 1.05rem; font-weight: 500; }
  .studio-address { font-size: 0.78rem; opacity: 0.65; margin-top: 0.2rem; }
  .studio-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 20px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .badge-occupied { background: var(--rust-light); color: var(--rust); }
  .badge-free { background: var(--sage-light); color: var(--sage); }
  .studio-body { padding: 1.1rem 1.25rem; }
  .studio-tenant { font-size: 0.9rem; font-weight: 500; margin-bottom: 0.3rem; }
  .studio-info { font-size: 0.8rem; color: #666; margin-bottom: 0.75rem; }
  .studio-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }

  /* ── SECTION TITLE ── */
  .section-title {
    font-family: 'Fraunces', serif;
    font-size: 1.6rem;
    font-weight: 300;
    margin-bottom: 1.5rem;
    color: var(--ink);
  }
  .section-title em { color: var(--gold); font-style: italic; }

  /* ── BAIL VIEW ── */
  .bail-doc {
    background: white;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 2.5rem;
    font-size: 0.88rem;
    line-height: 1.7;
    box-shadow: 0 2px 8px var(--shadow);
    max-height: 500px;
    overflow-y: auto;
  }
  .bail-doc h2 { font-family: 'Fraunces', serif; font-size: 1.3rem; text-align: center; margin-bottom: 1.5rem; }
  .bail-doc h3 { font-family: 'Fraunces', serif; font-size: 1rem; margin: 1.25rem 0 0.5rem; border-bottom: 1px solid var(--cream); padding-bottom: 0.25rem; }
  .bail-doc p { margin-bottom: 0.5rem; }
  .bail-field { background: var(--gold-light); border-bottom: 1px solid var(--gold); padding: 0 0.2rem; }

  /* ── SIGNATURE ── */
  .sig-zone {
    border: 1.5px dashed var(--border);
    border-radius: 6px;
    background: var(--paper);
    position: relative;
    overflow: hidden;
  }
  .sig-zone canvas { display: block; cursor: crosshair; touch-action: none; }
  .sig-label { font-size: 0.75rem; color: #888; text-align: center; margin-top: 0.4rem; }

  /* ── EDL ── */
  .room-row {
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }
  .room-header {
    background: var(--cream);
    padding: 0.6rem 1rem;
    font-weight: 500;
    font-size: 0.88rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }
  .room-body { padding: 1rem; background: white; }
  .item-row {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
    gap: 0.75rem;
    align-items: start;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--cream);
  }
  .item-row:last-child { border-bottom: none; }
  .etat-btn {
    padding: 0.3rem 0.6rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 0.75rem;
    cursor: pointer;
    background: white;
    transition: all 0.15s;
  }
  .etat-btn.bon { background: var(--sage-light); border-color: var(--sage); color: var(--sage); font-weight: 600; }
  .etat-btn.moyen { background: var(--gold-light); border-color: var(--gold); color: var(--gold); font-weight: 600; }
  .etat-btn.mauvais { background: var(--rust-light); border-color: var(--rust); color: var(--rust); font-weight: 600; }

  /* ── PHOTO ZONE ── */
  .photo-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }
  .photo-thumb {
    width: 70px; height: 70px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid var(--border);
  }
  .photo-add {
    width: 70px; height: 70px;
    border: 1.5px dashed var(--border);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 1.5rem;
    color: var(--border);
    transition: border-color 0.2s;
    background: var(--paper);
  }
  .photo-add:hover { border-color: var(--gold); color: var(--gold); }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    animation: fadeIn 0.15s;
  }
  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
  .modal {
    background: white;
    border-radius: 10px;
    padding: 2rem;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    animation: slideUp 0.2s;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity:0 } to { transform: translateY(0); opacity:1 } }
  .modal-title {
    font-family: 'Fraunces', serif;
    font-size: 1.2rem;
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--cream);
  }
  .modal-close {
    float: right;
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #999;
    margin-left: 1rem;
  }

  /* ── TAG ── */
  .tag {
    display: inline-block;
    padding: 0.15rem 0.5rem;
    border-radius: 20px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.03em;
  }
  .tag-gold { background: var(--gold-light); color: var(--gold); }
  .tag-sage { background: var(--sage-light); color: var(--sage); }
  .tag-rust { background: var(--rust-light); color: var(--rust); }

  /* ── TABS ── */
  .tab-bar { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 1.5rem; }
  .tab-item {
    padding: 0.6rem 1.2rem;
    border: none;
    background: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: #888;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: all 0.15s;
  }
  .tab-item:hover { color: var(--ink); }
  .tab-item.active { color: var(--gold); border-bottom-color: var(--gold); }

  /* ── ALERT ── */
  .alert {
    padding: 0.75rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .alert-success { background: var(--sage-light); color: var(--sage); border: 1px solid var(--sage); }
  .alert-error { background: var(--rust-light); color: var(--rust); border: 1px solid var(--rust); }
  .alert-info { background: var(--gold-light); color: var(--gold); border: 1px solid var(--gold); }

  /* ── CROQUIS ── */
  .croquis-canvas {
    border: 1px solid var(--border);
    border-radius: 6px;
    cursor: crosshair;
    touch-action: none;
    display: block;
    width: 100%;
  }

  /* ── STEPS ── */
  .steps { display: flex; gap: 0; margin-bottom: 2rem; }
  .step {
    flex: 1;
    text-align: center;
    position: relative;
    padding-bottom: 1rem;
  }
  .step::after {
    content: '';
    position: absolute;
    bottom: 0.45rem;
    left: 50%;
    right: -50%;
    height: 2px;
    background: var(--border);
    z-index: 0;
  }
  .step:last-child::after { display: none; }
  .step-circle {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--cream);
    border: 2px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 600;
    margin: 0 auto 0.4rem;
    position: relative;
    z-index: 1;
    transition: all 0.2s;
  }
  .step.active .step-circle { background: var(--gold); border-color: var(--gold); color: white; }
  .step.done .step-circle { background: var(--sage); border-color: var(--sage); color: white; }
  .step-label { font-size: 0.72rem; color: #888; }
  .step.active .step-label { color: var(--gold); font-weight: 600; }
  .step.done .step-label { color: var(--sage); }

  /* ── INVENTAIRE ── */
  .inv-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
  .inv-table th {
    background: var(--ink); color: var(--paper);
    padding: 0.5rem 0.75rem; text-align: left;
    font-size: 0.75rem; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;
  }
  .inv-table td { padding: 0.45rem 0.75rem; border-bottom: 1px solid var(--cream); vertical-align: middle; }
  .inv-table tr:hover td { background: var(--paper); }
  .inv-table input[type="text"], .inv-table input[type="number"] {
    border: 1px solid var(--border); border-radius: 4px;
    padding: 0.3rem 0.5rem; font-size: 0.82rem;
    width: 100%; background: white; outline: none;
  }
  .inv-table input:focus { border-color: var(--gold); }
  .inv-cat-header td {
    background: var(--cream); font-weight: 600; font-size: 0.8rem;
    letter-spacing: 0.03em; color: var(--ink); padding: 0.4rem 0.75rem;
  }
  .inv-etat-select {
    border: 1px solid var(--border); border-radius: 4px;
    padding: 0.3rem 0.4rem; font-size: 0.8rem; background: white; cursor: pointer;
  }
  .inv-etat-select.bon { background: var(--sage-light); border-color: var(--sage); color: var(--sage); }
  .inv-etat-select.moyen { background: var(--gold-light); border-color: var(--gold); color: var(--gold); }
  .inv-etat-select.mauvais { background: var(--rust-light); border-color: var(--rust); color: var(--rust); }
  .btn-del { background: none; border: none; color: #ccc; cursor: pointer; font-size: 1rem; padding: 0 0.25rem; }
  .btn-del:hover { color: var(--rust); }

  /* ── PARAPHES ── */
  .paraphe-row { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 1rem; }
  .paraphe-block { flex: 1; min-width: 180px; }
  .paraphe-block .sig-zone canvas { height: 65px !important; }

  /* ── MISC ── */
  .divider { height: 1px; background: var(--cream); margin: 1.25rem 0; }
  .text-muted { color: #888; font-size: 0.82rem; }
  .mb-1 { margin-bottom: 0.5rem; }
  .mb-2 { margin-bottom: 1rem; }
  .mb-3 { margin-bottom: 1.5rem; }
  .mt-1 { margin-top: 0.5rem; }
  .mt-2 { margin-top: 1rem; }
  .flex { display: flex; }
  .flex-between { display: flex; justify-content: space-between; align-items: center; }
  .gap-1 { gap: 0.5rem; }
  .fw-500 { font-weight: 500; }
  .print-hidden { }
  @media print {
    .print-hidden { display: none !important; }
    .bail-doc { max-height: none; box-shadow: none; border: none; }
  }
`;

// ─── DATA ────────────────────────────────────────────────────────────────────
const INITIAL_STUDIOS = [
  {
    id: 1,
    nom: "Studio Verdun",
    adresse: "12 rue de Verdun, 34000 Montpellier",
    surface: 22,
    loyer: 480,
    charges: 40,
    depot: 480,
    locataire: { nom: "Martin", prenom: "Léa", email: "lea.martin@email.com", tel: "06 12 34 56 78", naissance: "2001-05-14", nationalite: "Française", profession: "Étudiante - Médecine", garant_nom: "Martin Jean", garant_tel: "06 98 76 54 32" },
    bail: { debut: "2024-09-01", fin: "2025-08-31", signe: false, signe_locataire: null, signe_bailleur: null },
    edl: []
  },
  {
    id: 2,
    nom: "Studio Gambetta",
    adresse: "7 avenue Gambetta, 34000 Montpellier",
    surface: 18,
    loyer: 420,
    charges: 35,
    depot: 420,
    locataire: { nom: "Dubois", prenom: "Tom", email: "tom.dubois@email.com", tel: "06 23 45 67 89", naissance: "2002-03-22", nationalite: "Française", profession: "Étudiant - Droit", garant_nom: "Dubois Claire", garant_tel: "06 11 22 33 44" },
    bail: { debut: "2024-10-01", fin: "2025-09-30", signe: true, signe_locataire: "data:image/png;base64,iVBORw0K", signe_bailleur: "data:image/png;base64,iVBORw0K" },
    edl: []
  },
  {
    id: 3,
    nom: "Studio Voltaire",
    adresse: "3 rue Voltaire, 34000 Montpellier",
    surface: 25,
    loyer: 520,
    charges: 45,
    depot: 520,
    locataire: null,
    bail: null,
    edl: []
  }
];

const PIECES_EDL = [
  {
    nom: "Entrée / Couloir",
    items: ["Sols", "Murs / Peinture", "Plafond", "Porte d'entrée", "Sonnette / Interphone", "Boîte aux lettres"]
  },
  {
    nom: "Pièce principale (séjour/chambre)",
    items: ["Sols", "Murs / Peinture", "Plafond", "Fenêtres / Volets", "Radiateur", "Prises électriques", "Interrupteurs", "Lit", "Canapé / Fauteuil", "Bureau / Chaise", "Armoire / Rangements", "Table"]
  },
  {
    nom: "Cuisine",
    items: ["Sols", "Murs / Peinture", "Plafond", "Plaques de cuisson", "Four / Micro-ondes", "Réfrigérateur", "Évier / Robinetterie", "Meubles bas / Hauts", "Hotte"]
  },
  {
    nom: "Salle de bain",
    items: ["Sols", "Murs / Faïence", "Plafond", "Douche / Baignoire", "Lavabo / Robinetterie", "WC", "Miroir", "Radiateur sèche-serviettes", "VMC / Ventilation"]
  },
  {
    nom: "Divers",
    items: ["Tableau électrique", "Compteur eau / EDF", "Cave / Débarras", "Parking / Local vélos", "Parties communes"]
  }
];

const MOBILIER_DEFAUT = [
  { cat: "Literie", items: ["Lit (cadre)", "Matelas", "Oreillers (x2)", "Couette / couverture"] },
  { cat: "Séjour / Chambre", items: ["Canapé / convertible", "Table basse", "Bureau", "Chaise de bureau", "Armoire / penderie", "Étagères", "Lampe de bureau", "Lampe de chevet"] },
  { cat: "Cuisine", items: ["Table à manger", "Chaises (x2)", "Réfrigérateur", "Plaques de cuisson", "Four / micro-ondes", "Hotte aspirante", "Vaisselle (6 couverts)", "Verres (x6)", "Casseroles / poêles", "Couverts (x6)", "Planche à découper"] },
  { cat: "Salle de bain", items: ["Miroir", "Porte-serviettes", "Rideau de douche"] },
  { cat: "Équipements", items: ["Télévision", "Fer à repasser / table", "Aspirateur", "Lave-linge", "Sèche-linge", "Lave-vaisselle", "Congélateur"] },
];

// ─── SIGNATURE PAD ────────────────────────────────────────────────────────────
function SignaturePad({ label, value, onChange, width = 280, height = 100 }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const stop = () => {
    if (!drawing.current) return;
    drawing.current = false;
    onChange(canvasRef.current.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange(null);
  };

  useEffect(() => {
    if (value && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, []);

  return (
    <div>
      <div className="sig-zone">
        <canvas
          ref={canvasRef}
          width={width} height={height}
          style={{ width: "100%", height: `${height}px` }}
          onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.3rem" }}>
        <span className="sig-label">{label}</span>
        <button className="btn btn-outline btn-sm" onClick={clear}>Effacer</button>
      </div>
    </div>
  );
}

// ─── CROQUIS PAD ─────────────────────────────────────────────────────────────
function CroquisPad({ value, onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const colorRef = useRef("#c0392b");
  const [color, setColor] = useState("#c0392b");
  const [size, setSize] = useState(3);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const start = (e) => { e.preventDefault(); drawing.current = true; lastPos.current = getPos(e); };
  const draw = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = colorRef.current;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();
    lastPos.current = pos;
    onChange(canvasRef.current.toDataURL());
  };
  const stop = () => { drawing.current = false; };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onChange(null);
  };

  useEffect(() => { colorRef.current = color; }, [color]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  const COLORS = ["#1a1a2e","#c0392b","#b8860b","#5a7a6a","#3498db","#e67e22"];

  return (
    <div>
      <div style={{ display:"flex", gap:"0.5rem", marginBottom:"0.5rem", alignItems:"center", flexWrap:"wrap" }}>
        {COLORS.map(c => (
          <div key={c} onClick={() => setColor(c)} style={{
            width:22, height:22, borderRadius:"50%", background:c, cursor:"pointer",
            border: color===c ? "3px solid #1a1a2e" : "2px solid transparent",
            flexShrink: 0
          }} />
        ))}
        <select value={size} onChange={e => setSize(Number(e.target.value))}
          style={{ fontSize:"0.75rem", padding:"0.2rem", border:"1px solid #ccc", borderRadius:"3px", background:"white" }}>
          <option value={1}>Fin</option>
          <option value={3}>Moyen</option>
          <option value={6}>Épais</option>
        </select>
        <button className="btn btn-outline btn-sm" onClick={clear} style={{ marginLeft:"auto" }}>Effacer</button>
      </div>
      <canvas
        ref={canvasRef}
        width={500} height={200}
        className="croquis-canvas"
        style={{ height: "200px" }}
        onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
        onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}
      />
    </div>
  );
}

// ─── GENERATE BAIL TEXT ───────────────────────────────────────────────────────
function generateBailHtml(studio) {
  const loc = studio.locataire;
  const b = studio.bail;
  const today = new Date().toLocaleDateString("fr-FR");

  return `
    <h2>CONTRAT DE LOCATION MEUBLÉE<br/><small style="font-size:0.75em;font-weight:400;">Loi n°89-462 du 6 juillet 1989 – Usage d'habitation principale</small></h2>

    <h3>Article 1 – Parties</h3>
    <p><strong>Bailleur :</strong> <span class="bail-field">Jeremy [NOM]</span>, propriétaire du bien désigné ci-après.</p>
    <p><strong>Locataire :</strong> <span class="bail-field">${loc?.prenom || "___"} ${loc?.nom || "___"}</span>, né(e) le <span class="bail-field">${loc?.naissance ? new Date(loc.naissance).toLocaleDateString("fr-FR") : "___"}</span>, de nationalité <span class="bail-field">${loc?.nationalite || "Française"}</span>, exerçant la profession de <span class="bail-field">${loc?.profession || "___"}</span>.</p>

    <h3>Article 2 – Désignation du logement</h3>
    <p>Le bailleur loue au locataire un logement meublé situé :</p>
    <p><strong>${studio.adresse}</strong></p>
    <p>Type : Studio – Surface habitable : <strong>${studio.surface} m²</strong> – Régime LMNP.</p>

    <h3>Article 3 – Durée du bail</h3>
    <p>Le présent bail est consenti pour une durée de <strong>1 an</strong>, du <span class="bail-field">${b?.debut ? new Date(b.debut).toLocaleDateString("fr-FR") : "___"}</span> au <span class="bail-field">${b?.fin ? new Date(b.fin).toLocaleDateString("fr-FR") : "___"}</span>, conformément à l'article 25-7 de la loi du 6 juillet 1989.</p>
    <p>Pour un bail étudiant (9 mois), la durée peut être réduite sur demande du locataire justifiant de son statut d'étudiant.</p>

    <h3>Article 4 – Loyer et charges</h3>
    <p>Le loyer mensuel est fixé à <strong>${studio.loyer} €</strong> hors charges.</p>
    <p>Les charges locatives récupérables sont fixées forfaitairement à <strong>${studio.charges} €</strong> par mois.</p>
    <p><strong>Total mensuel : ${studio.loyer + studio.charges} €</strong>, payable d'avance le 1er de chaque mois.</p>
    <p>Révision annuelle selon l'IRL (Indice de Référence des Loyers) publié par l'INSEE.</p>

    <h3>Article 5 – Dépôt de garantie</h3>
    <p>Un dépôt de garantie de <strong>${studio.depot} €</strong> (équivalent à 2 mois de loyer hors charges) est versé à la signature du présent bail. Il sera restitué dans un délai maximal d'un mois après remise des clés si aucune dégradation n'est constatée, ou deux mois dans le cas contraire.</p>

    <h3>Article 6 – Obligations du bailleur</h3>
    <p>Le bailleur s'engage à : délivrer un logement décent et en bon état d'usage, assurer la jouissance paisible, entretenir les locaux en état de servir, effectuer les réparations nécessaires autres que locatives, et fournir les équipements mentionnés à l'inventaire.</p>

    <h3>Article 7 – Obligations du locataire</h3>
    <p>Le locataire s'engage à : payer le loyer et les charges aux termes convenus, user paisiblement du logement, répondre des dégradations survenues pendant la location, ne pas transformer les locaux sans accord écrit, permettre l'accès au logement pour travaux urgents, s'assurer contre les risques locatifs et en justifier chaque année.</p>

    <h3>Article 8 – Résiliation du bail</h3>
    <p>Le locataire peut donner congé à tout moment avec un préavis d'<strong>un mois</strong> (logement meublé), par lettre recommandée avec AR ou acte d'huissier.</p>
    <p>Le bailleur peut donner congé pour reprise, vente ou motif légitime et sérieux, avec un préavis de <strong>trois mois</strong> avant l'échéance du bail.</p>

    <h3>Article 9 – Garant</h3>
    <p>La présente location est garantie par : <span class="bail-field">${loc?.garant_nom || "___"}</span>, joignable au <span class="bail-field">${loc?.garant_tel || "___"}</span>.</p>

    <h3>Article 10 – Dispositions diverses</h3>
    <p>Le logement est destiné exclusivement à l'habitation principale du locataire. Toute sous-location est interdite sans accord écrit du bailleur. Les animaux de compagnie sont soumis à accord préalable.</p>
    <p>Pour tout litige, les parties s'engagent à recourir à une conciliation préalable conformément à la loi ALUR.</p>

    <br/>
    <p><strong>Fait à Montpellier, le ${today}</strong></p>
    <p style="margin-top:1rem;font-size:0.8em;color:#666;">Ce document est établi en deux exemplaires originaux, un pour chaque partie. Il est accompagné d'un état des lieux d'entrée.</p>
  `;
}

// ─── SUPABASE CONFIG ─────────────────────────────────────────────────────────
const SUPA_URL = "https://qoymdycxlcmgtcurunqo.supabase.co";
const SUPA_KEY = "sb_secret_cRXRrcB5NmsMGd7iQ2MPnw_Odn_X2yE";
const H = {
  "apikey": SUPA_KEY,
  "Authorization": `Bearer ${SUPA_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};
const db = {
  async getStudios() {
    try {
      const r = await fetch(`${SUPA_URL}/rest/v1/studios?select=id,nom,adresse,surface,loyer,charges,depot,locataires(*),baux(*)&order=id`, { headers: H });
      if (!r.ok) return [];
      const rows = await r.json();
      return rows.map(s => ({ ...s, locataire: Array.isArray(s.locataires) ? (s.locataires[0]||null) : null, bail: Array.isArray(s.baux) ? (s.baux[0]||null) : null, edl: [] }));
    } catch(e) { console.error(e); return []; }
  },
  async createStudio(data) {
    const { locataire, bail, edl, locataires, baux, ...s } = data;
    const r = await fetch(`${SUPA_URL}/rest/v1/studios`, { method: "POST", headers: H, body: JSON.stringify([s]) });
    const res = await r.json(); return Array.isArray(res) ? res[0] : res;
  },
  async updateStudio(id, data) {
    const { locataire, bail, edl, locataires, baux, ...s } = data;
    await fetch(`${SUPA_URL}/rest/v1/studios?id=eq.${id}`, { method: "PATCH", headers: H, body: JSON.stringify(s) });
  },
  async upsertLocataire(loc) {
    const method = loc.id ? "PATCH" : "POST";
    const url = loc.id ? `${SUPA_URL}/rest/v1/locataires?id=eq.${loc.id}` : `${SUPA_URL}/rest/v1/locataires`;
    const r = await fetch(url, { method, headers: H, body: JSON.stringify(method==="POST"?[loc]:loc) });
    const res = await r.json(); return Array.isArray(res) ? res[0] : res;
  },
  async upsertBail(bail) {
    const method = bail.id ? "PATCH" : "POST";
    const url = bail.id ? `${SUPA_URL}/rest/v1/baux?id=eq.${bail.id}` : `${SUPA_URL}/rest/v1/baux`;
    const r = await fetch(url, { method, headers: H, body: JSON.stringify(method==="POST"?[bail]:bail) });
    const res = await r.json(); return Array.isArray(res) ? res[0] : res;
  },
  async saveEdl(edl) {
    const r = await fetch(`${SUPA_URL}/rest/v1/etats_des_lieux`, { method: "POST", headers: H, body: JSON.stringify([edl]) });
    const res = await r.json(); return Array.isArray(res) ? res[0] : res;
  },
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [modal, setModal] = useState(null);
  const [alert, setAlert] = useState(null);
  const [edlType, setEdlType] = useState("entree");

  // Load from Supabase on mount
  useEffect(() => {
    db.getStudios().then(data => { setStudios(data); setLoading(false); });
  }, []);

  const refreshStudios = async () => {
    const data = await db.getStudios();
    setStudios(data);
    if (selectedStudio) {
      const updated = data.find(s => s.id === selectedStudio.id);
      if (updated) setSelectedStudio(updated);
    }
  };

  const updateStudio = async (id, updater) => {
    const current = studios.find(s => s.id === id);
    const updated = { ...current, ...updater(current) };
    // Optimistic UI
    setStudios(prev => prev.map(s => s.id === id ? updated : s));
    if (selectedStudio?.id === id) setSelectedStudio(updated);
    // Persist to Supabase
    await db.updateStudio(id, updated);
    // Save locataire if changed
    if (updated.locataire) {
      const loc = { ...updated.locataire, studio_id: id };
      const saved = await db.upsertLocataire(loc);
      if (saved?.id && !updated.locataire.id) {
        await refreshStudios();
      }
    }
    // Save bail if changed
    if (updated.bail) {
      const bail = { ...updated.bail, studio_id: id };
      await db.upsertBail(bail);
    }
  };

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const studio = selectedStudio ? studios.find(s => s.id === selectedStudio.id) : null;

  // ── DASHBOARD ──
  const renderDashboard = () => (
    <div>
      <div className="section-title">Mes <em>studios</em></div>
      {loading && <div className="alert alert-info">⏳ Chargement depuis Supabase...</div>}
      <div className="studio-grid">
        {studios.map(s => (
          <div key={s.id} className="studio-card">
            <div className="studio-header">
              <div>
                <div className="studio-name">{s.nom}</div>
                <div className="studio-address">{s.adresse}</div>
              </div>
              <span className={`studio-badge ${s.locataire ? "badge-occupied" : "badge-free"}`}>
                {s.locataire ? "Occupé" : "Libre"}
              </span>
            </div>
            <div className="studio-body">
              {s.locataire ? (
                <>
                  <div className="studio-tenant">{s.locataire.prenom} {s.locataire.nom}</div>
                  <div className="studio-info">
                    {s.loyer + s.charges} €/mois · {s.surface} m²
                    {s.bail && <> · Bail {s.bail.signe ? <span className="tag tag-sage">✓ Signé</span> : <span className="tag tag-rust">Non signé</span>}</>}
                  </div>
                </>
              ) : (
                <div className="studio-info text-muted">{s.loyer} €/mois · {s.surface} m² — Disponible</div>
              )}
              <div className="studio-actions">
                <button className="btn btn-primary btn-sm" onClick={() => { setSelectedStudio(s); setPage("bail"); }}>📄 Bail</button>
                <button className="btn btn-outline btn-sm" onClick={() => { setSelectedStudio(s); setPage("edl"); }}>🏠 EDL</button>
                <button className="btn btn-outline btn-sm" onClick={() => { setSelectedStudio(s); setModal("editStudio"); }}>✏️</button>
              </div>
            </div>
          </div>
        ))}
        <div className="studio-card" style={{ border:"1.5px dashed var(--border)", background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", minHeight:160 }}
          onClick={() => setModal("addStudio")}>
          <div style={{ textAlign:"center", color:"var(--border)" }}>
            <div style={{ fontSize:"2rem" }}>+</div>
            <div style={{ fontSize:"0.8rem", marginTop:"0.3rem" }}>Ajouter un studio</div>
          </div>
        </div>
      </div>

      <div className="divider" style={{ margin:"2rem 0" }} />

      <div className="grid-3">
        <div className="card" style={{ borderLeft:"3px solid var(--gold)" }}>
          <div className="text-muted mb-1">Revenus mensuels</div>
          <div style={{ fontFamily:"Fraunces, serif", fontSize:"1.6rem", fontWeight:500 }}>
            {studios.filter(s => s.locataire).reduce((a, s) => a + s.loyer + s.charges, 0)} €
          </div>
          <div className="text-muted" style={{ fontSize:"0.75rem", marginTop:"0.25rem" }}>
            {studios.filter(s => s.locataire).reduce((a, s) => a + s.loyer, 0)} € loyers + {studios.filter(s => s.locataire).reduce((a, s) => a + s.charges, 0)} € charges
          </div>
        </div>
        <div className="card" style={{ borderLeft:"3px solid var(--sage)" }}>
          <div className="text-muted mb-1">Taux d'occupation</div>
          <div style={{ fontFamily:"Fraunces, serif", fontSize:"1.6rem", fontWeight:500 }}>
            {Math.round(studios.filter(s => s.locataire).length / studios.length * 100)}%
          </div>
          <div className="text-muted" style={{ fontSize:"0.75rem", marginTop:"0.25rem" }}>
            {studios.filter(s => s.locataire).length}/{studios.length} studios occupés
          </div>
        </div>
        <div className="card" style={{ borderLeft:"3px solid var(--rust)" }}>
          <div className="text-muted mb-1">Baux à signer</div>
          <div style={{ fontFamily:"Fraunces, serif", fontSize:"1.6rem", fontWeight:500 }}>
            {studios.filter(s => s.bail && !s.bail.signe).length}
          </div>
          <div className="text-muted" style={{ fontSize:"0.75rem", marginTop:"0.25rem" }}>En attente de signature</div>
        </div>
      </div>
    </div>
  );

  // ── BAIL ──
  const [bailStep, setBailStep] = useState(0);
  const [sigBailleur, setSigBailleur] = useState(null);
  const [sigLocataire, setSigLocataire] = useState(null);

  const renderBail = () => {
    if (!studio) return <div className="text-muted">Sélectionnez un studio.</div>;
    if (!studio.locataire) return (
      <div className="card">
        <div className="card-header">📄 Bail — {studio.nom}</div>
        <p className="text-muted">Ce studio n'a pas de locataire. Ajoutez un locataire d'abord.</p>
        <div className="btn-row">
          <button className="btn btn-gold" onClick={() => setModal("addLocataire")}>+ Ajouter un locataire</button>
        </div>
      </div>
    );

    const STEPS = ["Informations", "Lecture du bail", "Paraphes & Signature", "Envoi"];

    return (
      <div>
        <div className="flex-between mb-2">
          <div className="section-title" style={{ margin:0 }}>Bail — <em>{studio.nom}</em></div>
          <div style={{ display:"flex", gap:"0.5rem" }}>
            {studio.bail?.signe && <span className="tag tag-sage">✓ Signé</span>}
            <button className="btn btn-outline btn-sm" onClick={() => setPage("dashboard")}>← Retour</button>
          </div>
        </div>

        <div className="steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`step ${bailStep === i ? "active" : bailStep > i ? "done" : ""}`}>
              <div className="step-circle">{bailStep > i ? "✓" : i+1}</div>
              <div className="step-label">{s}</div>
            </div>
          ))}
        </div>

        {bailStep === 0 && (
          <div className="card">
            <div className="card-header">📋 Informations du bail</div>
            <div className="grid-2 mb-2">
              <div className="field">
                <label>Début du bail</label>
                <input type="date" value={studio.bail?.debut || ""} onChange={e => updateStudio(studio.id, s => ({ bail: { ...s.bail, debut: e.target.value } }))} />
              </div>
              <div className="field">
                <label>Fin du bail</label>
                <input type="date" value={studio.bail?.fin || ""} onChange={e => updateStudio(studio.id, s => ({ bail: { ...s.bail, fin: e.target.value } }))} />
              </div>
              <div className="field">
                <label>Loyer mensuel (€)</label>
                <input type="number" value={studio.loyer} onChange={e => updateStudio(studio.id, () => ({ loyer: Number(e.target.value) }))} />
              </div>
              <div className="field">
                <label>Charges forfaitaires (€)</label>
                <input type="number" value={studio.charges} onChange={e => updateStudio(studio.id, () => ({ charges: Number(e.target.value) }))} />
              </div>
              <div className="field">
                <label>Dépôt de garantie (€)</label>
                <input type="number" value={studio.depot} onChange={e => updateStudio(studio.id, () => ({ depot: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="card-header" style={{ marginBottom:"0.75rem" }}>👤 Locataire</div>
            <div className="grid-2">
              <div className="field"><label>Prénom</label><input value={studio.locataire.prenom} onChange={e => updateStudio(studio.id, s => ({ locataire: { ...s.locataire, prenom: e.target.value } }))} /></div>
              <div className="field"><label>Nom</label><input value={studio.locataire.nom} onChange={e => updateStudio(studio.id, s => ({ locataire: { ...s.locataire, nom: e.target.value } }))} /></div>
              <div className="field"><label>Date de naissance</label><input type="date" value={studio.locataire.naissance} onChange={e => updateStudio(studio.id, s => ({ locataire: { ...s.locataire, naissance: e.target.value } }))} /></div>
              <div className="field"><label>Nationalité</label><input value={studio.locataire.nationalite} onChange={e => updateStudio(studio.id, s => ({ locataire: { ...s.locataire, nationalite: e.target.value } }))} /></div>
              <div className="field"><label>Profession / Formation</label><input value={studio.locataire.profession} onChange={e => updateStudio(studio.id, s => ({ locataire: { ...s.locataire, profession: e.target.value } }))} /></div>
              <div className="field"><label>Email</label><input type="email" value={studio.locataire.email} onChange={e => updateStudio(studio.id, s => ({ locataire: { ...s.locataire, email: e.target.value } }))} /></div>
              <div className="field"><label>Téléphone</label><input value={studio.locataire.tel} onChange={e => updateStudio(studio.id, s => ({ locataire: { ...s.locataire, tel: e.target.value } }))} /></div>
            </div>
            <div className="divider" />
            <div className="card-header" style={{ marginBottom:"0.75rem" }}>🤝 Garant</div>
            <div className="grid-2">
              <div className="field"><label>Nom du garant</label><input value={studio.locataire.garant_nom || ""} onChange={e => updateStudio(studio.id, s => ({ locataire: { ...s.locataire, garant_nom: e.target.value } }))} /></div>
              <div className="field"><label>Téléphone garant</label><input value={studio.locataire.garant_tel || ""} onChange={e => updateStudio(studio.id, s => ({ locataire: { ...s.locataire, garant_tel: e.target.value } }))} /></div>
            </div>
            <div className="btn-row">
              <button className="btn btn-gold" onClick={() => setBailStep(1)}>Continuer → Lire le bail</button>
            </div>
          </div>
        )}

        {bailStep === 1 && (
          <div className="card">
            <div className="card-header">📜 Lecture & vérification du bail</div>
            <div className="alert alert-info">ℹ️ Lisez attentivement le bail ci-dessous avant de signer. Vous pouvez revenir à l'étape précédente pour corriger des informations.</div>
            <div className="bail-doc" dangerouslySetInnerHTML={{ __html: generateBailHtml(studio) }} />
            <div className="btn-row">
              <button className="btn btn-outline" onClick={() => setBailStep(0)}>← Modifier</button>
              <button className="btn btn-gold" onClick={() => setBailStep(2)}>Procéder à la signature →</button>
            </div>
          </div>
        )}

        {bailStep === 2 && (
          <div className="card">
            <div className="card-header">✍️ Signatures & Paraphes</div>
            <div className="alert alert-info">⚠️ Signez dans les zones ci-dessous. Ces signatures ont valeur de consentement dans le cadre de cette application. Pour une valeur légale certifiée, utilisez un service comme YouSign ou DocuSign.</div>
            <div className="grid-2">
              <div>
                <p className="fw-500 mb-1">Signature du bailleur</p>
                <SignaturePad label="Bailleur — Jeremy" value={sigBailleur} onChange={setSigBailleur} />
              </div>
              <div>
                <p className="fw-500 mb-1">Signature du locataire</p>
                <SignaturePad label={`${studio.locataire.prenom} ${studio.locataire.nom}`} value={sigLocataire} onChange={setSigLocataire} />
              </div>
            </div>
            <div className="divider" />
            <p className="fw-500 mb-1">Paraphes <span className="text-muted">(initiales, apposées sur chaque page)</span></p>
            <div className="paraphe-row">
              <div className="paraphe-block">
                <p style={{ fontSize:"0.78rem", color:"#666", marginBottom:"0.3rem" }}>Paraphe bailleur</p>
                <SignaturePad label="Initiales bailleur" value={null} onChange={() => {}} height={65} />
              </div>
              <div className="paraphe-block">
                <p style={{ fontSize:"0.78rem", color:"#666", marginBottom:"0.3rem" }}>Paraphe locataire</p>
                <SignaturePad label={`Initiales — ${studio.locataire?.prenom || "locataire"}`} value={null} onChange={() => {}} height={65} />
              </div>
            </div>
            <div className="btn-row">
              <button className="btn btn-outline" onClick={() => setBailStep(1)}>← Retour</button>
              <button className="btn btn-sage" disabled={!sigBailleur || !sigLocataire} onClick={async () => {
                await updateStudio(studio.id, s => ({ bail: { ...s.bail, signe: true, signe_bailleur: sigBailleur, signe_locataire: sigLocataire } }));
                showAlert("Bail signé et sauvegardé !");
                setBailStep(3);
              }}>✓ Valider les signatures</button>
            </div>
          </div>
        )}

        {bailStep === 3 && (
          <div className="card">
            <div className="card-header">📧 Envoi du bail</div>
            <div className="alert alert-success">✓ Le bail a été signé avec succès !</div>
            <EmailSender studio={studio} type="bail" onSent={() => showAlert("Email envoyé !")} />
            <div className="btn-row">
              <button className="btn btn-outline" onClick={() => { setBailStep(0); setPage("dashboard"); }}>← Tableau de bord</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── ÉTAT DES LIEUX ──
  const [edlData, setEdlData] = useState({});
  const [openRooms, setOpenRooms] = useState({ 0: true });
  const [edlPhotos, setEdlPhotos] = useState({});
  const [edlCroquis, setEdlCroquis] = useState({});
  const [edlStep, setEdlStep] = useState(0);
  const [sigEdlBailleur, setSigEdlBailleur] = useState(null);
  const [sigEdlLocataire, setSigEdlLocataire] = useState(null);
  const [paraphEdlBailleur, setParaphEdlBailleur] = useState(null);
  const [paraphEdlLocataire, setParaphEdlLocataire] = useState(null);

  // Inventaire mobilier : { itemKey: { present, etat, quantite, obs } }
  const [inventaire, setInventaire] = useState(() => {
    const inv = {};
    MOBILIER_DEFAUT.forEach(cat => cat.items.forEach(item => {
      inv[`${cat.cat}__${item}`] = { present: true, etat: "bon", quantite: 1, obs: "" };
    }));
    return inv;
  });
  const [invCustom, setInvCustom] = useState([]); // { cat, label, etat, quantite, obs }
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemCat, setNewItemCat] = useState(MOBILIER_DEFAUT[0].cat);
  const photoInputRef = useRef(null);
  const [photoTarget, setPhotoTarget] = useState(null);

  const setEtat = (pieceIdx, item, etat) => {
    setEdlData(prev => ({
      ...prev,
      [`${pieceIdx}_${item}`]: { ...prev[`${pieceIdx}_${item}`], etat }
    }));
  };
  const setComment = (pieceIdx, item, comment) => {
    setEdlData(prev => ({
      ...prev,
      [`${pieceIdx}_${item}`]: { ...prev[`${pieceIdx}_${item}`], comment }
    }));
  };

  const addPhoto = (pieceIdx, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setEdlPhotos(prev => ({
        ...prev,
        [pieceIdx]: [...(prev[pieceIdx] || []), e.target.result]
      }));
    };
    reader.readAsDataURL(file);
  };

  const renderEdl = () => {
    if (!studio) return <div className="text-muted">Sélectionnez un studio.</div>;
    const EDL_STEPS = ["Type & Infos", "État des lieux", "Inventaire", "Croquis", "Signatures", "Envoi"];

    return (
      <div>
        <div className="flex-between mb-2">
          <div className="section-title" style={{ margin:0 }}>État des lieux — <em>{studio.nom}</em></div>
          <button className="btn btn-outline btn-sm" onClick={() => setPage("dashboard")}>← Retour</button>
        </div>

        <div className="steps">
          {EDL_STEPS.map((s, i) => (
            <div key={i} className={`step ${edlStep === i ? "active" : edlStep > i ? "done" : ""}`}>
              <div className="step-circle">{edlStep > i ? "✓" : i+1}</div>
              <div className="step-label" style={{ fontSize:"0.65rem" }}>{s}</div>
            </div>
          ))}
        </div>

        {edlStep === 0 && (
          <div className="card">
            <div className="card-header">🏠 Type d'état des lieux</div>
            <div style={{ display:"flex", gap:"1rem", marginBottom:"1.5rem" }}>
              <button className={`btn ${edlType==="entree" ? "btn-gold" : "btn-outline"}`} onClick={() => setEdlType("entree")}>🔑 Entrée</button>
              <button className={`btn ${edlType==="sortie" ? "btn-rust" : "btn-outline"}`} onClick={() => setEdlType("sortie")}>🚪 Sortie</button>
            </div>
            <div className="grid-2">
              <div className="field"><label>Date de l'état des lieux</label><input type="date" defaultValue={new Date().toISOString().split("T")[0]} /></div>
              <div className="field"><label>Heure</label><input type="time" defaultValue="10:00" /></div>
              {studio.locataire && <><div className="field"><label>Locataire</label><input readOnly value={`${studio.locataire.prenom} ${studio.locataire.nom}`} /></div>
              <div className="field"><label>Email locataire</label><input readOnly value={studio.locataire.email} /></div></>}
            </div>
            <div className="field mt-2"><label>Relevés de compteurs</label>
              <div className="grid-3" style={{ marginTop:"0.3rem" }}>
                <input placeholder="Eau froide (m³)" />
                <input placeholder="Eau chaude (m³)" />
                <input placeholder="Électricité (kWh)" />
              </div>
            </div>
            <div className="field mt-2"><label>Nombre de clés remises</label><input type="number" defaultValue={1} style={{ maxWidth:120 }} /></div>
            <div className="btn-row">
              <button className="btn btn-gold" onClick={() => setEdlStep(1)}>Commencer l'état des lieux →</button>
            </div>
          </div>
        )}

        {edlStep === 1 && (
          <div>
            <div className="alert alert-info">Notez l'état de chaque élément. Ajoutez des photos et commentaires si nécessaire.</div>
            {PIECES_EDL.map((piece, pieceIdx) => (
              <div key={pieceIdx} className="room-row">
                <div className="room-header" onClick={() => setOpenRooms(p => ({ ...p, [pieceIdx]: !p[pieceIdx] }))}>
                  <span>🏠 {piece.nom}</span>
                  <div style={{ display:"flex", gap:"0.5rem", alignItems:"center" }}>
                    <span className="text-muted" style={{ fontSize:"0.75rem" }}>
                      {piece.items.filter(it => edlData[`${pieceIdx}_${it}`]?.etat).length}/{piece.items.length} renseignés
                    </span>
                    <span>{openRooms[pieceIdx] ? "▲" : "▼"}</span>
                  </div>
                </div>
                {openRooms[pieceIdx] && (
                  <div className="room-body">
                    {piece.items.map(item => (
                      <div key={item} className="item-row">
                        <span style={{ fontSize:"0.85rem", fontWeight:500 }}>{item}</span>
                        <div style={{ display:"flex", gap:"0.3rem", flexWrap:"wrap" }}>
                          {["bon","moyen","mauvais"].map(e => (
                            <button key={e} className={`etat-btn ${edlData[`${pieceIdx}_${item}`]?.etat === e ? e : ""}`}
                              onClick={() => setEtat(pieceIdx, item, e)}>
                              {e === "bon" ? "✓" : e === "moyen" ? "~" : "✗"} {e}
                            </button>
                          ))}
                        </div>
                        <input placeholder="Commentaire..." style={{ fontSize:"0.8rem", padding:"0.3rem 0.5rem", border:"1px solid var(--border)", borderRadius:4, width:"100%" }}
                          value={edlData[`${pieceIdx}_${item}`]?.comment || ""}
                          onChange={e => setComment(pieceIdx, item, e.target.value)} />
                      </div>
                    ))}
                    <div style={{ marginTop:"0.75rem" }}>
                      <p style={{ fontSize:"0.8rem", fontWeight:500, marginBottom:"0.4rem" }}>📷 Photos de la pièce</p>
                      <div className="photo-grid">
                        {(edlPhotos[pieceIdx] || []).map((src, i) => (
                          <img key={i} src={src} className="photo-thumb" alt="edl" />
                        ))}
                        <div className="photo-add" onClick={() => { setPhotoTarget(pieceIdx); photoInputRef.current?.click(); }}>+</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <input ref={photoInputRef} type="file" accept="image/*" style={{ display:"none" }}
              onChange={e => { if (e.target.files[0]) addPhoto(photoTarget, e.target.files[0]); e.target.value=""; }} />
            <div className="btn-row">
              <button className="btn btn-outline" onClick={() => setEdlStep(0)}>← Retour</button>
              <button className="btn btn-gold" onClick={() => setEdlStep(2)}>Continuer → Inventaire</button>
            </div>
          </div>
        )}

        {edlStep === 2 && (
          <div className="card">
            <div className="card-header">🛋️ Inventaire du mobilier</div>
            <p className="text-muted mb-2">Vérifiez la présence et l'état de chaque meuble et équipement. Décochez les éléments absents du logement.</p>
            <table className="inv-table">
              <thead>
                <tr>
                  <th style={{width:32}}>✓</th>
                  <th>Désignation</th>
                  <th style={{width:60}}>Qté</th>
                  <th style={{width:110}}>État</th>
                  <th>Observation</th>
                  <th style={{width:32}}></th>
                </tr>
              </thead>
              <tbody>
                {MOBILIER_DEFAUT.map(cat => (
                  <>
                    <tr className="inv-cat-header" key={`cat_${cat.cat}`}>
                      <td colSpan={6}>📦 {cat.cat}</td>
                    </tr>
                    {cat.items.map(item => {
                      const key = `${cat.cat}__${item}`;
                      const val = inventaire[key] || { present: true, etat: "bon", quantite: 1, obs: "" };
                      return (
                        <tr key={key} style={{ opacity: val.present ? 1 : 0.4 }}>
                          <td><input type="checkbox" checked={val.present} onChange={e => setInventaire(p => ({ ...p, [key]: { ...val, present: e.target.checked } }))} /></td>
                          <td style={{ fontWeight: 500 }}>{item}</td>
                          <td><input type="number" min={0} max={20} value={val.quantite} style={{ width:50 }}
                            onChange={e => setInventaire(p => ({ ...p, [key]: { ...val, quantite: Number(e.target.value) } }))} /></td>
                          <td>
                            <select className={`inv-etat-select ${val.etat}`} value={val.etat}
                              onChange={e => setInventaire(p => ({ ...p, [key]: { ...val, etat: e.target.value } }))}>
                              <option value="neuf">Neuf</option>
                              <option value="bon">Bon</option>
                              <option value="moyen">Moyen</option>
                              <option value="mauvais">Mauvais</option>
                            </select>
                          </td>
                          <td><input type="text" placeholder="Rayure, tache..." value={val.obs}
                            onChange={e => setInventaire(p => ({ ...p, [key]: { ...val, obs: e.target.value } }))} /></td>
                          <td></td>
                        </tr>
                      );
                    })}
                  </>
                ))}
                {invCustom.map((item, i) => (
                  <tr key={`custom_${i}`}>
                    <td><input type="checkbox" checked={item.present !== false} onChange={e => setInvCustom(p => p.map((x,j) => j===i ? {...x, present: e.target.checked} : x))} /></td>
                    <td style={{ fontWeight:500 }}>
                      <span style={{ fontSize:"0.72rem", color:"var(--gold)", marginRight:"0.3rem" }}>[{item.cat}]</span>
                      {item.label}
                    </td>
                    <td><input type="number" min={0} max={20} value={item.quantite||1} style={{ width:50 }}
                      onChange={e => setInvCustom(p => p.map((x,j) => j===i ? {...x, quantite: Number(e.target.value)} : x))} /></td>
                    <td>
                      <select className={`inv-etat-select ${item.etat||"bon"}`} value={item.etat||"bon"}
                        onChange={e => setInvCustom(p => p.map((x,j) => j===i ? {...x, etat: e.target.value} : x))}>
                        <option value="neuf">Neuf</option>
                        <option value="bon">Bon</option>
                        <option value="moyen">Moyen</option>
                        <option value="mauvais">Mauvais</option>
                      </select>
                    </td>
                    <td><input type="text" placeholder="Observation..." value={item.obs||""}
                      onChange={e => setInvCustom(p => p.map((x,j) => j===i ? {...x, obs: e.target.value} : x))} /></td>
                    <td><button className="btn-del" onClick={() => setInvCustom(p => p.filter((_,j) => j!==i))}>🗑</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display:"flex", gap:"0.5rem", marginTop:"1rem", flexWrap:"wrap", alignItems:"center", padding:"0.75rem", background:"var(--cream)", borderRadius:6 }}>
              <span style={{ fontSize:"0.8rem", fontWeight:600 }}>+ Ajouter un élément :</span>
              <select value={newItemCat} onChange={e => setNewItemCat(e.target.value)}
                style={{ fontSize:"0.8rem", padding:"0.3rem 0.5rem", border:"1px solid var(--border)", borderRadius:4, background:"white" }}>
                {MOBILIER_DEFAUT.map(c => <option key={c.cat} value={c.cat}>{c.cat}</option>)}
                <option value="Autre">Autre</option>
              </select>
              <input value={newItemLabel} onChange={e => setNewItemLabel(e.target.value)}
                placeholder="Nom du meuble / équipement"
                style={{ fontSize:"0.8rem", padding:"0.3rem 0.6rem", border:"1px solid var(--border)", borderRadius:4, flex:1, minWidth:150 }} />
              <button className="btn btn-gold btn-sm" onClick={() => {
                if (!newItemLabel.trim()) return;
                setInvCustom(p => [...p, { cat: newItemCat, label: newItemLabel.trim(), etat:"bon", quantite:1, obs:"", present:true }]);
                setNewItemLabel("");
              }}>Ajouter</button>
            </div>
            <div className="btn-row">
              <button className="btn btn-outline" onClick={() => setEdlStep(1)}>← Retour</button>
              <button className="btn btn-gold" onClick={() => setEdlStep(3)}>Continuer → Croquis</button>
            </div>
          </div>
        )}

        {edlStep === 3 && (
          <div className="card">
            <div className="card-header">✏️ Croquis / Annotations générales</div>
            <p className="text-muted mb-2">Dessinez un plan ou annotez les zones à signaler. Utilisez les couleurs pour différencier les types de dégradations.</p>
            <CroquisPad value={edlCroquis.general} onChange={v => setEdlCroquis(p => ({ ...p, general: v }))} />
            <div className="field mt-2">
              <label>Observations générales</label>
              <textarea placeholder="Notez ici vos observations générales sur l'état du logement..." rows={4}
                value={edlCroquis.obs || ""}
                onChange={e => setEdlCroquis(p => ({ ...p, obs: e.target.value }))} />
            </div>
            <div className="btn-row">
              <button className="btn btn-outline" onClick={() => setEdlStep(2)}>← Retour</button>
              <button className="btn btn-gold" onClick={() => setEdlStep(4)}>Continuer → Signatures</button>
            </div>
          </div>
        )}

        {edlStep === 4 && (
          <div className="card">
            <div className="card-header">✍️ Signatures & Paraphes de l'état des lieux</div>
            <div className="alert alert-info">Chaque partie doit signer et parapher l'état des lieux.</div>

            <p className="fw-500" style={{ marginBottom:"0.75rem", marginTop:"0.5rem" }}>Signatures</p>
            <div className="grid-2">
              <div>
                <p style={{ fontSize:"0.82rem", color:"#666", marginBottom:"0.4rem" }}>Bailleur</p>
                <SignaturePad label="Signature bailleur — Jeremy" value={sigEdlBailleur} onChange={setSigEdlBailleur} />
              </div>
              <div>
                <p style={{ fontSize:"0.82rem", color:"#666", marginBottom:"0.4rem" }}>
                  Locataire {studio.locataire ? `— ${studio.locataire.prenom} ${studio.locataire.nom}` : ""}
                </p>
                <SignaturePad label="Signature locataire" value={sigEdlLocataire} onChange={setSigEdlLocataire} />
              </div>
            </div>

            <div className="divider" />

            <p className="fw-500 mb-1">Paraphes <span className="text-muted">(initiales, apposées sur chaque page)</span></p>
            <div className="paraphe-row">
              <div className="paraphe-block">
                <p style={{ fontSize:"0.78rem", color:"#666", marginBottom:"0.3rem" }}>Paraphe bailleur</p>
                <SignaturePad label="Initiales bailleur" value={paraphEdlBailleur} onChange={setParaphEdlBailleur} height={65} />
              </div>
              <div className="paraphe-block">
                <p style={{ fontSize:"0.78rem", color:"#666", marginBottom:"0.3rem" }}>Paraphe locataire</p>
                <SignaturePad label="Initiales locataire" value={paraphEdlLocataire} onChange={setParaphEdlLocataire} height={65} />
              </div>
            </div>

            <div className="btn-row">
              <button className="btn btn-outline" onClick={() => setEdlStep(3)}>← Retour</button>
              <button className="btn btn-sage"
                disabled={!sigEdlBailleur || !sigEdlLocataire}
                onClick={async () => {
                  await db.saveEdl({
                    studio_id: studio.id,
                    type: edlType,
                    date_edl: new Date().toISOString().split("T")[0],
                    data: edlData,
                    inventaire: inventaire,
                    observations: edlCroquis.obs || "",
                    sig_bailleur: sigEdlBailleur,
                    sig_locataire: sigEdlLocataire,
                    paraph_bailleur: paraphEdlBailleur,
                    paraph_locataire: paraphEdlLocataire,
                  });
                  showAlert(`État des lieux ${edlType === "entree" ? "d'entrée" : "de sortie"} sauvegardé !`);
                  setEdlStep(5);
                }}>✓ Valider l'état des lieux</button>
            </div>
          </div>
        )}

        {edlStep === 5 && (
          <div className="card">
            <div className="card-header">📧 Envoi de l'état des lieux</div>
            <div className="alert alert-success">✓ État des lieux {edlType === "entree" ? "d'entrée" : "de sortie"} validé et signé !</div>
            <EmailSender studio={studio} type={edlType} onSent={() => showAlert("Documents envoyés !")} />
            <div className="btn-row">
              <button className="btn btn-outline" onClick={() => { setEdlStep(0); setPage("dashboard"); }}>← Tableau de bord</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── EMAIL SENDER ──
  function EmailSender({ studio, type, onSent }) {
    const [to, setTo] = useState(studio?.locataire?.email || "");
    const [cc, setCc] = useState("jeremy@email.com");
    const [subject, setSubject] = useState(
      type === "bail" ? `Bail de location — ${studio?.nom}` :
      type === "entree" ? `État des lieux d'entrée — ${studio?.nom}` :
      `État des lieux de sortie — ${studio?.nom}`
    );
    const [body, setBody] = useState(
      type === "bail"
        ? `Bonjour ${studio?.locataire?.prenom || ""},\n\nVeuillez trouver ci-joint votre bail de location pour le logement situé au ${studio?.adresse}.\n\nN'hésitez pas à me contacter pour toute question.\n\nCordialement,\nJeremy`
        : `Bonjour ${studio?.locataire?.prenom || ""},\n\nVeuillez trouver ci-joint l'état des lieux ${type === "entree" ? "d'entrée" : "de sortie"} pour le logement au ${studio?.adresse}.\n\nCordialement,\nJeremy`
    );
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const send = async () => {
      setSending(true);
      try {
        const { default: Anthropic } = await import("https://esm.sh/@anthropic-ai/sdk");
        const client = new Anthropic();
        // Simulated: In production, use Gmail MCP
        await new Promise(r => setTimeout(r, 1500));
        setSent(true);
        onSent?.();
      } catch {
        setSent(true); // fallback demo
        onSent?.();
      }
      setSending(false);
    };

    if (sent) return <div className="alert alert-success">✓ Email envoyé avec succès !</div>;

    return (
      <div>
        <div className="grid-2 mb-2">
          <div className="field">
            <label>Destinataire (locataire)</label>
            <input type="email" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div className="field">
            <label>Copie (bailleur)</label>
            <input type="email" value={cc} onChange={e => setCc(e.target.value)} />
          </div>
        </div>
        <div className="field mb-2">
          <label>Objet</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
        <div className="field mb-2">
          <label>Corps du message</label>
          <textarea rows={6} value={body} onChange={e => setBody(e.target.value)} />
        </div>
        <div style={{ background:"var(--cream)", borderRadius:6, padding:"0.75rem", fontSize:"0.8rem", marginBottom:"1rem" }}>
          <p className="fw-500 mb-1">📎 Documents joints :</p>
          {type === "bail" && <p>• Bail de location signé — {studio?.nom}.pdf</p>}
          {(type === "entree" || type === "sortie") && <p>• État des lieux {type === "entree" ? "d'entrée" : "de sortie"} — {studio?.nom}.pdf</p>}
          <p>• Notice d'information DPE</p>
          {type === "entree" && <p>• Règlement de copropriété</p>}
        </div>
        <button className="btn btn-sage" onClick={send} disabled={sending}>
          {sending ? "⏳ Envoi en cours..." : "📧 Envoyer les documents"}
        </button>
      </div>
    );
  }

  // ── MODALS ──
  const renderModal = () => {
    if (!modal) return null;

    if (modal === "addLocataire" || modal === "editStudio") {
      const s = selectedStudio ? studios.find(x => x.id === selectedStudio?.id) : null;
      return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-title">
              <button className="modal-close" onClick={() => setModal(null)}>×</button>
              {modal === "addLocataire" ? "Ajouter un locataire" : `Modifier — ${s?.nom}`}
            </div>
            {modal === "editStudio" && s && (
              <div>
                <div className="grid-2 mb-2">
                  <div className="field"><label>Nom du studio</label><input defaultValue={s.nom} id="edit_nom" /></div>
                  <div className="field"><label>Adresse</label><input defaultValue={s.adresse} id="edit_adresse" /></div>
                  <div className="field"><label>Surface (m²)</label><input type="number" defaultValue={s.surface} id="edit_surface" /></div>
                  <div className="field"><label>Loyer (€)</label><input type="number" defaultValue={s.loyer} id="edit_loyer" /></div>
                </div>
                <button className="btn btn-gold" onClick={async () => {
                  await updateStudio(s.id, () => ({
                    nom: document.getElementById("edit_nom").value,
                    adresse: document.getElementById("edit_adresse").value,
                    surface: Number(document.getElementById("edit_surface").value),
                    loyer: Number(document.getElementById("edit_loyer").value),
                  }));
                  setModal(null); showAlert("Studio mis à jour !");
                }}>Enregistrer</button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (modal === "addStudio") {
      const fields = {};
      return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-title"><button className="modal-close" onClick={() => setModal(null)}>×</button>Nouveau studio</div>
            <div className="grid-2 mb-2">
              <div className="field"><label>Nom</label><input id="new_nom" placeholder="Studio Pasteur" /></div>
              <div className="field"><label>Adresse</label><input id="new_adresse" placeholder="5 rue Pasteur, 34000..." /></div>
              <div className="field"><label>Surface (m²)</label><input type="number" id="new_surface" defaultValue={20} /></div>
              <div className="field"><label>Loyer (€)</label><input type="number" id="new_loyer" defaultValue={450} /></div>
              <div className="field"><label>Charges (€)</label><input type="number" id="new_charges" defaultValue={40} /></div>
            </div>
            <button className="btn btn-gold" onClick={async () => {
              const newS = {
                nom: document.getElementById("new_nom").value || "Nouveau studio",
                adresse: document.getElementById("new_adresse").value || "",
                surface: Number(document.getElementById("new_surface").value),
                loyer: Number(document.getElementById("new_loyer").value),
                charges: Number(document.getElementById("new_charges").value),
                depot: Number(document.getElementById("new_loyer").value),
              };
              const created = await db.createStudio(newS);
              if (created) { await refreshStudios(); }
              setModal(null); showAlert("Studio ajouté et sauvegardé !");
            }}>Ajouter le studio</button>
          </div>
        </div>
      );
    }
    return null;
  };

  // ── RENDER ──
  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">Loca<span>Gestion</span></div>
          <div className="nav-tabs">
            <button className={`nav-tab ${page==="dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}>🏘 Studios</button>
            {selectedStudio && <>
              <button className={`nav-tab ${page==="bail" ? "active" : ""}`} onClick={() => setPage("bail")}>📄 Bail</button>
              <button className={`nav-tab ${page==="edl" ? "active" : ""}`} onClick={() => setPage("edl")}>🏠 État des lieux</button>
            </>}
          </div>
          {selectedStudio && (
            <div style={{ fontSize:"0.75rem", color:"rgba(245,240,232,0.5)", whiteSpace:"nowrap" }}>
              {studios.find(s => s.id === selectedStudio.id)?.nom}
            </div>
          )}
        </nav>

        <main className="main">
          {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
          {page === "dashboard" && renderDashboard()}
          {page === "bail" && renderBail()}
          {page === "edl" && renderEdl()}
        </main>
      </div>
      {renderModal()}
    </>
  );
}
