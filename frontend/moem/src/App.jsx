import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./layouts/SidebarLayout";
import ClubExplore from "./pages/ClubExplore";
import Chat from "./pages/Chat";
import MyClubs from "./pages/MyClubs";
import ExchangeClubs from "./pages/ExchangeClubs";
import AppliedClubs from "./pages/AppliedClubs";
import Account from "./pages/Account";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route path="explore" element={<ClubExplore />} />
          <Route path="chat" element={<Chat />} />
          <Route path="myclubs" element={<MyClubs />} />
          <Route path="exchange" element={<ExchangeClubs />} />
          <Route path="applied" element={<AppliedClubs />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
