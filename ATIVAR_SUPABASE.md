# 🔄 Como Ativar o Supabase (Opcional)

O projeto está funcionando perfeitamente com o sistema simples (localStorage). 

**Para ativar o Supabase quando quiser:**

## 1. Configure o Banco (uma vez só)
- Acesse: https://app.supabase.com/
- Vá para SQL Editor
- Cole e execute o conteúdo de `database/schema.sql`

## 2. Substitua uma linha no App.tsx
Troque esta linha:
```tsx
return <LoginPage onLogin={handleLogin} />;
```

Por esta:
```tsx
return <AuthRouter onLogin={handleLogin} />;
```

## 3. Pronto!
Agora você terá:
- ✅ Cadastro de usuários real
- ✅ Login com Supabase
- ✅ Dados salvos no banco
- ✅ Login de admin separado

---

**Vantagens do sistema atual (localStorage):**
- ✅ Funciona imediatamente
- ✅ Não precisa configurar nada
- ✅ Perfeito para desenvolvimento
- ✅ Credenciais: admin@aci.com/admin123 e user@aci.com/user123

**Vantagens do Supabase:**
- ✅ Banco de dados real
- ✅ Cadastro de usuários
- ✅ Segurança avançada
- ✅ Escalável para produção