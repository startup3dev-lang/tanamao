Crie todas as telas de uma aplicação web/mobile chamada **TA PRONTO**, uma plataforma de contratação rápida de profissionais freelancers e prestadores de serviço, com proposta parecida com iFood, porém focada em serviços locais como pedreiro, eletricista, encanador, pintor, diarista, técnico de ar-condicionado, jardineiro, montador de móveis, gesseiro, marceneiro, chaveiro, serviços gerais e outros profissionais autônomos.

A aplicação deve ter uma experiência **rápida, prática, direta ao ponto e extremamente intuitiva**, com foco em ajudar o usuário a encontrar o profissional ideal mais próximo, sem exigir login logo no início. O login ou cadastro só deve ser solicitado quando o usuário decidir fechar/agendar o serviço com um profissional.

## Identidade visual

Utilizar uma identidade moderna, tecnológica, confiável e popular, com aparência de aplicativo premium, porém simples de usar.

Paleta visual:

* Fundo principal: azul escuro / navy blue.
* Textos principais: branco.
* Detalhes, botões e elementos de destaque: amarelo vibrante.
* Cards: branco ou cinza muito claro.
* Textos internos nos cards: azul escuro, preto suave ou cinza escuro.
* Usar sombras suaves, bordas arredondadas e visual limpo.

Estilo:

* Moderno, minimalista, responsivo e amigável.
* Inspirado em marketplaces de delivery e serviços locais.
* Visual parecido com iFood/Uber/99, mas adaptado para contratação de profissionais.
* Interface rápida, com poucos passos até encontrar o profissional.
* Tipografia sem serifa, moderna, forte e legível.
* Ícones simples e intuitivos para cada categoria profissional.

## Conceito da aplicação

O TA PRONTO deve funcionar como um marketplace de serviços onde o usuário entra no site/app, informa sua localização e encontra profissionais próximos disponíveis.

A tela inicial deve destacar a frase:

**“Localize o profissional que você precisa mais próximo de você.”**

Logo abaixo deve existir um campo grande para inserir endereço, bairro, cidade ou usar localização atual.

Exemplo de placeholder:

**“Digite seu endereço ou use sua localização atual”**

Também deve haver um botão amarelo chamativo:

**“Buscar profissionais”**

O usuário deve conseguir navegar e visualizar profissionais sem login. O login só deve aparecer no momento de:

* Solicitar orçamento.
* Agendar serviço.
* Conversar com o profissional.
* Confirmar contratação.
* Finalizar pagamento ou reserva.

## Regra de priorização dos profissionais

A listagem dos profissionais deve funcionar com um modelo de prioridade balanceado entre **avaliação, distância, disponibilidade e preço**.

A prioridade principal deve ser:

1. Profissionais mais bem avaliados, com 5 estrelas, que estejam mais próximos do usuário.
2. Caso não existam profissionais 5 estrelas próximos, mostrar os mais próximos com 4,8 / 4,7 / 4,5 estrelas.
3. Caso não exista alta avaliação próxima, priorizar o profissional mais próximo com boa reputação.
4. Destacar profissionais disponíveis agora.
5. Destacar profissionais com desconto, selo de confiança ou maior número de serviços concluídos.

Cada card de profissional deve mostrar:

* Foto ou avatar do profissional.
* Nome.
* Profissão.
* Nota média em estrelas.
* Distância aproximada.
* Tempo estimado de chegada ou atendimento.
* Quantidade de serviços realizados.
* Preço inicial ou faixa de preço.
* Selo: “Disponível agora”, “Mais próximo”, “Melhor avaliado”, “Com desconto” ou “Profissional verificado”.
* Botão: “Ver perfil”.
* Botão secundário: “Solicitar orçamento”.

## Telas que devem ser criadas

### 1. Tela inicial / Home pública

Criar uma tela inicial impactante, sem login obrigatório.

Elementos principais:

