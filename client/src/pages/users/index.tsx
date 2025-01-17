
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserData {
  email: string;
  name: string;
  compliance?: {
    govID: string;
    selfie: string;
    sourceOfFunds: string;
    taxID: string;
  };
  financialInfo?: {
    accountNumber: string;
    preferredCurrency: string;
    routingNumber: string;
  };
  personalInfo?: {
    address: string;
    dateOfBirth: string;
    email: string;
    fullName: string;
    phone: string;
  };
  preferences?: {
    accountType: string;
    language: string;
    theme: string;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(database, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          setUsers(snapshot.val());
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <ScrollArea className="h-[800px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(users).map(([userId, userData]) => (
            <Card key={userId}>
              <CardHeader>
                <CardTitle>{userData.personalInfo?.fullName || userData.name || 'Unnamed User'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Email:</strong> {userData.personalInfo?.email || userData.email}</p>
                  {userData.personalInfo?.phone && (
                    <p><strong>Phone:</strong> {userData.personalInfo.phone}</p>
                  )}
                  {userData.preferences?.accountType && (
                    <p><strong>Account Type:</strong> {userData.preferences.accountType}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
