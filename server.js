const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const API_KEY = process.env.GEMINI_API_KEY;
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  const contexto = `
Eres Piña Tactuk 🍍, asistente virtual de una academia militar.
Responde de forma clara, directa y amigable.
`;

  try {
    const response = await fetch(
 "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + API_KEY  ,    {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: contexto + "\nUsuario: " + userMessage,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let reply = "⚠️ La IA no respondió correctamente";

    if (
      data?.candidates?.[0]?.content?.parts?.[0]?.text
    ) {
      reply = data.candidates[0].content.parts[0].text;
    } else {
      console.log("ERROR GEMINI:", data);
    }

    res.json({ reply });

  } catch (error) {
    console.error("ERROR SERVIDOR:", error);
    res.json({ reply: "Error del servidor 😢" });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});


