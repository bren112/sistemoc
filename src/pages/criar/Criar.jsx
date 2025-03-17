import React, { useState } from 'react';
import supabase from '../../supabaseclient';
// Supondo que você tenha configurado o cliente do Supabase corretamente

const CriarDespesa = () => {
  const [fornecedor, setFornecedor] = useState('');
  const [cnpj, setCNPJ] = useState('');
  const [emp, setEmp] = useState('');
  const [Vencto, setVencto] = useState('');
  const [RectoFat, setRectoFat] = useState('');
  const [valor, setValor] = useState('');
  const [notaFiscal, setNotaFiscal] = useState('');
  const [ordemDeCompra, setOrdemDeCompra] = useState('');
  const [Pedido, setPedido] = useState('');
  const [campoAplicacao, setCampoAplicacao] = useState('');
  const [observacao, setObservacao] = useState('');
  const [status, setStatus] = useState('Pendente'); // Padrão "Pendente"
  const [venctoDate, setVenctoDate] = useState(''); // Data de vencimento
  const [dataCriacao, setDataCriacao] = useState(new Date().toISOString()); // Data de criação (timestamp)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userId = localStorage.getItem('userId');
  
    const { data, error } = await supabase
      .from('despesas')
      .insert([
        {
          fornecedor,
          cnpj,
          emp: parseInt(emp),
          vencto: parseInt(Vencto),
          recto_fat: parseInt(RectoFat),
          valor: parseFloat(valor),
          nota_fiscal: notaFiscal,
          ordem_de_compra: ordemDeCompra,
          pedido: Pedido,
          campo_aplicacao: campoAplicacao,
          observacao,
          status,
          venctoo: venctoDate, // Alterado de vencto_date para venctoo
          data_criacao: dataCriacao,
          id_setores: userId
        }
      ]);
  
    if (error) {
      console.error('Erro ao inserir despesa:', error.message);
    } else {
      console.log('Despesa inserida com sucesso!', data);
    }
  };
  

  return (
    <div>
      <h1>Inserir Nova Despesa</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fornecedor">Fornecedor:</label>
        <input
          type="text"
          name="fornecedor"
          value={fornecedor}
          onChange={(e) => setFornecedor(e.target.value)}
          required
        />

        <label htmlFor="cnpj">CNPJ:</label>
        <input
          type="text"
          name="cnpj"
          value={cnpj}
          onChange={(e) => setCNPJ(e.target.value)}
          required
        />

        <label htmlFor="emp">Emp. (Número):</label>
        <input
          type="number"
          name="emp"
          value={emp}
          onChange={(e) => setEmp(e.target.value)}
          required
        />

        <label htmlFor="Vencto">Vencimento (Número):</label>
        <input
          type="number"
          name="Vencto"
          value={Vencto}
          onChange={(e) => setVencto(e.target.value)}
          required
        />

        <label htmlFor="RectoFat">Recto. Fat. (Número):</label>
        <input
          type="number"
          name="RectoFat"
          value={RectoFat}
          onChange={(e) => setRectoFat(e.target.value)}
          required
        />

        <label htmlFor="valor">Valor:</label>
        <input
          type="number"
          name="valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          step="0.01"
          required
        />

        <label htmlFor="notaFiscal">Nota Fiscal:</label>
        <input
          type="text"
          name="notaFiscal"
          value={notaFiscal}
          onChange={(e) => setNotaFiscal(e.target.value)}
          required
        />

        <label htmlFor="ordemDeCompra">Ordem de Compra:</label>
        <input
          type="text"
          name="ordemDeCompra"
          value={ordemDeCompra}
          onChange={(e) => setOrdemDeCompra(e.target.value)}
          required
        />

        <label htmlFor="Pedido">Pedido:</label>
        <input
          type="text"
          name="Pedido"
          value={Pedido}
          onChange={(e) => setPedido(e.target.value)}
          required
        />

        <label htmlFor="campoAplicacao">Campo de Aplicação:</label>
        <textarea
          name="campoAplicacao"
          value={campoAplicacao}
          onChange={(e) => setCampoAplicacao(e.target.value)}
          required
        />

        <label htmlFor="observacao">Observação:</label>
        <textarea
          name="observacao"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          required
        />

        <label htmlFor="status">Status:</label>
        <select
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="Pendente">Pendente</option>
          <option value="Concluída">Concluída</option>
          <option value="Cancelada">Cancelada</option>
        </select>

        <label htmlFor="venctoDate">Data de Vencimento:</label>
        <input
          type="date"
          name="venctoDate"
          value={venctoDate}
          onChange={(e) => setVenctoDate(e.target.value)}
          required
        />

        <button type="submit">Salvar Despesa</button>
      </form>
    </div>
  );
};

export default CriarDespesa;
