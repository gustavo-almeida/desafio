## :book: Desafio Teste de Performance

Desenvolva um script de performance para o seguinte cenário:
URL: https://www.blazedemo.com

Cenário:

- Compra de passagem aérea - Passagem comprada com sucesso.

Critério de Aceitação:

- 250 requisições por segundo com um tempo de resposta 90th percentil inferior a 2 segundos.

Instruções:

- Escolha entre JMeter e Gatling.
- Monte um teste de carga e um teste de pico que satisfaçam a vazão do critério de aceitação.
- Anexe o relatório da execução, e explique se o critério de aceitação foi satisfatório ou não, além dos motivos que te levaram a essa conclusão.
- Crie o repositório no GitHub (público) e COPIE E COLE o link aqui. Desenvolva a automação e suba o código no repositório (dica: crie primeiro o repositório, copie o link, cole neste campo e submeta o formulário).
- Não se esqueça do README.md, que deve conter
  - Instruções para a execução do script
  - Relatório de execução dos testes
  - Demais considerações pertinentes ao teste

---

## :microscope: Sobre os scripts

Os cenários foram escritos na ferramenta JMeter e foram divididos em dois scripts para facilitar a execução.

### Para a execução, basta:

1. Instalar o JMeter versão 5.4.1 ou superior: https://jmeter.apache.org/download_jmeter.cgi
1. Clonar o projeto ou baixar os scripts **carga.jmx** e **pico.jmx**
1. Executar o comando _**jmeter -n -t \<local do script> -l \<local do result> -e -o \<diretorio relatorio>**_
1. Por exemplo, no diretório onde estão os scripts rodar:
   > _jmeter -n -t carga.jmx -l carga_result.jtl -e -o carga-report_\
   > _jmeter -n -t pico.jmx -l pico_result.jtl -e -o pico-report_
1. Aguardar uns 7 minutos para a execução completa de cada script
1. Na pasta escolhida para gerar o relatório terá um arquivo **index.html** com o resultado da execução.

### Considerações dos scripts

Foi usado [um recurso do JMeter](https://jmeter.apache.org/api/org/apache/jmeter/timers/ConstantThroughputTimer.html) para manter a média de requisições por segundo dentro do critério de aceitação. Com isso, algumas estratégias de _think time_ adicionadas nas primeiras versões do projeto foram desabilitadas, pois com esse recurso o JMeter "atrasa" de forma proposital as requisições para manter dentro da média proposta, e os _think times_ acabaram não surtindo efeito.

As requisições seguiram a ordem de acesso às páginas de compras:

1. home
1. purchase
1. reservation
1. confirmation

Para cada página foram adicionadas asserções de **código de resposta (200)** e **tempo de resposta (2000ms)**. Com isso, algo fora desses parâmetros foi considerado como erro na requisição.

Foram usadas **1000 threads** e tempo de execução total de **7 minutos**.

A única diferença entre os scripts está no _rampup_\*:

- **carga.jmx**: 120 segundos de rampup
- **pico.jmx**: 0 segundo de rampup

> \* Esse ponto será explicado melhor no relatório individual.

---

## :bar_chart: Relatório de execução

### Teste de Carga - :heavy_check_mark:

O teste de carga foi considerado satisfatório, pois atendeu os critérios de aceitação durante todo o período de execução, mantendo uma taxa baixa de erros (gráfico de pizza - menos de 4%):

![carga](img/carga.png)

Conforme observado, o tempo de resposta ficou em **1168.90ms** com um _throughput_ de **241.93**\* transações por segundo, o que atende os critérios.

> \* O recurso do JMeter de manter um _throughput_ não é preciso, pois trabalha na média. Dessa forma, foi considerado esse valor como aceitável dentro de um possível intervalo de confiança.

O relatório completo pode ser visto no html gerado em **./carga_report/index.html**.

### Teste de Pico - :heavy_multiplication_x:

Não ficou muito claro o que seria um teste de pico, então foi entendido que seria um teste em que **não há** um rampup, ou seja, todas as requisições chegam de uma vez no início do teste. Logo, conforme anunciado anteriormente, assim foi configurado o script **pico.jmx**.

Para esse cenário o teste não foi considerado satisfatório, pois a latência aumentou acima do critério de aceitação e consequentemente a taxa de erros cresceu bastante (gráfico de pizza - mais de 17%).

![pico](img/pico.png)

No gráfico de **Response Time Percentiles** fica mais claro que o critério não foi aceito:

![pico](img/pico_90th.png)

> O recurso que limita o _throughput_ do JMeter teve dificuldades para manter uma média, pois a aplicação estava respondendo de forma muito aleatória, dada a característica do teste.

O relatório completo pode ser visto no html gerado em **./pico_report/index.html**.

## :pencil: Considerações finais

Os critérios de aceitação precisam ser conversados para saber se condizem exatamente com o cenário esperado, pois ao limitar as execuções por segundo, mesmo aumentando a quantidade de _threads_, elas não surtem efeito a partir de um determinado número.

Algumas melhorias para as próximas versões observadas:

- Reativar o _think time_ das requisições, mantendo o critério de aceitação.
- Adicionar variáveis de forma aleatória para simular a seleção de cidades, voos e dados de pagamento, tornando o teste mais orgânico.
- Adicionar um _docker file_ para execução mais precisa e segura, podendo rodar o teste em diferentes ambientes com facilidade e rapidez.
- Ajustar o tempo total de teste de forma a condizer com as métricas de pico de uso da aplicação.
