const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02d89f1e979bc3247ac6541bb174fb6236c8229f2603ad8f28e20da4df8d6ea40e": 100, // 035273ff0e4d8b691e0009bc24c3b959e72c8338a3a0f29ffe6fc65487d927c6
  "03d50edf8decdf5a55a45f24f1e44460dbe9739455c223ef297daad7127002d807": 50, // 2e746616b9f9d967d1fc67b24c35cd2e9cdd14b2c5267dc09fc7d9bd24301d5e
  "02fca67664671394364e30daec305923a84b4ba0584d33d285b5c9b0daa626cff2": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
