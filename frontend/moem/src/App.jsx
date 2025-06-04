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
import ActivityPost from "./pages/ActivityPost"
import ClubCalendar from "./pages/ClubCalendar";
import ClubActivityDetail from "./pages/ClubActivityDetail";
import ClubActivityWrite from "./pages/ClubActivityWrite";
import ClubMyPage from "./pages/ClubMyPage";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* 상단바 */}
        {/* <Header /> */}

        <Routes>
          <Route path="/" element={<Header/>}>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mypage" element={<PrivateRoute> <MyPage /> </PrivateRoute>} />
            <Route path="/exploreclub" element={<ExploreClub />} />
            <Route path="/club/register" element={<PrivateRoute> <ClubRegister /> </PrivateRoute>} />
            <Route path="/club/:clubId/info" element={<ClubInfo />} />
            <Route path="/club/:clubId/activity/:postId" element={<ActivityPost/>}/>
            <Route path="/club/create" element={<PrivateRoute> <ClubCreate /> </PrivateRoute>} />
            <Route path="/club/" element={<PrivateRoute> <ClubLayout /> </PrivateRoute>}>
              <Route path=":clubId" element={<ClubMain />} />
              <Route path=":clubId/manage" element={<ClubManager />} />
              <Route path=":clubId/:boardId" element={<ClubBoard />} />
              <Route path=":clubId/calendar" element={<ClubCalendar />} />
              <Route path=":clubId/act/:actId" element={<ClubActivityDetail />} />
              <Route
                path=":clubId/act/:actId/write"
                element={<ClubActivityWrite />}
              />
              <Route path=":clubId/mypage" element={<ClubMyPage />} />
              <Route path=":clubId/:boardId/write" element={<WritePost />} />
              <Route path=":clubId/:boardId/:postId" element={<Post />} />
            </Route>
          </Route>
          {/* 추가 페이지들은 여기에 계속 나열 */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
