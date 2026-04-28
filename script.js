// ==================== GERAR PDF (VERSÃO CORRIGIDA) ====================
document.getElementById('gerarPdfBtn')?.addEventListener('click', async function() {
    const dados = coletarDados();
    if (!validarDados(dados)) return;
    
    // Mostra loading
    const btn = this;
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '⏳ Gerando PDF...';
    btn.disabled = true;
    
    try {
        // Cria um container temporário isolado
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.innerHTML = gerarComunicadoHTML(dados);
        document.body.appendChild(tempDiv);
        
        const element = tempDiv.querySelector('#comunicadoParaExportar');
        if (!element) {
            throw new Error('Elemento não encontrado');
        }
        
        // Configuração do PDF
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: `Comunicado_${dados.nomeColaborador.replace(/\s/g, '_')}_${dados.dataOcorrencia}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, letterRendering: true, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(element).save();
        
        // Remove o container temporário
        document.body.removeChild(tempDiv);
        
    } catch (error) {
        console.error('Erro detalhado:', error);
        alert('Erro ao gerar PDF: ' + error.message);
    } finally {
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
});

// ==================== GERAR IMAGEM (VERSÃO CORRIGIDA) ====================
document.getElementById('gerarImagemBtn')?.addEventListener('click', async function() {
    const dados = coletarDados();
    if (!validarDados(dados)) return;
    
    const btn = this;
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '⏳ Gerando imagem...';
    btn.disabled = true;
    
    try {
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.innerHTML = gerarComunicadoHTML(dados);
        document.body.appendChild(tempDiv);
        
        const element = tempDiv.querySelector('#comunicadoParaExportar');
        if (!element) {
            throw new Error('Elemento não encontrado');
        }
        
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true
        });
        
        const link = document.createElement('a');
        const dataUrl = canvas.toDataURL('image/png');
        link.download = `Comunicado_${dados.nomeColaborador.replace(/\s/g, '_')}_${dados.dataOcorrencia}.png`;
        link.href = dataUrl;
        link.click();
        
        document.body.removeChild(tempDiv);
        
    } catch (error) {
        console.error('Erro detalhado:', error);
        alert('Erro ao gerar imagem: ' + error.message);
    } finally {
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
});