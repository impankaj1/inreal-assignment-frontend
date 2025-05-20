import { UserProvider } from "@/components/UserProvider";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <UserProvider>
      <main className="flex-1 py-8 px-4">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </UserProvider>
  );
}
