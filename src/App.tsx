import liff from '@line/liff'
import type { Liff } from '@line/liff'
import './App.css'
import { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { BookmarkPlus, ScanLine } from 'lucide-react'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

type Profile = Awaited<ReturnType<Liff['getProfile']>>
type Context = ReturnType<Liff['getContext']>

function App() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [context, setContext] = useState<Context | null>(null)
  const [scanResult, setScanResult] = useState<string | null>(null)

  const handleScanCode = async () => {
    const result = await liff.scanCodeV2()
    setScanResult(result.value ?? null)
  }

  const handleAddShortcut = async () => {
    await liff.createShortcutOnHomeScreen({
      url: `https://miniapp.line.me/${import.meta.env.VITE_LIFF_ID}`
    })
  }

  useEffect(() => {
    (async () => {
      await liff.init({
        liffId: import.meta.env.VITE_LIFF_ID,
        withLoginOnExternalBrowser: true
      })
      console.log('LIFF Initialized Successfully')

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

      const ctx = liff.getContext()
      setContext(ctx)
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
        <Button onClick={handleAddShortcut}>
          <BookmarkPlus /> Add Shortcut
        </Button>
        <Button className="ml-2" onClick={handleScanCode}>
          <ScanLine /> Scan Code
        </Button>
        {scanResult && <p className="mt-2 text-sm">Result: {scanResult}</p>}

        {context && (
          <pre className="mt-4 p-3 bg-gray-100 rounded text-xs overflow-auto dark:bg-gray-800">
            {JSON.stringify(context, null, 2)}
          </pre>
        )}
      </div>
    </>
  )
}

export default App
