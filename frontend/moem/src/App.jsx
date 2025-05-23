import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import MyPage from "./pages/MyPage";
import ClubLayout from "./layouts/ClubLayout";
import ClubMain from "./pages/ClubMain";
import ExploreClub from "./pages/ExploreClub";
import ClubInfo from "./pages/ClubInfo";
import ClubRegister from "./pages/ClubRegister";
import ClubCreate from "./pages/ClubCreate";
import ClubBoard from "./pages/ClubBoard";
import Post from "./pages/Post";
import WritePost from "./pages/WritePost";
import ClubManager from "./pages/ClubManager";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 상단바 */}
        <Header />

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/exploreclub" element={<ExploreClub />} />
          <Route path="/club/register" element={<ClubRegister />} />
          <Route path="/club/:clubId/info" element={<ClubInfo />} />
          <Route path="/club/create" element={<ClubCreate />} />
          <Route path="/club/" element={<ClubLayout />}>
            <Route path=":clubId" element={<ClubMain />} />
            <Route path=":clubId/manage" element={<ClubManager />} />
            <Route path=":clubId/:boardId" element={<ClubBoard />} />
            <Route path=":clubId/:boardId/write" element={<WritePost />} />
            <Route path=":clubId/:boardId/:postId" element={<Post />} />
          </Route>
          {/* 추가 페이지들은 여기에 계속 나열 */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
