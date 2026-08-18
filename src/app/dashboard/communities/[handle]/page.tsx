import CommunityClient from './CommunityClient';
import { seedCommunities } from '@/lib/seed/communities';

export function generateStaticParams() {
  return seedCommunities.map((c) => ({
    handle: c.handle,
  }));
}

export default function Page() {
  return <CommunityClient />;
}
