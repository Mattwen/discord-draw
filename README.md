# discord-draw
Basic drawing application for Discord users.

# Install using Docker

    docker pull mattwen/discord-draw:latest
    docker run --restart=always -p 8080:8080 -d mattwen/discord-draw:latest

Done!!

# Install Dependencies manually
git clone

    git clone https://github.com/Mattwen/discord-draw.git
    cd discord-draw
    sudo chmod +x server.js
    
install required npm packages

    npm install
    
check to see if it's running properly

    sudo node server.js
       
deploy on pm2

    sudo pm2 start
    pm2 start server.js -n "discord-draw"
    

    
   
