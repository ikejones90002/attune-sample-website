// Fictional sample content for the prototype — no real people, events, or organizations.
export interface CommunitySpace {
  id: string;
  name: string;
  description: string;
}

export interface ThreadReply {
  author: string;
  text: string;
  at: string;
}

export interface CommunityThread {
  id: string;
  spaceId: string;
  author: string;
  title: string;
  body: string;
  replies: ThreadReply[];
  createdAt: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  access: string[];
}

export interface CommunityResource {
  id: string;
  title: string;
  kind: string;
  description: string;
}

export const COMMUNITY_SPACES: CommunitySpace[] = [
  {
    id: 'deaf-hoh',
    name: 'Deaf & HoH dating',
    description: 'Share experiences, tips, and stories about dating as a Deaf or hard-of-hearing person.',
  },
  {
    id: 'blind-low-vision',
    name: 'Blind & low-vision dating',
    description: 'Conversation and advice for navigating dating with vision loss, from first chats to first dates.',
  },
  {
    id: 'asl-learners',
    name: 'ASL learners',
    description: 'A friendly corner for hearing folks learning ASL to date, flirt, and connect more accessibly.',
  },
  {
    id: 'success-stories',
    name: 'Success stories',
    description: 'Celebrate couples who met through Attune and share what made it click.',
  },
];

export const COMMUNITY_THREADS: CommunityThread[] = [
  {
    id: 'thread-deaf-hoh-1',
    spaceId: 'deaf-hoh',
    author: 'Nadia F.',
    title: 'How do you bring up your hearing on a first date?',
    body: 'I usually mention it in my profile, but I still get nervous about the actual moment in person — especially with restaurant noise. What has worked for you?',
    replies: [
      {
        author: 'Sam W.',
        text: 'I just treat it as a fun fact, not a disclaimer. "Heads up, I read lips, so pick a seat where I can see your face!" Most people are relieved it is that simple.',
        at: '2026-08-14T18:22:00',
      },
      {
        author: 'Priya N.',
        text: 'Picking the venue yourself helps a lot. I suggest quieter spots with good lighting and never have to explain much.',
        at: '2026-08-14T20:05:00',
      },
    ],
    createdAt: '2026-08-14T12:40:00',
  },
  {
    id: 'thread-deaf-hoh-2',
    spaceId: 'deaf-hoh',
    author: 'Chris L.',
    title: 'Best caption-friendly date ideas in LA?',
    body: 'Video calls are fine, but I want in-person ideas where communication is easy — no loud bars. What are your go-tos?',
    replies: [
      {
        author: 'Nadia F.',
        text: 'Mini golf in Burbank! You face each other the whole time, and it is naturally turn-based conversation.',
        at: '2026-09-02T14:11:00',
      },
      {
        author: 'Sam W.',
        text: 'Art museums are underrated first dates. Plenty to react to, quiet rooms, and you can point at things when a word does not come.',
        at: '2026-09-02T16:47:00',
      },
      {
        author: 'Elena V.',
        text: 'Sunset picnic at the beach — wind can be tricky for hearing aids, but sitting close and signing together is perfect.',
        at: '2026-09-03T09:30:00',
      },
    ],
    createdAt: '2026-09-02T10:15:00',
  },
  {
    id: 'thread-blind-lv-1',
    spaceId: 'blind-low-vision',
    author: 'Tara J.',
    title: 'Do you share photos or voice notes first?',
    body: 'Dating apps are so visual. I send a voice note early so people hear the real me — curious what others do and when.',
    replies: [
      {
        author: 'Marcus T.',
        text: 'Voice notes all the way. My intro message is usually a short audio clip, and it filters for people who actually want to talk.',
        at: '2026-07-22T11:03:00',
      },
    ],
    createdAt: '2026-07-21T19:26:00',
  },
  {
    id: 'thread-blind-lv-2',
    spaceId: 'blind-low-vision',
    author: 'Ben O.',
    title: 'Accessible first-date venues in the Valley?',
    body: 'Looking for places that are easy to navigate with a cane — good lighting for low vision, not a maze. Suggestions welcome.',
    replies: [
      {
        author: 'Tara J.',
        text: 'The NoHo farmers market is great — open layout, vendors who talk to you, and lots of food to share.',
        at: '2026-08-30T13:58:00',
      },
      {
        author: 'Alex C.',
        text: 'Seconding farmers markets. Also, comedy clubs: fixed seating, you face the stage, and laughter does the ice-breaking for you.',
        at: '2026-08-30T15:12:00',
      },
    ],
    createdAt: '2026-08-29T21:44:00',
  },
  {
    id: 'thread-asl-1',
    spaceId: 'asl-learners',
    author: 'Hannah D.',
    title: 'Learning ASL to date a Deaf woman — where do I start?',
    body: 'I matched with someone wonderful who uses ASL, and I want to do more than rely on text. What helped you learn fastest as an adult?',
    replies: [
      {
        author: 'Luis M.',
        text: 'Weekly practice with a Deaf tutor beats any app. I found one through a local Deaf community center and my signing improved tenfold.',
        at: '2026-06-18T10:20:00',
      },
      {
        author: 'Maya R.',
        text: 'Learn the signs for your shared interests first! Dating-specific vocabulary is motivating, and she will appreciate the effort even when you are clumsy.',
        at: '2026-06-18T12:45:00',
      },
    ],
    createdAt: '2026-06-17T22:10:00',
  },
  {
    id: 'thread-asl-2',
    spaceId: 'asl-learners',
    author: 'Derek P.',
    title: 'Signs that impressed your date the most?',
    body: 'Fun question: which signs or phrases got the best reaction when you used them on a date?',
    replies: [
      {
        author: 'Hannah D.',
        text: 'Learning "your laugh is my favorite sound" in ASL — I butchered the grammar and she laughed for five minutes. Worth it.',
        at: '2026-09-11T17:33:00',
      },
      {
        author: 'Luis M.',
        text: 'Food signs. Asking for the menu and ordering for both of us in ASL at a restaurant got me a second date on the spot.',
        at: '2026-09-11T19:02:00',
      },
      {
        author: 'Nadia F.',
        text: 'From the Deaf side: any sign done with genuine effort and eye contact wins. Perfection is not the point.',
        at: '2026-09-12T08:15:00',
      },
    ],
    createdAt: '2026-09-11T14:50:00',
  },
  {
    id: 'thread-success-1',
    spaceId: 'success-stories',
    author: 'Grace K.',
    title: 'Married last spring — we met right here!',
    body: 'Two years ago I matched with a guy who sent me a voice note instead of "hey." We just got married in Joshua Tree with an ASL interpreter at the ceremony. Do not settle for boring openers!',
    replies: [
      {
        author: 'Sam W.',
        text: 'This is the content I am here for. Congratulations!',
        at: '2026-05-20T09:12:00',
      },
      {
        author: 'Tara J.',
        text: 'An interpreted ceremony in Joshua Tree sounds magical. Wishing you both everything good.',
        at: '2026-05-20T11:26:00',
      },
    ],
    createdAt: '2026-05-19T20:05:00',
  },
  {
    id: 'thread-success-2',
    spaceId: 'success-stories',
    author: 'Owen R.',
    title: 'She taught me to sign "I love you" on our third date',
    body: 'I am hearing, she is Deaf. On our third date she taught me ILY and I practiced it the whole bus ride home. Six months later and I am conversational. Learning her language changed everything.',
    replies: [
      {
        author: 'Hannah D.',
        text: 'This is exactly what I needed to read today. Starting my lessons next week!',
        at: '2026-09-25T16:40:00',
      },
    ],
    createdAt: '2026-09-25T13:18:00',
  },
];

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'event-deaf-coffee',
    title: 'Deaf Coffee & Conversation Night',
    date: '2026-10-17T18:00:00',
    location: 'Culver City Community Center, Culver City',
    description: 'A relaxed evening social for Deaf and HoH singles and friends — coffee, board games, and new faces. Come as you are.',
    access: ['ASL interpreters', 'Wheelchair accessible', 'Well-lit space'],
  },
  {
    id: 'event-tactile-art',
    title: 'Tactile Art Tour for Blind & Low-Vision Visitors',
    date: '2026-10-24T11:00:00',
    location: 'Pasadena Art Museum, Pasadena',
    description: 'Guided small-group tour of the sculpture garden with touch access and detailed audio descriptions. Great low-pressure date outing.',
    access: ['Audio description', 'Touch tours', 'Sighted guides available', 'Wheelchair accessible'],
  },
  {
    id: 'event-asl-speed',
    title: 'ASL Speed-Friending Mixer',
    date: '2026-11-07T19:00:00',
    location: 'The Virgil, East Hollywood',
    description: 'Five-minute rounds of conversation — signing strongly encouraged, all levels welcome. A fun way to meet other Attune members in person.',
    access: ['ASL interpreters', 'Beginner-friendly signing tables'],
  },
  {
    id: 'event-sensory-hike',
    title: 'Sensory-Friendly Group Hike',
    date: '2026-11-14T08:30:00',
    location: 'Griffith Park, Los Angeles',
    description: 'A slow-paced morning hike designed for blind, low-vision, and Deaf hikers, with volunteer guides and a rest-stop breakfast.',
    access: ['Sighted guides available', 'ASL interpreters', 'Quiet rest stops', 'Service animals welcome'],
  },
];

