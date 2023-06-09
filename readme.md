## :book: Desafio Teste de Performance

Desenvolva um script de performance para o seguinte cenário:
URL: https://www.blazedemo.com

Cenário:

- Compra de passagem aérea - Passagem comprada com sucesso.

Critério de Aceitação:

- 250 requisições por segundo com um tempo de resposta 90th percentil inferior a 2 segundos.

Instruções

- Escolha entre JMeter e Gatling
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

Para a execução, basta:

1. Instalar o JMeter versão 5.4.1 ou superior: https://jmeter.apache.org/download_jmeter.cgi
1. Clonar o projeto ou baixar os scripts **carga.jmx** e **pico.jmx**
1. Executar o comando _**jmeter -n -t \<local do script> -l \<local do result> -e -o \<diretorio relatorio>**_
1. Por exemplo, no diretório onde estão os scripts rodar:
   > _jmeter -n -t carga.jmx -l carga_result.jtl -e -o carga_report_\
   > _jmeter -n -t pico.jmx -l pico_result.jtl -e -o pico_report_
1. Aguardar uns 7 minutos para a execução completa de cada script
1. Na pasta escolhida para gerar o relatório terá um arquivo **index.html** com o resultado da execução.

---

## Relatório de execução

Teste de Carga -
