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
    RegisterSecurityQuestions: lazy(() => import("./../../pages/user/register/security-questions.jsx")),
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
        <Route path={"/user/challenge/key"} element={<Pages.LoginChallengeKey {...reports}></Pages.LoginChallengeKey>} />
        <Route path={"/user/challenge/app-prompt"} element={<Pages.LoginChallengeAppPrompt {...reports}></Pages.LoginChallengeAppPrompt>} />
        <Route path={"/user/challenge/app-code"} element={<Pages.LoginChallengeAppCode {...reports}></Pages.LoginChallengeAppCode>} />
        <Route path={"/user/challenge/backup"} element={<Pages.LoginChallengeBackup {...reports}></Pages.LoginChallengeBackup>} />
        <Route path={"/user/challenge/auth-app"} element={<Pages.LoginChallengeAuthApp {...reports}></Pages.LoginChallengeAuthApp>} />

        <Route path={"/user/register"} element={<Pages.Register {...reports}></Pages.Register>} />
        <Route path={"/user/register/username"} element={<Pages.RegisterUsername {...reports}></Pages.RegisterUsername>} />
        <Route path={"/user/register/password"} element={<Pages.RegisterPassword {...reports}></Pages.RegisterPassword>} />
        <Route path={"/user/register/personal"} element={<Pages.RegisterPersonalInfo {...reports}></Pages.RegisterPersonalInfo>} />
        <Route path={"/user/register/security-questions"} element={<Pages.RegisterSecurityQuestions {...reports}></Pages.RegisterSecurityQuestions>} />
        <Route path={"/user/register/quick-settings"} element={<Pages.RegisterQuickSettings {...reports}></Pages.RegisterQuickSettings>} />
        <Route path={"/user/register/agreement"} element={<Pages.RegisterAgreement {...reports}></Pages.RegisterAgreement>} />
        <Route path={"/user/register/review"} element={<Pages.RegisterReview {...reports}></Pages.RegisterReview>} />

        {/* Pages that Don't require the user to be signed in or signed out */}
        <Route path={"/help"} element={<Pages.HelpHome {...reports}></Pages.HelpHome>} />
        <Route path={"/help/feed"} element={<Navigate href={"/help"}/>} />
        <Route path={"/help/feed/*"} element={<Pages.HelpHome {...reports}></Pages.HelpHome>} />
        <Route path={"/help/article"} element={<Navigate href={"/help"}/>} />
        <Route path={"/help/article/*"} element={<Pages.HelpArticle {...reports}></Pages.HelpArticle>} />
    </Routes>
    );
}

export default WebRoutes;