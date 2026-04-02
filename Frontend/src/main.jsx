import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './apps/index.css'
import App from './apps/App.jsx'
import { store } from './apps/app.store.js'
import { Provider } from "react-redux"
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <App />
  </Provider>
  //     <StrictMode>
  // </StrictMode>,
)
