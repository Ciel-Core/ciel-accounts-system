/**
 * 
 * Manage the website's <routes> element
 * 
 **/

import { Routes, Route, Navigate } from "@solidjs/router";
import { lazy } from "solid-js";

// Import all the website's pages
const Pages = {
    Home: lazy(() => import("./../../pages/home.jsx")),
    AccountCustomization: lazy(() => import("./../../pages/user/customization.jsx")),

    New: lazy(() => import("./../../pages/new.jsx")),

    Login: lazy(() => import("./../../pages/user/login.jsx")),
    LoginPassword: lazy(() => import("./../../pages/user/login/password.jsx")),
    DeviceAuth: lazy(() => import("./../../pages/user/device/auth.jsx")),
    LoginChallenge: lazy(() => import("./../../pages/user/challenge.jsx")),
    LoginChallengeKey: lazy(() => import("./../../pages/user/challenge/key.jsx")),
    LoginChallengeAppPrompt: lazy(() => import("./../../pages/user/challenge/app-prompt.jsx")),
    LoginChallengeAppCode: lazy(() => import("./../../pages/user/challenge/app-code.jsx")),
    LoginChallengeBackup: lazy(() => import("./../../pages/user/challenge/backup.jsx")),
    LoginChallengeAuthApp: lazy(() => import("./../../pages/user/challenge/auth-app.jsx")),

    Register: lazy(() => import("./../../pages/user/register.jsx")),
    RegisterUsername: lazy(() => import("./../../pages/user/register/username.jsx")),
    RegisterPassword: lazy(() => import("./../../pages/user/register/password.jsx")),
    RegisterPersonalInfo: lazy(() => import("./../../pages/user/register/personal.jsx")),
    RegisterSecurityQuestions:
                        lazy(() => import("./../../pages/user/register/security-questions.jsx")),
    RegisterQuickSettings: lazy(() => import("./../../pages/user/register/quick-settings.jsx")),
    RegisterAgreement: lazy(() => import("./../../pages/user/register/agreement.jsx")),
    RegisterReview: lazy(() => import("./../../pages/user/register/review.jsx")),
    DeviceAuthSetup: lazy(() => import("./../../pages/user/device/setup.jsx")),

    HelpHome: lazy(() => import("./../../pages/help/home.jsx")),
    HelpArticle: lazy(() => import("./../../pages/help/article.jsx"))
}, Error = {
    NotFound: lazy(() => import("./../../pages/error/404.jsx"))
};

export function WebRoutes(props){
    let reports = {
        pageLoaded: props.pageLoad,
        pageUnloading: props.pageUnload,
        
        userData: props.userData,
        
        viewMode: props.viewMode
    };
    return (
    <Routes>
        {/* The error page */}
        <Route path={"*"} element={<Error.NotFound {...reports} />} />

        {/* Pages that require the user to be signed in, and can be used only when signed in */}
        <Route path={["/", "/home/*"]} element={<Pages.Home {...reports} />} />
        <Route path={"/home"} element={<Navigate href={"/"}/>} />
        <Route path={"/user/customization"} element={<Pages.AccountCustomization {...reports} />} />

        <Route path={"/user/device/setup"} element={<Pages.DeviceAuthSetup {...reports} />} />
        <Route path={"/user/device/auth"} element={<Pages.DeviceAuth {...reports} />} />

        {/* Pages that DON'T require the user to be signed in, and the user can't use
            while signed in */}
        <Route path={"/new"} element={<Pages.New {...reports} />} />

        <Route path={"/user/login"} element={<Pages.Login {...reports} />} />
        <Route path={"/user/login/password"} element={<Pages.LoginPassword {...reports} />} />
        <Route path={"/user/challenge"} element={<Pages.LoginChallenge {...reports} />} />
        <Route path={"/user/challenge/key"} element={<Pages.LoginChallengeKey {...reports} />} />
        <Route path={"/user/challenge/app-prompt"}
                element={<Pages.LoginChallengeAppPrompt {...reports} />} />
        <Route path={"/user/challenge/app-code"}
                element={<Pages.LoginChallengeAppCode {...reports} />} />
        <Route path={"/user/challenge/backup"}
                element={<Pages.LoginChallengeBackup {...reports} />} />
        <Route path={"/user/challenge/auth-app"}
                element={<Pages.LoginChallengeAuthApp {...reports} />} />

        <Route path={"/user/register"} element={<Pages.Register {...reports} />} />
        <Route path={"/user/register/username"} element={<Pages.RegisterUsername {...reports} />} />
        <Route path={"/user/register/password"} element={<Pages.RegisterPassword {...reports} />} />
        <Route path={"/user/register/personal"}
                element={<Pages.RegisterPersonalInfo {...reports} />} />
        <Route path={"/user/register/security-questions"}
                element={<Pages.RegisterSecurityQuestions {...reports} />} />
        <Route path={"/user/register/quick-settings"}
                element={<Pages.RegisterQuickSettings {...reports} />} />
        <Route path={"/user/register/agreement"}
                element={<Pages.RegisterAgreement {...reports} />} />
        <Route path={"/user/register/review"} element={<Pages.RegisterReview {...reports} />} />

        {/* Pages that Don't require the user to be signed in or signed out */}
        <Route path={"/help"} element={<Pages.HelpHome {...reports} />} />
        <Route path={"/help/feed"} element={<Navigate href={"/help"}/>} />
        <Route path={"/help/feed/*"} element={<Pages.HelpHome {...reports} />} />
        <Route path={"/help/article"} element={<Navigate href={"/help"}/>} />
        <Route path={"/help/article/*"} element={<Pages.HelpArticle {...reports} />} />
    </Routes>
    );
}

export default WebRoutes;