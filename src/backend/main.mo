import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Char "mo:core/Char";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Status = { #pending; #approved; #rejected };

  type PickupLine = {
    id : Nat;
    text : Text;
    instagramUrl : ?Text;
    reportCount : Nat;
    likeCount : Nat;
    isSystem : Bool;
    status : Status;
  };

  let pickupLines = Map.empty<Nat, PickupLine>();
  var nextId = 0;

  public shared ({ caller }) func submitPickupLine(text : Text, instagramUrl : ?Text) : async () {
    let cleanedText = text.trim(#char ' ');

    if (cleanedText.size() == 0 or cleanedText.size() > 1000) {
      Runtime.trap("Pickup line must not be empty and must be less than 1000 characters.");
    };

    if (not isMultiline(cleanedText)) {
      Runtime.trap("Pickup line must be multi-line with at least 2 separate lines.");
    };

    let pickupLine : PickupLine = {
      id = nextId;
      text = cleanedText;
      instagramUrl;
      reportCount = 0;
      likeCount = 0;
      isSystem = false;
      status = #pending;
    };

    pickupLines.add(nextId, pickupLine);
    nextId += 1;
  };

  public query ({ caller }) func getAllPickupLines() : async [PickupLine] {
    pickupLines.values().toArray();
  };

  public query ({ caller }) func getPendingPickupLines() : async [PickupLine] {
    pickupLines.toArray().filter(
      func((_, line)) {
        line.status == #pending;
      }
    ).map(
      func((_, line)) { line }
    );
  };

  public query ({ caller }) func getApprovedPickupLines() : async [PickupLine] {
    pickupLines.toArray().filter(
      func((_, line)) {
        line.status == #approved;
      }
    ).map(
      func((_, line)) { line }
    );
  };

  public shared ({ caller }) func approvePickupLine(id : Nat) : async () {
    updatePickupLineStatus(id, #approved);
  };

  public shared ({ caller }) func rejectPickupLine(id : Nat) : async () {
    updatePickupLineStatus(id, #rejected);
  };

  public query ({ caller }) func getLineWithGuide(id : Nat) : async {
    pickupLine : PickupLine;
    howToUse : Text;
  } {
    switch (pickupLines.get(id)) {
      case (null) { Runtime.trap("Pickup line does not exist") };
      case (?pickupLine) {
        let howToUse = generateHowToUseGuide(pickupLine.text);
        {
          pickupLine;
          howToUse;
        };
      };
    };
  };

  public shared ({ caller }) func reportPickupLine(id : Nat) : async () {
    switch (pickupLines.get(id)) {
      case (null) { Runtime.trap("Pickup line does not exist") };
      case (?pickupLine) {
        let updatedPickupLine = { pickupLine with reportCount = pickupLine.reportCount + 1 };
        pickupLines.add(id, updatedPickupLine);
      };
    };
  };

  public shared ({ caller }) func likePickupLine(id : Nat) : async () {
    switch (pickupLines.get(id)) {
      case (null) { Runtime.trap("Pickup line does not exist") };
      case (?pickupLine) {
        let updatedPickupLine = { pickupLine with likeCount = pickupLine.likeCount + 1 };
        pickupLines.add(id, updatedPickupLine);
      };
    };
  };

  func updatePickupLineStatus(id : Nat, newStatus : Status) {
    switch (pickupLines.get(id)) {
      case (null) { Runtime.trap("Pickup line does not exist") };
      case (?pickupLine) {
        let updatedPickupLine = { pickupLine with status = newStatus };
        pickupLines.add(id, updatedPickupLine);
      };
    };
  };

  func isMultiline(text : Text) : Bool {
    let lines = text.split(#char '\n').toArray();
    let nonEmptyLines = lines.filter(func(line) { line.trim(#char ' ').size() > 0 });
    nonEmptyLines.size() >= 3;
  };

  func generateHowToUseGuide(pickupLine : Text) : Text {
    let timing = getTimingAdvice(getNumberOfLines(pickupLine));
    let context = getContextAdvice(pickupLine);
    let lineType = detectLineType(pickupLine);
    let sectionDivider = "\n——————————————————————————————————————————————————————\n";
    let delivery = "Deliver each line with a touch of confidence, hitting the right tone for the situation. Treat each exchange as a playful back-and-forth, pausing for genuine reactions between lines.";
    let contextFormatted = "Context:\n" # context # sectionDivider;
    let deliveryTitle = "\nHow to Use: " # sectionDivider;
    let deliveryEnd = delivery # sectionDivider;
    let timingAdvice = "\nTiming: " # sectionDivider # timing # sectionDivider;
    let lineTypeAdvice = "\n" # getLineTypeAdvice(lineType) # sectionDivider;
    let followUp = "Follow-up:\nIf you get a positive reaction, have fun with it! Build on their response to keep the energy going. If the conversation is flowing, add a witty remark or ask an open-ended question related to the theme. Remember, the real connection comes from a genuine, enjoyable interaction – let your personality shine and make it an unforgettable moment.";
    let followUpAdvice = sectionDivider # sectionDivider # followUp # sectionDivider;
    contextFormatted # deliveryTitle # deliveryEnd # timingAdvice # lineTypeAdvice # followUpAdvice;
  };

  func getLineTypeAdvice(lineType : Text) : Text {
    switch (lineType) {
      case ("classic") { "Classic lines have timeless appeal – they're perfect for breaking the ice in almost any setting. Use them to spark interest in a fun, nonchalant way." };
      case ("bold") { "Bold lines are designed to leave a lasting impression fast. Deliver them with confidence in social gatherings where you want to stand out and make an immediate impact. Great for moments when you're feeling adventurous." };
      case ("clever") { "Clever lines shine in witty, intellectual environments. Drop them into playful conversations or when you're discussing interesting topics – they show off your quick thinking and sense of humor." };
      case ("subtle") { "Subtle lines are best for more intimate, relaxed settings. Use them to create intrigue and keep things mysterious during deeper conversations or when the mood is mellow." };
      case ("playful") { "Playful lines are ideal for laid-back situations where laughter is welcome. Use them during social events or lighthearted conversations to keep the mood upbeat and fun." };
      case ("unexpected") { "Unexpected lines are attention-grabbers! Use them as conversation starters or to inject humor into a discussion. Great for sparking curiosity and keeping the interaction lively." };
      case ("cheesy") { "Cheesy lines are all about fun – perfect for breaking the ice (and maybe getting a laugh). Smile when you use them, add a wink, and enjoy the moment regardless of the outcome." };
      case ("rhyming") { "Rhyming lines add a creative touch to your approach. They're especially effective in artistic settings or when discussing music, poetry, or other creative interests." };
      case ("smooth") { "Smooth lines work well in sophisticated environments where charm and finesse are important. Deliver them confidently to make a lasting impression with elegance and style." };
      case ("thematic") { "Thematic lines are great for connecting over shared interests. Use them in situations that match the theme for the best response (e.g., outdoors for adventure-themed lines)." };
      case ("literary") { "Literary lines are wonderful for fellow book lovers and creative thinkers. Use them to connect over shared passions or to spark conversations about literature and storytelling." };
      case ("miscellaneous") { "Versatile lines that fit a variety of situations. Use them to keep conversations interesting and to showcase your unique personality." };
      case (_) { "Classic lines have timeless appeal – they're perfect for breaking the ice in almost any setting. Use them to spark interest in a fun, nonchalant way." };
    };
  };

  func getContextAdvice(_pickupLine : Text) : Text {
    "These lines work best when the conversation is already lighthearted and both parties are engaged. Use them to add a playful touch to the interaction, regardless of the setting.";
  };

  func getTimingAdvice(lineCount : Nat) : Text {
    let lineCountText = lineCount.toText();
    "Use this " # lineCountText # " line pickup when the vibe is relaxed and everyone is open to a bit of fun. Ideal for moments when both of you are already joking around or looking for a playful exchange.";
  };

  func containsAny(pickupLine : Text, patterns : [Text]) : Bool {
    let lowerCaseLine = toLowerCase(pickupLine);
    for (pattern in patterns.values()) {
      if (lowerCaseLine.contains(#text(toLowerCase(pattern)))) {
        return true;
      };
    };
    false;
  };

  func toLowerCase(text : Text) : Text {
    let chars = List.empty<Char>();
    text.chars().forEach(func(char) { chars.add(char) });
    Text.fromIter(chars.values());
  };

  func detectLineType(pickupLine : Text) : Text {
    let lowerCaseLine = toLowerCase(pickupLine);

    let boldPatterns : [Text] = [
      "seduce",
      "bedroom",
      "naked",
      "strip",
      "date",
      "fantasy",
      "daring",
      "adventure",
      "challenge",
      "intense",
      "irresistible",
    ];

    let cleverPatterns : [Text] = [
      "masterpiece",
      "paradox",
      "riddle",
      "witty",
      "spin",
      "twist",
      "crafty",
      "innovation",
      "push the envelope",
      "clever",
      "thought-provoking",
      "puzzle",
      "ingenious",
      "original",
      "ingenious",
      "genius",
      "impressionist",
      "inspired",
      "inspiration",
      "puns",
    ];

    let subtlePatterns : [Text] = [
      "whisper",
      "hint",
      "suggest",
      "allure",
      "quiet",
      "intrigue",
      "mystery",
      "nuance",
      "delicately",
      "softly",
      "gentle",
      "secret",
      "muah",
      "private",
      "reserved",
      "quietly",
      "low key",
      "discreet",
      "secretous",
    ];

    let playfulPatterns : [Text] = [
      "giggle",
      "chuckle",
      "adorable",
      "bubbles",
      "sparkle",
      "wink",
      "cheerful",
      "upbeat",
      "light-hearted",
      "ecstatic",
      "ecstatic",
      "happiness",
      "quirky",
      "joyful",
    ];

    let unexpectedPatterns : [Text] = [
      "surprised",
      "caught off guard",
      "stunned",
      "unpredictable",
      "sudden",
      "rapid",
      "lightening speed",
      "shocking",
      "unexpectedly",
      "twist",
      "throwback",
      "unconventional",
      "remarkable",
    ];

    let cheesyPatterns : [Text] = [
      "cuddle", "dazzle", "special", "gaze", "sparkle", "dream", "cute", "hilarious", "entertain"
    ];

    let rhymingPatterns : [Text] = [
      "poetry",
      "rhymes",
      "verse",
      "rhyme",
      "classical",
      "musicality",
      "verbatim",
      "rhymin",
    ];

    let literaturePatterns : [Text] = [
      "literature",
      "fantasy",
      "tale",
      "novel",
      "book",
      "chapters",
      "sparknotes",
      "epic",
      "poetry",
      "verse",
      "shakespeare",
      "storybook",
      "bibliophile",
      "narrative",
      "fable",
      "fictional",
      "literary",
      "classic",
    ];

    if (lowerCaseLine.contains(#text("punctuation_pattern"))) {
      "bold";
    } else if (containsAny(lowerCaseLine, boldPatterns)) {
      "bold";
    } else if (containsAny(lowerCaseLine, cleverPatterns)) {
      "clever";
    } else if (containsAny(lowerCaseLine, subtlePatterns)) {
      "subtle";
    } else if (containsAny(lowerCaseLine, playfulPatterns)) {
      "playful";
    } else if (containsAny(lowerCaseLine, unexpectedPatterns)) {
      "unexpected";
    } else if (containsAny(lowerCaseLine, cheesyPatterns)) {
      "cheesy";
    } else if (containsAny(lowerCaseLine, rhymingPatterns)) {
      "rhyming";
    } else if (containsAny(lowerCaseLine, literaturePatterns)) {
      "literary";
    } else {
      "classic";
    };
  };

  func getNumberOfLines(text : Text) : Nat {
    let lines = text.split(#char '\n').toArray();
    let nonEmptyLines = lines.filter(func(line) { line.trim(#char ' ').size() > 0 });
    nonEmptyLines.size();
  };
};
