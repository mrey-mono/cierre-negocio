import { useState, useRef } from "react";

const PRODUCTS = ["Cuenta", "Core", "Tarjetas", "Payouts", "Payins", "Wallet Marca Blanca"];

const Label = ({ children, required }) => (
  <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>
    {children}{required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
  </label>
);

const Input = ({ placeholder, multiline, rows = 3, value, onChange }) => {
  const base = { width: "100%", boxSizing: "border-box", border: "1px solid #e5e7eb", borderRadius: 6, padding: "8px 10px", fontSize: 13, color: "#111827", background: "#fafafa", outline: "none", fontFamily: "inherit", transition: "border-color 0.15s" };
  return multiline
    ? <textarea value={value} onChange={onChange} rows={rows} placeholder={placeholder} style={{ ...base, resize: "vertical" }} />
    : <input value={value} onChange={onChange} type="text" placeholder={placeholder} style={base} />;
};

const Select = ({ options, value, onChange }) => (
  <select value={value} onChange={onChange} style={{ width: "100%", boxSizing: "border-box", border: "1px solid #e5e7eb", borderRadius: 6, padding: "8px 10px", fontSize: 13, color: value ? "#111827" : "#9ca3af", background: "#fafafa", outline: "none", fontFamily: "inherit" }}>
    <option value="">Seleccionar...</option>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const CheckOption = ({ label, checked, onChange }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#374151", padding: "4px 0" }}>
    <input type="checkbox" checked={checked} onChange={onChange} style={{ accentColor: "#111827", width: 14, height: 14 }} />
    {label}
  </label>
);

const RadioOption = ({ label, name, value, checked, onChange }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#374151", padding: "4px 0" }}>
    <input type="radio" name={name} value={value} checked={checked} onChange={onChange} style={{ accentColor: "#111827" }} />
    {label}
  </label>
);

const Section = ({ title, accent = "#111827", children }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 3, height: 18, background: accent, borderRadius: 2 }} />
      <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</h2>
    </div>
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20 }}>{children}</div>
  </div>
);

const Row = ({ children, cols = 2 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, marginBottom: 16 }}>{children}</div>
);

const Field = ({ label, children, required }) => (
  <div><Label required={required}>{label}</Label>{children}</div>
);

const Divider = () => <div style={{ borderTop: "1px solid #f3f4f6", margin: "16px 0" }} />;

const SubHeader = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>{children}</div>
);

const ProductTag = ({ name, active, onClick }) => (
  <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "1.5px solid", borderColor: active ? "#111827" : "#e5e7eb", background: active ? "#111827" : "#fff", color: active ? "#fff" : "#6b7280", transition: "all 0.15s" }}>
    {name}
  </button>
);

