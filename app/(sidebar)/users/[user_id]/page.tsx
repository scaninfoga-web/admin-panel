import UserProfile from "@/components/pages/user-profile/UserProfile";

interface PageProps {
  params: {
    user_id: number;
  };
}

export default function Page({params}: PageProps) {
    const {user_id} = params
    return (
        <UserProfile user_id={user_id} />
    )
}