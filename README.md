- Projeto exemplo - backend REST para despesas

- class descriptions
    expenses - classe responsavel pela entidade de despesas com metodos CRUD e interface com DB
    users - classe responsavel pela entidade de usuarios com metodos CRUD e interface com DB
    auth - classe responsavel pelos metodos de autenticação, no caso somente email e password
    session - classe responsavel pelo registro de sessoes de usuario, e interface desta com DB
    database - classe de utilidades para a criação da base de dados e populacao da mesma para teste
    procedures - classe responsavel pelo processamento das requiciçoes e gerenciamento de callbacks, mantendo assim a assincronicidade da aplicação, evitando o uso de awaits em processos assincronos

- o arquivo de index.js processa a inicialização do servico, incluindo o serviço de processamento de requisições

- observação:
    devido a problemas com a ferramenta bodyparser, o body de requisições de post e put que utilizam Content-Type multipart em geral o processamento desta foi feito manualmente utilizando expressoes regulares.

- ao ser adicionado uma despesa, o usuario sera notificado atraves de um email com detalhes da despesa adicionada

- somente usuario logado (com seção aberta) pode adicionar sua propria despesa, o que supri a validação do usuario ja no ato de login

- os dados inseridos sao validados nos seguintes criterios
    somente usuarios logados podem add seu dado
    data nao é futuro
    valor nao é negativo
    descrição tem ate 191 caracteres