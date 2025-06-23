// local-webhook-listening-server.js

const express = require('express');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ** ADAPTE CE CHEMIN ** : chemin absolu vers un dossier où tu veux cloner/puller ton repo localement


// ** ADAPTE CETTE URL ** : l'URL HTTPS de ton repository GitHub (copie depuis GitHub)
const repoUrl = 'https://github.com/jmahot/Devops_Mlops_Ex5_CI_CD_Pipeline.git';

const repoName = path.basename(repoUrl, '.git');
const fullPath = path.join(repoDir, repoName);

app.post('/webhook', (req, res) => {
  try {
    // Crée le dossier s'il n'existe pas
    if (!fs.existsSync(repoDir)) fs.mkdirSync(repoDir, { recursive: true });
    process.chdir(repoDir);

    // Clone le repo si pas encore cloné
    if (!fs.existsSync(fullPath)) {
      console.log('Cloning repo...');
      execSync(`git clone ${repoUrl}`, { stdio: 'inherit' });
    }

    process.chdir(fullPath);
    console.log('Checking out main branch and pulling latest changes...');
    execSync('git checkout main', { stdio: 'inherit' });
    execSync('git pull origin main', { stdio: 'inherit' });

    try {
      console.log('Stopping containers if running...');
      execSync('docker compose down', { stdio: 'inherit' });
    } catch (e) {
      console.log('No containers to stop or error stopping them');
    }

    console.log('Pulling latest Docker images...');
    execSync('docker compose build backend frontend', { stdio: 'inherit' });

    console.log('Starting containers...');
    execSync('docker compose up -d', { stdio: 'inherit' });

    res.status(200).send('Deployment completed');
  } catch (err) {
    console.error('Deployment failed:', err);
    res.status(500).send('Deployment failed');
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Webhook listening server started on port ${PORT}`);
});
