import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  public type Status = { #pending; #approved; #rejected };
  public type OldPickupLine = {
    id : Nat;
    text : Text;
    instagramUrl : ?Text;
    reportCount : Nat;
    isSystem : Bool;
    status : Status;
  };

  public type OldActor = {
    pickupLines : Map.Map<Nat, OldPickupLine>;
    nextId : Nat;
  };

  public type NewPickupLine = {
    id : Nat;
    text : Text;
    instagramUrl : ?Text;
    reportCount : Nat;
    likeCount : Nat;
    isSystem : Bool;
    status : Status;
  };

  public type NewActor = {
    pickupLines : Map.Map<Nat, NewPickupLine>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newPickupLines = old.pickupLines.map<Nat, OldPickupLine, NewPickupLine>(
      func(_id, oldLine) {
        { oldLine with likeCount = 0 };
      }
    );
    { pickupLines = newPickupLines; nextId = old.nextId };
  };
};
