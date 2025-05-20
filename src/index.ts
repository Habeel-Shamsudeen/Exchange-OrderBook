import express from "express";
import { asks, bids, Depth, Order, PORT, TICKER, users } from "./types";
import { fillOrders } from "./utils";
export const app = express();

app.use(express.json());

// route to place a limit order
app.post("/order", (req, res) => {
  const side = req.body.side; // can be either ask or bid
  const price: number = req.body.price;
  const quantity: number = req.body.quantity;
  const userId: string = req.body.userId;

  const order: Order = {
    userId,
    price,
    quantity,
  }

  // if the current order can be filled it will be filled and remaining quantity of the order will be returned
  // example if user place 2QTY for bid and there only match for 1QTY that will be filled and remaining 1QTY is returned
  const remainingQty = fillOrders({ side, order });

  if (remainingQty === 0) {
    res.json({
      message: `Order filled for ${order.quantity} QTY`,
      filledQuantity: order.quantity,
    });
    return;
  }
  if (side === "bid") {
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
    filledQuantity: order.quantity - remainingQty,
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
      balances: {
        USD: 0,
        [TICKER]: 0,
      },
    });
    return;
  }
  res.json({
    balances: user.balances,
  });
});

// to get the quote price to buy x number of stocks. basically need to return the average price of / unit stock for user to buy x amount based on the asks in the orderbook
app.post("/quote",(req,res)=>{
    let qty = req.body.qty;
    let quotePrice = 0;
    for(let i = asks.length-1; i>=0; i++){
      if(asks[i].quantity > qty){
        quotePrice += (qty*asks[i].price);
        break; 
    }
      quotePrice += (asks[i].price*asks[i].quantity);
      qty -= asks[i].quantity;
    }
    res.json({
      quote:quotePrice
    })
})

app.listen(PORT, () => {
  // console.log(`listening to port ${PORT}`);
});