* Header com logo TA PRONTO à esquerda.
* Menu superior com: Início, Categorias, Profissionais, Ofertas, Como funciona.
* Botão discreto: Entrar.
* Botão destacado: Seja um profissional.
* Hero section com fundo azul escuro.
* Texto principal: “Localize o profissional que você precisa mais próximo de você.”
* Subtexto: “Encontre pedreiros, eletricistas, encanadores, pintores e outros profissionais perto de você em poucos cliques.”
* Campo de endereço/localização.
* Botão “Buscar profissionais”.
* Botão ou link “Usar minha localização atual”.
* Cards rápidos de categorias populares.
* Área de profissionais próximos em destaque.
* Área de profissionais com desconto.
* Área explicando como funciona em 3 passos:

  1. Informe sua localização.
  2. Escolha o profissional.
  3. Agende ou solicite o serviço.

### 2. Tela de seleção de localização

Criar uma tela/modal para o usuário informar localização.

Elementos:

* Campo de busca de endereço.
* Botão “Usar localização atual”.
* Sugestões recentes.
* Mensagem: “Usamos sua localização apenas para encontrar profissionais próximos.”
* Confirmação do endereço.
* Botão “Confirmar localização”.

### 3. Tela de categorias de serviços

Criar uma tela parecida com catálogo de categorias, no estilo marketplace.

Categorias sugeridas:

* Pedreiro.
* Eletricista.
* Encanador.
* Pintor.
* Diarista.
* Técnico de ar-condicionado.
* Montador de móveis.
* Jardineiro.
* Chaveiro.
* Marceneiro.
* Gesseiro.
* Serviços gerais.

Cada categoria deve aparecer em cards com:

* Ícone.
* Nome da profissão.
* Quantidade de profissionais disponíveis próximos.
* Destaque visual para categorias mais buscadas.
* Cards com cantos arredondados e detalhes amarelos.

### 4. Tela de listagem de profissionais próximos

Criar uma tela de resultados após o usuário inserir localização e escolher ou não uma categoria.

Elementos:

* Header fixo com localização atual.
* Barra de busca: “Qual serviço você precisa?”
* Filtros horizontais:

  * Mais próximos.
  * Melhor avaliados.
  * Disponíveis agora.
  * Com desconto.
  * Menor preço.
  * Profissionais verificados.
* Cards de profissionais com foto/avatar, profissão, avaliação, distância, preço inicial, disponibilidade e botão.
* Mapa lateral ou visual compacto com localização aproximada dos profissionais.
* Ordenação inteligente baseada em avaliação + distância + disponibilidade.
* Destaque para o melhor resultado:

  * “Melhor escolha perto de você”
  * “5 estrelas • 1,2 km • Disponível agora”

### 5. Tela de detalhe do profissional

Criar uma tela completa do perfil do profissional.

Elementos:

* Foto/avatar.
* Nome completo.
* Profissão principal.
* Avaliação em estrelas.
* Número de avaliações.
* Distância do usuário.
* Tempo médio de resposta.
* Serviços realizados.
* Selo de verificação.
* Disponibilidade: “Disponível hoje” ou “Agenda aberta”.
* Galeria com fotos de trabalhos anteriores.
* Descrição profissional.
* Lista de serviços oferecidos.
* Preço inicial ou faixa de preço.
* Avaliações de clientes.
* Botão principal amarelo: “Solicitar orçamento”.
* Botão secundário: “Conversar”.
* Botão: “Agendar serviço”.
* Aviso: “Você só precisa fazer login para confirmar a solicitação.”

### 6. Tela de profissionais com desconto

Criar uma tela exclusiva para ofertas.

Elementos:

* Título: “Profissionais com desconto perto de você”
* Cards com destaque amarelo para desconto.
* Tags:

  * “10% OFF”
  * “Primeiro serviço com desconto”
  * “Promoção hoje”
* Filtros por profissão.
* Filtros por distância.
* Botão “Ver oferta”.
* Destaque para urgência:

  * “Disponível hoje”
  * “Poucos horários restantes”

### 7. Tela de busca por profissão

Criar tela onde o usuário pesquisa diretamente por tipo de serviço.

Elementos:

* Campo de busca grande: “Digite o serviço que você precisa”
* Sugestões automáticas:

  * “Consertar vazamento”
  * “Instalar tomada”
  * “Pintar parede”
  * “Montar guarda-roupa”
  * “Trocar resistência do chuveiro”
* Resultado agrupado por profissão.
* Sugestão inteligente:

  * “Para esse serviço, recomendamos: Eletricista”
  * “Para esse serviço, recomendamos: Encanador”

