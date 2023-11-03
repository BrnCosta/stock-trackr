# Alunos: Bruno Oliveira Costa
#         Gabriel Nogueira Morais
  
O sistema desenvolvido para o trabalho consiste em uma aplicação para controle de estoque e vendas de uma forma simplificada.
O sistema possui funções para cadastro de produtos, controle de estoque, venda e pagamento.
   
Algumas das regras de negócio:

Não pode ter estoque negativo
Não pode vender um produto com estoque igual a 0
Não pode vender um número maior de unidades do que o disponível em estoque
Ao realizar uma venda deve ser removido as unidades do estoque
Caso a venda seja cancelada os produtos devem retornar ao estoque
Não pode ter mais de um produto cadastrado com o mesmo código 
O preço ao comprar deve ser correspondentes a quantidade de itens no carrinho
O valor a vista é 10% menor que o valor a prazo
Só pode vender um produto com o status “A VENDA”
Todo produto deve ter uma categoria cadastrada
Todo produto deve ter um preço
O produto pode ter uma descrição 
Não pode se cadastrar um produto caso falte alguma característica fundamental (categoria ou preço)

Foi utilizada a linguagem JAVA e o framework JUNIT para desevolvimento dos testes.
