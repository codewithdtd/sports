import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import bookingReducer from './bookingSlice'
import facilityReducer from './facilitySlice'

export default configureStore({
  reducer: {
    user: userReducer,
    booking: bookingReducer,
    facility: facilityReducer,
  }
})