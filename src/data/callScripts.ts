// Fictional sample data for the simulated video call demo — no real people.
// Each script is what the sample profile "says" on a first video call; the
// lines are shown as word-by-word live captions in VideoCallDialog.

export const CALL_SCRIPTS: Record<string, string[]> = {
  'maya-r': [
    'Hi! Okay, the captions are working on my end — can you see me signing clearly?',
    'I was just cleaning my brushes, so if there is paint on my hands, that is why.',
    'I paint watercolors, mostly the San Gabriels at golden hour. The light up there right before sunset is unreal.',
    'Have you ever hiked the trails above Pasadena? There is one with a waterfall that I take everyone to.',
    'Fair warning, I am extremely serious about tacos. Like, I have a ranked list serious.',
    'This is fun. Maybe next time we keep chatting over actual Mexican food instead of a screen.',
  ],
  'devon-k': [
    'Hey! Give me one sec — okay, good, you are nice and framed up. I read lips, so this already helps.',
    'I just got back from the dog beach, so if I look windswept, that is the ocean’s fault.',
    'I am kind of a coffee nerd, full disclosure. I have opinions about grinders that nobody asked for.',
    'Do you dance at all? I do salsa on Fridays and I am always recruiting partners.',
    'Board game nights at my place get competitive. Like, friendship-testing competitive.',
    'This went way better than my usual small talk. We should do coffee for real sometime.',
  ],
  'priya-s': [
    'Hi! Your voice came through crystal clear, which I appreciate more than you know.',
    'So, I have to ask the important question first — what is the best thing you have eaten this week?',
    'I am still on a biryani kick. I made a huge batch on Sunday and my whole building smelled amazing.',
    'I am listening to this twenty-hour audiobook right now and I cannot stop. It is becoming a personality trait.',
    'Also, if you have stand-up special recommendations, I collect them like trading cards.',
    'Okay, I already like talking to you. That is a promising sign for a first call.',
  ],
  'marcus-t': [
    'Hey, good to see you. Let me dim my lamp a bit — there, perfect. Good light makes all the difference for me.',
    'I have a record on in the background, hope that is okay. Coltrane makes everything better.',
    'I spent last weekend trying to photograph the Milky Way. Mostly got clouds, but the attempt counts.',
    'Do you play chess at all? I keep a board set up permanently, just in case.',
    'Biking the LA River path early in the morning — that is my favorite version of this city.',
    'I am glad we did this. Next time maybe I put on a record and we keep talking properly.',
  ],
  'elena-v': [
    'Hi hi! Sorry if my hair is still damp, I literally just came from the water.',
    'Sunrise surf this morning was perfect. Small waves, nobody out, total glass.',
    'I am signing, by the way — the captions should keep up. I also sign BSL, long story involving a very rainy semester in London.',
    'Have you ever been to a Deaf theater night? I take everyone I know eventually, it is incredible.',
    'I bake when I cannot surf. Today’s experiment is vegan lemon bars, results pending.',
    'Okay, you are fun. Beach walk and baked goods next time, I am calling it now.',
  ],
  'jordan-a': [
    'Hey! Fair warning, there is a wall of film cameras behind me and I will talk about them if prompted.',
    'I just got back from a desert trip — two nights under stars so bright you do not need a headlamp.',
    'Do you camp at all? I am trying to gauge how much backpacking talk is too much backpacking talk.',
    'I shoot film, so every photo costs me about a dollar. It has made me extremely thoughtful.',
    'There is a tiny brewery near me that does a sour you would have to taste to believe.',
    'This was easy. I am voting we do the next one somewhere with actual scenery.',
  ],
  'sofia-m': [
    'Hi! Captions on, clay washed off my hands — mostly. We are in business.',
    'I was at the wheel all morning. I made four mugs and only ruined one, which is a personal record.',
    'Weekends I am usually on a coastal trail with a true-crime podcast playing. Balanced lifestyle.',
    'Do you have a farmers market you swear by? I plan my Sundays around one in particular.',
    'If we get along, I am absolutely making you a mug. It is a whole thing with me.',
    'This felt really natural. Let’s not let it be the last call, okay?',
  ],
  'alex-c': [
    'Hey! You are talking to a man who once did a full improv set about a haunted food truck, so expectations: managed.',
    'Quick, settle something for me — best taco in LA, go. I need to know where you stand.',
    'I play goalball on Saturdays. Picture dodgeball, but everyone is blindfolded and the ball has bells in it.',
    'Also, I will defend nineties hip-hop as the greatest era. This is non-negotiable.',
    'My improv team does a show next month and yes, this is me already inviting you.',
    'Okay, genuinely, I had a great time. Round two soon, your pick of topic.',
  ],
};

/** Fallback script for any profile without its own lines. */
export const DEFAULT_CALL_SCRIPT: string[] = [
  'Hi! Really glad we finally got to do this.',
  'So how has your day been treating you so far?',
  'I have to say, it is nice putting a voice and a face to the messages.',
  'What have you been up to this week — anything good?',
  'Okay, I am already having more fun than I expected for a first call.',
  'Let’s definitely do this again soon. Maybe next time with coffee involved.',
];
