import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate-pdf', (req, res) => {
    const data = req.body;
    const jsonPath = '/tmp/patient_data.json';
    
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

    const scriptPath = path.join(__dirname, 'generate_pdf.py');
    const outputPath = path.join(__dirname, '../baza_pdf/Wzor-IPZ-Moje-Zdrowie-PTMR_Wypelniony.pdf');

    exec(`python3 ${scriptPath} ${jsonPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: 'Failed to generate PDF' });
        }
        
        console.log(`Script output: ${stdout}`);
        
        if (fs.existsSync(outputPath)) {
            res.download(outputPath, 'MojeZdrowie_IPZ_Gotowy.pdf');
        } else {
            res.status(500).json({ error: 'Output file not found' });
        }
    });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
