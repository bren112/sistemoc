import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseclient';
import { data, useNavigate } from 'react-router-dom';
import './logado.css';

function Logado() {
    const [setor, setSetor] = useState(null);
    const [despesas, setDespesas] = useState([]);
    const [mes, setMes] = useState('');
    const [despesaEditando, setDespesaEditando] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [ordenacao, setOrdenacao] = useState('asc'); // Estado para controlar a ordenação
    const setorId = localStorage.getItem('setor_id');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSetor = async () => {
            if (!setorId) return;

            const { data: setorData, error: setorError } = await supabase
                .from('Setores')
                .select('id , nome_setor')
                .eq('id', setorId)
                .single();

            if (setorError) {
                console.error('Erro ao buscar setor:', setorError);
            } else {
                setSetor(setorData.nome_setor);
            }

            const { data: despesasData, error: despesasError } = await supabase
                .from('despesas')
                .select('*')
                .eq('id_setores', setorId);

            if (despesasError) {
                console.error('Erro ao buscar despesas:', despesasError);
            } else {
                setDespesas(despesasData);
            }
        };

        fetchSetor();
    }, [setorId]);

    const logout = () => {
        localStorage.removeItem('setor_id');
        navigate('/');
    };

    const filtrarDespesasPorMes = () => {
        if (!mes) return despesas;
        return despesas.filter((despesa) => {
            const dataCriacao = new Date(despesa.data_criacao);
            return dataCriacao.getMonth() === parseInt(mes) - 1;
        });
    };

    const abrirModal = (despesa) => {
        setDespesaEditando(despesa);
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setDespesaEditando(null);
    };

    const editarDespesa = async (e) => {
        e.preventDefault();
        if (!despesaEditando) return;

        const { id, fornecedor, cnpj, emp, vencto, recto_fat, valor, nota_fiscal, ordem_de_compra, pedido, campo_aplicacao, observacao, status, data_criacao, venctoo } = despesaEditando;

        const { error } = await supabase
            .from('despesas')
            .update({
                fornecedor,
                cnpj,
                emp,
                vencto,
                recto_fat,
                valor,
                nota_fiscal,
                ordem_de_compra,
                pedido,
                campo_aplicacao,
                observacao,
                status,
                venctoo,
            })
            .eq('id', id);

        if (error) {
            console.error('Erro ao editar despesa:', error);
        } else {
            fecharModal();
            window.location.reload(); 
        }
    };

    const excluirDespesa = async (id) => {
        const { error } = await supabase
            .from('despesas')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao excluir despesa:', error);
        } else {
            alert('Despesa excluída com sucesso!');
            fetchSetor();
        }
    };

    const verificarCorVencimento = (venctoOriginal, status) => {
        const hoje = new Date();
        const vencimento = new Date(venctoOriginal); 
    
        if (isNaN(vencimento)) {
            return ''; 
        }
    
        const diffTime = vencimento - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
        if (status === 'pendente') {
            return 'orange';
        } else if (status === 'concluida') {
            return 'green';
        } else if (diffDays <= 7 && diffDays >= 0) {
            return 'yellow';
        } else if (diffDays < 0) {
            return 'red';
        }
        return ''; 
    };

    // Função para ordenar as despesas pela coluna 'Vencimento'
    const ordenarDespesas = (despesas) => {
        return despesas.sort((a, b) => {
            const vencimentoA = new Date(a.vencto);
            const vencimentoB = new Date(b.vencto);
            if (ordenacao === 'asc') {
                return vencimentoA - vencimentoB;
            } else {
                return vencimentoB - vencimentoA;
            }
        });
    };

    return (
        <div>
            <br />
            <h2>Setor ID: {setorId}</h2>
            <br />
           <h2>Setor Logado: {data.nome_setor}</h2>

         
            <div>
                <label htmlFor="mes">Escolha o mês: </label>
                <select
                    id="mes"
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                >
                    <option value="">Selecione</option>
                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                    <option value="4">Abril</option>
                    <option value="5">Maio</option>
                    <option value="6">Junho</option>
                    <option value="7">Julho</option>
                    <option value="8">Agosto</option>
                    <option value="9">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                </select>
            </div>

            <div>
                <button onClick={() => setOrdenacao(ordenacao === 'asc' ? 'desc' : 'asc')}>
                    Ordenar por Vencimento ({ordenacao === 'asc' ? 'Crescente' : 'Decrescente'})
                </button>
            </div>

            <div>
            <button onClick={logout} className="logout-button">Logout</button>
            </div>
            {despesas.length > 0 ? (
                <div>
                    <h3>Despesas do Setor: {setor}</h3>
                    <div className="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fornecedor</th>
                                    <th>CNPJ</th>
                                    <th>Empresa</th>
                                    <th>Vencimento</th>
                                    <th>Recebimento</th>
                                    <th>Valor</th>
                                    <th>Nota Fiscal</th>
                                    <th>Ordem de Compra</th>
                                    <th>Pedido</th>
                                    <th>Campo de Aplicação</th>
                                    <th>Observação</th>
                                    <th>Status</th>
                                    <th>Data de Criação</th>
                                    <th>Vencimento Original</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordenarDespesas(filtrarDespesasPorMes()).map((despesa) => (
                                    <tr
                                        key={despesa.id}
                                        style={{
                                            backgroundColor: verificarCorVencimento(despesa.venctoo, despesa.status),
                                        }}
                                    >
                                        <td>{despesa.fornecedor}</td>
                                        <td>{despesa.cnpj}</td>
                                        <td>{despesa.emp}</td>
                                        <td>{despesa.vencto}</td>
                                        <td>{despesa.recto_fat}</td>
                                        <td>{despesa.valor}</td>
                                        <td>{despesa.nota_fiscal}</td>
                                        <td>{despesa.ordem_de_compra}</td>
                                        <td>{despesa.pedido}</td>
                                        <td>{despesa.campo_aplicacao}</td>
                                        <td>{despesa.observacao}</td>
                                        <td>{despesa.status}</td>
                                        <td>{new Date(despesa.data_criacao).toLocaleDateString()}</td>
                                        <td>{despesa.venctoo ? new Date(despesa.venctoo).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            <button onClick={() => abrirModal(despesa)}>Editar</button>
                                            <button onClick={() => excluirDespesa(despesa.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p>Sem despesas registradas.</p>
            )}

            {modalAberto && (
                <div className="modal">
                    <form onSubmit={editarDespesa}>
                        <h3>Editar Despesa</h3>
                        <label>Fornecedor</label>
                        <input
                            type="text"
                            value={despesaEditando?.fornecedor || ''}
                            onChange={(e) =>
                                setDespesaEditando({ ...despesaEditando, fornecedor: e.target.value })
                            }
                        />
                        {/* Outros campos aqui */}
                        <button type="submit">Salvar</button>
                        <button type="button" onClick={fecharModal}>
                            Fechar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Logado;
