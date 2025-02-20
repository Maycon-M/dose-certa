FROM nginx:alpine

# Copia os arquivos públicos para o diretório padrão do Nginx
COPY public/ /usr/share/nginx/html/

# Copia uma configuração customizada do Nginx (opcional)
# COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80