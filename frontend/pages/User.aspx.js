import { useEffect } from "react";
import { useRouter } from "next/router";

const UserPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    const userId = router.query['ID'];
    if (userId) {
      router.push(`/users/${userId}/profile`);
    }
  }, [router.query]);

  return null;
};

export default UserPage;
