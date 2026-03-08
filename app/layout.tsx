import type { Metadata } from "next";
import "./globals.css";
import { initializeDatabase, query } from "@/lib/db";

export async function generateMetadata(): Promise<Metadata> {
  try {
    await initializeDatabase();
    const settings = await query('SELECT * FROM settings');
    const settingsMap: Record<string, string> = {};
    settings.forEach((setting: any) => {
      settingsMap[setting.key] = setting.value;
    });
    
    return {
      title: settingsMap.site_name || "导航网站",
      description: settingsMap.site_description || "简洁实用的导航网站",
    };
  } catch (error) {
    console.error('Error fetching settings for metadata:', error);
    return {
      title: "导航网站",
      description: "简洁实用的导航网站",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="background-gradient" />
        <div className="background-pattern" />
        {children}
      </body>
    </html>
  );
}
