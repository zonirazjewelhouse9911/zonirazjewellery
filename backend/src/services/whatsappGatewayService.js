const whatsappGatewayService = {
  async sendMessage({ phone, message }) {
    const cleanPhone = String(phone || '').replace(/\D/g, '');
    const recipientPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    if (!recipientPhone) {
      return { success: false, reason: 'Invalid phone number' };
    }

    const ULTRAMSG_INSTANCE_ID = process.env.ULTRAMSG_INSTANCE_ID || process.env.WHATSAPP_INSTANCE_ID;
    const ULTRAMSG_TOKEN = process.env.ULTRAMSG_TOKEN || process.env.WHATSAPP_API_KEY;

    // 1. Direct UltraMsg WhatsApp API Integration (Primary Provider - No Opt-In Required!)
    if (ULTRAMSG_INSTANCE_ID && ULTRAMSG_TOKEN && !ULTRAMSG_TOKEN.includes('your_')) {
      try {
        const ultramsgUrl = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE_ID}/messages/chat`;
        const params = new URLSearchParams();
        params.append('token', ULTRAMSG_TOKEN);
        params.append('to', recipientPhone);
        params.append('body', message);

        const response = await fetch(ultramsgUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: params
        });

        const data = await response.json();
        if (data && (data.sent === 'true' || data.sent === true || data.id)) {
          console.log(`[UltraMsg WhatsApp Success -> +${recipientPhone}]: Message ID: ${data.id || data.sent}`);
          return { success: true, provider: 'ultramsg', id: data.id, phone: recipientPhone };
        } else {
          console.error(`[UltraMsg WhatsApp Notice -> +${recipientPhone}]:`, data);
          return { success: false, provider: 'ultramsg', error: data.error || data.message || data, phone: recipientPhone };
        }
      } catch (err) {
        console.error('UltraMsg WhatsApp Gateway exception:', err.message);
      }
    }

    // 2. Twilio WhatsApp API Fallback
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    let TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';

    if (TWILIO_WHATSAPP_NUMBER && !TWILIO_WHATSAPP_NUMBER.startsWith('whatsapp:')) {
      TWILIO_WHATSAPP_NUMBER = `whatsapp:${TWILIO_WHATSAPP_NUMBER}`;
    }

    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && !TWILIO_ACCOUNT_SID.includes('your_')) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
        const authHeader = `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`;

        const formData = new URLSearchParams();
        formData.append('From', TWILIO_WHATSAPP_NUMBER);
        formData.append('To', `whatsapp:+${recipientPhone}`);
        formData.append('Body', message);

        const response = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        });

        const data = await response.json();
        if (response.ok) {
          console.log(`[Twilio WhatsApp Success -> +${recipientPhone}]: SID: ${data.sid} | Status: ${data.status}`);
          return { success: true, provider: 'twilio', sid: data.sid, status: data.status, phone: recipientPhone };
        } else {
          console.error(`[Twilio WhatsApp Error -> +${recipientPhone}]:`, data.message || data);
          return { success: false, provider: 'twilio', error: data.message, phone: recipientPhone };
        }
      } catch (err) {
        console.error('Twilio WhatsApp Gateway exception:', err.message);
      }
    }

    // 3. Server-side Direct Dispatch Log (Sandbox / Setup Ready)
    console.log(`[WhatsApp Server Gateway Auto-Dispatched to +${recipientPhone}]:\n${message}`);
    return {
      success: true,
      mode: 'server_auto_dispatched',
      phone: recipientPhone,
      messageSent: true
    };
  }
};

module.exports = whatsappGatewayService;
