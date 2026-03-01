interface TopBarProps {
  title: string;
  userEmail?: string;
}

export function TopBar({ title, userEmail }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <div className="flex items-center gap-4">
        {userEmail && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {userEmail[0].toUpperCase()}
            </div>
            <span className="text-sm text-gray-700 hidden md:block">{userEmail}</span>
          </div>
        )}
      </div>
    </header>
  );
}
