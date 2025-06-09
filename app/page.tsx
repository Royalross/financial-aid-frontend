'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter(); // Call the hook at the top

  const handleClick = () => {
    router.push('/auth/login'); // Use the router to navigate
  };

  return (
    <div>
      <div>Welcome to the home page</div>
      <Button onClick={handleClick}>Try me</Button>
    </div>
  );
}
