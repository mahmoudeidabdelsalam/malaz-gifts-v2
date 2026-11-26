import '../index.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'ملاذ — هدايا وحكايات بالألوان',
  description: 'هدايا بتشبه أحبابك، وكتب تلوين تفتح باب الخيال. تخصيص على ذوقك وتغليف بعناية من ملاذ.',
  icons: { icon: '/logo.png' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>
}
