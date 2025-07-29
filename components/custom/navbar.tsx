"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@/redux/store";
import { logout } from "@/redux/userSlice";
import { cn, getClientInfoUtil } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { getApiList } from "@/redux/apiListSlice";
import { setInfo } from "@/redux/infoSlice";

const Navbar: React.FC = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const validEnvs = ["DEVELOPMENT", "PRODUCTION"];

  const [env, setEnv] = useState<string>("DEVELOPMENT");
 useEffect(() => {
    const fetchInfo = async () => {
      try {
        const info = await getClientInfoUtil();
        console.log("INFO: ", info);
        dispatch(setInfo(info));
      } catch (e) {
        console.error('Failed to fetch client info', e);
      }
    };
    fetchInfo();
  }, [dispatch]);

  useEffect(() => {
    const saved = localStorage.getItem("environment");
    const envValue =
      typeof saved === "string" && validEnvs.includes(saved)
        ? saved
        : "DEVELOPMENT";

    setEnv(envValue);

    if (saved !== envValue) {
      localStorage.setItem("environment", envValue);
  }
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(getApiList());
    }
  }, [token]);

  const handleChange = (value: string) => {
    setEnv(value);
    localStorage.setItem("environment", value);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.refresh();
  };

  const navLinks = [
    { label: "Users", href: "/users" },
    { label: "Transactions", href: "/transactions" },
    { label: "Set Credentials", href: "/setCredentials" },
    { label: "User Activites", href: "/user-activities" },
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
          {!token && (
            <Select value={env} onValueChange={handleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select environment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DEVELOPMENT">DEVELOPMENT</SelectItem>
                <SelectItem value="PRODUCTION">PRODUCTION</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
