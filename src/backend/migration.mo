import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Text "mo:core/Text";

module {
  type Status = { #pending; #approved; #rejected };

  type Category = {
    #Funny;
    #Smooth;
    #Cheesy;
    #Savage;
    #Romantic;
    #Nerdy;
    #Opener;
    #Comeback;
    #Cringe;
    #Uncategorized;
  };

  type EmojiReactions = {
    laugh : Nat;
    heart : Nat;
    fire : Nat;
    skull : Nat;
  };

  type OldPickupLine = {
    id : Nat;
    text : Text;
    instagramUrl : ?Text;
    reportCount : Nat;
    likeCount : Nat;
    isSystem : Bool;
    status : Status;
  };

  type OldActor = {
    pickupLines : Map.Map<Nat, OldPickupLine>;
    nextId : Nat;
  };

  type NewPickupLine = {
    id : Nat;
    text : Text;
    instagramUrl : ?Text;
    reportCount : Nat;
    likeCount : Nat;
    isSystem : Bool;
    status : Status;
    downvoteCount : Nat;
    category : Category;
    username : ?Text;
    copyCount : Nat;
    emojiReactions : EmojiReactions;
    submittedAt : Int;
  };

  type NewComment = {
    id : Nat;
    lineId : Nat;
    text : Text;
    username : Text;
    submittedAt : Int;
  };

  type NewActor = {
    pickupLines : Map.Map<Nat, NewPickupLine>;
    nextId : Nat;
    comments : Map.Map<Nat, List.List<NewComment>>;
    nextCommentId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newPickupLines = old.pickupLines.map<Nat, OldPickupLine, NewPickupLine>(
      func(_id, oldPickupLine) {
        { oldPickupLine with
          downvoteCount = 0;
          category = #Funny;
          username = null;
          copyCount = 0;
          emojiReactions = {
            laugh = 0;
            heart = 0;
            fire = 0;
            skull = 0;
          };
          submittedAt = 0;
        };
      }
    );
    {
      pickupLines = newPickupLines;
      nextId = old.nextId;
      comments = Map.empty<Nat, List.List<NewComment>>();
      nextCommentId = 0;
    };
  };
};
