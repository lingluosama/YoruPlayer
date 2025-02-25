FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    g++ \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir /app
WORKDIR /app

COPY ./crowapp /app/

RUN chmod +x /app/crowapp

CMD ["./crowapp"]
