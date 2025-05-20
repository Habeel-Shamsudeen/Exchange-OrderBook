# Exchange-OrderBook

A simple exchange order book simulation built using Node.js and Express.  
It allows users to place limit orders (bids and asks), view the order book depth, and track user balances.

## Features

- Place **limit orders** (buy/sell)
- Automatic **order matching and trade execution**
- **Order book depth** endpoint to view current bids and asks
- **User balance tracking** (USD and TICKER)
- In-memory storage (no database)

## API Endpoints

### 1. **POST** `/order`
Place a new limit order (bid or ask).

## API Endpoints

---

### 📥 POST `/order`
Place a **limit order** (either `bid` or `ask`). The order will be matched against existing orders if possible. If partially filled, the remaining quantity is added to the order book.

**Request Parameters:**

- `side`: `"bid"` or `"ask"`
- `order`:  
  - `userId`: string  
  - `price`: number  
  - `quantity`: number

**Example Request:**

Side: `bid`  
Order: `{ userId: "user123", price: 100, quantity: 2 }`

**Example Response (Partially Filled):**

Message: `Order filled for 1 QTY`  
Filled Quantity: `1`  
Remaining Quantity: `1`

---

### 📊 GET `/depth`
Returns the current state of the order book showing total quantity available at each price level, along with the type (`bid` or `ask`).

**Example Response:**

Message: `Fetched the depth`  
Depth:
- `100`: type: `bid`, quantity: `5`
- `105`: type: `ask`, quantity: `3`

---

### 💰 GET `/balance/:userId`
Returns the balance of a specific user by their user ID.

**Example Request:**

GET `/balance/user123`

**Example Response:**

Balance:  
- `USD`: 1500  
- `TICKER`: 10

---

### 💬 POST `/quote`

Returns the best price quote to fulfill a requested quantity from the order book. Currently supports quoting for the `bid` side (i.e., simulating a market buy against existing ask orders).


