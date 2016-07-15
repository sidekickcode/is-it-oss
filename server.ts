import * as express from "express";
import * as bodyParser from "body-parser";
import isItOss, { validRepoUrl, OssStatus } from "./is-it-oss";

const app = express();

app.use(bodyParser.json());

app.get("/oss-status", function(req, res) {
  const repo = req.query.repo;
  if(!validRepoUrl(repo)) {
    res.sendStatus(400).send({ error: "invalid 'repo' from query string" });
  }

  isItOss(repo)
    .then((answer: OssStatus) => res.send(answer))
    .catch(e => {
      console.error(e.stack);
      res.sendStatus(500).send({ error: "oh noes, something's wrong" })
    })
})

app.listen(process.env.PORT, function() {
  console.log("App online, aye aye!"); 
})
