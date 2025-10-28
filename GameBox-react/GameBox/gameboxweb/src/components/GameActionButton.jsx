import React, { useState } from 'react';

// Status possíveis (você pode expandir esta lista)
const STATUS_OPTIONS = [
    { value: 'na fila', label: 'Na Fila' },
    { value: 'jogando', label: 'Jogando' },
    { value: 'completado', label: 'Completado' },
    { value: 'abandonado', label: 'Abandonado' },
];

function GameActionButton({ gameId, currentStatus, onActionSuccess }) {
    const [status, setStatus] = useState(currentStatus || 'na fila');
    const [isInLibrary, setIsInLibrary] = useState(!!currentStatus);
    const [loading, setLoading] = useState(false);
    //const API_BASE_URL = 'http://localhost:5000/api/biblioteca';


    // Função genérica para requisições
    const handleRequest = async (url, method, body = null) => {
        setLoading(true);
        try {
            const response = await fetch(url, { // A URL AGORA SEMPRE SERÁ COMPLETA
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : null, 
                credentials: 'include', // ESTÁ CORRETO AQUI!
            });

            const data = await response.json();
            setLoading(false);

            if (!response.ok) {
                alert(`Erro: ${data.erro || data.mensagem}`);
                return false;
            }

            onActionSuccess(data.mensagem); // Notifica o componente pai sobre o sucesso
            return true;

        } catch (error) {
            setLoading(false);
            alert('Erro de conexão com o servidor.');
            console.error('Erro na requisição:', error);
            return false;
        }
    };

    const handleAddGame = async () => {
        const success = await handleRequest(
            '/api/biblioteca/adicionar', 
            'POST',
            { jogo_id: gameId, status: status }
        );
        if (success) {
            setIsInLibrary(true);
        }
    };

    const handleRemoveGame = async () => {
        const success = await handleRequest(
            `/api/biblioteca/remover/${gameId}`, 
            'DELETE'
        );
        if (success) {
            setIsInLibrary(false);
            setStatus('na fila');
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        
        if (isInLibrary) {
            await handleRequest(
                `/api/biblioteca/status/${gameId}`, 
                'PUT',
                { status: newStatus }
            );
        } else {
            await handleAddGame();
        }
    };

    return (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {isInLibrary ? (
                <>
                    <select value={status} onChange={handleStatusChange} disabled={loading}>
                        {STATUS_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <button onClick={handleRemoveGame} disabled={loading}>
                        {loading ? 'Removendo...' : 'Remover da Biblioteca'}
                    </button>
                </>
            ) : (
                <>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={loading}>
                        {STATUS_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <button onClick={handleAddGame} disabled={loading}>
                        {loading ? 'Adicionando...' : 'Adicionar à Biblioteca'}
                    </button>
                </>
            )}
        </div>
    );
}

export default GameActionButton;
