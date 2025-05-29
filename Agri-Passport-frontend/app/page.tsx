import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-emerald-600" />
            <h1 className="text-2xl font-bold text-emerald-800">
              Agri-Food Passport
            </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/customer">
              <Button variant="ghost">For Customers</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Register</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 leading-tight">
              Ensuring Food Safety Across the Supply Chain
            </h1>
            <p className="text-lg text-gray-600">
              Our platform connects manufacturers, safety officers, and
              consumers to ensure transparency and safety in food products.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                </Button>
              </Link>
              <Link href="/customer">
                <Button variant="outline">Verify a Product</Button>
              </Link>
            </div>
          </div>
          {/* <div className="flex-1">
            <Image
              src="/profilepage.png?height=400&width=500"
              alt="Food safety illustration"
              width={500}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">
                For Manufacturers
              </CardTitle>
              <CardDescription>
                Register and verify your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Submit your product batches for safety verification and generate
                QR codes for your customers.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/login?role=manufacturer" className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Manufacturer Login
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">
                For Safety Officers
              </CardTitle>
              <CardDescription>
                Verify and approve food products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Review product submissions, perform safety checks, and issue
                verifiable credentials.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/login?role=officer" className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Officer Login
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">For Customers</CardTitle>
              <CardDescription>Verify product authenticity</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Scan QR codes or enter batch numbers to verify the safety
                credentials of food products.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/customer" className="w-full">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Verify a Product
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="bg-emerald-800 text-white py-12 mt-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6" />
                <h2 className="text-xl font-bold">Agri-Food Passport</h2>
              </div>
              <p className="mt-2 text-emerald-100">
                Ensuring food safety and transparency
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/" className="text-emerald-100 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/customer"
                    className="text-emerald-100 hover:text-white"
                  >
                    Verify Product
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-emerald-100 hover:text-white"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-emerald-700 text-center text-emerald-100">
            <p>
              © {new Date().getFullYear()} Agri-Food Passport. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
