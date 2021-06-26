import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { OrderList } from './types'
import { RootState } from '../../app/store'

const axios = require('axios');

const REST_API = 'https://api.pro.coinbase.com/products/BTC-USD/book'

export interface OrderBookState {
  bestAsks: OrderList
  bestBids: OrderList
  messageQueue: Array<any>
  sequenceNumber: number
  status: 'idle' | 'loading'
}

const initialState: OrderBookState = {
  bestAsks: [
    {
      orderId: '1',
      price: '1300',
      quantity: '1.00'
    },
    {
      orderId: '2',
      price: '1400',
      quantity: '2.01'
    },
    {
      orderId: '3',
      price: '1500',
      quantity: '1600.2'
    },
    {
      orderId: '4',
      price: '1600',
      quantity: '1'
    }
  ],
  bestBids: [
    {
      orderId: '5',
      price: '1200',
      quantity: '2.01'
    },
    {
      orderId: '6',
      price: '1100',
      quantity: '53.0'
    },
    {
      orderId: '7', 
      price: '1000',
      quantity: '10.10001'
    },
    {
      orderId: '8',
      price: '900',
      quantity: '21'
    }
  ],
  messageQueue: [],
  sequenceNumber: 0,
  status: 'idle',
}

export const fetchSnapshot = createAsyncThunk(
  'orderBook/fetchSnapshot',
  async () => {
    const response = await axios.get(REST_API, { params: { level: 3 } });

    //@ts-ignore
    return response.data
  }
)

export const orderBook = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    handleMessage: (state, action: PayloadAction<any>) => {
      const update = JSON.parse(action.payload)

        const { sequence } = update
        const nextNumber = state.sequenceNumber + 1

        if (sequence === nextNumber) {
          const { type } = update
          switch (type) {
            case 'change': {
              //TODO
              break
            }
            case 'done': {
              //TODO
              break
            }
            case 'match': {
              //TODO
              break
            }
            case 'open': {
              //TODO
              break
            }
            default: {
              break
            }
          }
        }
        else if (sequence > nextNumber) {
          state.messageQueue.push(update)
          // TODO: Begin queue handler
        }

          // const open = {
          //   order_id: "8152ee3b-4223-4099-8c1e-fbad963e2a2c"
          //   price: "32017.95"
          //   product_id: "BTC-USD"
          //   remaining_size: "0.1561"
          //   sequence: 26857404607
          //   side: "buy"
          //   time: "2021-06-26T03:55:00.957000Z"
          //   type: "open"
          // }
          // const done = {
          //   order_id: "44174bd9-7a9d-470d-859e-d5043d8031c9"
          //   price: "32007.38"
          //   product_id: "BTC-USD"
          //   reason: "canceled"
          //   remaining_size: "0.3491249"
          //   sequence: 26857404610
          //   side: "buy"
          //   time: "2021-06-26T03:55:00.957030Z"
          //   type: "done"
          // }
          // const match = {
          //   maker_order_id: "a7e999f1-6194-4bcb-b090-5030290f260d"
          //   price: "32022.82"
          //   product_id: "BTC-USD"
          //   sequence: 26857404370
          //   side: "sell"
          //   size: "0.01071643"
          //   taker_order_id: "3d028221-9c05-417b-b97b-b6061df33749"
          //   time: "2021-06-26T03:55:00.456978Z"
          //   trade_id: 190224646
          //   type: "match"
          // }
          //TODO determine what to do on message
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSnapshot.fulfilled, (state, action) => {
        const { asks, bids, sequence } = action.payload

        state.status = 'idle'
        state.sequenceNumber = sequence

        asks.forEach(a => {
          const [price, quantity, orderId] = a
          for (let i = a.length - 1; i > -1; i--) {
            if (new Decimal(price) < state.bestAsks[i].price) {
              continue
            }
            else if (new Decimal(price) === state.bestAsks[i].price) {
              state.bestAsks[i].quantity += quantity
            }
          }
        })

        //TODO process action.payload and output to state.bestAsks and state.bestBids
      })
      .addCase(fetchSnapshot.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSnapshot.rejected, (state, action) => {
        //TODO what to do if fetch snapshot failed
      })
  },
})

export const { handleMessage } = orderBook.actions

export const selectBestAsks = (state: RootState) => state.orderBook.bestAsks
export const selectBestBids = (state: RootState) => state.orderBook.bestBids

export default orderBook.reducer
