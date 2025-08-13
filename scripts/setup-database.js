import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://uunuonapovtyuwtelrng.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bnVvbmFwb3Z0eXV3dGVscm5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NTQ2OTksImV4cCI6MjA2NjAzMDY5OX0.t-yru5eAK00I3fxdidZuPQxiT_gSQNP62bSVVoFTxx8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🔄 Configurando banco de dados...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(process.cwd(), 'database', 'schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir em comandos individuais (separados por ponto e vírgula)
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📋 Executando ${commands.length} comandos SQL...`);
    
    // Executar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        try {
          console.log(`⏳ Executando comando ${i + 1}/${commands.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          
          if (error) {
            console.log(`⚠️ Aviso no comando ${i + 1}: ${error.message}`);
          } else {
            console.log(`✅ Comando ${i + 1} executado com sucesso`);
          }
        } catch (err) {
          console.log(`⚠️ Erro no comando ${i + 1}: ${err.message}`);
        }
      }
    }
    
    // Testar se a tabela foi criada
    console.log('🔍 Verificando se a tabela foi criada...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('❌ Tabela ainda não foi criada. Execute manualmente o SQL no Supabase Dashboard.');
      console.log('📋 Vá para: Supabase Dashboard > SQL Editor > Cole o conteúdo de database/schema.sql');
    } else {
      console.log('✅ Banco de dados configurado com sucesso!');
      console.log('✅ Tabela "users" criada e acessível.');
    }
    
  } catch (error) {
    console.log('❌ Erro na configuração:', error.message);
    console.log('📋 Execute manualmente o SQL no Supabase Dashboard.');
  }
}

setupDatabase();