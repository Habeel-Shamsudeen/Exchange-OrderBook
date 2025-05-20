export interface Balances {
  [key: string]: number;
}

export interface User {
  id: string;
  balances: Balances;
}

export interface Order {
  userId: string;
  price: number;
  quantity: number;
}

export interface FillOrder {
  side: "ask" | "bid";
  order: Order;
}

export interface Depth {
  [price: string]: {
    type: "ask" | "bid";
    quantity: number;
  };
}

export const bids: Order[] = [];
export const asks: Order[] = [];

export const users: User[] = [{
  id: "1",
  balances: {
    "GOOGLE": 10,
    "USD": 50000
  }
}, {
  id: "2",
  balances: {
    "GOOGLE": 10,
    "USD": 50000
  }
}];

export const PORT = 3000;

export const TICKER = "GOOGLE";
