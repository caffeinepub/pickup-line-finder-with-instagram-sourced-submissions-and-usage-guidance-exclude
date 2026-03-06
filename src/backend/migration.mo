import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type Status = { #pending; #approved; #rejected };

  type OldPickupLine = {
    id : Nat;
    text : Text;
    instagramUrl : ?Text;
    reportCount : Nat;
    isSystem : Bool;
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
    isSystem : Bool;
    status : Status;
  };

  type NewActor = {
    pickupLines : Map.Map<Nat, NewPickupLine>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newPickupLines = old.pickupLines.map<Nat, OldPickupLine, NewPickupLine>(
      func(_id, oldLine) {
        { oldLine with status = #approved };
      },
    );
    { old with pickupLines = newPickupLines };
  };
};
