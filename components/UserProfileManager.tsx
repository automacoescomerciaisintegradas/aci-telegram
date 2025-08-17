import React, { useState, useEffect } from 'react';

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    shopeeId: string;
    telegramBotToken: string;
    whatsappChannelUrl: string;
}

interface UserProfileManagerProps {
    onProfileSaved: (profile: UserProfile) => void;
    initialProfile?: UserProfile;
}

export const UserProfileManager: React.FC<UserProfileManagerProps> = ({ 
    onProfileSaved, 
    initialProfile 
}) => {
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        phone: '',
        shopeeId: '',
        telegramBotToken: '',
        whatsappChannelUrl: 'https://whatsapp.com/channel/0029Vb6aZAsGOj9phEbZG72W'
    });

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Carregar perfil salvo
    useEffect(() => {
        const savedProfile = localStorage.getItem('aci_user_profile');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                setProfile(parsed);
            } catch (error) {
                console.error('Erro ao carregar perfil:', error);
            }
        } else if (initialProfile) {
            setProfile(initialProfile);
        }
    }, [initialProfile]);

    // Salvar perfil
    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');

        try {
            // Validar campos obrigatórios
            if (!profile.name || !profile.email) {
                throw new Error('Nome e email são obrigatórios');
            }

            // Salvar no localStorage
            localStorage.setItem('aci_user_profile', JSON.stringify(profile));
            
            // Simular salvamento no servidor
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setMessage('✅ Perfil salvo com sucesso!');
            onProfileSaved(profile);
            
            // Limpar mensagem após 3 segundos
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Limpar perfil
    const handleClear = () => {
        if (confirm('Tem certeza que deseja limpar todos os dados do perfil?')) {
            setProfile({
                name: '',
                email: '',
                phone: '',
                shopeeId: '',
                telegramBotToken: '',
                whatsappChannelUrl: 'https://whatsapp.com/channel/0029Vb6aZAsGOj9phEbZG72W'
            });
            localStorage.removeItem('aci_user_profile');
            setMessage('🗑️ Perfil limpo');
        }
    };

    return (
        <div className="bg-slate-800/50 border border-dark-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">👤 Perfil do Usuário</h3>
            <p className="text-dark-text-secondary mb-6">
                Salve suas informações para preenchimento automático
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                        Nome Completo *
                    </label>
                    <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary"
                        placeholder="Seu nome completo"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                        Email *
                    </label>
                    <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary"
                        placeholder="seu@email.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                        Telefone
                    </label>
                    <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary"
                        placeholder="(11) 99999-9999"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                        ID Afiliado Shopee
                    </label>
                    <input
                        type="text"
                        value={profile.shopeeId}
                        onChange={(e) => setProfile(prev => ({ ...prev, shopeeId: e.target.value }))}
                        className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary"
                        placeholder="Seu ID de afiliado"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                        Token Bot Telegram
                    </label>
                    <input
                        type="password"
                        value={profile.telegramBotToken}
                        onChange={(e) => setProfile(prev => ({ ...prev, telegramBotToken: e.target.value }))}
                        className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary"
                        placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                        URL WhatsApp Channel
                    </label>
                    <input
                        type="url"
                        value={profile.whatsappChannelUrl}
                        onChange={(e) => setProfile(prev => ({ ...prev, whatsappChannelUrl: e.target.value }))}
                        className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary"
                        placeholder="https://whatsapp.com/channel/..."
                    />
                </div>
            </div>

            {message && (
                <div className={`p-3 rounded-lg mb-4 ${
                    message.includes('✅') ? 'bg-green-900/50 border border-green-700 text-green-300' :
                    message.includes('❌') ? 'bg-red-900/50 border border-red-700 text-red-300' :
                    'bg-blue-900/50 border border-blue-700 text-blue-300'
                }`}>
                    {message}
                </div>
            )}

            <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-brand-primary hover:bg-brand-primary/90 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    {isSaving ? 'Salvando...' : '💾 Salvar Perfil'}
                </button>

                <button
                    onClick={handleClear}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    🗑️ Limpar
                </button>
            </div>
        </div>
    );
};