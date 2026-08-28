import { StudentShell } from '@/components/app/student-shell'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentShell>{children}</StudentShell>
}
