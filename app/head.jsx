"use client";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [profile, setProfile] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetch("https://api.cat4u.store/api/esi/me", {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => setProfile(null));
  }, []);

  return (
    <header className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur">
      <h1 className="text-xl font-bold text-white">🐸🐟😺 커뮤니티</h1>
      {profile?.ok && !imgError ? (
        <img
          src={profile.portrait}
          alt="프로필"
          className="w-10 h-10 rounded-full border-2 border-white"
          onError={() => setImgError(true)}
        />
      ) : (
        <FaUserCircle className="w-10 h-10 text-white" />
      )}
    </header>
  );
}
