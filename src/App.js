import React, { useEffect } from "react";
import "./App.css";
import Auth from "./components/Auth";
import Layout from "./components/Layout";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./components/Notification";
import { uiActions } from "./store/ui-slice";
let isFirstRender = true;

function App() {
  const dispatch = useDispatch();
  const notification = useSelector(state => state.ui.notification)
  const cart = useSelector(state => state.cart);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender = false;
      return;
    }
    const sendRequest = async () => {
      //send state as Sending request
      dispatch(uiActions.showNotification({
        open: true,
        message: "Sending Request",
        type: 'warning'
      }))

      const response = await fetch('https://redux-http-8bae7-default-rtdb.firebaseio.com/cartItems.json',
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      const data = await response.json();

      // send state as Request is suceesful
      dispatch(uiActions.showNotification({
        open: true,
        message: "Sent Request To Database Successfully",
        type: 'success'
      }))
    }
    sendRequest().catch(err => {
      // send state as Error
      dispatch(uiActions.showNotification({
        open: true,
        message: "Sending Request failed",
        type: 'error'
      }))
    });

  }, [cart]);
  return (
    <div className="App">
      {notification && <Notification type={notification.type} message={notification.message} />}
      {!isLoggedIn && <Auth />}
      {isLoggedIn && <Layout />}
    </div>
  );
}

export default App;
