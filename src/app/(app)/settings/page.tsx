'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {

  return (
    <div className="container mx-auto max-w-3xl p-4 md:p-8">
       <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Settings will be available here.</p>
          </CardContent>
        </Card>
    </div>
  );
}
