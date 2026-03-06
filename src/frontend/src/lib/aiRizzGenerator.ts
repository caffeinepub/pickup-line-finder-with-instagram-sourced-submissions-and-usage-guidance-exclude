// Simulated AI rizz line generator
// Generates witty, multi-line pickup lines based on topic

interface TopicLines {
  lines: string[];
}

const topicDatabase: Record<string, TopicLines> = {
  gym: {
    lines: [
      "Are you a deadlift?\n\nBecause you've got me weak in the knees\n\nAnd I'd go to the gym every day just for you.",
      "Do you even lift?\n\nBecause every time I see you,\n\nMy heart rate hits a new personal record.",
      "Are you a rest day?\n\nBecause I've been working so hard\n\nAnd you're exactly what I need.",
      "Is your name Cardio?\n\nBecause you get my heart going\n\nAnd I never want to stop.",
      "Are you a personal trainer?\n\nBecause you've been pushing me\n\nTo be the best version of myself without even trying.",
      "Do you believe in supersets?\n\nBecause I could go back and forth with you\n\nAll day without needing a break.",
    ],
  },
  coffee: {
    lines: [
      "Are you an espresso shot?\n\nBecause you hit different at 8am\n\nAnd now I can't start my day without you.",
      "Do you work at a coffee shop?\n\nBecause you've got me coming back every morning\n\nAnd I'm starting to think it's not for the coffee.",
      "Are you a latte?\n\nBecause you're the perfect blend of warm and sweet\n\nAnd I want you in my hands every morning.",
      "Is your name Caffeine?\n\nBecause you keep me up at night\n\nThinking about the next time I'll see you.",
      "Are you cold brew?\n\nBecause you've been steeping in my mind all night\n\nAnd now I can't get enough.",
      "Do you take sugar?\n\nBecause every second with you\n\nIs already the sweetest part of my day.",
    ],
  },
  stars: {
    lines: [
      "Do you like stargazing?\n\nBecause I've been staring at you\n\nLonger than any constellation I've ever found.",
      "Are you the North Star?\n\nBecause no matter where I go,\n\nI always find myself looking back at you.",
      "Are you an astronomer?\n\nBecause you've discovered something in me\n\nI never knew existed.",
      "Do you know what's bigger than the universe?\n\nThe amount of times I've thought about you today.\n\nAnd even that might be an understatement.",
      "Are you a shooting star?\n\nBecause I've been making the same wish\n\nEvery single night.",
      "If you were a planet,\n\nYou'd be the one scientists are still searching for —\n\nPerfect and completely out of reach.",
    ],
  },
  books: {
    lines: [
      "Are you a good book?\n\nBecause I keep telling myself just one more chapter\n\nAnd before I know it, it's 3am.",
      "Are you a plot twist?\n\nBecause I never saw you coming\n\nAnd now I can't imagine the story without you.",
      "Do you like libraries?\n\nBecause I'd check you out\n\nAnd renew you every single time.",
      "Are you a bestseller?\n\nBecause everyone who meets you raves about you\n\nAnd I finally understand why.",
      "Are you the last page of a great novel?\n\nBecause I never want to reach you\n\nAnd I'm already dreading the end.",
      "I wasn't going to start another book.\n\nBut then you walked in\n\nAnd now I can't put you down.",
    ],
  },
  music: {
    lines: [
      "Are you a chorus?\n\nBecause I keep replaying you in my head\n\nAnd it only gets better every time.",
      "Are you a vinyl record?\n\nBecause everyone wants to handle you with care\n\nAnd you sound best up close.",
      "Are you a song on shuffle?\n\nBecause I wasn't looking for you\n\nBut now you're on repeat.",
      "Are you a guitar solo?\n\nBecause you came out of nowhere\n\nAnd now you're the only part I remember.",
      "Can I tell you something?\n\nYou're like my favorite song —\n\nI already know all the words but I still listen on loop.",
      "Are you a bridge in a song?\n\nBecause just when I thought I knew what I felt,\n\nYou changed everything.",
    ],
  },
  food: {
    lines: [
      "Are you a chef's special?\n\nBecause there's only one of you\n\nAnd everyone's trying to get a reservation.",
      "Are you ramen at 2am?\n\nBecause you're exactly what I need\n\nWhen the world gets overwhelming.",
      "Are you dessert?\n\nBecause I was full\n\nBut somehow there's always room for you.",
      "Are you spicy food?\n\nBecause you make me feel things\n\nI wasn't prepared for.",
      "If you were a meal,\n\nYou'd be the one I drive across town for —\n\nAnd never once regret the effort.",
      "Do you like comfort food?\n\nBecause being around you\n\nFeels exactly like that.",
    ],
  },
  school: {
    lines: [
      "Are you a pop quiz?\n\nBecause you caught me completely off guard\n\nAnd I'm still not ready for you.",
      "Are you extra credit?\n\nBecause meeting you today\n\nFelt like a bonus I didn't deserve but I'll take.",
      "Are you a study session?\n\nBecause I'd cancel all my plans\n\nJust to spend more time with you.",
      "Are you a final exam?\n\nBecause I've been preparing for you my whole life\n\nAnd I'm still nervous.",
      "You know what's funny?\n\nI used to hate group projects —\n\nUntil I realized I want to be on your team forever.",
      "Are you detention?\n\nBecause I'd get in trouble on purpose\n\nJust to spend an extra hour with you.",
    ],
  },
  summer: {
    lines: [
      "Are you the sun?\n\nBecause you showed up out of nowhere\n\nAnd now I can't stop thinking about getting burned.",
      "Are you a summer playlist?\n\nBecause every time I hear you\n\nI want to roll the windows down and drive forever.",
      "Are you a beach sunset?\n\nBecause I'd stand in the same spot for hours\n\nJust to watch you.",
      "Are you summer vacation?\n\nBecause you came too fast\n\nAnd I never want you to end.",
      "Do you like late summer nights?\n\nBecause I'd stay up till sunrise\n\nJust to keep talking to you.",
      "Are you a heat wave?\n\nBecause you showed up unexpectedly\n\nAnd now everything feels different.",
    ],
  },
  funny: {
    lines: [
      "Are you a WiFi signal?\n\nBecause I feel a strong connection\n\nAnd I'm not going anywhere until I lose it.",
      "Do you believe in love at first swipe?\n\nBecause I matched with you ironically\n\nAnd now I'm here preparing speeches.",
      "Are you a parking ticket?\n\nBecause you've got 'fine' written all over you\n\nAnd I'd pay that fee happily.",
      "Are you Google Maps?\n\nBecause I've been lost my whole life\n\nAnd somehow you're showing me where to go.",
      "Can I tell you something embarrassing?\n\nI practiced this whole conversation in the shower —\n\nAnd you still made me forget everything.",
      "Are you a software update?\n\nBecause ever since I met you,\n\nEverything in my life feels upgraded.",
    ],
  },
  romantic: {
    lines: [
      "Can I ask you something?\n\nWhat does it feel like to be the most beautiful person in the room?\n\nBecause you've been that every time I've seen you.",
      "I wasn't going to talk to you tonight.\n\nBut then you smiled at someone across the room\n\nAnd I had to know what it feels like to be that person.",
      "Do you know what the hardest part about meeting you was?\n\nRealizing I've been comparing everyone to someone I hadn't even met yet.\n\nTurns out I was waiting for you.",
      "I thought about what I'd say if I ever met someone like you.\n\nNow that you're here,\n\nI just want to listen to you instead.",
      "You know what I find rare?\n\nSomeone who makes a room feel warmer just by walking into it.\n\nYou do that every single time.",
      "If you were a feeling,\n\nYou'd be that one in the morning\n\nWhen you realize it's actually a good day.",
    ],
  },
  travel: {
    lines: [
      "Are you a passport?\n\nBecause with you,\n\nEverywhere feels like a destination worth visiting.",
      "Do you like window seats?\n\nBecause ever since I sat next to you,\n\nEvery view looks better.",
      "Are you a layover in a city I'd never planned to visit?\n\nBecause I only had two hours\n\nAnd now I'm rescheduling my whole life.",
      "If you were a travel destination,\n\nYou'd be the kind people keep secret —\n\nToo good to share, too beautiful to forget.",
      "I wasn't going to take this trip.\n\nBut then I heard about you\n\nAnd suddenly I needed to see it for myself.",
      "Are you jet lag?\n\nBecause you've completely messed up my schedule\n\nAnd I can't stop thinking about you at 3am.",
    ],
  },
  art: {
    lines: [
      "Are you an unfinished painting?\n\nBecause I keep seeing new things in you\n\nEvery time I look.",
      "Do you believe in art at first sight?\n\nBecause you stopped me mid-conversation\n\nAnd I'm still standing here trying to understand you.",
      "Are you a gallery I've never been to?\n\nBecause I hear people talk about you constantly\n\nAnd I finally see why.",
      "If you were a brushstroke,\n\nYou'd be the one that holds the whole piece together —\n\nSmall detail, but nothing works without it.",
      "Can I tell you something?\n\nYou look like someone who inspired a painting once\n\nAnd the artist never quite got over it.",
      "Are you abstract art?\n\nBecause I don't fully understand you yet\n\nBut I'm completely drawn in.",
    ],
  },
  gaming: {
    lines: [
      "Are you a final boss?\n\nBecause I've been preparing for this moment my whole life\n\nAnd I'm still not sure I'm ready.",
      "Do you have a save point?\n\nBecause I'd restart from the beginning\n\nJust to experience meeting you again.",
      "Are you a hidden achievement?\n\nBecause I wasn't even trying to find you\n\nAnd somehow this feels like my biggest win.",
      "If life were an RPG,\n\nYou'd be the legendary item I didn't think was real —\n\nImpossible to find, impossible to put down.",
      "Are you a co-op game?\n\nBecause everything gets more fun with you involved\n\nAnd I keep choosing your side.",
      "I wasn't going to play one more round.\n\nBut then you showed up\n\nAnd now I never want to log off.",
    ],
  },
  sports: {
    lines: [
      "Are you overtime?\n\nBecause even when I think we're done,\n\nI'm not ready for this to end.",
      "Do you believe in home advantage?\n\nBecause you make every place feel like somewhere I belong.",
      "Are you the winning goal?\n\nBecause the moment you happened,\n\nEverything before it stopped mattering.",
      "If you were a play,\n\nYou'd be the kind coaches diagram for years —\n\nImpossible to defend against.",
      "Are you a championship ring?\n\nBecause I've been working toward something like you\n\nFor longer than I realized.",
      "Can I tell you something crazy?\n\nI've never been the type to get nervous before a big moment —\n\nUntil right now, talking to you.",
    ],
  },
  animals: {
    lines: [
      "Are you a golden retriever?\n\nBecause being around you\n\nMakes everything feel warmer and better.",
      "Do you like cats?\n\nBecause they only choose people worth their time\n\nAnd something tells me they'd pick you.",
      "Are you a rare bird that only shows up in certain seasons?\n\nBecause I feel like I've been waiting my whole life\n\nAnd I can't believe I'm finally seeing you.",
      "If you were an animal,\n\nYou'd be the one that surprises everyone —\n\nNobody expected you, but now nobody wants to leave.",
      "Are you a dog at the end of a long day?\n\nBecause the moment I saw you,\n\nAll the bad stuff just disappeared.",
      "Can I tell you something?\n\nThe way you light up a room reminds me of a firefly —\n\nBrief, brilliant, and impossible to ignore.",
    ],
  },
  science: {
    lines: [
      "Are you gravity?\n\nBecause I didn't choose to fall for you\n\nIt just happened and I can't stop.",
      "Do you know Newton's third law?\n\nBecause every time you walk into my world,\n\nI feel something push back just as hard.",
      "Are you dark matter?\n\nBecause scientists can't explain you\n\nBut somehow you're holding everything together.",
      "If attraction were a force of nature,\n\nYou'd be the strongest one —\n\nInvisible, undeniable, and completely unavoidable.",
      "Are you a black hole?\n\nBecause you've bent every rule I had\n\nAnd pulled me in without trying.",
      "Can I tell you something weird?\n\nEver since I met you,\n\nEverything around you feels like the control group.",
    ],
  },
  tech: {
    lines: [
      "Are you a software update?\n\nBecause ever since you came along,\n\nEverything in my world runs better.",
      "Do you know what's impressive?\n\nYou've got better UI than anything I've ever used —\n\nAnd the backend clearly matches.",
      "Are you open source?\n\nBecause I'd contribute everything I have\n\nJust to be part of what you're building.",
      "If you were an algorithm,\n\nYou'd be the kind that solves problems\n\nI didn't even know I had.",
      "Are you a bug I can't fix?\n\nBecause you've completely taken over my system\n\nAnd I keep going back to figure you out.",
      "Can I tell you something nerdy?\n\nEvery time I see you,\n\nMy response time drops to zero.",
    ],
  },
  fashion: {
    lines: [
      "Are you a limited edition drop?\n\nBecause I've been refreshing all day\n\nAnd I still can't believe you're here.",
      "Do you know what the best accessory is?\n\nConfidence. And you wear it\n\nBetter than anyone I've ever seen.",
      "Are you vintage?\n\nBecause everyone notices you in a room full of new things\n\nAnd nobody can explain exactly why.",
      "If style were a language,\n\nYou'd be fluent in something\n\nMost people don't even know exists.",
      "Are you a classic piece?\n\nBecause trends come and go\n\nBut something about you never goes out of style.",
      "I wasn't going to say anything.\n\nBut you pulled off something today\n\nThat I've never seen look that good on anyone.",
    ],
  },
  movies: {
    lines: [
      "Are you the third act?\n\nBecause everything was good before\n\nBut this is where it gets unforgettable.",
      "Do you like plot twists?\n\nBecause I came here for one thing\n\nAnd somehow you became the whole story.",
      "Are you a film score?\n\nBecause the moment you walked in,\n\nEverything started feeling more cinematic.",
      "If my life were a movie,\n\nYou'd be the character the audience fell for\n\nBefore the writers even planned it.",
      "Are you a sequel I actually want?\n\nBecause I'd watch this story\n\nAs many times as you'd let me.",
      "Can I tell you something?\n\nYou have a leading role energy —\n\nThe kind that makes the rest of the cast look better too.",
    ],
  },
  fitness: {
    lines: [
      "Are you a morning run?\n\nBecause I don't want to do it at first\n\nBut after five minutes I never want to stop.",
      "Do you believe in progressive overload?\n\nBecause every time I talk to you,\n\nI feel myself getting stronger.",
      "Are you the last rep?\n\nBecause I didn't think I had anything left\n\nAnd somehow you made it possible.",
      "If motivation were a person,\n\nIt would look exactly like you —\n\nImpossible to ignore and genuinely inspiring.",
      "Are you a recovery day?\n\nBecause being with you\n\nFeels like everything is healing at once.",
      "Can I be honest?\n\nI've never worked this hard toward anything in my life\n\nUntil I realized it was worth impressing you.",
    ],
  },
  nature: {
    lines: [
      "Are you a wildfire?\n\nBecause you started small\n\nAnd now I can't contain what I'm feeling.",
      "Do you like hiking?\n\nBecause meeting you\n\nFelt like reaching a view I almost didn't go for.",
      "Are you a thunderstorm on a summer night?\n\nBecause you came out of nowhere,\n\nShook everything up, and now the air feels completely different.",
      "If you were a season,\n\nYou'd be the first warm day in spring —\n\nThe one everyone steps outside for.",
      "Are you a river?\n\nBecause you move in one direction\n\nAnd somehow carve through everything.",
      "Can I tell you something?\n\nYou remind me of the ocean at night —\n\nDark, beautiful, and bigger than I expected.",
    ],
  },
  cooking: {
    lines: [
      "Are you a recipe I found by accident?\n\nBecause I had no idea what I was getting into\n\nAnd now it's my favorite thing I've ever made.",
      "Do you like cooking for people?\n\nBecause the way you make others feel\n\nIs the best kind of art there is.",
      "Are you a slow simmer?\n\nBecause the longer I'm around you,\n\nThe better everything gets.",
      "If you were a dish,\n\nYou'd be the one that looks simple\n\nBut has layers nobody expected.",
      "Are you a secret ingredient?\n\nBecause I can't explain what you do\n\nBut everything is better when you're in it.",
      "Can I cook for you sometime?\n\nNot because I'm great at it —\n\nBut I want to see what you look like when something makes you happy.",
    ],
  },
  dance: {
    lines: [
      "Are you a slow song?\n\nBecause the world keeps spinning fast\n\nBut every second with you feels extended.",
      "Do you dance?\n\nBecause watching you move through a room\n\nLooks like something that took years to perfect.",
      "Are you the moment before the drop?\n\nBecause I've been holding my breath\n\nSince the second I noticed you.",
      "If energy had a shape,\n\nIt would look exactly like you on the dance floor —\n\nEveryone orbiting without realizing it.",
      "Are you a choreography I can't follow?\n\nBecause I keep trying to keep up with you\n\nAnd I never quite get there.",
      "Can I tell you something?\n\nI don't usually dance.\n\nBut for you, I'd learn.",
    ],
  },
  photography: {
    lines: [
      "Are you golden hour?\n\nBecause everything looks better with you in it\n\nAnd you only get a small window.",
      "Do you know what the hardest thing to photograph is?\n\nSomething that moves you.\n\nAnd I haven't put my camera down since I saw you.",
      "Are you a film camera?\n\nBecause with you, I want to slow down,\n\nThink before I act, and make every shot count.",
      "If I had one frame left,\n\nI already know exactly what I'd photograph.\n\nOr who.",
      "Are you natural light?\n\nBecause everything I thought I knew looks different now\n\nThat you're illuminating it.",
      "Can I tell you something?\n\nYou have a presence that's almost impossible to capture —\n\nThe kind photographers spend years chasing.",
    ],
  },
};

