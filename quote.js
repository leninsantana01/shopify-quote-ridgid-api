const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { product, variant, sku, product_url, name, company, email, phone, quantity, notes } = req.body;

  if (!name || !company || !email || !quantity) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    // Correo al cliente
    await resend.emails.send({
      from: 'RIDGID <onboarding@resend.dev>',
      to: email,
      bcc: 'hectornavarro@mmco.com.mx',
      subject: 'Confirmación de solicitud de cotización - RIDGID',
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#d32f2f;padding:24px;text-align:center">
          <img src="https://cdn.shopify.com/s/files/1/0524/9348/4231/files/mmachinery_970a2f14-4478-4e54-8209-f3f18285d711.jpg" alt="RIDGID" style="max-width:200px;height:auto">
        </div>
        <div style="padding:32px">
          <h2 style="color:#d32f2f;margin-top:0">¡Hola ${name}!</h2>
          <p>Recibimos tu solicitud de cotización. Un asesor técnico te contactará en <strong>menos de 24 horas hábiles</strong>.</p>
          <div style="background:#d32f2f ;padding:16px;border-radius:6px;margin:24px 0">
            <p style="margin:4px 0"><strong>Producto:</strong> ${product}</p>
            ${sku ? `<p style="margin:4px 0"><strong>SKU:</strong> ${sku}</p>` : ''}
            <p style="margin:4px 0"><strong>Cantidad:</strong> ${quantity}</p>
            <p style="margin:4px 0"><strong>Empresa:</strong> ${company}</p>
            ${notes ? `<p style="margin:4px 0"><strong>Especificaciones:</strong> ${notes}</p>` : ''}
          </div>
          <p style="color:#666;font-size:14px">¿Preguntas urgentes? Llámanos al <strong>55 5351 6970</strong><br>
          <strong>Horario de atención:</strong> 9:00 - 17:00 hrs</p>
        </div>
        <div style="background:#d32f2f ;padding:16px;text-align:center;font-size:12px;color:#666">
          RIDGID · <a href="https://ridgidmc.com" style="color:#d32f2f;text-decoration:none">ridgidmc.com</a>
        </div>
      </div>`
    });

    // Correo al equipo de ventas
    await resend.emails.send({
      from: 'RIDGID Cotizaciones <onboarding@resend.dev>',
      to: 'hectornavarro@mmco.com.mx',
      subject: `[Nueva Cotización] ${product} — ${company}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#d32f2f;padding:16px 24px">
          <h2 style="color:white;margin:0">Nueva solicitud de cotización</h2>
        </div>
        <div style="padding:24px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:130px">Producto</td><td style="padding:8px;border-bottom:1px solid #eee">${product}</td></tr>
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
            <p style="margin:0">Solicitud recibida a través de formulario de cotización en ridgidmc.com</p>
          </div>
        </div>
      </div>`
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error procesando la solicitud' });
  }
}