export const COMMUNITY_RESOURCES: CommunityResource[] = [
  {
    id: 'resource-accessible-dating-guide',
    title: 'The Accessible First-Date Playbook',
    kind: 'Guide',
    description: 'A practical guide to planning dates that work for Deaf, HoH, blind, and low-vision partners — venue checklists included.',
  },
  {
    id: 'resource-asl-dating-signs',
    title: '100 ASL Signs for Dating & Small Talk',
    kind: 'Video',
    description: 'A friendly video series teaching the most useful signs for meeting someone new, from introductions to compliments.',
  },
  {
    id: 'resource-screen-reader-dating',
    title: 'Dating Apps That Respect Screen Readers',
    kind: 'Guide',
    description: 'An honest rundown of which dating apps work well with VoiceOver and TalkBack, and which ones still have a long way to go.',
  },
  {
    id: 'resource-deaf-dating-org',
    title: 'Deaf Dating Alliance',
    kind: 'Organization',
    description: 'A community organization hosting socials and mixers for Deaf and hard-of-hearing singles across Southern California.',
  },
  {
    id: 'resource-communication-cards',
    title: 'Printable Communication Preference Cards',
    kind: 'Guide',
    description: 'Wallet-sized cards you can hand to a date or server explaining how you communicate best — in ASL, braille-ready PDF, and large print.',
  },
  {
    id: 'resource-captions-advocacy',
    title: 'Why Captions Are a Dating Issue',
    kind: 'Video',
    description: 'A short explainer on how captioned video calls change the game for HoH daters, and how to ask for them without awkwardness.',
  },
];
