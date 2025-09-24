import Sidebar from '@/components/common/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="admin" />
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}