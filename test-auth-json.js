import { AuthService } from './electron/services/AuthService-json.js';

// Test del servizio di autenticazione basato su JSON
async function testAuthService() {
  console.log('🔧 Test del servizio di autenticazione basato su JSON');
  
  const authService = new AuthService();
  
  try {
    // Test 1: Registrazione nuovo utente
    console.log('\n📝 Test 1: Registrazione nuovo utente');
    const testUser = await authService.register(
      'Mario Rossi', 
      'mario.test@example.com', 
      'password123456'
    );
    console.log('✅ Utente registrato:', testUser);
    
    // Test 2: Login con le credenziali giuste
    console.log('\n🔑 Test 2: Login con credenziali corrette');
    const loggedUser = await authService.login(
      'mario.test@example.com', 
      'password123456'
    );
    console.log('✅ Login effettuato:', loggedUser);
    
    // Test 3: Login con password sbagliata
    console.log('\n❌ Test 3: Login con password sbagliata');
    try {
      await authService.login('mario.test@example.com', 'wrongpassword');
    } catch (error) {
      console.log('✅ Errore atteso:', error.message);
    }
    
    // Test 4: Email già registrata
    console.log('\n📧 Test 4: Email già registrata');
    try {
      await authService.register('Mario Duplicate', 'mario.test@example.com', 'anotherpassword');
    } catch (error) {
      console.log('✅ Errore atteso:', error.message);
    }
    
    // Test 5: Validazione input
    console.log('\n⚠️  Test 5: Validazione input');
    try {
      await authService.register('', 'invalid-email', 'short');
    } catch (error) {
      console.log('✅ Errore di validazione:', error.message);
    }
    
    console.log('\n🎉 Tutti i test sono stati completati con successo!');
    
  } catch (error) {
    console.error('❌ Errore durante i test:', error);
  }
}

// Esegui i test
testAuthService();
