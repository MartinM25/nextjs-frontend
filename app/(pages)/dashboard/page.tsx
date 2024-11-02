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

  const handleNavigateToProfile = () => {
    const profileString = JSON.stringify(profile);
    const encodedProfile = encodeURIComponent(profileString); // Encode the JSON string for safe URL usage
    router.push(`/profile?profile=${encodedProfile}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen lg:mx-16">

      <nav className="flex justify-between items-center p-4">
        <div className="text-lg font-semibold">
          Welcome, {profile?.name}
        </div>
        <div className="flex space-x-4">
          <Button variant="link" className="">Chat</Button>
          <Button variant="link" onClick={handleNavigateToProfile}>Profile</Button>
          <Button onClick={handleLogout} className="">Logout</Button>
        </div>
      </nav>

      <div className="flex-grow p-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        {profile?.role === "agent" && <p>Agent-specific content here</p>}
        {profile?.role === "tenant" && <p>Tenant-specific content here</p>}
        {profile?.role === "landlord" && <p>Landlord-specific content here</p>}
      </div>
    </div>
  )
}

export default Page