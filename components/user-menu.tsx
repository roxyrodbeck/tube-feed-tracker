"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut, Settings, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function UserMenu() {
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0]
  }

  if (!user) {
    return null
  }

  const handleSignOut = () => {
    logout()
    router.push("/auth/signin")
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-full"
      >
        <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
          <img
            src="/favicon.svg"
            alt="User"
            width={20}
            height={20}
            className="w-5 h-5 text-blue-600 dark:text-blue-400"
          />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
          {user.name ? getFirstName(user.name) : user.email}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </Button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <Card className="absolute right-0 top-full mt-2 w-64 z-20 shadow-lg">
            <CardContent className="p-4 space-y-3">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-3">
                <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              </div>

              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="ghost" className="w-full justify-start" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
