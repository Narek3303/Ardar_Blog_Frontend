import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from "./context/WishlistContext";
import { CurrencyProvider } from './context/CurrencyContext';
import { QueryClient, QueryClientProvider } from 'react-query'; // Ավելացրեք այսը
import UserRegistrationForm from './components/UserRegistrationForm';
import LoginFormComponent from './components/LoginForm';
import EmailConfirmationPage from './components/EmailConfirmationPage';
import ProductListPage from './pages/ProductListPage';
import PasswordResetRequest from './components/PasswordReset';
import PasswordResetVerify from './components/PasswordResetVerify';
import PasswordResetVerified from './components/PasswordResetVerified';
import ProductDetailPage from './pages/ProductDetailPage';
import ReviewFormPage from "./pages/ReviewFormPage";
import WishlistPage from "./pages/WishlistPage";
import SignupVerify from './components/SignupVerify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import CustomSettingsPanel from './components/SettingsPanel';
import Header from './components/Header';
import Logout from './components/LogoutComponent';
import { Toaster } from 'react-hot-toast';
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import OrderStatusUpdatePage from './pages/OrderStatusUpdatePage';
import UserProfile from './pages/UserProfilepage';
import EmailChangeVerify from './components/EmailChangeVerify';
import EmailChangeRequest from './components/EmailChangeRequest';
import PasswordChange from './components/PasswordChange';
import Footer from './components/FooterComponent';
import './index.css';
import { LikedProductsProvider } from './context/LikedProductsContext';




const queryClient = new QueryClient(); // Ստեղծեք QueryClient օբյեկտ

function App() {
    const location = useLocation();
    // Օրինակ՝ թաքցնելու ցանկվող հայտարարագրվող routes
    const hideHeaderOn = ['/login', '/register', '/password/reset', '/password/reset/verify', '/password/reset/verified'];
    const hideFooterOn = ['/login', '/register', '/password/reset', '/password/reset/verify', '/password/reset/verified'];

    const shouldHideHeader = hideHeaderOn.includes(location.pathname);
    const shouldHideFooter = hideFooterOn.includes(location.pathname);



    return (
        <AuthProvider>
            <CurrencyProvider>
                <LikedProductsProvider>

                    <CartProvider>
                        <QueryClientProvider client={queryClient}> {/* Ավելացրեք QueryClientProvider */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                                {!shouldHideHeader && (
                                    <header>
                                        <Header />
                                    </header>
                                )}

                                <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
                                    {/* ✅ Toaster և ToastContainer դրվում են Routes-ից ԱՐՏԱՔԻՆ */}
                                    <Toaster position="top-center" reverseOrder={false} />


                                    <Routes>
                                        <Route path="/" element={<ProductListPage />} />
                                        <Route path="/register" element={<UserRegistrationForm />} />
                                        <Route path="/login" element={<LoginFormComponent />} />
                                        <Route path="/confirm-email/:uid/:token" element={<EmailConfirmationPage />} />
                                        <Route path="/password/reset" element={<PasswordResetRequest />} />
                                        <Route path="/password/reset/verify" element={<PasswordResetVerify />} />
                                        <Route path="/password/reset/verified" element={<PasswordResetVerified />} />
                                        <Route path="/product/:slug/:product_id" element={<ProductDetailPage />} />
                                        <Route path="/products/:productId/review/" element={<ReviewFormPage />} />
                                        <Route path="/signup/verify" element={<SignupVerify />} />

                                        <Route
                                            path="/change-email"
                                            element={
                                                <PrivateRoute>
                                                    <EmailChangeRequest />
                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="/change-password"
                                            element={
                                                <PrivateRoute>
                                                    <PasswordChange />
                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="/verify-email-change"
                                            element={
                                                <PrivateRoute>
                                                    <EmailChangeVerify />
                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="/wishlist"
                                            element={
                                                <PrivateRoute>
                                                    <WishlistProvider>
                                                    <WishlistPage />
                                                    </WishlistProvider>

                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="/cart"
                                            element={
                                                <PrivateRoute>
                                                    <CartPage />
                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="/orders"
                                            element={
                                                <PrivateRoute>
                                                    <OrderListPage />
                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="/order-detail/:id"
                                            element={
                                                <PrivateRoute>
                                                    <OrderDetailPage />
                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="/profile/"
                                            element={
                                                <PrivateRoute>
                                                    <UserProfile />
                                                </PrivateRoute>
                                            }
                                        />
                                        <Route
                                            path="/settings/"
                                            element={
                                                <PrivateRoute>
                                                    <CustomSettingsPanel />
                                                </PrivateRoute>
                                            }
                                        />
                                        {/*<Route*/}
                                        {/*    path="/order-status/:id/"*/}
                                        {/*    element={*/}
                                        {/*        <PrivateRoute>*/}
                                        {/*            <OrderStatusUpdatePage />*/}
                                        {/*        </PrivateRoute>*/}
                                        {/*    }*/}
                                        {/*/>*/}



                                    </Routes>
                                </Box>
                                {!shouldHideFooter && (
                                    <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'grey.100' }}>
                                        <Footer />
                                    </Box>
                                )}

                            </Box>
                        </QueryClientProvider> {/* Փակեք QueryClientProvider */}
                    </CartProvider>
                </LikedProductsProvider>
            </CurrencyProvider>
        </AuthProvider>
    );
}

export default App;
