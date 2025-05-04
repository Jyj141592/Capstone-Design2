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
          <Route path="/club/" element={<ClubLayout/>}>
            <Route path=":clubId" element={<ClubMain/>}/>
          </Route>
          {/* 추가 페이지들은 여기에 계속 나열 */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
