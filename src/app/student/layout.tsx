import Sidebar from '@/components/common/Sidebar'

export const dynamic = 'force-dynamic'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex bg-slate-50">
      <Sidebar role="student" />
      <main className="flex-1 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}