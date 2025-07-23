"use client"

import {
  Bookmark,
  Clock,
  FileText,
  LayoutDashboard,
  Telescope,
  Monitor,
  Search,
} from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const sidebarLinks = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'Digital Intelligence',
    icon: Search,
    href: '/digitalIntelligence',
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'Scaninfoga Intelligence',
    icon: Telescope,
    href: '/scaninfogaIntelligence',
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'Bookmarks',
    icon: Bookmark,
    href: '/dashboard/bookmarks',
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'History',
    icon: Clock,
    href: '/dashboard/history',
    roles: ['USER', 'ADMIN'],
  },
  { title: 'Reports', icon: FileText, href: '/reports', roles: ['ADMIN'] },
  { title: 'Monitor', icon: Monitor, href: '/monitor', roles: ['ADMIN'] },
];

const Sidebar : React.FC = () => {
    const pathname = usePathname();
    return (
        <aside className='fixed w-72 left-0 inset-0 bg-black'>
            <div className="flex justify-center items-center border-b border-gray-500">
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

        </aside>
    )
}

export default Sidebar;
