import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import SidebarLayout from "./layouts/SidebarLayout";
import ClubExplore from "./pages/ClubExplore";
import Chat from "./pages/Chat";
import MyClubs from "./pages/MyClubs";
import ExchangeClubs from "./pages/ExchangeClubs";
import Account from "./pages/Account";
import ClubDetail from "./pages/ClubDetail";
import PostForm from "./pages/PostForm";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SidebarLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
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
    </AuthProvider>
  );
}

export default App;
