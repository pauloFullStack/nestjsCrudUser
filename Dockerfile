# Dockerfile

# Usando uma imagem base do Node.js
FROM node:18-alpine

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando os arquivos de configuração de pacotes e instalando dependências
COPY package*.json ./
RUN npm install

# Copiando o código do backend para o contêiner
COPY . .

# Construindo o projeto
RUN npm run build

# Definindo variáveis de ambiente
ENV NODE_ENV=development

# Expondo a porta que o backend usará
EXPOSE 3000

# Comando para iniciar o servidor NestJS
CMD ["node", "dist/main"]
