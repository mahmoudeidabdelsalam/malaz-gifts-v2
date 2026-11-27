export type ComicStory = {
  id: string
  name: string
  description: string
  cover: string
  folder: string
  pagesCount: number
  pageWidth: number
  pageHeight: number
}

// Add a folder under public/images/comic-stories and register it here.
export const comicStories: ComicStory[] = [
  {
    id: 'firefighter',
    name: 'رجل الإطفاء الخارق',
    description: 'مغامرة بطل الإطفاء الصغير.',
    cover: '/images/comic-stories/firefighter/page-1.png',
    folder: '/images/comic-stories/firefighter',
    pagesCount: 4,
    pageWidth: 384,
    pageHeight: 688,
  },
  {
    id: 'doctor',
    name: 'الدكتور الصغير',
    description: 'مغامرة الطبيب الصغير في مساعدة الجميع.',
    cover: '/images/comic-stories/doctor/page-1.png',
    folder: '/images/comic-stories/doctor',
    pagesCount: 4,
    pageWidth: 384,
    pageHeight: 688,
  },
  {
    id: 'football',
    name: 'بطل كرة القدم',
    description: 'مباراة ممتعة ومغامرة كروية لا تنسى.',
    cover: '/images/comic-stories/football/page-1.png',
    folder: '/images/comic-stories/football',
    pagesCount: 4,
    pageWidth: 384,
    pageHeight: 688,
  },
  {
    id: 'pilot',
    name: 'الطيار الصغير',
    description: 'رحلة جوية ممتعة مع بطل الطيران الصغير.',
    cover: '/images/comic-stories/pilot/page-1.png',
    folder: '/images/comic-stories/pilot',
    pagesCount: 4,
    pageWidth: 384,
    pageHeight: 688,
  },
]
