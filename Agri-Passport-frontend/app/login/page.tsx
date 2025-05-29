    "use client"

    import type React from "react"
    import { useState } from "react"
    import { useRouter, useSearchParams } from "next/navigation"
    import { Button } from "@/components/ui/button"
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
    import { Input } from "@/components/ui/input"
    import { Label } from "@/components/ui/label"
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
    import { useAuth } from "@/context/auth-context"
    import { Leaf } from "lucide-react"
    import Link from "next/link"
    import { Alert, AlertDescription } from "@/components/ui/alert"
    import api from "@/api/axiosInstance"

    export default function LoginPage() {
      const router = useRouter()
      const searchParams = useSearchParams()
      const defaultRole = searchParams.get("role") || "manufacturer"
      const [activeTab, setActiveTab] = useState(defaultRole)
      const [error, setError] = useState<string | null>(null)

      const [formData, setFormData] = useState({
        email: "",
        password: "",
      })

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
      }

      const handleLogin = (e: React.FormEvent, role: string) => {
        setError(null)

        const { email, password } = formData

        if (!email || !password) {
          setError("Email and password are required")
          return
        }

        api.post("auth/login", { email, password, role }).then((response) => {
          const { token } = response.data
          localStorage.setItem("token", token)
          
          router.push(`/${role}`)
        }).catch((error) => {
          if (error.response) {
            setError(error.response.data.message || "Login failed")
          } else {
            setError("Network error. Please try again.")
          }
        })
      }

      return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
          <header className="container mx-auto py-6 px-4">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-emerald-600" />
              <h1 className="text-xl font-bold text-emerald-800">Agri-Food Passport</h1>
            </Link>
          </header>

          <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-emerald-800">Login</CardTitle>
                <CardDescription className="text-center">
                  Access your dashboard to manage food safety credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4 bg-red-50 text-red-800 border-red-200">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="manufacturer">Manufacturer</TabsTrigger>
                    <TabsTrigger value="officer">Safety Officer</TabsTrigger>
                    <TabsTrigger value="customer">Customer</TabsTrigger>
                  </TabsList>

                  {["manufacturer", "officer", "customer"].map((role) => (
                    <TabsContent value={role} key={role}>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        handleLogin(e, role)
                      }} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`${role}-email`}>Email</Label>
                          <Input
                            id={`${role}-email`}
                            name="email"
                            type="email"
                            placeholder={`${role}@example.com`}
                            value={formData.email}
                            onChange={handleChange}
                          />  
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${role}-password`}>Password</Label>
                          <Input
                            id={`${role}-password`}
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                          />
                        </div>
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                          Login as {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Button>
                      </form>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <p className="text-sm text-center text-gray-500">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-emerald-600 hover:underline">
                    Create an account
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </main>
        </div>
      )
    }
