export interface Balances {
  [key: string]: number;
}

export interface User {
  id: string;
  balance: Balances;
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
  [price: number]: {
    type: "ask" | "bid";
    quantity: number;
  };
}

export const bids: Order[] = [];
export const asks: Order[] = [];

export const users: User[] = [
  {
    id: "1",
    balance: {
      GOGLE: 10,
      USD: 50000,
    },
  },
  {
    id: "2",
    balance: {
      GOGLE: 10,
      USD: 50000,
    },
  },
];

export const PORT = 3000;

export const TICKER = "GOOGLE";