const OtroDetalle = ({ value, onChange }) => (
  <div style={{ marginTop: 8, padding: "10px 12px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6 }}>
    <div style={{ fontSize: 11, color: "#92400e", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Si otro, detallar:</div>
    <textarea value={value} onChange={onChange} rows={2} placeholder="Describe el esquema de costos..."
      style={{ width: "100%", boxSizing: "border-box", border: "1px solid #fde68a", borderRadius: 4, padding: "6px 8px", fontSize: 13, background: "#fffef7", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
  </div>
);

const ImageUpload = ({ label, value, onChange }) => {
  const ref = useRef();
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      {value ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img src={value} alt="pricing" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 6, border: "1px solid #e5e7eb", display: "block" }} />
          <button onClick={() => onChange(null)} style={{ position: "absolute", top: 4, right: 4, background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, padding: "2px 7px", fontSize: 11, cursor: "pointer" }}>✕</button>
        </div>
      ) : (
        <div onClick={() => ref.current.click()} style={{ border: "2px dashed #d1d5db", borderRadius: 8, padding: "18px 16px", textAlign: "center", cursor: "pointer", background: "#f9fafb", color: "#9ca3af", fontSize: 12 }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>📎</div>
          Adjuntar screenshot de pricing por rango
          <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => onChange(ev.target.result);
            reader.readAsDataURL(file);
          }} />
        </div>
      )}
    </div>
  );
};

function buildPDFHTML(form, productos, images, version) {
  const empresa = form.empresa || "Sin nombre";
  const val = k => form[k] || "—";
  const productosActivos = PRODUCTS.filter(p => productos[p]);

  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <style>
    body{font-family:Arial,sans-serif;font-size:11px;color:#111;margin:0;padding:24px}
    h1{font-size:18px;margin:0 0 2px}
    .meta{font-size:10px;color:#666;margin-bottom:20px}
    .version{display:inline-block;background:#111827;color:#fff;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:bold;margin-left:10px}
    h2{font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:.08em;border-bottom:2px solid #111827;padding-bottom:4px;margin:18px 0 10px}
    h3{font-size:11px;font-weight:bold;text-transform:uppercase;color:#374151;margin:12px 0 6px}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:10px}
    .grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:10px}
    .fl{font-size:9px;font-weight:bold;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px}
    .fv{font-size:11px;border-bottom:1px solid #e5e7eb;padding-bottom:2px;min-height:16px;margin-bottom:8px}
    .tag{display:inline-block;background:#111827;color:#fff;padding:2px 10px;border-radius:10px;font-size:10px;margin:2px}
    .box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px;margin-bottom:10px}
    .otro{background:#fffbeb;border:1px solid #fde68a;border-radius:4px;padding:8px;margin-top:4px;font-size:10px}
    img.pricing{max-width:100%;max-height:180px;border-radius:4px;border:1px solid #e5e7eb;margin-top:6px;display:block}
    .footer{margin-top:30px;border-top:1px solid #e5e7eb;padding-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:16px;font-size:10px;color:#6b7280}
  </style></head><body>
  <h1>Cierre de Negocio — ${empresa} <span class="version">V${version}</span></h1>
  <div class="meta">Mono · Sales → Onboarding · ${new Date().toLocaleDateString("es-CO")}</div>
  <h2>1 · Información del cliente</h2>
  <div class="grid2">
    <div><div class="fl">Nombre empresa</div><div class="fv">${val("empresa")}</div></div>
    <div><div class="fl">Fecha pago setup fee</div><div class="fv">${val("fechaPago")}</div></div>
    <div><div class="fl">Contacto principal</div><div class="fv">${val("contacto")}</div></div>
    <div><div class="fl">Correo facturación</div><div class="fv">${val("emailFacturacion")}</div></div>
    <div><div class="fl">Facturación</div><div class="fv">${val("facturacion")}</div></div>
    <div><div class="fl">Segmento</div><div class="fv">${form.segmento==="mid"?"Mid-market":form.segmento==="ent"?"Enterprise":"—"}</div></div>
    <div><div class="fl">Razón Social</div><div class="fv">${val("razonSocial")}</div></div>
    <div><div class="fl">NIT</div><div class="fv">${val("nit")}</div></div>
    <div><div class="fl">Jurisdicción</div><div class="fv">${val("jurisdiccion")}</div></div>
    <div><div class="fl">Dirección, Ciudad</div><div class="fv">${val("direccion")}</div></div>
    <div><div class="fl">Representante Legal</div><div class="fv">${val("repLegal")}</div></div>
    <div><div class="fl">Documento Rep. Legal</div><div class="fv">${val("docRepLegal")}</div></div>
  </div>
  <h2>2 · Productos contratados</h2>
  <div>${productosActivos.map(p=>`<span class="tag">${p}</span>`).join("")||"—"}</div>`;

  if (productosActivos.length > 0) {
    html += `<h2>3 · Configuración por producto</h2>`;
    if (productos["Cuenta"]) html += `<div class="box"><h3>Cuenta</h3><div class="grid3"><div><div class="fl">Modelo</div><div class="fv">${val("cuentaModelo")}</div></div><div><div class="fl">Tipo de cuenta</div><div class="fv">${val("cuentaTipo")}</div></div><div><div class="fl">Adicionales</div><div class="fv">${[form.cuentaAV&&"Acciones y Valores",form.cuentaGMF&&"Exención GMF",form.cuentaH2H&&"H2H (BCC)"].filter(Boolean).join(", ")||"—"}</div></div></div>${form.cuentaGMF?`<div class="fl">Numerales GMF</div><div class="fv">${val("cuentaGMFNumerales")}</div>`:""}</div>`;
    if (productos["Core"]) html += `<div class="box"><h3>Core</h3><div class="grid3"><div><div class="fl">Plan</div><div class="fv">${val("corePlan")}</div></div><div><div class="fl">Fondeo</div><div class="fv">${[form.coreFondeoCOP&&"COP",form.coreFondeoUSD&&"USD"].filter(Boolean).join(", ")||"—"}</div></div><div><div class="fl">Monedas</div><div class="fv">${[form.coreMonedaCOP&&"COP",form.coreMonedaUSD&&"USD",form.coreMonedaOtras].filter(Boolean).join(", ")||"—"}</div></div></div><div class="grid2"><div><div class="fl">Setup fee</div><div class="fv">${val("coreSetup")}</div></div><div><div class="fl">Mensualidad</div><div class="fv">${val("coreMensualidad")}</div></div></div><div class="fl">Markup</div><div class="fv">${val("coreMarkup")}</div></div>`;
    if (productos["Tarjetas"]) html += `<div class="box"><h3>Tarjetas</h3><div class="fl">Tipo</div><div class="fv">${[form.tarjFisicas&&"Físicas",form.tarjVirtuales&&"Virtuales",form.tarjToken&&"Tokenización"].filter(Boolean).join(", ")||"—"}</div>${form.tarjFisicas?`<div class="grid2"><div><div class="fl">Tarjetas a emitir</div><div class="fv">${val("tarjFisicasCant")}</div></div><div><div class="fl">Valor plástico</div><div class="fv">${val("tarjPlastico")}</div></div></div>`:""}${form.tarjToken?`<div class="fl">Tokenización mensualidad</div><div class="fv">${val("tarjTokenMens")} ${[form.tarjGPay&&"Google Pay",form.tarjAPay&&"Apple Pay"].filter(Boolean).join(", ")}</div>`:""}  <div class="fl">Máx. tarjetas/usuario</div><div class="fv">${val("tarjMax")}</div></div>`;
    if (productos["Payouts"]) html += `<div class="box"><h3>Payouts</h3><div class="grid2"><div><div class="fl">Rieles</div><div class="fv">${[form.payoutACH&&"ACH",form.payoutTransfiya&&"Transfiya/Turbo",form.payoutBreB&&"Bre-B"].filter(Boolean).join(", ")||"—"}</div></div><div><div class="fl">Esquema de costos</div><div class="fv">${val("payoutEsquema")}</div></div></div>${form.payoutEsquema==="Otro"?`<div class="otro"><b>Detalle:</b> ${val("payoutEsquemaOtro")}</div>`:""}${form.payoutEsquema==="Por rango"&&images.payoutImg?`<div class="fl">Pricing por rango</div><img class="pricing" src="${images.payoutImg}"/>`:""}${form.payoutACH&&form.payoutEsquema==="Fijo por transferencia"?`<div class="fl">Costo ACH</div><div class="fv">${val("payoutCostoACH")}</div>`:""}${form.payoutBreB&&form.payoutEsquema==="Fijo por transferencia"?`<div class="fl">Costo Bre-B</div><div class="fv">${val("payoutCostoBreB")}</div>`:""}${form.payoutBreB?`<div class="fl">Validación de llave</div><div class="fv">${form.payoutValidLlave==="si"?`Sí · Costo: ${val("payoutCostoValidLlave")}`:form.payoutValidLlave==="no"?"No":"—"}</div>`:""}<div class="grid2"><div><div class="fl">Setup fee</div><div class="fv">${val("payoutSetup")}</div></div><div><div class="fl">Mínimo facturable</div><div class="fv">${val("payoutMin")}</div></div></div></div>`;
    if (productos["Payins"]) html += `<div class="box"><h3>Payins</h3><div class="fl">Métodos</div><div class="fv">${[form.payinPSE&&"PSE de Mono",form.payinAdq&&"Adquirencia",form.payinBreB&&"Bre-B Collections",form.payinCodigo&&"Gestión Código Recaudo"].filter(Boolean).join(", ")||"—"}</div>${form.payinPSE?`<div class="fl">Costo PSE</div><div class="fv">${val("payinCostoPSE")}</div>`:""}${form.payinAdq?`<div class="fl">Costo adquirencia</div><div class="fv">${val("payinCostoAdq")}</div>`:""}${form.payinBreB?`<div class="fl">Plan Bre-B</div><div class="fv">${val("payinBreBPlan")}</div>${form.payinBreBPlan==="Plan Basic"?`<div class="fl">Add-ons</div><div class="fv">${[form.payinQR&&"QR",form.payin2Reglas&&"2 reglas",form.payin4Reglas&&"4 reglas"].filter(Boolean).join(", ")||"—"}</div>`:""}<div class="fl">Esquema costos Bre-B</div><div class="fv">${val("payinEsquema")}</div>${form.payinEsquema==="Otro"?`<div class="otro"><b>Detalle:</b> ${val("payinEsquemaOtro")}</div>`:""}${form.payinEsquema==="Por rango"&&images.payinImg?`<div class="fl">Pricing por rango</div><img class="pricing" src="${images.payinImg}"/>`:""}${form.payinEsquema==="Fijo por intento"?`<div class="fl">Costo por intento</div><div class="fv">${val("payinCostoIntento")}</div>`:""}`:""}<div class="grid2"><div><div class="fl">Setup fee</div><div class="fv">${val("payinSetup")}</div></div><div><div class="fl">Mínimo facturable</div><div class="fv">${val("payinMin")}</div></div></div></div>`;
    if (productos["Wallet Marca Blanca"]) html += `<div class="box"><h3>Wallet Marca Blanca</h3><div class="fl">Funcionalidades</div><div class="fv">${[form.walletTransf&&"Transf. entre wallets",form.walletACH&&"ACH",form.walletTransfiya&&"Transfiya/Turbo",form.walletTarjetas&&"Activación tarjetas",form.walletSolicitud&&"Solicitud tarjeta usuario"].filter(Boolean).join(", ")||"—"}</div><div class="grid2"><div><div class="fl">Costo transf. banco</div><div class="fv">${val("walletCostoTransf")}</div></div><div><div class="fl">GMF asume</div><div class="fv">${form.walletGMF==="cliente"?"Cliente/Tenant":form.walletGMF==="usuario"?"Usuario Final":"—"}</div></div></div>${form.walletA2A==="si"?`<div class="fl">A2A FX</div><div class="fv">Incluye · Comisión: ${val("walletComision")}</div><div class="fl">Costos por moneda</div><div class="fv">COP: ${val("walletFXCOP")} · USD: ${val("walletFXUSD")} · CLP: ${val("walletFXCLP")} · MXN: ${val("walletFXMXN")} · PEN: ${val("walletFXPEN")}</div><div class="fl">Endpoint tasas</div><div class="fv">${form.walletEndpoint==="si"?"Activado":form.walletEndpoint==="no"?"No activado":"—"}</div>`:""}</div>`;
  }

  html += `<h2>4 · Contexto del deal</h2>
  <div class="fl">Descripción del cliente</div><div class="fv">${val("descripcion")}</div>
  <div class="fl">Volumen transaccional</div><div class="fv">${val("volumen")}</div>
  <div class="fl">Caso de uso</div><div class="fv">${val("casoUso")}</div>
  <h2>5 · Notas de handoff</h2>
  <div class="fv">${val("notas")}</div>
  <div class="footer"><div><b>Completado por:</b> ${val("completadoPor")}</div><div><b>Fecha:</b> ${val("fechaCompletado")}</div></div>
  </body></html>`;
  return html;
}

export default function CierreNegocio() {
  const [productos, setProductos] = useState({});
  const [form, setForm] = useState({});
  const [images, setImages] = useState({ payoutImg: null, payinImg: null });
  const [versions, setVersions] = useState({});

  const toggle = p => setProductos(prev => ({ ...prev, [p]: !prev[p] }));
  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const get = (key, fallback = "") => form[key] ?? fallback;

  const versionKey = (form.empresa || "").toLowerCase().replace(/\s+/g, "_");
  const nextVersion = (versions[versionKey] || 0) + 1;

  const handleGeneratePDF = () => {
    const empresa = form.empresa?.trim() || "empresa";
    const key = empresa.toLowerCase().replace(/\s+/g, "_");
    const v = (versions[key] || 0) + 1;
    setVersions(prev => ({ ...prev, [key]: v }));
    const html = buildPDFHTML(form, productos, images, v);
    const w = window.open("", "_blank");
    if (!w) { alert("Permite popups para generar el PDF"); return; }
    w.document.write(html);
    w.document.title = `Template cierre de negocio - ${empresa}_V${v}`;
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'DM Sans', system-ui, sans-serif", padding: "32px 16px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); input:focus,textarea:focus,select:focus{border-color:#111827!important;box-shadow:0 0 0 3px rgba(17,24,39,.06)}`}</style>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Mono · Sales → Onboarding</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#111827" }}>Cierre de Negocio</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280" }}>Completa los campos aplicables antes de hacer el handoff a onboarding.</p>
        </div>

        {/* 1. Cliente */}
        <Section title="1 · Información del cliente" accent="#111827">
          <Row>
            <Field label="Nombre empresa" required><Input placeholder="Ej. Empresa S.A.S." value={get("empresa")} onChange={e => set("empresa", e.target.value)} /></Field>
            <Field label="Fecha pago setup fee" required><Input placeholder="dd/mm/aa" value={get("fechaPago")} onChange={e => set("fechaPago", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Contacto principal"><Input placeholder="Nombre, email, teléfono" value={get("contacto")} onChange={e => set("contacto", e.target.value)} /></Field>
            <Field label="Correo para facturación"><Input placeholder="facturacion@empresa.com" value={get("emailFacturacion")} onChange={e => set("emailFacturacion", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Facturación">
              <div style={{ display: "flex", gap: 16 }}>
                <RadioOption label="COP" name="facturacion" value="COP" checked={get("facturacion") === "COP"} onChange={() => set("facturacion", "COP")} />
                <RadioOption label="USD" name="facturacion" value="USD" checked={get("facturacion") === "USD"} onChange={() => set("facturacion", "USD")} />
              </div>
            </Field>
            <Field label="Segmento">
              <div style={{ display: "flex", gap: 16 }}>
                <RadioOption label="Mid-market" name="segmento" value="mid" checked={get("segmento") === "mid"} onChange={() => set("segmento", "mid")} />
                <RadioOption label="Enterprise" name="segmento" value="ent" checked={get("segmento") === "ent"} onChange={() => set("segmento", "ent")} />
              </div>
            </Field>
          </Row>
          <Divider />
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Datos entidad legal</div>
          <Row>
            <Field label="Razón Social"><Input value={get("razonSocial")} onChange={e => set("razonSocial", e.target.value)} /></Field>
            <Field label="NIT"><Input value={get("nit")} onChange={e => set("nit", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Jurisdicción"><Input value={get("jurisdiccion")} onChange={e => set("jurisdiccion", e.target.value)} /></Field>
            <Field label="Dirección, Ciudad"><Input value={get("direccion")} onChange={e => set("direccion", e.target.value)} /></Field>
          </Row>
          <Row>
            <Field label="Nombre representante legal"><Input value={get("repLegal")} onChange={e => set("repLegal", e.target.value)} /></Field>
            <Field label="Documento representante legal"><Input value={get("docRepLegal")} onChange={e => set("docRepLegal", e.target.value)} /></Field>
          </Row>
        </Section>

        {/* 2. Productos */}
        <Section title="2 · Productos contratados" accent="#6366f1">
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>Selecciona todos los productos incluidos en el deal:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PRODUCTS.map(p => <ProductTag key={p} name={p} active={!!productos[p]} onClick={() => toggle(p)} />)}
          </div>
        </Section>

        {/* 3. Configuración */}
        {Object.values(productos).some(Boolean) && (
          <Section title="3 · Configuración por producto" accent="#f59e0b">

            {/* CUENTA */}
            {productos["Cuenta"] && (
              <div style={{ marginBottom: 20 }}>
                <SubHeader>Cuenta</SubHeader>
                <Row cols={3}>
                  <Field label="Modelo de operación">
                    <Select value={get("cuentaModelo")} onChange={e => set("cuentaModelo", e.target.value)} options={["Habilitador", "Agregador"]} />
                  </Field>
                  <Field label="Tipo de cuenta">
                    <Select value={get("cuentaTipo")} onChange={e => set("cuentaTipo", e.target.value)} options={["Cuenta del cliente en BCC", "Cuenta del cliente en Bancoomeva", "Cuenta de Mono en BCC", "Cuenta de Mono en Bancoomeva", "Cuenta de Mono en Global66 (USD)"]} />
                  </Field>
                  <Field label="Adicionales">
                    <CheckOption label="Acciones y Valores" checked={get("cuentaAV", false)} onChange={e => set("cuentaAV", e.target.checked)} />
                    <CheckOption label="Exención GMF" checked={get("cuentaGMF", false)} onChange={e => set("cuentaGMF", e.target.checked)} />
                    <CheckOption label="Requiere H2H (solo BCC)" checked={get("cuentaH2H", false)} onChange={e => set("cuentaH2H", e.target.checked)} />
                  </Field>
                </Row>
                {get("cuentaGMF") && <Field label="Numerales exención GMF"><Input placeholder="Listar numerales..." value={get("cuentaGMFNumerales")} onChange={e => set("cuentaGMFNumerales", e.target.value)} /></Field>}
                <Divider />
              </div>
            )}

            {/* CORE — Lite added */}
            {productos["Core"] && (
              <div style={{ marginBottom: 20 }}>
                <SubHeader>Core</SubHeader>
                <Row cols={3}>
                  <Field label="Plan">
                    <Select value={get("corePlan")} onChange={e => set("corePlan", e.target.value)} options={["Lite", "Basic", "Premium"]} />
                  </Field>
                  <Field label="Fondeo en">
                    <CheckOption label="COP" checked={get("coreFondeoCOP", false)} onChange={e => set("coreFondeoCOP", e.target.checked)} />
                    <CheckOption label="USD" checked={get("coreFondeoUSD", false)} onChange={e => set("coreFondeoUSD", e.target.checked)} />
                  </Field>
                  <Field label="Monedas a soportar">
                    <CheckOption label="COP" checked={get("coreMonedaCOP", false)} onChange={e => set("coreMonedaCOP", e.target.checked)} />
                    <CheckOption label="USD" checked={get("coreMonedaUSD", false)} onChange={e => set("coreMonedaUSD", e.target.checked)} />
                    <div style={{ marginTop: 4 }}><Input placeholder="Otras..." value={get("coreMonedaOtras")} onChange={e => set("coreMonedaOtras", e.target.value)} /></div>
                  </Field>
                </Row>
                <Row>
                  <Field label="Setup fee (+ IVA)"><Input placeholder="$0.00" value={get("coreSetup")} onChange={e => set("coreSetup", e.target.value)} /></Field>
                  <Field label="Mensualidad (+ IVA)"><Input placeholder="$0.00" value={get("coreMensualidad")} onChange={e => set("coreMensualidad", e.target.value)} /></Field>
                </Row>
                <Field label="Configuración del markup">
                  <Select value={get("coreMarkup")} onChange={e => set("coreMarkup", e.target.value)} options={["Solo compras internacionales", "Solo compras locales", "Compras locales e internacionales"]} />
                </Field>
                <Divider />
              </div>
            )}

            {/* TARJETAS */}
            {productos["Tarjetas"] && (
              <div style={{ marginBottom: 20 }}>
                <SubHeader>Tarjetas</SubHeader>
                <Row cols={3}>
                  <Field label="Tipo de tarjetas">
                    <CheckOption label="Físicas" checked={get("tarjFisicas", false)} onChange={e => set("tarjFisicas", e.target.checked)} />
                    <CheckOption label="Virtuales" checked={get("tarjVirtuales", false)} onChange={e => set("tarjVirtuales", e.target.checked)} />
                    <CheckOption label="Tokenización" checked={get("tarjToken", false)} onChange={e => set("tarjToken", e.target.checked)} />
                  </Field>
                  {get("tarjFisicas") && (
                    <Field label="Físicas – detalle">
                      <Input placeholder="Tarjetas a emitir" value={get("tarjFisicasCant")} onChange={e => set("tarjFisicasCant", e.target.value)} />
                      <div style={{ marginTop: 8 }}><Input placeholder="Valor del plástico" value={get("tarjPlastico")} onChange={e => set("tarjPlastico", e.target.value)} /></div>
                    </Field>
                  )}
                  {get("tarjToken") && (
                    <Field label="Tokenización – detalle">
                      <Input placeholder="Mensualidad + IVA" value={get("tarjTokenMens")} onChange={e => set("tarjTokenMens", e.target.value)} />
                      <div style={{ marginTop: 8 }}>
                        <CheckOption label="Google Pay" checked={get("tarjGPay", false)} onChange={e => set("tarjGPay", e.target.checked)} />
                        <CheckOption label="Apple Pay" checked={get("tarjAPay", false)} onChange={e => set("tarjAPay", e.target.checked)} />
                      </div>
                    </Field>
                  )}
                </Row>
                <Field label="Número máx. tarjetas por usuario">
                  <Input placeholder="Ej. 5" value={get("tarjMax")} onChange={e => set("tarjMax", e.target.value)} />
                </Field>
                <Divider />
              </div>
            )}

            {/* PAYOUTS — Otro + image upload for Por rango */}
            {productos["Payouts"] && (
              <div style={{ marginBottom: 20 }}>
                <SubHeader>Payouts</SubHeader>
                <Row cols={2}>
                  <Field label="Rieles de transferencia">
                    <CheckOption label="ACH" checked={get("payoutACH", false)} onChange={e => set("payoutACH", e.target.checked)} />
                    <CheckOption label="Transfiya / Turbo" checked={get("payoutTransfiya", false)} onChange={e => set("payoutTransfiya", e.target.checked)} />
                    <CheckOption label="Bre-B" checked={get("payoutBreB", false)} onChange={e => set("payoutBreB", e.target.checked)} />
                  </Field>
                  <Field label="Esquema de costos">
                    <Select value={get("payoutEsquema")} onChange={e => set("payoutEsquema", e.target.value)} options={["Fijo por transferencia", "Por rango", "Otro"]} />
                    {get("payoutEsquema") === "Fijo por transferencia" && (
                      <>
                        {get("payoutACH") && <div style={{ marginTop: 8 }}><Input placeholder="ACH: $ + IVA" value={get("payoutCostoACH")} onChange={e => set("payoutCostoACH", e.target.value)} /></div>}
                        {get("payoutBreB") && <div style={{ marginTop: 8 }}><Input placeholder="Bre-B: $ + IVA" value={get("payoutCostoBreB")} onChange={e => set("payoutCostoBreB", e.target.value)} /></div>}
                      </>
                    )}
                    {get("payoutBreB") && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f3f4f6" }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Validación de llave</div>
                        <div style={{ display: "flex", gap: 16, marginBottom: 6 }}>
                          <RadioOption label="Sí" name="payoutValidLlave" value="si" checked={get("payoutValidLlave") === "si"} onChange={() => set("payoutValidLlave", "si")} />
                          <RadioOption label="No" name="payoutValidLlave" value="no" checked={get("payoutValidLlave") === "no"} onChange={() => set("payoutValidLlave", "no")} />
                        </div>
                        {get("payoutValidLlave") === "si" && (
                          <Input placeholder="Costo validación de llave: $ + IVA" value={get("payoutCostoValidLlave")} onChange={e => set("payoutCostoValidLlave", e.target.value)} />
                        )}
                      </div>
                    )}
                    {get("payoutEsquema") === "Otro" && <OtroDetalle value={get("payoutEsquemaOtro")} onChange={e => set("payoutEsquemaOtro", e.target.value)} />}
                    {get("payoutEsquema") === "Por rango" && <ImageUpload label="Screenshot pricing por rango" value={images.payoutImg} onChange={v => setImages(prev => ({ ...prev, payoutImg: v }))} />}
                  </Field>
                </Row>
                <Row>
                  <Field label="Setup fee (+ IVA)"><Input placeholder="$0.00" value={get("payoutSetup")} onChange={e => set("payoutSetup", e.target.value)} /></Field>
                  <Field label="Mínimo facturable mensual"><Input placeholder="$0.00" value={get("payoutMin")} onChange={e => set("payoutMin", e.target.value)} /></Field>
                </Row>
                <Divider />
              </div>
            )}

            {/* PAYINS — conditional add-ons (Basic only), conditional costo por intento, Otro + image */}
            {productos["Payins"] && (
              <div style={{ marginBottom: 20 }}>
                <SubHeader>Payins</SubHeader>
                <Row cols={2}>
                  <Field label="Métodos de recaudo">
                    <CheckOption label="PSE de Mono" checked={get("payinPSE", false)} onChange={e => set("payinPSE", e.target.checked)} />
                    <CheckOption label="Servicio de adquirencia" checked={get("payinAdq", false)} onChange={e => set("payinAdq", e.target.checked)} />
                    <CheckOption label="Bre-B Collections" checked={get("payinBreB", false)} onChange={e => set("payinBreB", e.target.checked)} />
                    <CheckOption label="Gestión Código Recaudo banco" checked={get("payinCodigo", false)} onChange={e => set("payinCodigo", e.target.checked)} />
                  </Field>
                  <Field label="Costos recaudo">
                    {get("payinPSE") && <div style={{ marginBottom: 8 }}><Input placeholder="Costo PSE: $ + IVA" value={get("payinCostoPSE")} onChange={e => set("payinCostoPSE", e.target.value)} /></div>}
                    {get("payinAdq") && <div style={{ marginBottom: 8 }}><Input placeholder="Costo adquirencia: $ + IVA" value={get("payinCostoAdq")} onChange={e => set("payinCostoAdq", e.target.value)} /></div>}
                  </Field>
                </Row>

                {get("payinBreB") && (
                  <>
                    <Row>
                      <Field label="Plan Bre-B Collections">
                        <Select value={get("payinBreBPlan")} onChange={e => set("payinBreBPlan", e.target.value)} options={["Plan Full", "Plan Basic", "Otro"]} />
                      </Field>
                      {/* Add-ons ONLY visible when Plan Basic selected */}
                      {get("payinBreBPlan") === "Plan Basic" && (
                        <Field label="Add-ons">
                          <CheckOption label="Generación QR" checked={get("payinQR", false)} onChange={e => set("payinQR", e.target.checked)} />
                          <CheckOption label="Hasta 2 reglas de validación" checked={get("payin2Reglas", false)} onChange={e => set("payin2Reglas", e.target.checked)} />
                          <CheckOption label="Hasta 4 reglas de validación" checked={get("payin4Reglas", false)} onChange={e => set("payin4Reglas", e.target.checked)} />
                        </Field>
                      )}
                    </Row>

                    <Row>
                      <Field label="Setup fee (+ IVA)"><Input placeholder="$0.00" value={get("payinSetup")} onChange={e => set("payinSetup", e.target.value)} /></Field>
                      <Field label="Esquema de costos Bre-B">
                        <Select value={get("payinEsquema")} onChange={e => set("payinEsquema", e.target.value)} options={["Fijo por intento", "Por rango", "Otro"]} />
                        {get("payinEsquema") === "Otro" && <OtroDetalle value={get("payinEsquemaOtro")} onChange={e => set("payinEsquemaOtro", e.target.value)} />}
                        {get("payinEsquema") === "Por rango" && <ImageUpload label="Screenshot pricing por rango" value={images.payinImg} onChange={v => setImages(prev => ({ ...prev, payinImg: v }))} />}
                      </Field>
                    </Row>

                    {/* Costo por intento ONLY when Fijo por intento */}
                    <Row>
                      {get("payinEsquema") === "Fijo por intento" && (
                        <Field label="Costo por intento (+ IVA)"><Input placeholder="$0.00" value={get("payinCostoIntento")} onChange={e => set("payinCostoIntento", e.target.value)} /></Field>
                      )}
                      <Field label="Mínimo facturable mensual"><Input placeholder="$0.00" value={get("payinMin")} onChange={e => set("payinMin", e.target.value)} /></Field>
                    </Row>
                  </>
                )}

                {!get("payinBreB") && (
                  <Row cols={1}><Field label="Setup fee (+ IVA)"><Input placeholder="$0.00" value={get("payinSetup")} onChange={e => set("payinSetup", e.target.value)} /></Field></Row>
                )}
                <Divider />
              </div>
            )}

            {/* WALLET */}
            {productos["Wallet Marca Blanca"] && (
              <div style={{ marginBottom: 4 }}>
                <SubHeader>Wallet Marca Blanca</SubHeader>
                <Field label="Funcionalidades">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                    <CheckOption label="Transferencias entre wallets" checked={get("walletTransf", false)} onChange={e => set("walletTransf", e.target.checked)} />
                    <CheckOption label="Transferencia ACH" checked={get("walletACH", false)} onChange={e => set("walletACH", e.target.checked)} />
                    <CheckOption label="Transfiya / Turbo" checked={get("walletTransfiya", false)} onChange={e => set("walletTransfiya", e.target.checked)} />
                    <CheckOption label="Activación tarjetas físicas" checked={get("walletTarjetas", false)} onChange={e => set("walletTarjetas", e.target.checked)} />
                    <CheckOption label="Solicitud tarjeta por usuario final" checked={get("walletSolicitud", false)} onChange={e => set("walletSolicitud", e.target.checked)} />
                  </div>
                </Field>
                <Row>
                  <Field label="Costo transferencia a cuenta banco (+ IVA)"><Input placeholder="$0.00" value={get("walletCostoTransf")} onChange={e => set("walletCostoTransf", e.target.value)} /></Field>
                  <Field label="GMF lo asume">
                    <div style={{ display: "flex", gap: 16 }}>
                      <RadioOption label="Cliente / Tenant" name="walletGMF" value="cliente" checked={get("walletGMF") === "cliente"} onChange={() => set("walletGMF", "cliente")} />
                      <RadioOption label="Usuario Final" name="walletGMF" value="usuario" checked={get("walletGMF") === "usuario"} onChange={() => set("walletGMF", "usuario")} />
                    </div>
                  </Field>
                </Row>
                <Divider />
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Account 2 Account FX Transfer</div>
                <Row cols={2}>
                  <Field label="¿Incluye A2A FX?">
                    <div style={{ display: "flex", gap: 16 }}>
                      <RadioOption label="Sí" name="walletA2A" value="si" checked={get("walletA2A") === "si"} onChange={() => set("walletA2A", "si")} />
                      <RadioOption label="No" name="walletA2A" value="no" checked={get("walletA2A") === "no"} onChange={() => set("walletA2A", "no")} />
                    </div>
                  </Field>
                  {get("walletA2A") === "si" && (
                    <Field label="Comisión sobre tasa de cambio (%)"><Input placeholder="Ej. 1.5%" value={get("walletComision")} onChange={e => set("walletComision", e.target.value)} /></Field>
                  )}
                </Row>
                {get("walletA2A") === "si" && (
                  <>
                    <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>Costos fijos por transferencia (moneda origen):</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 16 }}>
                      {["COP", "USD", "CLP", "MXN", "PEN"].map(m => (
                        <Field key={m} label={m}><Input placeholder="$0" value={get(`walletFX${m}`)} onChange={e => set(`walletFX${m}`, e.target.value)} /></Field>
                      ))}
                    </div>
                    <Field label="Endpoint consulta tasas de cambio">
                      <div style={{ display: "flex", gap: 16 }}>
                        <RadioOption label="Activar" name="walletEndpoint" value="si" checked={get("walletEndpoint") === "si"} onChange={() => set("walletEndpoint", "si")} />
                        <RadioOption label="No activar" name="walletEndpoint" value="no" checked={get("walletEndpoint") === "no"} onChange={() => set("walletEndpoint", "no")} />
                      </div>
                    </Field>
                  </>
                )}
              </div>
            )}
          </Section>
        )}

        {/* 4. Contexto del deal — all required, no promesas */}
        <Section title="4 · Contexto del deal" accent="#10b981">
          <Row cols={1}>
            <Field label="Descripción del cliente" required>
              <Input multiline rows={2} placeholder="Qué hace el cliente, quiénes son..." value={get("descripcion")} onChange={e => set("descripcion", e.target.value)} />
            </Field>
          </Row>
          <Row cols={1}>
            <Field label="Volumen transaccional" required>
              <Input multiline rows={2} placeholder="Número de transacciones, ticket promedio, usuarios proyectados..." value={get("volumen")} onChange={e => set("volumen", e.target.value)} />
            </Field>
          </Row>
          <Row cols={1}>
            <Field label="Caso de uso" required>
              <Input multiline rows={2} placeholder="Para qué va a usar Mono..." value={get("casoUso")} onChange={e => set("casoUso", e.target.value)} />
            </Field>
          </Row>
        </Section>

        {/* 5. Notas */}
        <Section title="5 · Notas de handoff" accent="#8b5cf6">
          <Field label="Condiciones especiales y descuentos">
            <Input multiline rows={3} placeholder="Descuentos, inicio del cobro de la mensualidad, mínimo facturable, cualquier información adicional..." value={get("notas")} onChange={e => set("notas", e.target.value)} />
          </Field>
          <Divider />
          <Row>
            <Field label="Completado por" required><Input placeholder="Nombre del vendedor" value={get("completadoPor")} onChange={e => set("completadoPor", e.target.value)} /></Field>
            <Field label="Fecha"><Input placeholder="dd/mm/aaaa" value={get("fechaCompletado")} onChange={e => set("fechaCompletado", e.target.value)} /></Field>
          </Row>
        </Section>

        {/* Submit */}
        <div style={{ textAlign: "right", paddingBottom: 40 }}>
          {form.empresa && (
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10 }}>
              Se generará: <span style={{ color: "#374151", fontWeight: 600 }}>Template cierre de negocio - {form.empresa}_V{nextVersion}</span>
            </div>
          )}
          <button onClick={handleGeneratePDF} style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em" }}>
            Generar PDF y hacer handoff →
          </button>
        </div>

      </div>
    </div>
  );
}
