const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración de marcas
const brands = {
  ridgid: {
    name: 'RIDGID',
    color: '#d32f2f',
    colorDark: '#b71c1c',
    logo: 'https://cdn.shopify.com/s/files/1/0524/9348/4231/files/mmachinery_970a2f14-4478-4e54-8209-f3f18285d711.jpg',
    email: 'hectornavarro@mmco.com.mx',
    phone: '55 5351 6970',
    website: 'ridgidmc.com',
    websiteUrl: 'https://ridgidmc.com',
    formality: 'usted'
  },
  greenlee: {
    name: 'GreenleeMC',
    color: '#1a5c2a',
    colorDark: '#0d3d1a',
    logo: 'https://cdn.shopify.com/s/files/1/0793/6095/0502/files/logo_GreenleeMC_f06c1043-8488-437c-b7a2-79b5505e7341.jpg?v=1774889775',
    email: 'hectornavarro@mmco.com.mx',
    phone: '55 5351 6970',
    website: 'greenleemc.com',
    websiteUrl: 'https://greenleemc.com',
    formality: 'usted'
  },
  construirmx: {
    name: 'Construir MX',
    color: '#d32f2f',
    colorDark: '#b71c1c',
    logo: 'https://cdn.shopify.com/s/files/1/0265/3428/1302/files/logo_construirmx_f0c0d036-dab5-4dd8-a5fa-3250eca91b98.png?v=1778004251',
    email: 'hectornavarro@mmco.com.mx',
    phone: '55 5351 6970',
    website: 'construir.com.mx',
    websiteUrl: 'https://construir.com.mx',
    formality: 'usted'
  }
};

// DIRECCIÓN DE PRUEBA - Temporalmente todos los correos van aquí
const TEST_EMAIL = 'lenin@equipmentn.com';

// Función para generar el correo del cliente
function getClientEmailHTML(brand, data) {
  const brandConfig = brands[brand] || brands.ridgid;
  const { product, variant, sku, name, company, quantity, notes } = data;

  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:${brandConfig.color};padding:24px;text-align:center">
      <img src="${brandConfig.logo}" alt="${brandConfig.name}" style="max-width:200px;height:auto">
    </div>
    <div style="padding:32px">
      <h2 style="color:${brandConfig.color};margin-top:0">¡Hola ${name}!</h2>
      <p>Recibimos tu solicitud de cotización. Un asesor técnico te contactará en <strong>menos de 24 horas hábiles</strong>.</p>
      <div style="background:#f5f5f5;padding:16px;border-radius:6px;margin:24px 0">
        <p style="margin:4px 0"><strong>Producto:</strong> ${product}</p>
        ${sku ? `<p style="margin:4px 0"><strong>SKU:</strong> ${sku}</p>` : ''}
        <p style="margin:4px 0"><strong>Cantidad:</strong> ${quantity}</p>
        <p style="margin:4px 0"><strong>Empresa:</strong> ${company}</p>
        ${notes ? `<p style="margin:4px 0"><strong>Especificaciones:</strong> ${notes}</p>` : ''}
      </div>
      <p style="color:#666;font-size:14px">¿Preguntas urgentes? Llámanos al <strong>${brandConfig.phone}</strong><br>
      <strong>Horario de atención:</strong> 9:00 - 17:00 hrs</p>
    </div>
    <div style="background:#f0f0f0;padding:16px;text-align:center;font-size:12px;color:#666">
      ${brandConfig.name} · <a href="${brandConfig.websiteUrl}" style="color:${brandConfig.color};text-decoration:none">${brandConfig.website}</a>
    </div>
  </div>`;
}

// Función para generar el correo del equipo de ventas
function getSalesEmailHTML(brand, data) {
  const brandConfig = brands[brand] || brands.ridgid;
  const { product, variant, sku, product_url, name, company, email, phone, quantity, notes } = data;

  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
    <div style="background:${brandConfig.color};padding:16px 24px">
      <h2 style="color:white;margin:0">Nueva solicitud de cotización - ${brandConfig.name}</h2>
    </div>
    <div style="padding:24px">
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:130px">Producto</td><td style="padding:8px;border-bottom:1px solid #eee">${product}</td></tr>
        ${variant ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Variante</td><td style="padding:8px;border-bottom:1px solid #eee">${variant}</td></tr>` : ''}
        ${sku ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">SKU</td><td style="padding:8px;border-bottom:1px solid #eee">${sku}</td></tr>` : ''}
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Cantidad</td><td style="padding:8px;border-bottom:1px solid #eee">${quantity}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Cliente</td><td style="padding:8px;border-bottom:1px solid #eee">${name}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Empresa</td><td style="padding:8px;border-bottom:1px solid #eee">${company}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Teléfono</td><td style="padding:8px;border-bottom:1px solid #eee">${phone}</td></tr>` : ''}
        ${notes ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Especificaciones</td><td style="padding:8px;border-bottom:1px solid #eee">${notes}</td></tr>` : ''}
        ${product_url ? `<tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">URL Producto</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="${product_url}">${product_url}</a></td></tr>` : ''}
      </table>
      <div style="margin-top:24px;padding-top:24px;border-top:1px solid #eee;font-size:12px;color:#666">
        <p style="margin:0">Solicitud recibida a través de formulario de cotización en ${brandConfig.website}</p>
      </div>
    </div>
  </div>`;
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { brand, product, variant, sku, product_url, name, company, email, phone, quantity, notes } = req.body;

  // Validación de marca
  if (!brand || !brands[brand]) {
    return res.status(400).json({ error: 'Marca no válida. Debe ser: ridgid, greenlee o construirmx' });
  }

  // Validación de campos requeridos
  if (!name || !company || !email || !product || !quantity) {
    return res.status(400).json({ error: 'Faltan campos requeridos: name, company, email, product, quantity' });
  }

  const brandConfig = brands[brand];

  try {
    // Correo al cliente - TEMPORALMENTE VA A TEST_EMAIL
    const clientEmailResult = await resend.emails.send({
      from: `${brandConfig.name} <onboarding@resend.dev>`,
      to: TEST_EMAIL,
      subject: 'Confirmación de solicitud de cotización - ' + brandConfig.name,
      html: getClientEmailHTML(brand, { product, variant, sku, name, company, quantity, notes })
    });

    if (!clientEmailResult || clientEmailResult.error) {
      console.error('Error enviando correo al cliente:', clientEmailResult.error);
      return res.status(500).json({ error: 'Error enviando confirmación al cliente' });
    }

    // Correo al equipo de ventas - TEMPORALMENTE VA A TEST_EMAIL
    const salesEmailResult = await resend.emails.send({
      from: `${brandConfig.name} Cotizaciones <onboarding@resend.dev>`,
      to: TEST_EMAIL,
      subject: `[Nueva Cotización - ${brandConfig.name}] ${product} — ${company}`,
      html: getSalesEmailHTML(brand, { product, variant, sku, product_url, name, company, email, phone, quantity, notes })
    });

    if (!salesEmailResult || salesEmailResult.error) {
      console.error('Error enviando correo al equipo de ventas:', salesEmailResult.error);
      return res.status(500).json({ error: 'Error enviando solicitud al equipo de ventas' });
    }

    return res.status(200).json({ success: true, message: 'Cotización registrada exitosamente' });
  } catch (error) {
    console.error('Error en el handler:', error);
    return res.status(500).json({ error: 'Error procesando la solicitud', details: error.message });
  }
};
