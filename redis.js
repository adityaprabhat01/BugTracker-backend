const redis = require("redis");

const createObject = (client) => {
  const x = new Redis(client)
  return x;
}

class Redis {
  constructor(client) {
    this.client = client;
  }

  async add_to_active_users () {
    const value = await this.client.get("key");
    console.log(value)
  }

}


const client = redis.createClient({
  url: process.env.REDIS_URL,
});

const userid_to_socket = redis.createClient({
  url: process.env.USERID_TO_SOCKET,
});

client.connect().then(() => {})
userid_to_socket.connect().then(() => {})

  module.exports = {
    client,
    userid_to_socket
  }
