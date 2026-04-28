// Registro do Service Worker com recarga automática
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            console.log('✅ Service Worker registrado com sucesso:', registration);
            
            // Verifica se há atualização
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('🔄 Novo Service Worker encontrado:', newWorker);
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('📦 Nova versão disponível! Recarregue a página.');
                        // Opcional: mostrar notificação para o usuário
                        if (confirm('Nova versão disponível! Recarregar para atualizar?')) {
                            window.location.reload();
                        }
                    }
                });
            });
            
        } catch (error) {
            console.error('❌ Falha no registro do Service Worker:', error);
        }
    });
    
    // Força recarga de página quando o SW é atualizado
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
} else {
    console.log('⚠️ Service Worker não suportado neste navegador');
}

// Verificar status de conectividade
window.addEventListener('load', () => {
    function updateOnlineStatus() {
        const status = navigator.onLine ? 'online' : 'offline';
        console.log(`🌐 Status da conexão: ${status}`);
        
        // Opcional: mostrar indicador visual
        let indicator = document.getElementById('online-status');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'online-status';
            indicator.style.position = 'fixed';
            indicator.style.top = '10px';
            indicator.style.right = '10px';
            indicator.style.padding = '5px 10px';
            indicator.style.borderRadius = '20px';
            indicator.style.fontSize = '12px';
            indicator.style.zIndex = '9999';
            document.body.appendChild(indicator);
        }
        
        if (navigator.onLine) {
            indicator.textContent = '🟢 Online';
            indicator.style.backgroundColor = '#42b549';
            indicator.style.color = 'white';
        } else {
            indicator.textContent = '🔴 Offline (modo limitado)';
            indicator.style.backgroundColor = '#dc3545';
            indicator.style.color = 'white';
        }
        
        setTimeout(() => {
            indicator.style.opacity = '0.7';
        }, 3000);
    }
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
});