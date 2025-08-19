"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Mail, Calendar, Activity, Shield, Settings } from "lucide-react"
import { useEnhancedAuth } from "@/hooks/use-enhanced-auth"

export function UserProfile() {
  const { user, updateProfile, changePassword, getUserStats } = useEnhancedAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const stats = getUserStats()

  const handleUpdateProfile = async () => {
    setError("")
    setMessage("")

    const result = await updateProfile({ name: name.trim() })
    if (result.success) {
      setMessage("Profile updated successfully!")
      setIsEditing(false)
    } else {
      setError(result.error || "Failed to update profile")
    }
  }

  const handleChangePassword = async () => {
    setError("")
    setMessage("")

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match")
      return
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters")
      return
    }

    const result = await changePassword(currentPassword, newPassword)
    if (result.success) {
      setMessage("Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      setError(result.error || "Failed to change password")
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              {isEditing ? (
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleUpdateProfile} size="sm">
                  Save Changes
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Account Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined: {new Date(stats.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span>Last Login: {new Date(stats.lastLogin).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Total Calculations: {stats.totalCalculations}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Session Expires: {new Date(stats.sessionExpiry).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button
            onClick={handleChangePassword}
            disabled={!currentPassword || !newPassword || !confirmPassword}
            size="sm"
          >
            Change Password
          </Button>
        </CardContent>
      </Card>

      {(message || error) && (
        <Alert variant={error ? "destructive" : "default"}>
          <AlertDescription>{message || error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
