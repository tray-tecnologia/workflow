# workflow
Workflow para desenvolvimento de temas

# Como usar


Pré-requisitos: NodeJS, NPM e GULP

```
$ git clone https://github.com/tray-desenvolvedores/workflow.git
$ cd workflow
$ npm install
```

# Configuração/Uso

Configure a loja que você vai trabalhar:

```
$ mkdir nomedoTema
$ cd nomedoTema
$ opencode configure API_KEY PASSWORD THEME_ID (veja a Obs: logo abaixo)
$opencode download
```

Obs: API_KEY e PASSWORD são chaves individuais que o desenvolvedor deve solicitar ao lojista.
Essas chaves que estão na documentação são da loja de teste: https://opencode.commercesuite.com.br.
Se quiser poderá utilizar essa loja com as seguintes credenciais:
opencode configure 20a699301d454509691f3ea02c1cba4b ea0727075e1639a42fd966a2f6e67abc 1

Após baixar todos os arquivos, volte para a pasta que contém o gulpfile.js e rode esse comando:

```
$ gulp --folder nomedoTema
``` 
Pronto, comece a editar seus arquivos e você verá o gulp e o opencode trabalhando por você!


