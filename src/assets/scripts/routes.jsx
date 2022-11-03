/**
 * 
 * Manage the website's <routes> element
 * 
 **/

import { Routes, Route } from "@solidjs/router";
import { lazy } from "solid-js";

// Import all the website's pages
const Pages = {
    Home: lazy(() => import("./../../pages/home.jsx")),
    New: lazy(() => import("./../../pages/new.jsx")),
    Login: lazy(() => import("./../../pages/user/login.jsx")),
    LoginPassword: lazy(() => import("./../../pages/user/login/password.jsx")),
    LoginChallenge: lazy(() => import("./../../pages/user/challenge.jsx")),
    Register: lazy(() => import("./../../pages/user/register.jsx")),
    RegisterUsername: lazy(() => import("./../../pages/user/register/username.jsx")),
    RegisterPassword: lazy(() => import("./../../pages/user/register/password.jsx")),
    RegisterPersonalInfo: lazy(() => import("./../../pages/user/register/personal.jsx")),
    RegisterSecurityQuestions: lazy(() => import("./../../pages/user/register/security-questions.jsx")),
    RegisterQuickSettings: lazy(() => import("./../../pages/user/register/quick-settings.jsx")),
    RegisterAgreement: lazy(() => import("./../../pages/user/register/agreement.jsx")),
    RegisterReview: lazy(() => import("./../../pages/user/register/review.jsx")),
    DeviceAuthSetup: lazy(() => import("./../../pages/user/device/setup.jsx")),
    DeviceAuth: lazy(() => import("./../../pages/user/device/auth.jsx"))
}, Error = {
    NotFound: lazy(() => import("./../../pages/error/404.jsx"))
};

export function WebRoutes(props){
    let reports = {pageLoaded: props.pageLoad, pageUnloading: props.pageUnload}
    return (
    <Routes>
        {/* The error page */}
        <Route path={"*"} element={<Error.NotFound {...reports}></Error.NotFound>} />

        {/* Pages that require the user to be signed in, and can be used only when signed in */}
        <Route path={"/"} element={<Pages.Home {...reports}></Pages.Home>} />

        <Route path={"/user/device/setup"} element={<Pages.DeviceAuthSetup {...reports}></Pages.DeviceAuthSetup>} />
        <Route path={"/user/device/auth"} element={<Pages.DeviceAuth {...reports}></Pages.DeviceAuth>} />

        {/* Pages that DON'T require the user to be signed in, and the user can't use while signed in */}
        <Route path={"/new"} element={<Pages.New {...reports}></Pages.New>} />

        <Route path={"/user/login"} element={<Pages.Login {...reports}></Pages.Login>} />
        <Route path={"/user/login/password"} element={<Pages.LoginPassword {...reports}></Pages.LoginPassword>} />

        <Route path={"/user/challenge"} element={<Pages.LoginChallenge {...reports}></Pages.LoginChallenge>} />
        <Route path={"/user/register"} element={<Pages.Register {...reports}></Pages.Register>} />
        <Route path={"/user/register/username"} element={<Pages.RegisterUsername {...reports}></Pages.RegisterUsername>} />
        <Route path={"/user/register/password"} element={<Pages.RegisterPassword {...reports}></Pages.RegisterPassword>} />
        <Route path={"/user/register/personal"} element={<Pages.RegisterPersonalInfo {...reports}></Pages.RegisterPersonalInfo>} />
        <Route path={"/user/register/security-questions"} element={<Pages.RegisterSecurityQuestions {...reports}></Pages.RegisterSecurityQuestions>} />
        <Route path={"/user/register/quick-settings"} element={<Pages.RegisterQuickSettings {...reports}></Pages.RegisterQuickSettings>} />
        <Route path={"/user/register/agreement"} element={<Pages.RegisterAgreement {...reports}></Pages.RegisterAgreement>} />
        <Route path={"/user/register/review"} element={<Pages.RegisterReview {...reports}></Pages.RegisterReview>} />
    </Routes>
    );
}

export default WebRoutes;