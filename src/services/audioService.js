// Questo servizio gestisce le chiamate relative all'audio
export async function playAudio(audioPath) {
  try {
    console.log('Attempting to play audio:', audioPath);
    
    // Se siamo in Electron, usa l'API Electron con IPC
    if (typeof window !== 'undefined' && window.electronAPI) {
      console.log('Using Electron IPC audio API');
      const result = await window.electronAPI.playAudio(audioPath);
      
      if (result.success) {
        console.log('IPC: Audio file received, converting to playable format');
        
        // Converte base64 in ArrayBuffer
        const binaryString = atob(result.audioBuffer);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Crea un Blob URL per la riproduzione
        const audioBlob = new Blob([bytes], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        return new Promise((resolve, reject) => {
          const audio = new Audio(audioUrl);
          
          audio.addEventListener('canplaythrough', () => {
            console.log('Audio can play through via IPC');
            audio.play()
              .then(() => {
                console.log('Audio playing successfully via IPC');
                // Pulizia del URL object dopo la riproduzione
                audio.addEventListener('ended', () => {
                  URL.revokeObjectURL(audioUrl);
                });
                resolve(true);
              })
              .catch(error => {
                console.error('Error playing IPC audio:', error);
                URL.revokeObjectURL(audioUrl);
                reject(error);
              });
          });
          
          audio.addEventListener('error', (error) => {
            console.error('Error loading IPC audio:', error);
            URL.revokeObjectURL(audioUrl);
            reject(error);
          });
          
          audio.load();
        });
      } else {
        throw new Error(result.error || 'Failed to load audio via IPC');
      }
    }
    
    // Fallback per browser: usa Audio HTML standard
    console.log('Using browser Audio API');
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      
      // Prova diversi percorsi
      const possiblePaths = [
        audioPath.startsWith('/') ? audioPath : `/${audioPath}`,
        `./${audioPath}`,
        `assets/audio/${audioPath.split('/').pop()}`
      ];
      
      let currentPathIndex = 0;
      
      const tryNextPath = () => {
        if (currentPathIndex >= possiblePaths.length) {
          reject(new Error('All audio paths failed'));
          return;
        }
        
        const currentPath = possiblePaths[currentPathIndex];
        console.log('Trying path:', currentPath);
        
        audio.src = currentPath;
        audio.load();
      };
      
      audio.addEventListener('canplaythrough', () => {
        console.log('Audio can play through');
        audio.play()
          .then(() => {
            console.log('Audio playing successfully');
            resolve(true);
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            currentPathIndex++;
            tryNextPath();
          });
      });
      
      audio.addEventListener('error', () => {
        console.error('Failed to load:', audio.src);
        currentPathIndex++;
        tryNextPath();
      });
      
      tryNextPath();
    });
  } catch (error) {
    console.error('General audio error:', error);
    throw error;
  }
}
