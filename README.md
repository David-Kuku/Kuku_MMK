### Kuku_MMK

## Requirements
- To run this code, the Node Package Manager (NPM) is required. You will need to download and install Node from https://nodejs.com/en/download. You will be able to run     npm commands with this.<br/>
- An env file will alse be required. In the .env file, environment variables which include database connection details, redis connection details and so on.<br/>
- Check the env.example for the list of environmental variables needed.

## 1. Database
- Create a PostgreSQL database locally. This will be used to store the application's metadata.<br/>
- After creating the database, run the following command to copy the dump onto the database. <br/>
- After that, then you can set your environment variables as specified in the env.example.<br/>

## 2. Redis
- Download redis on your computer. This process varies for different operating systems. So go to https://redis.io/docs/getting-started/ and follow the process. <br/>
- Once that is done, start your redis server as directed on the redis website.<br/>
- For the redis env vars,<br/>
    REDIS_HOST = 127.0.0.1<br/>
    REDIS_PORT = 6379, could be used as default
  
## 3. Installing Packages
- To download all packages, run the command:<br/>
    npm install<br/>
- To start the server, run the command: <br/>
    npm run dev<br/>
    
- Base Url: http://localhost:3000/. This can be accessed in your web browser. A JSON with status of UP {"status":"Active"} will be displayed

