- Projeto exemplo - backend REST para despesas<br />
<br />
- class descriptions<br />
    expenses - classe responsavel pela entidade de despesas com metodos CRUD e interface com DB<br />
    users - classe responsavel pela entidade de usuarios com metodos CRUD e interface com DB<br />
    auth - classe responsavel pelos metodos de autenticação, no caso somente email e password<br />
    session - classe responsavel pelo registro de sessoes de usuario, e interface desta com DB<br />
    database - classe de utilidades para a criação da base de dados e populacao da mesma para teste<br />
    procedures - classe responsavel pelo processamento das requiciçoes e gerenciamento de callbacks, mantendo assim a assincronicidade da aplicação, evitando o uso de awaits em processos assincronos<br />
<br />
- o arquivo de index.js processa a inicialização do servico, incluindo o serviço de processamento de requisições<br />
<br />
- observação:<br />
    devido a problemas com a ferramenta bodyparser, o body de requisições de post e put que utilizam Content-Type multipart em geral o processamento desta foi feito manualmente utilizando expressoes regulares.<br />
<br />
- ao ser adicionado uma despesa, o usuario sera notificado atraves de um email com detalhes da despesa adicionada<br />
<br />
- somente usuario logado (com seção aberta) pode adicionar sua propria despesa, o que supri a validação do usuario ja no ato de login<br />
<br />
- os dados inseridos sao validados nos seguintes criterios<br />
    somente usuarios logados podem add seu dado<br />
    data nao é futuro<br />
    valor nao é negativo<br />
    descrição tem ate 191 caracteres