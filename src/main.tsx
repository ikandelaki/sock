import { createRoot } from "react-dom/client";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./components/App/App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import MyAccount from "./routes/MyAccount/MyAccount.component";
import Login from "Routes/Login/Login.component.tsx";
import SignUp from "Routes/Signup/Signup.component.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/account/login",
    Component: Login,
  },
  {
    path: "/account/signup",
    Component: SignUp,
  },
  {
    path: "/myaccount",
    Component: MyAccount,
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>,
);
