'use client'

import Image from "next/image"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { logout } from "@/redux/userSlice"
import { useRouter } from 'next/navigation';

const Navbar : React.FC<{}> = () => {
  const token = useSelector((state: RootState) => state.user.token)
  const dispatch = useDispatch()
  const router = useRouter()
  const handleLogout = () => {
    dispatch(logout())
    router.refresh()
  }
  return (
    <header className="w-full fixed top-0 bg-background px-6 z-10">
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
        <div>
          {
            token && <Button onClick={handleLogout}> Logout </Button>
          }
        </div>
      </div>
    </header>
  )
}

export default Navbar;
