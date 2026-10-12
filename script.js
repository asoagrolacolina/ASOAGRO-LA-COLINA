/*
  CONFIGURACIÓN INICIAL:
  1) Reemplaza WHATSAPP_NUMBER con el número de la asociación en formato internacional,
     solo números. Para Colombia, comienza por 57. Ejemplo ficticio: 573001234567.
  2) Cambia nombres, presentaciones y precios de PRODUCTS por la oferta real.
*/
const WHATSAPP_NUMBER = "573214054298"; // WhatsApp ASOAGRO LA COLINA (Colombia)
const PRODUCTS = [
  { id: "docena", name: "Cubeta de 12 huevos", detail: "Presentación de una docena", price: 0, label: "PARA EL HOGAR" },
  { id: "30", name: "Cubeta de 30 huevos", detail: "Presentación familiar", price: 0, label: "FAMILIAR" },
  { id: "mayor", name: "Pedido por volumen", detail: "Consulta disponibilidad y precio", price: 0, label: "PARA NEGOCIOS" }
];
const quantities = Object.fromEntries(PRODUCTS.map(p => [p.id, 0]));
const money = amount => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(amount);

function eggArt() {
  return '<div class="carton">' + Array.from({length:6}, () => '<span class="mini-egg"></span>').join("") + '</div>';
}
function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product-card">
      <div class="product-art">${eggArt()}<span class="product-badge">${p.label}</span></div>
      <h3>${p.name}</h3>
      <p class="product-description">${p.detail}</p>
      <div class="product-bottom">
        <div class="price">${p.price > 0 ? money(p.price) : "Consultar"}<small>${p.price > 0 ? "COP / presentación" : "Precio por confirmar"}</small></div>
        <div class="quantity" aria-label="Cantidad de ${p.name}">
          <button type="button" aria-label="Quitar uno" onclick="changeQuantity('${p.id}', -1)">−</button>
          <output id="qty-${p.id}">0</output>
          <button type="button" aria-label="Agregar uno" onclick="changeQuantity('${p.id}', 1)">+</button>
        </div>
      </div>
    </article>`).join("");
}
function changeQuantity(id, delta) {
  quantities[id] = Math.max(0, (quantities[id] || 0) + delta);
  document.getElementById(`qty-${id}`).textContent = quantities[id];
  updateCart();
}
function updateCart() {
  const selected = PRODUCTS.filter(p => quantities[p.id] > 0);
  const count = selected.reduce((sum, p) => sum + quantities[p.id], 0);
  const total = selected.every(p => p.price > 0) ? selected.reduce((sum,p) => sum + p.price * quantities[p.id], 0) : null;
  document.getElementById("cart-summary").textContent = count
    ? `${count} presentación(es) seleccionada(s)${total !== null ? " · " + money(total) : " · total por confirmar"}`
    : "Aún no has agregado productos";
  document.getElementById("checkout").disabled = count === 0;
}
function openWhatsApp(message) {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (!number || number === "573000000000") {
    alert("Antes de recibir pedidos, el administrador debe configurar el número real de WhatsApp en el archivo script.js.");
    return;
  }
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
}
document.getElementById("checkout").addEventListener("click", () => {
  const selected = PRODUCTS.filter(p => quantities[p.id] > 0);
  if (!selected.length) return;
  let message = "¡Hola, ASOAGRO LA COLINA! Quiero hacer este pedido de Eco Huevos – La Colina:\n\n";
  selected.forEach(p => message += `• ${p.name}: ${quantities[p.id]} presentación(es)${p.price > 0 ? " — " + money(p.price * quantities[p.id]) : ""}\n`);
  message += "\nPor favor, confirmen disponibilidad, valor total y opciones de entrega. Gracias.";
  openWhatsApp(message);
});
document.getElementById("contact-whatsapp").addEventListener("click", event => {
  event.preventDefault();
  openWhatsApp("¡Hola, ASOAGRO LA COLINA! Quisiera recibir información sobre Eco Huevos – La Colina.");
});
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
updateCart();

/* EFECTO INTERACTIVO: FRACTURA DORADA DE LA CÁSCARA
   Al tocar/clicar la ilustración aparece una red de grietas orgánicas,
   destellos cálidos y pequeños fragmentos. No requiere librerías externas. */
(function initShellEffect() {
  const stage = document.querySelector('.hero-art');
  const canvas = document.getElementById('shell-canvas');
  if (!stage || !canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0, height = 0, dpr = 1;
  let effects = [];
  let animationFrame = 0;
  let lastMove = 0;

  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function random(min, max) { return min + Math.random() * (max - min); }

  function makeCrack(x, y) {
    const paths = [];
    const mainCount = 9 + Math.floor(Math.random() * 4);
    const radius = Math.min(72, Math.max(42, Math.min(width, height) * .19));
    for (let i = 0; i < mainCount; i++) {
      const angle = (Math.PI * 2 * i / mainCount) + random(-.19, .19);
      const length = radius * random(.58, 1.2);
      const points = [{ x, y }];
      let px = x, py = y;
      const steps = 4 + Math.floor(Math.random() * 3);
      for (let j = 1; j <= steps; j++) {
        const distance = length / steps;
        const a = angle + random(-.26, .26);
        px += Math.cos(a) * distance;
        py += Math.sin(a) * distance;
        points.push({ x: px, y: py });
      }
      paths.push({ points, branch: false, delay: random(0, 110) });
      // Ramificaciones cortas e irregulares: recuerdan la fractura de una cáscara.
      if (i % 2 === 0 && points.length > 3) {
        const base = points[2 + Math.floor(Math.random() * (points.length - 2))];
        const branchAngle = angle + random(-1.25, 1.25);
        const branchLength = length * random(.18, .38);
        const end = { x: base.x + Math.cos(branchAngle) * branchLength, y: base.y + Math.sin(branchAngle) * branchLength };
        const mid = { x: base.x + (end.x - base.x) * .52 + random(-5, 5), y: base.y + (end.y - base.y) * .52 + random(-5, 5) };
        paths.push({ points: [base, mid, end], branch: true, delay: random(100, 240) });
      }
    }
    const shards = Array.from({ length: 5 }, () => ({
      angle: random(0, Math.PI * 2), distance: random(12, 34), size: random(3, 8), rotation: random(-1, 1)
    }));
    return { x, y, started: performance.now(), paths, shards, radius };
  }

  function drawPath(path, progress, alpha) {
    const pts = path.points;
    if (pts.length < 2) return;
    const total = pts.length - 1;
    const scaled = Math.min(total, progress * total);
    const full = Math.floor(scaled);
    const partial = scaled - full;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i <= full; i++) ctx.lineTo(pts[i].x, pts[i].y);
    if (full < total) {
      const a = pts[full], b = pts[full + 1];
      ctx.lineTo(a.x + (b.x - a.x) * partial, a.y + (b.y - a.y) * partial);
    }
    ctx.globalAlpha = alpha;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.strokeStyle = '#f6e3a6'; ctx.lineWidth = path.branch ? 1 : 1.65;
    ctx.shadowColor = '#e4bd60'; ctx.shadowBlur = 11;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = alpha * .72;
    ctx.strokeStyle = '#fff9e8'; ctx.lineWidth = .55;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function render(now) {
    ctx.clearRect(0, 0, width, height);
    effects = effects.filter(effect => now - effect.started < 1750);
    for (const effect of effects) {
      const elapsed = now - effect.started;
      const fade = elapsed < 950 ? 1 : Math.max(0, 1 - (elapsed - 950) / 800);
      // Halo de impacto que se abre y se desvanece.
      if (elapsed < 650) {
        const ringProgress = elapsed / 650;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, 7 + ringProgress * effect.radius * .72, 0, Math.PI * 2);
        ctx.strokeStyle = '#e7c875'; ctx.lineWidth = 1.1; ctx.globalAlpha = (1 - ringProgress) * .5;
        ctx.shadowColor = '#e7c875'; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }
      for (const path of effect.paths) {
        const local = Math.max(0, elapsed - path.delay);
        const duration = path.branch ? 310 : 440;
        drawPath(path, Math.min(1, local / duration), fade * Math.min(1, local / 90));
      }
      if (elapsed > 250) {
        const chipProgress = Math.min(1, (elapsed - 250) / 650);
        for (const shard of effect.shards) {
          const sx = effect.x + Math.cos(shard.angle) * shard.distance * chipProgress;
          const sy = effect.y + Math.sin(shard.angle) * shard.distance * chipProgress + chipProgress * 8;
          ctx.save(); ctx.translate(sx, sy); ctx.rotate(shard.rotation * chipProgress);
          ctx.globalAlpha = fade * (1 - chipProgress * .55);
          ctx.fillStyle = '#e6d5a6'; ctx.strokeStyle = '#fff0c6'; ctx.lineWidth = .6;
          ctx.beginPath(); ctx.moveTo(0, -shard.size); ctx.lineTo(shard.size * .75, 2); ctx.lineTo(-shard.size * .6, shard.size * .5); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
        }
      }
    }
    ctx.globalAlpha = 1;
    if (effects.length) animationFrame = requestAnimationFrame(render);
    else { animationFrame = 0; stage.classList.remove('cracking'); }
  }

  function trigger(clientX, clientY) {
    const rect = stage.getBoundingClientRect();
    const x = Math.max(12, Math.min(width - 12, clientX - rect.left));
    const y = Math.max(12, Math.min(height - 12, clientY - rect.top));
    effects.push(makeCrack(x, y));
    if (effects.length > 3) effects.shift();
    stage.classList.add('cracking');
    if (!animationFrame) animationFrame = requestAnimationFrame(render);
  }

  stage.addEventListener('click', event => trigger(event.clientX, event.clientY));
  stage.addEventListener('pointermove', event => {
    // Pequeño destello al pasar el cursor, sin dibujar grietas constantemente.
    const now = performance.now();
    if (event.pointerType === 'mouse' && now - lastMove > 1800 && Math.random() > .72) {
      lastMove = now;
      const rect = stage.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f7e5ad'; ctx.shadowColor = '#e7c875'; ctx.shadowBlur = 13; ctx.fill(); ctx.restore();
      setTimeout(() => { if (!effects.length) ctx.clearRect(0, 0, width, height); }, 350);
    }
  });
  if ('ResizeObserver' in window) new ResizeObserver(resizeCanvas).observe(stage);
  else window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
})();

