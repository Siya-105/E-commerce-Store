import { useState } from "react";
import { Home, ShoppingCart, CreditCard, BarChart2, Settings, HelpCircle, Menu, X } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: Home },
    { name: "Orders", icon: ShoppingCart },
    { name: "Payments", icon: CreditCard },
    { name: "Analytics", icon: BarChart2 },
    { name: "Settings", icon: Settings },
    { name: "Support", icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 shadow">
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
        <span className="font-bold">MyApp</span>
      </div>

      {/* Sidebar (Desktop) */}
      <div className="hidden md:flex h-screen w-64 bg-white shadow-lg flex-col">
        <div className="p-6 text-xl font-bold border-b">MyApp</div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="flex items-center w-full gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition"
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <button className="w-full bg-black text-white py-2 rounded-xl text-sm">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-64 bg-white h-full shadow-lg flex flex-col">
            <div className="p-6 flex justify-between items-center border-b">
              <span className="text-xl font-bold">MyApp</span>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className="flex items-center w-full gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition"
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t">
              <button className="w-full bg-black text-white py-2 rounded-xl text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
