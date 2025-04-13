import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./layouts/SidebarLayout";
import ClubExplore from "./pages/ClubExplore";
import Chat from "./pages/Chat";
import MyClubs from "./pages/MyClubs";
import ExchangeClubs from "./pages/ExchangeClubs";
import Account from "./pages/Account";
import ClubDetail from "./pages/ClubDetail";
import PostForm from "./pages/PostForm";
import PostDetail from "./pages/PostDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SidebarLayout />}>
          <Route path="explore" element={<ClubExplore />} />
          <Route path="chat" element={<Chat />} />
          <Route path="myclubs" element={<MyClubs />} />
          <Route path="exchange" element={<ExchangeClubs />} />
          <Route path="account" element={<Account />} />
          <Route path="club/:id" element={<ClubDetail />} />
          <Route path="post/write" element={<PostForm />} />
          <Route path="post/:id" element={<PostDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
