import ProfileClient from './ProfileClient';
import { seedUsers } from '@/lib/seed/users';

export function generateStaticParams() {
  return [
    { handle: [] },
    ...seedUsers.map((u) => ({ handle: [u.handle] }))
  ];
}

export default function Page() {
  return <ProfileClient />;
}
