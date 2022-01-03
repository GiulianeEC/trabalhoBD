const Discord = require('discord.js');

const { Client, Intents } = require('discord.js');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });//cirando um cliente bot

const token = 'OTIyNjY0NjkyNzUxNjcxMzA2.YcEwdQ.wpH2fKShXCoDqbCy6ananP1SOK4';//token único do bot

const prefix = '!!';//escolhendo o prefixo

bot.login(token);//loguin do bot

(async () => {
    const db = require("./db");//conectando ao banco de dados
    bot.on('ready', () => {//ligando o bot
        });
    bot.on('messageCreate',async (message) =>{//ao receber mensagem, começar a ler e realizar os comandos
        let role = message.guild.roles.cache.find(role => role.name === "Func");
        if( message.member.roles.cache.has(role.id) && message.content.includes(`${prefix}`)){//verificação do prefixo e do cargo Fun
            if(message.content.includes(`Compra`) || message.content.includes(`compra`)){//verificação se existe a palavra compra na mensagem
                if(message.content.includes(`Realiza`) || message.content.includes(`realiza`)){//comando de realizar uma compra
                    const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                        message.reply(`Informe o codigo do produto a ser comprado, depois insira a quantidade, o id do discord do cliente, do funcionario, por fim insira o método de pagamento, a data e a nota fiscal, tudo separado por \`,\` `);
                        let Compra = null;
                        collector.on('collect', m => {
                            Compra = m.content;
                        });
                        message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                        .then(async (collected) => {
                            const compra = await db.Compra(Compra);
                            if(compra === "Não há estoque suficiente"){
                                message.reply(`Não há estoque suficiente`);
                            }
                            else{
                                Compra = Compra.split(',');
                                const nota_fiscal = Compra[6];
                                const ACOMPRA = db.selecionaCompra(nota_fiscal);
                                message.reply(`A Compra ${JSON.stringify(ACOMPRA).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')} foi realizada com sucesso`);
                            }
                        }
                        )
                        .catch(collected => {
                            message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                        });
                }
                else if(message.content.includes(`Busca`) || message.content.includes(`busca`)){//comando de buscar compras
                    const filter = m => m.author.id === message.author.id;
                        const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                        message.reply(`informe a nota fiscal da compra`);
                        let Compra = null;
                        collector.on('collect', m => {
                            Compra = m.content;
                        });
                        message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                        .then(async (collected) => {
                            let Compras = await db.selecionaCompra(Compra);
                            if(Compras == ""){
                                message.reply(`A Compra não se encontra no nosso banco de dados`)
                            }
                            else{
                                message.reply(`${JSON.stringify(Compras).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')}`);
                            }
                        }
                        )
                        .catch(collected => {
                            message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                        });
                }
                else if(message.content.includes(`Todas`) || message.content.includes(`Todos`) || message.content.includes(`todas`) || message.content.includes(`todos`)){//comando de obter todas as compras
                    const Compra = await db.selecionaTodasCompras();
                    message.reply(`${JSON.stringify(Compra).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')}`);
                }
            }
            if(message.content.includes(`Produto`) || message.content.includes(`produto`)){//verificação se contem a palavra produto
                if(message.content.includes(`Del`) || message.content.includes(`del`)){//comando de deletar produtos
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                    message.reply(`Informe o codigo do produto a ser deletado`);
                    let produto = null;
                    collector.on('collect', m => {
                        produto = m.content;
                    });
                    message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(async (collected) => {
                        const result = await db.deletaProduto(produto);
                    }
                    )
                    .catch(collected => {
                        message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                    });
                }
                else if(message.content.includes(`Add`) || message.content.includes(`add`)){//comando de adicionar produtos
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                    message.reply(`Informe o nome, preço e estoque do produto separados por \`,\` `);
                    let produto = null;
                    collector.on('collect', m => {
                        produto = m.content;
                    });
                    message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(async (collected) => {
                        const result = await db.insereProduto(produto);
                        produto = produto.split(',');
                        const resposta = await db.selecionaProdutos(produto[0]);
                        message.reply(`O Produto ${JSON.stringify(resposta).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')} foi adicionado com sucesso`);
                    }
                    )
                    .catch(collected => {
                        message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                    });
                }
                else if(message.content.includes(`Atualiza`) || message.content.includes(`atualiza`)){//comando de atualizar produtos
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                    message.reply(`Informe o novo nome, preço e estoque, depois insira o id do produto a ser atualizado, todos separados por separados por \`,\` `);
                    let produto = null;
                    collector.on('collect', m => {
                        produto = m.content;
                    });
                    message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(async (collected) => {
                        const result = await db.UpdateProduto(produto);
                        produto = produto.split(',');
                        const resposta = await db.selecionaProdutos(produto[0]);
                        message.reply(`O Produto ${JSON.stringify(resposta).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')} foi atualizado com sucesso`);
                    }
                    )
                    .catch(collected => {
                        message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                    });
                }
            }
            if(message.content.includes(`Funcionario`) || message.content.includes(`funcionario`)){//Verificação se a mensagem contém funcionario
                if(message.content.includes(`Del`) || message.content.includes(`del`)){//comando de deletar funcionarios
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                    message.reply(`Informe o id do discord do funcionario a ser deletado`);
                    let funcionario = null;
                    collector.on('collect', m => {
                        funcionario = m.content;
                    });
                    message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(async (collected) => {
                        const result = await db.deletaFuncionario(funcionario);
                    }
                    )
                    .catch(collected => {
                        message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                    });
                }
                else if(message.content.includes(`Add`) || message.content.includes(`add`)){//comando de adicionar funcionarios
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                    message.reply(`Informe o id_discord, nome, cpf e salario do funcionario separados por \`,\` `);
                    let funcionario = null;
                    collector.on('collect', m => {
                        funcionario = m.content;
                    });
                    message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(async (collected) => {
                        const result = await db.insereFuncionario(funcionario);
                        funcionario = funcionario.split(',');
                        const resposta = await db.selecionaFuncionarios(funcionario[1]);
                        message.reply(`O Funcionario ${JSON.stringify(resposta).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')} foi adicionado com sucesso`);
                    }
                    )
                    .catch(collected => {
                        message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                    });
                }
                else if(message.content.includes(`Todos`) || message.content.includes(`todos`)){//comando de obter todos os funcionarios
                    const Funcionarios = await db.selecionaTodosFuncionarios();
                    message.reply(`${JSON.stringify(Funcionarios).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')}`);
                }
                else if(message.content.includes(`Atualiza`) || message.content.includes(`atualiza`)){//comando de atualizar funcionarios
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                    message.reply(`Informe o id_discord do funcionario a ser atualizado, depois insira o novo nome, cpf e salario do funcionario separados por \`,\` `);
                    let funcionario = null;
                    collector.on('collect', m => {
                        funcionario = m.content;
                    });
                    message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(async (collected) => {
                        const result = await db.UpdateFuncionario(funcionario);
                        funcionario = funcionario.split(',');
                        const resposta = await db.selecionaFuncionarios(funcionario[1]);
                        message.reply(`O Funcionario ${JSON.stringify(resposta).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')} foi atualizado com sucesso`);
                    }
                    )
                    .catch(collected => {
                        message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                    });
                }
                else{//comando de buscar funcionario
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 15000 });
                    message.reply(`Qual Funcionario está buscando?`);
                    let pesquisafuncionario = null;
                    collector.on('collect', m => {
                        pesquisafuncionario = m.content;
                    });
                    message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
                    .then(async (collected) => {
                        message.reply(`você selecionou o funcionario de nome ${pesquisafuncionario}`);
                        let Funcionario = await db.selecionaFuncionarios(pesquisafuncionario);
                        if(Funcionario == ""){
                            message.reply(`O Funcionario não se encontra no nosso banco de dados`)
                        }
                        else{
                            message.reply(`${JSON.stringify(Funcionario).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')}`);
                        }
                    }
                    )
                    .catch(collected => {
                        message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                    });
                }
            }
            if(message.content.includes(`Cliente`) || message.content.includes(`cliente`)){//Verificação se digitou cliente
                if(message.content.includes(`Del`) || message.content.includes(`del`)){//Comando de deletar clientes
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                    message.reply(`Informe o id do discord do Cliente a ser deletado`);
                    let Cliente = null;
                    collector.on('collect', m => {
                        Cliente = m.content;
                    });
                    message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(async (collected) => {
                        const result = await db.deletaCliente(Cliente);
                    }
                    )
                    .catch(collected => {
                        message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                    });
                }
                else if(message.content.includes(`Add`) || message.content.includes(`add`)){//comando de adicionar clientes
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                    message.reply(`Informe o id_discord, nome e endereço do cliente, separados por \`,\` `);
                    let cliente = null;
                    collector.on('collect', m => {
                        cliente = m.content;
                    });
                    message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(async (collected) => {
                        const result = await db.insereCliente(cliente);
                        cliente = cliente.split(',');
                        const resposta = await db.selecionaClientes(cliente[1]);
                        message.reply(`O Cliente ${JSON.stringify(resposta).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')} foi adicionado com sucesso`);
                    }
                    )
                    .catch(collected => {
                        message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                    });
                }
                else if(message.content.includes(`Atualiza`) || message.content.includes(`atualiza`)){//comando de atualizar clientes
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                    message.reply(`Informe o id_discord do cliente a ser atualizado, depois insira o novo nome e endereço do cliente, separados por \`,\` `);
                    let cliente = null;
                    collector.on('collect', m => {
                        cliente = m.content;
                    });
                    message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(async (collected) => {
                        const result = await db.UpdateCliente(cliente);
                        cliente = cliente.split(',');
                        const resposta = await db.selecionaClientes(cliente[1]);
                        message.reply(`O Cliente ${JSON.stringify(resposta).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')} foi atualizado com sucesso`);
                    }
                    )
                    .catch(collected => {
                        message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                    });
                }
                else if(message.content.includes(`Todos`) || message.content.includes(`todos`)){//comando de obter todos os clientes
                    const Clientes = await db.selecionaTodosClientes();
                    message.reply(`${JSON.stringify(Clientes).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')}`);
                }
                else{//comando de procurar clientes
                    const filter = m => m.author.id === message.author.id;
                    const collector = message.channel.createMessageCollector({ filter, time: 150000 });
                    message.reply(`Qual Cliente está buscando?`);
                    let pesquisacliente = null;
                    collector.on('collect', m => {
                        pesquisacliente = m.content;
                    });
                    message.channel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] })
                    .then(async (collected) => {
                        message.reply(`você selecionou o Cliente de nome ${pesquisacliente}`);
                        let Cliente = await db.selecionaClientes(pesquisacliente);
                        if(Cliente == ""){
                            message.reply(`O Cliente não se encontra no nosso banco de dados`)
                        }
                        else{
                            message.reply(`${JSON.stringify(Cliente).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')}`);
                        }
                    }
                    )
                    .catch(collected => {
                        message.channel.send('Ocorreu um erro ou o tempo se esgotou');
                    });
                }

            }
        }
        if(message.content === `${prefix}Catalogo` || message.content === `${prefix}catalogo`){//Comando de procurar todos os produtos
            const Catalogo = await db.selecionaTodosProdutos();
            message.reply(`${JSON.stringify(Catalogo).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')}`);
        }
        if(message.content === `${prefix}Produto` || message.content === `${prefix}produto`){//Comando de procura de produtos
            let pesquisaproduto = null;
            const filter = m => m.author.id === message.author.id;
            const collector = message.channel.createMessageCollector({ filter, time: 15000 });
            message.reply(`Qual Produto Deseja?`);
            collector.on('collect', m => {
                pesquisaproduto = m.content;
            });
            message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
			.then(async (collected) => {
                message.reply(`você selecionou o produto ${pesquisaproduto}`);
                let Produtos = await db.selecionaProdutos(pesquisaproduto);
                if(Produtos == ""){
                    message.reply(`O Produto não se encontra no nosso banco de dados`)
                }
                else{
                    message.reply(`${JSON.stringify(Produtos).trim().replaceAll('}','\n').replaceAll('{','').replaceAll(',',' ').replace('[','\xa0\xa0').replace(']','').replaceAll('"','')}`);
                }
            }
			)
			.catch(collected => {
				message.channel.send('Ocorreu um erro ou o tempo se esgotou');
			});
        }
        if(message.content === `${prefix}Ajuda` || message.content === `${prefix}ajuda`){//Comando Ajuda
            message.reply(`O bot utiliza do comando \`!!\` como prefixo para todos os comandos e deve ser utilizado antes de qualquer um. \nDigite \`!!Catalogo\` para o catalogo de produtos \nDigite \`!!Produto\` para e responda com o nome do produto para verificar apenas um produto. \nDigite \`!!Funcionario\` para comandos sobre funcionarios(requer cargo Func). \nDigite \`!!Clientes\` para comandos sobre clientes(requer cargo Func) \nDigite \`Compras\` para comando sobre compras(requer cargo Func).\nDigite \`Add\` após um comando(Funcionarios, Clientes, Produtos) para inserir um novo. \nDigite \`Del\` após um comando(Funcionarios, Clientes, Produtos) para deletar uma celular. \nDigite \`Atualiza\`após um comando (Funcionarios, Clientes, Produtos) para atualizar informações. \nDigite \`RealizarCompras\` para realizar uma compra(requer cargo Func). \nDigite \`Todos\` após um comando (Funcionarios, Clientes, Compras) para buscar tudo que há salvo sobre.`);
        }
    })
})();