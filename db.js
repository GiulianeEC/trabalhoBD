
async function selecionaProdutos(pesquisaproduto){//comando de pesuisar produtos
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM Produto WHERE nome LIKE '%${pesquisaproduto}%';`);
    return rows;
}
async function selecionaTodosProdutos(){//comando de pesquisar todos os produtos
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM Produto;`);
    return rows;
}
async function insereProduto(Produto){//comando de inserir produtos
    const conn = await connect();
    Produto = Produto.split(',');
    const sql = await conn.query(`INSERT INTO Produto(nome,preço,estoque) VALUES (${JSON.stringify(Produto[0])},${Produto[1]},${Produto[2]});`);
    return ;
}
async function deletaProduto(id){//comando de deletar produtos
    const conn = await connect();
    const sql = await conn.query(`DELETE FROM Produto WHERE id_produto=${id};`);
    return ;
}
async function UpdateProduto(Produto){//comando de atualizar produtos
    const conn = await connect();
    Produto = Produto.split(',');
    const sql = await conn.query(`Update Produto SET nome = ${JSON.stringify(Produto[0])},preço = ${Produto[1]},estoque = ${Produto[2]} WHERE id_produto = ${Produto[3]};`);
    return ;
}
async function selecionaFuncionarios(pesquisafuncionario){//comando de pesquisar funcionarios
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM Funcionario WHERE nome LIKE '%${pesquisafuncionario}%';`);
    return rows;
}
async function selecionaTodosFuncionarios(){//comando de pesquisar todos os funcionarios
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM Funcionario;`);
    return [rows];
}
async function insereFuncionario(Funcionario){//comando de inserir funcionarios
    const conn = await connect();
    Funcionario = Funcionario.split(',');
    const sql = await conn.query(`INSERT INTO Funcionario(id_discord,nome,cpf,salario) VALUES (${JSON.stringify(Funcionario[0])},${JSON.stringify(Funcionario[1])},${JSON.stringify(Funcionario[2])},${JSON.stringify(Funcionario[3])});`);
    return ;
}
async function deletaFuncionario(id){//comando de deletar funcionarios
    const conn = await connect();
    const sql = await conn.query(`DELETE FROM Funcionario WHERE id_discord=${JSON.stringify(id)};`);
    return ;
}
async function UpdateFuncionario(Funcionario){//comando de atualizar funcionarios
    const conn = await connect();
    Funcionario = Funcionario.split(',');
    const sql = await conn.query(`UPDATE Funcionario SET nome = ${JSON.stringify(Funcionario[1])},cpf = ${JSON.stringify(Funcionario[2])},salario = ${JSON.stringify(Funcionario[3])} WHERE id_discord = ${JSON.stringify(Funcionario[0])};`);
    return ;
}
async function selecionaTodosClientes(){//comando de pesquisar todos os funcionarios
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM Cliente;`);
    return [rows];
}
async function selecionaClientes(pesquisacliente){//comando de pesqusiar clientes
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM Cliente WHERE nome LIKE '%${pesquisacliente}%';`);
    return [rows];
}
async function insereCliente(Cliente){//comando de inserir clientes
    const conn = await connect();
    Cliente = Cliente.split(',');
    const sql = await conn.query(`INSERT INTO Cliente(id_discord,nome,endereco) VALUES (${JSON.stringify(Cliente[0])},${JSON.stringify(Cliente[1])},${JSON.stringify(Cliente[2])});`);
    return ;
}
async function deletaCliente(id){//comando de deletar clientes
    const conn = await connect();
    const sql = await conn.query(`DELETE FROM Cliente WHERE id_discord=${JSON.stringify(id)};`);
    return ;
}
async function UpdateCliente(Cliente){//comando de atualizar clientes
    const conn = await connect();
    Cliente = Cliente.split(',');
    const sql = await conn.query(`UPDATE Cliente SET nome = ${JSON.stringify(Cliente[1])} ,endereco = ${JSON.stringify(Cliente[2])} WHERE id_discord = ${JSON.stringify(Cliente[0])};`);
    return ;
}
async function Compra(Compra){//comando de realizar compras
    const conn = await connect();
    Compra = Compra.split(',');
    let [rows] = await conn.query(`SELECT estoque FROM Produto WHERE id_produto = ${Compra[0]} ;`);
    rows = JSON.stringify(rows);
    rows = rows.replaceAll('}','').replaceAll(']','').replaceAll(':',',').trim();
    rows = rows.split(',');
    parseInt(rows[1],10);
    if(rows[1] < Compra[1]){
        return "Não há estoque suficiente";
    }
    const novoestoque = rows[1] - Compra[1];
    let [Preco] = await conn.query(`SELECT preço FROM Produto WHERE id_produto = ${Compra[0]};`);
    Preco = JSON.stringify(Preco);
    Preco = Preco.replaceAll('}','').replaceAll(']','').replaceAll(':',',').trim();
    Preco = Preco.split(',');
    parseInt(Preco[1],10);
    const valortotal = Preco[1] * Compra[1];
    const Produto = await conn.query(`UPDATE Produto SET estoque = ${novoestoque} WHERE id_produto = ${Compra[0]};`);
    const slq = await conn.query(`INSERT INTO Compra(id_produto,id_discord,func,m_pagamento,data,nota_fiscal,valor_total) VALUES (${Compra[0]},${JSON.stringify(Compra[2])},${JSON.stringify(Compra[3])},${JSON.stringify(Compra[4])},${JSON.stringify(Compra[5])},${Compra[6]},${valortotal});`);
    return ;
}
async function selecionaCompra(Compra){//comando de pesquisar compras
    const conn = await connect();
    Compra = Compra.split(',');
    const [rows] = await conn.query(`SELECT * FROM Compra WHERE nota_fiscal = ${Compra};`);
    return [rows];
}
async function selecionaTodasCompras(){//comando de pesquisar todas as compras
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM Compra;`);
    return [rows];
}
async function connect(){//função de conetar ao banco de dados
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection;

    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection("mysql://root:bancodedadosI@localhost:3306/testes");
    console.log("Conectou no MySQL!");
    global.connection = connection;
    return connection;
}

connect();//chamada da conexão

module.exports = {selecionaFuncionarios, selecionaProdutos, selecionaTodosProdutos, selecionaTodosFuncionarios, selecionaClientes, selecionaTodosClientes, insereCliente,insereFuncionario, insereProduto, deletaProduto, deletaCliente, deletaFuncionario, UpdateFuncionario, UpdateCliente, UpdateProduto, Compra, selecionaCompra,selecionaTodasCompras}//exportando as funções