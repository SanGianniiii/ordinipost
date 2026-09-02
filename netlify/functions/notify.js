const admin = require('firebase-admin');

// Inizializza firebase-admin una sola volta (le funzioni serverless possono restare "calde" tra una chiamata e l'altra)
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

exports.handler = async function (event) {
  // Risposta alle richieste preflight CORS (nel caso in futuro chiami la funzione da un altro dominio)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    // Protezione semplice: solo chi conosce il secret concordato può inviare notifiche
    if (!process.env.NOTIFY_SECRET || body.secret !== process.env.NOTIFY_SECRET) {
      return { statusCode: 401, body: JSON.stringify({ errore: 'Non autorizzato' }) };
    }

    const db = admin.firestore();
    const tokensSnap = await db.collection('admin_tokens').get();
    const tokens = tokensSnap.docs.map((doc) => doc.id);

    if (tokens.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ inviate: 0, motivo: 'Nessun dispositivo registrato' }),
      };
    }

    const messaggio = {
      data: {
        title: body.title || 'Nuova Prenotazione',
        body: body.body || '',
      },
      tokens: tokens,
    };

    const risposta = await admin.messaging().sendEachForMulticast(messaggio);

    // Pulizia automatica dei token non più validi
    const tokenDaRimuovere = [];
    risposta.responses.forEach((resp, idx) => {
      if (!resp.success) {
        const codice = resp.error?.code;
        if (
          codice === 'messaging/registration-token-not-registered' ||
          codice === 'messaging/invalid-registration-token'
        ) {
          tokenDaRimuovere.push(tokens[idx]);
        }
      }
    });
    if (tokenDaRimuovere.length > 0) {
      await Promise.all(
        tokenDaRimuovere.map((t) => db.collection('admin_tokens').doc(t).delete())
      );
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ inviate: risposta.successCount, totali: tokens.length }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ errore: e.message }),
    };
  }
};
