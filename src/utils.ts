import { asks, bids, FillOrder, TICKER, users } from "./types";

export const fillOrders = ({ side, order }: FillOrder): number => {
  let remainingQty = order.quantity;
  if (side === "bid") {
    for (let i = asks.length - 1; i >= 0; i--) {
      if (asks[i].price > order.price) {
        break;
      }
      if (asks[i].quantity > remainingQty) {
        asks[i].quantity -= remainingQty;
        flipBalance(asks[i].userId, order.userId, remainingQty, asks[i].price);
        return 0;
      } else {
        remainingQty -= asks[i].quantity;
        flipBalance(
          asks[i].userId,
          order.userId,
          asks[i].quantity,
          asks[i].price
        );
        asks.pop();
      }
    }
  } else {
    for (let i = bids.length - 1; i >= 0; i--) {
      if (bids[i].price < order.price) {
        break;
      }
      if (bids[i].quantity > remainingQty) {
        bids[i].quantity -= remainingQty;
        flipBalance(order.userId, bids[i].userId, remainingQty, order.price);
        return 0;
      } else {
        remainingQty -= bids[i].quantity;
        flipBalance(
          order.userId,
          bids[i].userId,
          bids[i].quantity,
          order.price
        );
        bids.pop();
      }
    }
  }
  return remainingQty;
};

const flipBalance = (
  user1_Id: string,
  user2_Id: string,
  quantity: number,
  price: number
) => {
  const user1 = users.find((user) => user.id === user1_Id);
  const user2 = users.find((user) => user.id === user2_Id);
  if (!user1 || !user2) {
    return;
  }
  user1.balance["USD"] += quantity * price;
  user2.balance["USD"] -= quantity * price;
  user1.balance[TICKER] -= quantity;
  user2.balance[TICKER] += quantity;
};
