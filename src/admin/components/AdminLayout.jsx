import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Home,
  Users as UsersIcon,
  CreditCard,
  BarChart,
  ShieldCheck,
  HelpCircle,
  Book,
  LogOut,
  Group,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();

  const [isLegalOpen, setIsLegalOpen] = useState(false); // Tracks legal submenu
  const [isInstructionOpen, setIsInstructionOpen] = useState(false); // Tracks instruction submenu

  const menuItems = [
    {
      icon: <Home className="w-5 h-5" />,
      text: "Auctions",
      path: "/admin/auctions",
      active: location.pathname.includes("/admin/auctions"),
    },
    {
      icon: <UsersIcon className="w-5 h-5" />,
      text: "Users",
      path: "/admin/users",
      active: location.pathname.includes("/admin/users"),
    },
    {
      icon: <UsersIcon className="w-5 h-5" />,
      text: "Wallet Requests",
      path: "/admin/wallet-requests",
      active: location.pathname.includes("/admin/wallet-requests"),
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      text: "Transactions",
      path: "/admin/transactions",
      active: location.pathname.includes("/admin/transactions"),
    },
    {
      icon: <BarChart className="w-5 h-5" />,
      text: "Analytics",
      path: "/admin/analytics",
      active: location.pathname.includes("/admin/analytics"),
    },
    {
      icon: <Group className="w-5 h-5" />,
      text: "Players Registration",
      path: "/admin/players",
      active: location.pathname.includes("/admin/players"),
    },
  ];

  const legalItems = [
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      text: "Privacy Policy",
      path: "/admin/privacy",
      active: location.pathname.includes("/admin/privacy"),
    },
    {
      icon: <Book className="w-5 h-5" />,
      text: "Terms & Condition",
      path: "/admin/terms",
      active: location.pathname.includes("/admin/terms"),
    },
  ];

  const instructionTerms = [
    {
      icon: <HelpCircle className="w-5 h-5" />,
      text: "How to Play",
      path: "/admin/how-to-play",
      active: location.pathname.includes("/admin/how-to-play"),
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      text: "How to Pay",
      path: "/admin/how-to-pay",
      active: location.pathname.includes("/admin/how-to-pay"),
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      text: "How to Withdraw",
      path: "/admin/how-to-withdraw",
      active: location.pathname.includes("/admin/how-to-withdraw"),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <div className="h-screen md:min-w-[20%] lg:min-w-[16%] bg-gray-200 text-black flex flex-col p-6 space-y-8 shadow-lg">
        <div className="flex flex-col justify-start h-full">
          <nav className="space-y-2">
            <h3 className="text-xs text-black uppercase tracking-wider">
              Main Menu
            </h3>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 p-2 lg:p-3 rounded-lg transition-all duration-200 ${
                  item.active
                    ? "bg-blue-600 text-white"
                    : "text-black hover:bg-gray-500 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.text}</span>
              </Link>
            ))}
          </nav>

          <nav className="mt-4">
            <h3
              className="flex items-center justify-between text-xs text-black uppercase tracking-wider cursor-pointer"
              onClick={() => setIsLegalOpen(!isLegalOpen)}
            >
              Legal Pages
              {isLegalOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </h3>
            {isLegalOpen && (
              <div className="space-y-2 mt-2">
                {legalItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      item.active
                        ? "bg-blue-600 text-white"
                        : "text-black hover:bg-gray-500 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.text}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>

          <nav className="mt-4">
            <h3
              className="flex items-center justify-between text-xs text-black uppercase tracking-wider cursor-pointer"
              onClick={() => setIsInstructionOpen(!isInstructionOpen)}
            >
              Instruction Pages
              {isInstructionOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </h3>
            {isInstructionOpen && (
              <div className="space-y-2 mt-2">
                {instructionTerms.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      item.active
                        ? "bg-blue-600 text-white"
                        : "text-black hover:bg-gray-500 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.text}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </div>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-all duration-200"
          >
            <span className="text-sm">Logout</span>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="h-screen overflow-hidden flex-grow bg-white shadow-inner">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
