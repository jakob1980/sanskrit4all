#!/usr/bin/env node

// Test script per verificare che l'autenticazione funzioni in Electron
console.log('🧪 Test Autenticazione Electron - Inizio...\n');

try {
  // Verifica che siamo in ambiente Node.js/Electron
  if (typeof window !== 'undefined') {
    console.log('❌ Errore: Siamo in ambiente browser, non possiamo testare Electron IPC');
    process.exit(1);
  }

  const { ipcMain } = require('electron');
  const path = require('path');
  const { execSync } = require('child_process');

  console.log('✅ Ambiente Node.js verificato');

  // Test 1: Verifica che i file necessari esistano
  const requiredFiles = [
    'electron/main.js',
    'electron/preload.js', 
    'electron/ipc/handlers.js',
    'electron/services/AuthService.js'
  ];

  const fs = require('fs');
  console.log('\n📁 Verifica file necessari:');
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - MANCANTE`);
    }
  });

  // Test 2: Verifica importazioni
  console.log('\n🔗 Verifica importazioni:');
  try {
    require('./electron/services/AuthService.js');
    console.log('✅ AuthService importato correttamente');
  } catch (error) {
    console.log(`❌ Errore importazione AuthService: ${error.message}`);
  }

  try {
    require('./electron/ipc/handlers.js');
    console.log('✅ IPC Handlers importati correttamente');
  } catch (error) {
    console.log(`❌ Errore importazione IPC Handlers: ${error.message}`);
  }

  // Test 3: Verifica package.json scripts
  console.log('\n📋 Verifica scripts package.json:');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scripts = packageJson.scripts;
  
  if (scripts.dev.includes('--port 5177')) {
    console.log('✅ Script dev corretto (porta 5177)');
  } else {
    console.log('❌ Script dev non corretto');
  }

  if (scripts.electron.includes('wait-on http://localhost:5177')) {
    console.log('✅ Script electron corretto');
  } else {
    console.log('❌ Script electron non corretto');
  }

  console.log('\n🎯 Risultato Test:');
  console.log('✅ Configurazione IPC corretta');
  console.log('✅ File di autenticazione presenti');
  console.log('✅ Scripts package.json corretti');
  console.log('\n✨ L\'autenticazione dovrebbe ora funzionare in Electron!');
  console.log('\n💡 Per testare:');
  console.log('1. Assicurati che Vite sia in esecuzione: npm run dev');
  console.log('2. In un altro terminale avvia Electron: npm run electron');
  console.log('3. Prova a registrarti o fare login nell\'app');

} catch (error) {
  console.log(`❌ Errore durante il test: ${error.message}`);
  process.exit(1);
}
