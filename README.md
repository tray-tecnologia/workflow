# Workflow

Workflow para desenvolvimento de temas utilizando Tray CLI.

# Como usar

Pré-requisitos: NodeJS, NPM e GULP

Clone o repositório e acesse o diretório com os arquivos baixados.

Depois execute o comando:

```
$ npm install
```

# Configuração/Uso

Clone o repositorio, renomeie o arquivo .env.sample para .env e insira as credenciais da API nele.

TRAY_API_KEY=

TRAY_API_PASSWORD=

TRAY_THEME_ID=

Obs: API_KEY e PASSWORD são chaves individuais que o desenvolvedor deve solicitar ao lojista.

Em seguida basta executar o comando abaixo, para baixar os arquivos do tema:

```
$ gulp download
```

Os arquivos serão baixados dentro da pasta padrão theme-[THEME_ID].

Após finalizado o download execute o comando:

```
$ gulp
``` 

Pronto, comece a editar seus arquivos e você verá o gulp e o opencode trabalhando por você!

## Observações

Você pode alterar a pasta de trabalho usando a opção --folder ou --dir com o gulp.

Exemplo para fazer download em uma pasta diferente:

```
$ gulp download --folder=minha-pasta
```

Exemplo para editar o tema em uma pasta especifica:

```
$ gulp --folder=minha-pasta
```

## Opções

Os argumento do terminal podem ser usados para sobrescrever as configurações do .env

--folder: Diretório onde será salvo os arquivos do tema. O padrão é theme-[THEME_ID]

--key: Chave da API

--password: Senha da API

--theme: ID do tema

## Tray CLI

Repositório oficial da nova ferramenta da Tray

https://github.com/tray-tecnologia/tray-cli

## Suporte

ER Soluções Web LTDA 
http://ersolucoesweb.com.br

Parceiro credenciado Tray Commerce