import { createClient } from '@/lib/supabase/server';
import { TopBar } from '@/components/layout/TopBar';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div>
      <TopBar title="Dashboard" userEmail={user?.email} />
      <div className="p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome to FreelanceOS!</h3>
          <p className="text-blue-700 mb-4">
            Your freelance business operating system is ready.
          </p>
          <div className="flex gap-3 justify-center">
            <a
              href="/clients"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              View Clients
            </a>
            <a
              href="/settings"
              className="bg-white text-blue-600 border border-blue-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50"
            >
              Settings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
