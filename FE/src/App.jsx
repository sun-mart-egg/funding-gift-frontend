import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainLayout from "./components/UI/MainLayout.jsx";
import SubLayout from "./components/UI/SubLayout.jsx";

import FriendPage from "./pages/Friends/FriendsPage.jsx";
import CalendarPage from "./pages/Calendar/CalendarPage.jsx";

import Login from "./components/Login/LoginPage.jsx";
import LoginCallback from "./components/Login/LoginCallback.jsx";
import Signup from "./components/Login/Signup.jsx";
import SignupFinish from "./components/Login/SignupFinish.jsx";
import InputProfile from "./components/Login/InputProfile.jsx";
import ParticipatePage from "./components/Funding/pages/ParticipatePage.jsx";

import FriendFunding from "./components/Funding/pages/FriendFunding.jsx";
import MyFunding from "./components/Funding/pages/MyFunding";
import AccountListPage from "./components/Funding/pages/AccountListPage.jsx";
import MakeFundingMain from "./pages/Funding/MakeFundingMain.jsx";
import ProductPage from "./pages/Products/ProductPage.jsx";
import ProductDetail from "./pages/Products/ProductDetailPage.jsx";
import BrandStore from "./components/Products/BrandStore";
import Wishlist from "./components/Products/Wishlist";
import AddressListPage from "./pages/Funding/AddressListPage.jsx";
import FriendFundingDetail from "./components/Funding/pages/FriendFundingDetail.jsx";
import ParticipateFundingFinish from "./components/Funding/pages/ParticipateFundingFinish.jsx";
import Paypage from "./components/Funding/pages/Paypage.jsx";
import MakeFundingDetail from "./pages/Funding/MakeFunding/MakeFundingDetail.jsx";
import MakeFundingFinish from "./pages/Funding/MakeFunding/MakeFundingFinish.jsx";
import Home from "./components/Home/Home.jsx";
import MyFundingDetail from "./components/Funding/pages/MyFundingDetail.jsx";
import FundingMain from "./components/Funding/pages/FundingMain.jsx";
import StoryPage from "./components/Funding/pages/StoryPage.jsx";
import MyPage from "./components/Funding/pages/MyPage.jsx";
import NewAddressPage from "./components/Funding/pages/NewAddressPage.jsx";
import Alarm from "./components/Home/Alarm.jsx";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/my-funding" element={<MyFunding />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/funding" element={<FundingMain />} />
          </Route>

          <Route element={<SubLayout />}>
            <Route path="/login-page" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/input-profile" element={<InputProfile />} />
            <Route path="/signupFin" element={<SignupFinish />} />
            <Route path="/make-funding-main" element={<MakeFundingMain />} />
            <Route
              path="/my-funding-detail/:fundingId"
              element={<MyFundingDetail />}
            />
            <Route
              path="/friend-funding/:consumerId"
              element={<FriendFunding />}
            />

            <Route
              path="/friend-funding-detail/:fundingId"
              element={<FriendFundingDetail />}
            />
            <Route path="/my-page" element={<MyPage />} />
            <Route path="/alarm" element={<Alarm />} />
            <Route
              path="/make-funding-detail"
              element={<MakeFundingDetail />}
            />
            <Route
              path="/make-funding-finish"
              element={<MakeFundingFinish />}
            />
            <Route
              path="/participate-funding-finish"
              element={<ParticipateFundingFinish />}
            />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/address-list" element={<AddressListPage />} />
            <Route path="/account-list" element={<AccountListPage />} />
            <Route path="/new-address" element={<NewAddressPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/friends" element={<FriendPage />} />
            <Route
              path="/participate/:fundingId"
              element={<ParticipatePage />}
            />
            <Route path="/pay" element={<Paypage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/brand/:brandId" element={<BrandStore />} />
          </Route>

          <Route path="/login-callback" element={<LoginCallback />} />
          <Route path="/story/:selectedItem" element={<StoryPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
