"use client"
import BookmarkInformation from "@/components/custom/bookmark-information"
import CustomTabs from "@/components/custom/custom-tab"
import Title from "@/components/custom/custom-title"
import { DeviceInformation } from "@/components/custom/device-information"
import { LocationInformation } from "@/components/custom/location-information"
import LoginHistoryInformation from "@/components/custom/login-history-information"
import { Notes } from "@/components/custom/notes"
import { ProfileInformationCard } from "@/components/custom/profile-information"
import UserActivity from "@/components/custom/user-activity"
import WalletHistory from "@/components/custom/wallet-history"
import { WalletInformation } from "@/components/custom/wallet-information"
import { get } from "@/lib/api"
import type { DeviceInformationProps, LocationInformationProps, ProfileInformationCardProps, WalletInformationProps } from "@/lib/types"
import { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const UserProfile: React.FC<{user_id: number}> = ({user_id}) => {
  const [userInfoLoading, setUserInfoLoading] = useState(false)
  const [profileInfo, setProfileInfo] = useState<ProfileInformationCardProps>()
  const [walletInfo, setWalletInfo] = useState<WalletInformationProps>()
  const [locationInfo, setLocationInfo] = useState<LocationInformationProps>()
  const [deviceInfo, setDeviceInfo] = useState<DeviceInformationProps>()

  const tabs = [
    {
      value: 'bookmarks',
      label: 'Bookmarks',
      component: <BookmarkInformation user_id={user_id} />,
    },
    {
      value: 'loginHistory',
      label: 'Login History',
      component: <LoginHistoryInformation user_id={user_id} />,
    },
    {
      value: 'walletHistory',
      label: 'Wallet History',
      component: <WalletHistory user_id={user_id} />,
    },
    {
      value: 'userActivity',
      label: 'User Activity',
      component: <UserActivity user_id={user_id} />,
    },
  ];

  const populateData = async () => {
    setUserInfoLoading(true)
    try{
        const data = await get(`/api/admin/get-user-info?user_id=${user_id}`);
        const data1 = await get(`/api/admin/get-user-wallet-balance?user_id=${user_id}`);
        setProfileInfo(data.responseData);
        setWalletInfo(data1.responseData);
        setLocationInfo(data.responseData.sessionData);
        setDeviceInfo(data.responseData.sessionData);
    }
    catch(error){
        if(error instanceof AxiosError){
            toast.error(error.message);
        }
        console.log(error);
    }
    finally{
        setUserInfoLoading(false)
    }
}

  useEffect(() => {
    populateData()
  }, [])
    return (
        <>
        <Title title="User Profile" backButton path="/users" />
        <div className="grid grid-cols-3 gap-2 md:gap-4">
        <ProfileInformationCard data = {profileInfo} loading = {userInfoLoading} />
        <WalletInformation user_id={user_id} />
        <Notes user_id={user_id}/>
        <LocationInformation  data = {locationInfo} loading = {userInfoLoading} />
        <DeviceInformation data = {deviceInfo} loading = {userInfoLoading} />
        </div>
         <CustomTabs tabs={tabs} />
        </>
    )
}

export default UserProfile