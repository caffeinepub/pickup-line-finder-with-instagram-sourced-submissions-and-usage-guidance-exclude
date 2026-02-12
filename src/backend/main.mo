import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Char "mo:core/Char";
import Nat "mo:core/Nat";
import Order "mo:core/Order";



actor {
  type PickupLine = {
    id : Nat;
    text : Text;
    howToUse : Text;
    instagramUrl : ?Text;
    reportCount : Nat;
    isSystem : Bool;
  };

  module PickupLine {
    public func compare(line1 : PickupLine, line2 : PickupLine) : Order.Order {
      Nat.compare(line1.id, line2.id);
    };
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

    let howToUse = generateHowToUseGuide(cleanedText);
    let pickupLine : PickupLine = {
      id = nextId;
      text = cleanedText;
      howToUse;
      instagramUrl;
      reportCount = 0;
      isSystem = false;
    };

    pickupLines.add(nextId, pickupLine);
    nextId += 1;
  };

  public query ({ caller }) func getAllPickupLines() : async [PickupLine] {
    pickupLines.values().toArray().sort<PickupLine>();
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

  func isMultiline(text : Text) : Bool {
    let lines = text.split(#char '\n').toArray();
    let nonEmptyLines = lines.filter(func(line) { line.trim(#char ' ').size() > 0 });
    nonEmptyLines.size() >= 3;
  };

  func generateHowToUseGuide(_txt : Text) : Text {
    let delivery = "Deliver each line with confidence, pausing slightly between responses.";
    let timing = "Use it in a casual conversation, preferably when discussing lighthearted topics.";
    let followUp = "After the last line, gauge their reaction and respond playfully to their answer.";
    let context = "\n\nContext: Use this when you're in a relaxed environment, like a coffee shop or social event.";
    "How to use: " # delivery # " " # timing # " " # followUp # context;
  };
};
