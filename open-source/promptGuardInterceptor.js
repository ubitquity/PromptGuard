const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'secure.db'));

module.exports = function(req, res, next) {
    const systemPrompt = req.body.systemPrompt || "";
    const hash = crypto.createHash('sha256').update(systemPrompt).digest('hex');

    db.get("SELECT account FROM prompt_logs WHERE hash = ?", [hash], (err, row) => {
        if (row) return next();
        res.status(403).json({ error: "Security Violation: Prompt hash not found in ubitquity1 audit logs." });
    });
};
