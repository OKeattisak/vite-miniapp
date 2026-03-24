import liff from '@line/liff'
import type { Liff } from '@line/liff'
import './App.css'
import { useEffect, useState } from 'react'

type Profile = Awaited<ReturnType<Liff['getProfile']>>

function App() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    (async () => {
      await liff.init({ liffId: "2009124877-ajjI2b1l" })
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
    })()
  }, [])

  if (!profile) return <p>Loading...</p>

  return (
    <>
      <p>{profile.displayName}</p>
    </>
  )
}

export default App
