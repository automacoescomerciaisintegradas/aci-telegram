import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uunuonapovtyuwtelrng.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bnVvbmFwb3Z0eXV3dGVscm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTQ2OTksImV4cCI6MjA2NjAzMDY5OX0.t-yru5eAK00I3fxdidZuPQxiT_gSQNP62bSVVoFTxx8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com Supabase...');
    
    // Testar conexão básica
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      if (error.message.includes('relation "users" does not exist')) {
        console.log('❌ Tabela "users" não existe. Execute o script SQL primeiro.');
        console.log('📋 Vá para o Supabase Dashboard > SQL Editor e execute o conteúdo de database/schema.sql');
        return false;
      } else {
        console.log('❌ Erro na conexão:', error.message);
        return false;
      }
    }
    
    console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    console.log('✅ Tabela "users" existe e está acessível.');
    return true;
    
  } catch (error) {
    console.log('❌ Erro inesperado:', error.message);
    return false;
  }
}

testConnection();