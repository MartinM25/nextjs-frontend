"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchProfile } from "@/app/utils/axios";

import { Button } from "@/components/ui/button";

const Page = () => {
  const [profile, setProfile] = useState<{ name: string; role: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const profileData = await fetchProfile(token);
          setProfile(profileData);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.replace("/login");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {profile?.name}</h1>
      {profile?.role === "agent" && <p>Agent-specific content here</p>}
      {profile?.role === "tenant" && <p>Tenant-specific content here</p>}
      {profile?.role === "landlord" && <p>Landlord-specific content here</p>}
      <Button onClick={handleLogout} className="mt-4">
        Logout
      </Button>
    </div>
  )
}

export default Page