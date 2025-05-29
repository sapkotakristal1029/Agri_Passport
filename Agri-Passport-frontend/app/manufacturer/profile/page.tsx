"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode } from "lucide-react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/layout/dashboard-layout";
import QRCode from "react-qr-code";
import api from "@/api/axiosInstance";
import { json } from "stream/consumers";

interface IUser {
  username: string;
  email: string;
  role: string;
  createdAt: string;
  connection_id: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState("");

  const [user, setUser] = useState<IUser>({
    username: "",
    email: "",
    role: "",
    createdAt: "",
    connection_id: null,
  });

  const handleConnectWallet = () => {
    if (!walletConnected) {
      api
        .post(`/connection/create-invitation`, {
          alias: user?.email,
          auto_accept: true,
          public: true,
          multi_use: false,
        })
        .then((response) => {
          const connectionId = response.data.connection_id;
          setUser((prevUser) => ({
            ...prevUser,
            connection_id: connectionId,
          }));
          setQrValue(JSON.stringify(response.data.invitation_url));
          setShowQR(true);
        });
      setShowQR(true);
    }
  };

  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    api
      .get("/auth/profile")
      .then((response) => {
        const userData = response.data;
        console.log("User data:", userData);
        setUser({
          username: userData.username,
          email: userData.email,
          role: userData.role,
          createdAt: new Date(userData.createdAt).toLocaleDateString(),
          connection_id: userData.connection_id,
        });
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  }, []);

  useEffect(() => {
    if (user.connection_id) {
      api
        .get(`/connection/${user.connection_id}`)
        .then((response) => {
          const connectionData = response.data;
          if (connectionData.state !== "active") {
            api
              .get(`/connection/${user.connection_id}/invitation`)
              .then((response) => {
                const qrData = response.data;
                setQrValue(JSON.stringify(qrData.invitation_url));
                setShowQR(true);
              });
          } else {
            setShowQR(false);
            setWalletConnected(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching connection data:", error);
        });
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              👤 Profile
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Your account details and wallet status
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="space-y-5 text-sm text-gray-800 pt-6">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Username</p>
              <p className="font-medium">{user?.username}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Role</p>
              <p className="font-medium">{user?.role}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Joined</p>
              <p className="font-medium">{user?.createdAt}</p>
            </div>

            <Separator />

            <div className="space-y-4">
              <p className="text-sm font-medium">Wallet Status</p>

              {walletConnected ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <QrCode className="w-4 h-4" />
                  Wallet Connected
                </div>
              ) : (
                <>
                  {!user.connection_id && (
                    <Button
                      onClick={handleConnectWallet}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Connect Wallet
                    </Button>
                  )}
                  {showQR && (
                    <div className="mt-4 border p-4 rounded-md bg-gray-50 flex justify-center">
                      <QRCode
                        size={256}
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                        value={qrValue}
                        viewBox={`0 0 256 256`}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* <div className="pt-6">
            <Button variant="outline" onClick={() => router.push("/edit-profile")}>
              Edit Profile
            </Button>
          </div> */}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