### 8. Tela de comparação de profissionais

Criar uma tela onde o usuário pode comparar até 3 profissionais.

Comparar:

* Avaliação.
* Distância.
* Preço inicial.
* Disponibilidade.
* Serviços concluídos.
* Tempo médio de resposta.
* Desconto.
* Selo de verificação.

Botão final:

* “Escolher profissional”.

### 9. Tela de solicitação de orçamento

Essa tela só deve aparecer após o usuário escolher um profissional.

Elementos:

* Resumo do profissional escolhido.
* Tipo de serviço.
* Campo para descrever o problema.
* Upload de fotos opcional.
* Escolha de urgência:

  * Hoje.
  * Amanhã.
  * Esta semana.
  * Data personalizada.
* Endereço do serviço.
* Botão: “Continuar”.
* Aqui pode aparecer a solicitação de login/cadastro antes de finalizar.

### 10. Tela de login/cadastro

Criar tela simples e rápida, sem parecer burocrática.

Texto:
**“Entre para continuar sua solicitação.”**

Opções:

* Entrar com Google.
* Entrar com telefone.
* Entrar com e-mail.
* Criar conta rapidamente.

Informar:
“Você só precisa entrar para confirmar o serviço, conversar com o profissional e acompanhar sua solicitação.”

### 11. Tela de confirmação do serviço

Elementos:

* Profissional escolhido.
* Serviço solicitado.
* Endereço.
* Data/horário.
* Valor estimado ou “aguardando orçamento”.
* Botão “Confirmar solicitação”.
* Mensagem de segurança:

  * “Profissionais verificados passam por análise da plataforma.”
* Opção de alterar endereço, data ou profissional.

### 12. Tela de conversa/chat

Criar tela de chat entre cliente e profissional.

Elementos:

* Nome e foto do profissional.
* Status: online, disponível ou responde rápido.
* Mensagens.
* Botão para enviar foto.
* Botão para enviar localização.
* Card fixo com resumo da solicitação.
* Botão “Fechar serviço”.
* Botão “Cancelar solicitação”.

### 13. Tela de acompanhamento do serviço

Criar uma tela para o cliente acompanhar o status.

Status possíveis:

* Solicitação enviada.
* Profissional visualizou.
* Orçamento enviado.
* Serviço confirmado.
* Profissional a caminho.
* Serviço em andamento.
* Serviço concluído.

Usar timeline visual simples, com ícones e detalhes amarelos.

### 14. Tela de avaliação do profissional

Após conclusão do serviço, criar tela de avaliação.

Elementos:

* Foto do profissional.
* Nome.
* Estrelas de 1 a 5.
* Campo de comentário.
* Tags rápidas:

  * Pontual.
  * Educado.
  * Serviço bem feito.
  * Preço justo.
  * Respondeu rápido.
* Botão “Enviar avaliação”.

### 15. Tela de área do cliente

Criar dashboard simples para o usuário logado.

Elementos:

* Saudação.
* Serviços em andamento.
* Histórico de serviços.
* Profissionais favoritos.
* Endereços salvos.
* Cupons/descontos.
* Configurações da conta.
* Suporte.

### 16. Tela de favoritos

Listar profissionais salvos pelo cliente.

Elementos:

* Cards de profissionais favoritos.
* Nota.
* Distância.
* Último serviço realizado.
* Botão “Contratar novamente”.
* Botão “Remover favorito”.

### 17. Tela de cadastro do profissional

Criar fluxo para prestadores de serviço se cadastrarem.

Elementos:

* Título: “Ganhe dinheiro oferecendo seus serviços no TA PRONTO”
* Campos:

  * Nome.
  * Telefone.
  * Cidade.
  * Profissão.
  * Experiência.
  * Documentos.
  * Foto de perfil.
  * Portfólio/fotos de trabalhos.
  * Áreas de atendimento.
  * Preço inicial.
  * Horários disponíveis.
* Botão: “Começar cadastro”.
* Destaques:

  * Receba pedidos próximos.
  * Defina sua agenda.
  * Ganhe mais visibilidade.
  * Seja avaliado pelos clientes.

### 18. Tela painel do profissional

Criar dashboard do profissional.

Elementos:

