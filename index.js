const express = require("express");


const app = express();
const expressWs = require('express-ws')(app);
const wss = []

app.get('/', function (req, res, next) {
  res.send('Hello World!')
})

app.ws('/', function (ws, req) {
  console.log('connect success')
  console.log(ws)

  // 使用 ws 的 send 方法向连接另一端的客户端发送数据
  ws.send('connect to express server with WebSocket success')

  wss.push(ws)
  ws.on("message", (msg) => {
    console.log(msg);
    // 给所有的客户端广播消息
    // console.log(msg);
    // console.log(wss);
    wss.forEach((e) => {
      e.send(msg)
    })
  })
  // close 事件表示客户端断开连接时执行的回调函数
  ws.on('close', function (e) {
    console.log('close connection')
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
