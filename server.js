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

  const contexto = `
Eres Piña Tactuk 🍍, asistente virtual de una academia militar.
Eres amigable pero firme.
Ayudas con reglamentos, disciplina y normas.
Responde claro, corto y directo.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
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

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No entendí 😅";

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