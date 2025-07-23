"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { logout } from "@/redux/userSlice";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
    router.refresh();
  };

  const navLinks = [
    { label: "Users", href: "/users" },
    { label: "Transactions", href: "/transactions" },
    { label: "Set Credentials", href: "/setCredentials" },
  ];

  return (
    <header className="w-full fixed top-0 bg-background px-6 z-10 border-b">
      <div className="w-full flex items-center justify-between">
        <div>
          <Image
            src="https://website-stuff-logos.s3.ap-south-1.amazonaws.com/1.png"
            alt="scaninfoga"
            width={200}
            height={0}
            objectFit="contain"
            unoptimized
            priority={true}
            loading="eager"
          />
        </div>

        {token && (
          <div className="flex items-center gap-6 py-2 px-10 rounded-full mt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-medium hover:text-emerald-600 transition-colors",
                  pathname === link.href &&
                    "underline underline-offset-4 decoration-emerald-500 text-emerald-500"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div>
          {token && (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
