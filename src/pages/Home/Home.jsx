import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseclient';
import './Home.css';

function Home() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar se o setor_id está no localStorage e redirecionar para /home_logado
        const setorId = localStorage.getItem('setor_id');
        if (setorId) {
            navigate('/home_logado'); // Redireciona se o usuário já estiver logado
        }
    }, [navigate]);

    const handleLogin = async () => {
        if (!usuario || !senha) {
            setMensagem('Preencha todos os campos!');
            return;
        }

        const { data, error } = await supabase
            .from('setores')
            .select('id, nome_setor')
            .eq('usuario', usuario)
            .eq('senha', senha)
            .single();

        if (error || !data) {
            setMensagem('Usuário ou senha inválidos!');
            return;
        }

        localStorage.setItem('setor_id', data.id);
        setMensagem(`Bem-vindo, ${data.nome_setor}!`);

        setTimeout(() => {
            navigate('/home_logado'); // Redireciona para /home_logado após login
        }, 2000);
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
            />
            <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />
            <button onClick={handleLogin}>Entrar</button>
            {mensagem && <p>{mensagem}</p>}
        </div>
    );
}

export default Home;
