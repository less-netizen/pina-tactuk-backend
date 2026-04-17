const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // 🔥 FALTABA ESTO

const app = express();
app.use(cors());
app.use(bodyParser.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log("API KEY:", API_KEY);

  const contexto = `
Eres Piña Tactuk 🍍, asistente virtual de una academia militar.
Eres amigable pero firme.
Ayudas con reglamentos, disciplina y normas.
Responde claro, corto y directo.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: contexto + "\\nUsuario: " + userMessage
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    console.log("RESPUESTA GEMINI:", data);

let reply = "No entendí 😅";

if (data.candidates && data.candidates.length > 0) {
  reply = data.candidates[0].content.parts[0].text;
} else if (data.error) {
  reply = "Error de API 😢";
  console.error(data.error);
}

    res.json({ reply });

  } catch (error) {
    console.error(error); // 👈 para ver errores en Render
    res.json({ reply: "Error en el servidor 😢" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo");
});