FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    g++ \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /app
WORKDIR /app

COPY ./crowapp /app/

# 赋予执行权限（关键步骤！）
RUN chmod +x /app/crowapp

# 声明容器启动命令
CMD ["./crowapp"]
