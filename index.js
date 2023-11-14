const express = require("express");
const { init: initDB, Counter } = require("./db");

const app = express();
const expressWs = require('express-ws')(app);


app.get('/', function (req, res, next) {
  res.send('Hello World!')
})

app.ws('/', function (ws, req) {
  console.log('connect success')
  console.log(ws)
  
  // 使用 ws 的 send 方法向连接另一端的客户端发送数据
  ws.send('connect to express server with WebSocket success')

  // 使用 on 方法监听事件
  //   message 事件表示从另一段（服务端）传入的数据
  ws.on('message', function (msg) {
    console.log(`receive message ${msg}`)
    ws.send('default response')
  })

  // 设置定时发送消息
  let timer = setInterval(() => {
    ws.send(`interval message ${new Date()}`)
  }, 2000)

  // close 事件表示客户端断开连接时执行的回调函数
  ws.on('close', function (e) {
    console.log('close connection')
    clearInterval(timer)
    timer = undefined
  })
})



// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;
async function bootstrap() {
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