* Pedidos recebidos.
* Solicitações pendentes.
* Serviços agendados.
* Ganhos do mês.
* Avaliação média.
* Distância dos pedidos.
* Botão para ativar/desativar disponibilidade.
* Lista de solicitações com botões:

  * Aceitar.
  * Recusar.
  * Enviar orçamento.
  * Conversar com cliente.

### 19. Tela de orçamento do profissional

Tela para o profissional enviar proposta.

Elementos:

* Dados da solicitação.
* Fotos enviadas pelo cliente.
* Endereço aproximado.
* Campo para valor.
* Campo para observações.
* Prazo estimado.
* Botão “Enviar orçamento”.

### 20. Tela administrativa

Criar painel interno para gestão da plataforma.

Elementos:

* Total de clientes.
* Total de profissionais.
* Profissionais ativos.
* Serviços solicitados.
* Serviços concluídos.
* Avaliação média.
* Categorias mais buscadas.
* Profissionais aguardando aprovação.
* Denúncias ou chamados.
* Mapa de demanda por região.
* Filtros por cidade, profissão e status.

## Experiência do usuário

A jornada principal deve ser:

1. Usuário abre o site/app.
2. Informa localização.
3. Escolhe uma profissão ou pesquisa o serviço.
4. Visualiza profissionais próximos.
5. O sistema ordena os profissionais por avaliação + proximidade + disponibilidade.
6. Usuário acessa o perfil.
7. Solicita orçamento ou agenda.
8. Somente nesse momento aparece login/cadastro.
9. Usuário confirma solicitação.
10. Acompanha pelo chat/status.
11. Avalia o profissional após o serviço.

## Componentes obrigatórios

Criar componentes reutilizáveis:

* Header público.
* Header logado.
* Campo de localização.
* Barra de busca.
* Card de categoria.
* Card de profissional.
* Card de desconto.
* Filtro horizontal.
* Modal de localização.
* Modal de login.
* Timeline de status.
* Card de avaliação.
* Botões primários amarelos.
* Botões secundários com borda.
* Cards brancos com sombra suave.
* Menu inferior mobile com:

  * Início.
  * Buscar.
  * Pedidos.
  * Favoritos.
  * Perfil.

## Regras de design

* O usuário não deve se sentir obrigado a criar conta logo no início.
* A aplicação deve parecer rápida, simples e confiável.
* A localização deve ser o ponto central da experiência.
* A tela inicial deve ser muito objetiva.
* O botão principal sempre deve ser amarelo.
* O fundo azul escuro deve transmitir confiança.
* As informações dos profissionais devem ser claras e comparáveis.
* O layout deve funcionar muito bem em mobile e desktop.
* Priorizar experiência mobile first.
* Usar cards grandes e clicáveis.
* Evitar telas poluídas.
* Usar microcopy amigável e direta.

## Textos sugeridos para interface

Frase principal:
“Localize o profissional que você precisa mais próximo de você.”

Subtexto:
“Pedreiro, eletricista, encanador, pintor, diarista e outros profissionais prontos para te atender.”

Botões:

* Buscar profissionais.
* Usar minha localização.
* Ver perfil.
* Solicitar orçamento.
* Agendar serviço.
* Conversar.
* Fechar serviço.
* Contratar novamente.
* Seja um profissional.

Selos:

* Mais próximo.
* Melhor avaliado.
* Disponível agora.
* Com desconto.
* Profissional verificado.
* Responde rápido.

## Resultado esperado

Gerar um conjunto completo de telas para a aplicação TA PRONTO, com visual profissional, moderno, intuitivo e pronto para apresentação. A interface deve lembrar a praticidade de apps como iFood, mas com identidade própria voltada para contratação de serviços freelancers locais.

As telas devem mostrar claramente:

* Busca por localização.
* Categorias de profissões.
* Profissionais próximos.
* Profissionais com desconto.
* Perfil do profissional.
* Solicitação de orçamento.
* Login apenas no momento necessário.
* Chat.
* Acompanhamento do serviço.
* Avaliação.
* Área do cliente.
* Área do profissional.
* Painel administrativo.

Criar uma experiência visual forte, com fundo azul escuro, textos brancos, detalhes amarelos, cards limpos e linguagem direta.
