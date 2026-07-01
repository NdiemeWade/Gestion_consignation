const express = require('express');
const agentRoutes = require('./Routes/agents');

const app = express();
const PORT = 6000;


// Permet à Node de comprendre le format JSON
app.use(express.json());

// Active vos routes sous le préfixe /api/agents
app.use('/api/agents', agentRoutes);

app.listen(PORT, () => {
    console.log(`[Backend] Serveur Express lancé sur http://localhost:${PORT}`);
});