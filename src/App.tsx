import CssBaseline from "@mui/material/CssBaseline";
import { Provider } from "react-redux";
import UsersView from "./modules/users/UsersView";
import { store } from "./store";

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Provider store={store}>
        <UsersView />
      </Provider>
    </div>
  );
}

export default App;
