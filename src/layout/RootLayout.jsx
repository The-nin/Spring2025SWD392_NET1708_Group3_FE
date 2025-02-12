import { Outlet } from "react-router-dom";
import HeaderComponent from "../components/Header/Header";
import FooterComponent from "../components/Footer/Footer";

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterComponent />
    </div>
  );
}

export default RootLayout;
