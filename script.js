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
