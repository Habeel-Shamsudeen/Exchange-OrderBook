import express from "express";
import { asks, bids, Depth, Order, PORT, TICKER, users } from "./types";
import { fillOrders } from "./utils";
const app = express();

app.use(express.json());

// route to place a limit order
app.post("/order", (req, res) => {
  const side = req.body.side; // can be either ask or bid
  const order: Order = req.body.order;
  // if the current order can be filled it will be filled and remaining quantity of the order will be returned
  // example if user place 2QTY for bid and there only match for 1QTY that will be filled and remaining 1QTY is returned
  const remainingQty = fillOrders({ side, order });

  if (remainingQty === 0) {
    res.json({
      message: `Order filled for ${order.quantity} QTY`,
      filledQty: order.quantity,
    });
    return;
  }
  if (side === "bids") {
    bids.push({
      userId: order.userId,
      price: order.price,
      quantity: remainingQty,
    });
    // bids [lowest to highest] so highest can be poped
    bids.sort((a, b) => (a.price < b.price ? -1 : 1)); // if -1 a before b
  } else {
    asks.push({
      userId: order.userId,
      price: order.price,
      quantity: remainingQty,
    });
    //asks from highest to lowest lowest ask can be poped if order filled
    asks.sort((a, b) => (a.price < b.price ? 1 : -1)); // if +1 a after b
  }
  // sorting it such way that
  //[high ask........low ask] <-> [high bid......low bid] in order book
  res.json({
    message: `Order filled for ${order.quantity - remainingQty} QTY`,
    filledQty: order.quantity - remainingQty,
    remainingQty: remainingQty,
  });
  return;
});

// route that returns the depth. ie the order book. price, quantity type
// at 200 there is total 5QTY for sell etc
app.get("/depth", (req, res) => {
  const depth: Depth = {};

  for (let i = 0; i < bids.length; i++) {
    if (!depth[bids[i].price]) {
      depth[bids[i].price] = {
        type: "bid",
        quantity: bids[i].quantity,
      };
    } else {
      depth[bids[i].price].quantity += bids[i].quantity;
    }
  }

  for (let i = 0; i < asks.length; i++) {
    if (!depth[asks[i].price]) {
      depth[asks[i].price] = {
        type: "ask",
        quantity: asks[i].quantity,
      };
    } else {
      depth[asks[i].price].quantity += asks[i].quantity;
    }
  }

  res.json({
    message: "Fetched the depth",
    depth,
  });
  return;
});

app.get("/balance/:userId", (req, res) => {
  const userId = req.params.userId;
  const user = users.find((user) => user.id === userId);
  if (!user) {
    res.json({
      message: `User with the given id not found`,
      balance: {
        USD: 0,
        [TICKER]: 0,
      },
    });
    return;
  }
  res.json({
    balance: user.balance,
  });
});

app.get("/quote",(req,res)=>{
    
})

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