function shuffleLines(lines: string[]): string[] {
  // Fisher-Yates shuffle
  const arr = [...lines];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 4);
}

function getGenericLines(topic: string): string[] {
  const t = topic.toLowerCase().trim();
  const templates = [
    `Are you ${t}?\n\nBecause you've completely changed my perspective\n\nAnd I don't think I can go back to the way things were.`,
    `Do you love ${t}?\n\nBecause you have the same effect on me:\n\nInstantly addictive and impossible to stop thinking about.`,
    `If you were ${t},\n\nYou'd be the version everyone talks about —\n\nImpossible to find, impossible to forget.`,
    `I wasn't going to bring up ${t}.\n\nBut somehow it describes exactly how I feel around you:\n\nCompletely caught off guard and unable to stop.`,
    `Can I tell you something about ${t}?\n\nIt reminds me of you —\n\nEverywhere I go, I seem to find it.`,
    `You know what's funny about ${t}?\n\nEveryone likes it, but nobody expects it to hit this hard.\n\nSounds about right.`,
  ];
  return shuffleLines(templates);
}

function findBestMatch(topic: string): string[] {
  const t = topic.toLowerCase().trim();

  // Direct match
  if (topicDatabase[t]) {
    return shuffleLines(topicDatabase[t].lines);
  }

  // Partial match
  for (const key of Object.keys(topicDatabase)) {
    if (t.includes(key) || key.includes(t)) {
      return shuffleLines(topicDatabase[key].lines);
    }
  }

  // Keyword mapping
  const keywords: Record<string, string> = {
    workout: "gym",
    weightlifting: "gym",
    exercise: "gym",
    lifting: "gym",
    espresso: "coffee",
    latte: "coffee",
    cafe: "coffee",
    cappuccino: "coffee",
    space: "stars",
    astronomy: "stars",
    moon: "stars",
    night: "stars",
    galaxy: "stars",
    reading: "books",
    novel: "books",
    library: "books",
    song: "music",
    band: "music",
    concert: "music",
    playlist: "music",
    guitar: "music",
    piano: "music",
    cooking: "cooking",
    pizza: "food",
    sushi: "food",
    restaurant: "food",
    eating: "food",
    dinner: "food",
    class: "school",
    college: "school",
    university: "school",
    study: "school",
    beach: "summer",
    vacation: "travel",
    sunshine: "summer",
    holiday: "travel",
    humor: "funny",
    joke: "funny",
    laugh: "funny",
    love: "romantic",
    cute: "romantic",
    sweet: "romantic",
    date: "romantic",
    trip: "travel",
    adventure: "travel",
    hike: "nature",
    hiking: "nature",
    mountain: "nature",
    forest: "nature",
    ocean: "nature",
    photo: "photography",
    picture: "photography",
    camera: "photography",
    film: "movies",
    cinema: "movies",
    movie: "movies",
    series: "movies",
    netflix: "movies",
    code: "tech",
    coding: "tech",
    programming: "tech",
    software: "tech",
    app: "tech",
    run: "fitness",
    running: "fitness",
    yoga: "fitness",
    clothes: "fashion",
    style: "fashion",
    outfit: "fashion",
    dress: "fashion",
    video: "gaming",
    game: "gaming",
    esports: "gaming",
    football: "sports",
    basketball: "sports",
    soccer: "sports",
    tennis: "sports",
    dog: "animals",
    cat: "animals",
    pet: "animals",
    painting: "art",
    drawing: "art",
    sketch: "art",
    chemistry: "science",
    biology: "science",
    physics: "science",
    math: "science",
    dance: "dance",
    dancing: "dance",
    club: "dance",
  };

  for (const [kw, mapped] of Object.entries(keywords)) {
    if (t.includes(kw)) {
      return shuffleLines(topicDatabase[mapped].lines);
    }
  }

  return getGenericLines(topic);
}

/**
 * Generates 4 multi-line pickup lines based on a topic.
 * Returns shuffled lines so repeated queries feel fresh.
 */
export function generateAiLines(topic: string): string[] {
  if (!topic.trim()) {
    return shuffleLines(topicDatabase.romantic.lines);
  }
  return findBestMatch(topic);
}
