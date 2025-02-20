
# Dose Certa

O projeto Dose Certa é uma aplicação de lembretes de remedios para pessoas que possuem dificuldades de lembrar dos horários das suas medicações. Esse Repo contem o front-end da aplicação.

Esse projeto esta sendo utilizando nas disciplinas de Interface Homem Máquina e Infraestrutura em Nuvem com AWS.

## Autores

- [@Maycon-M](https://github.com/Maycon-M)

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/Maycon-M/dose-certa.git
```

Entre no diretório do projeto

```bash
  cd dose-certa
```

Construa uma imagem a partir do docker-compose.yaml

```bash
  docker-compose -f docker/docker-compose.yaml -p front_dose_certa up --build
```

## Relacionados

Segue a API do projeto

[API - Dose Certa](https://github.com/Maycon-M/dose_certa_api)
