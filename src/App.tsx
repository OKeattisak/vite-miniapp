import liff from '@line/liff'
import type { Liff } from '@line/liff'
import './App.css'
import { useEffect, useState } from 'react'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { BookmarkPlus } from 'lucide-react'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

type Profile = Awaited<ReturnType<Liff['getProfile']>>

function App() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [os, setOs] = useState<ReturnType<Liff['getOS']>>(undefined)

  const handleAddShortcut = async () => {
    await liff.createShortcutOnHomeScreen({
      url: `https://miniapp.line.me/${import.meta.env.VITE_LIFF_ID}`
    })
  }

  useEffect(() => {
    (async () => {
      await liff.init({ liffId: import.meta.env.VITE_LIFF_ID })
      console.log('LIFF Initialized Successfully')
      setOs(liff.getOS())

      const isLoggedIn = liff.isLoggedIn()
      if (!isLoggedIn) {
        return liff.login()
      }

      const friendship = await liff.getFriendship()
      if (!friendship.friendFlag) {
        await liff.requestFriendship()
      }

      const p = await liff.getProfile()
      setProfile(p)
    })()
  }, [])

  if (!profile) return <p>Loading...</p>

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-white shadow-sm dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{profile.displayName}</p>
        </div>
        <Avatar size="lg">
          <AvatarImage src={profile.pictureUrl} alt={profile.displayName} />
          <AvatarFallback>{profile.displayName}</AvatarFallback>
          <AvatarBadge className="bg-green-600 dark:bg-green-800" />
        </Avatar>
      </nav>

      <div className="pt-16 p-4">
        <Button variant="outline" onClick={handleAddShortcut}>
          <BookmarkPlus /> Add Shortcut
        </Button>
      </div>
    </>
  )
}

export default App
