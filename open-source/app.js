const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(bodyParser.json());

const db = new sqlite3.Database(path.join(__dirname, 'secure.db'));
db.run(`CREATE TABLE IF NOT EXISTS prompt_logs (
    id INTEGER PRIMARY KEY, account TEXT, hash TEXT, txid TEXT, token_used TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

async function verifyWebAuthTransaction(txid, expectedHash, expectedAccount, expectedToken) {
    try {
        const response = await fetch('https://proton.cryptolions.io/v1/history/get_transaction', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: txid })
        });
        if (!response.ok) return false;
        const txData = await response.json();
        const action = txData.trx.trx.actions.find(a => 
            a.account === 'tokencreate' && a.data.from === expectedAccount && a.data.quantity === `1.00000000 ${expectedToken}`
        );
        return action && action.data.memo === `REPORT:${expectedHash}:CLEAN_PROMPT`;
    } catch (e) { return false; }
}

app.post('/api/verify', async (req, res) => {
    const { account, hash, txid, token } = req.body;
    
    // HARD-CODED ADMIN ENFORCEMENT
    if (account !== 'ubitquity1') return res.status(403).json({ error: "Unauthorized WebAuth account." });

    const isValid = await verifyWebAuthTransaction(txid, hash, account, token);
    if (!isValid) return res.status(403).json({ error: "WebAuth verification failed on-chain." });

    db.run("INSERT INTO prompt_logs (account, hash, txid, token_used) VALUES (?, ?, ?, ?)", [account, hash, txid, token], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, message: "Prompt audited for ubitquity1." });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
