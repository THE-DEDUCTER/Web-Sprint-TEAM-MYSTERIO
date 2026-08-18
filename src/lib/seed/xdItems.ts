import type { XdItem } from '@/types'

const tags = ['Programming', 'Campus Life', 'Placements', 'Hostel', 'Exams', 'Motivation']

export const seedXdItems: XdItem[] = Array.from({ length: 18 }).map((_, i) => {
  const tag = tags[i % tags.length]
  return {
    id: `xd-${i + 1}`,
    tag,
    mediaUrl: `https://picsum.photos/seed/cohort-xd-${i + 1}/720/1080`,
    sourceUrl: 'https://imgflip.com/',
    mediaType: 'image' as const,
    caption: captionFor(tag, i),
    likeCount: Math.floor(20 + Math.random() * 400),
    likedByMe: false,
  }
})

function captionFor(tag: string, i: number): string {
  const captions: Record<string, string[]> = {
    Programming: ['when the code works but you don\'t know why', 'me explaining my one bug fix as a full changelog', '"it works on my machine" — famous last words'],
    'Campus Life': ['sprinting from D-block to the bus stop in 90 seconds', 'canteen queue at 12:58 PM be like', 'when the fest playlist hits different'],
    Placements: ['the LeetCode grind before placement season', 'HR: "tell me about yourself" — me: internal screaming', 'offer letter energy'],
    Hostel: ['3 AM mess hunger strikes again', 'roommate playing music at 2 AM before an 8 AM exam', 'the eternal fight over the room fan remote'],
    Exams: ['syllabus completion the night before', 'that one topic that\'s "just for viva" but is the whole paper', 'submitting the assignment at 11:59 PM'],
    Motivation: ['it\'s never too late to start the assignment due in 10 minutes', 'small wins: attended the 8 AM lecture', 'one more slide and the PPT is done, right?'],
  }
  const list = captions[tag] ?? ['just a Tuesday on campus']
  return list[i % list.length]
}
