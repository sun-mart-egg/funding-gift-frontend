import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainLayout from "./components/UI/MainLayout.jsx";
import SubLayout from "./components/UI/SubLayout.jsx";

import FriendPage from "./pages/Friends/FriendsPage.jsx";
import CalendarPage from "./pages/Calendar/CalendarPage.jsx";

import Login from "./pages/Auth/LoginPage.jsx";
import LoginCallback from "./components/Auth/LoginCallback.jsx";
import SignupPage from "./pages/Auth/SignupPage.jsx";
import SignupFinish from "./components/Auth/SignupFinish.jsx";
import InputProfile from "./components/Auth/InputProfile.jsx";
import ParticipatePage from "./components/Funding/pages/ParticipatePage.jsx";

import FriendFunding from "./components/Funding/pages/FriendFunding.jsx";
import MyFunding from "./pages/Funding/MyFunding.jsx";
import AccountListPage from "./pages/Funding/AccountListPage.jsx";
import MakeFundingMain from "./pages/Funding/MakeFundingStep/MakeFundingMain.jsx";
import ProductPage from "./pages/Products/ProductPage.jsx";
import ProductDetail from "./pages/Products/ProductDetailPage.jsx";
import Wishlist from "./components/Products/Wishlist";
import AddressListPage from "./pages/Funding/AddressListPage.jsx";
import FriendFundingDetail from "./components/Funding/pages/FriendFundingDetail.jsx";
import ParticipateFundingFinish from "./components/Funding/pages/ParticipateFundingFinish.jsx";
import Paypage from "./components/Funding/pages/Paypage.jsx";
import MakeFundingDetail from "./pages/Funding/MakeFundingStep/MakeFundingDetail.jsx";
import MakeFundingFinish from "./pages/Funding/MakeFundingStep/MakeFundingFinish.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import MyFundingDetail from "./components/Funding/pages/MyFundingDetail.jsx";
import StoryMain from "./pages/Story/StoryMain.jsx";
import StoryPage from "./pages/Story/StoryPage.jsx";
import MyPage from "./pages/Funding/MyPage.jsx";
import AddressFormPage from "./pages/Funding/AddressFormPage.jsx";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/my-funding" element={<MyFunding />} />

            <Route path="/product" element={<ProductPage />} />
            <Route path="/funding" element={<StoryMain />} />
          </Route>

          <Route element={<SubLayout />}>
            <Route path="/login-page" element={<Login />} />
            <Route path="/signup" element={<SignupPage />} />
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
            <Route path="/address-form" element={<AddressFormPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/friends" element={<FriendPage />} />
            <Route
              path="/participate/:fundingId"
              element={<ParticipatePage />}
            />
            <Route path="/pay" element={<Paypage />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>

          <Route path="/login-callback" element={<LoginCallback />} />
          <Route path="/story/:selectedItem" element={<StoryPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
