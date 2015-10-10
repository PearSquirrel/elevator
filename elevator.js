{
    init: function(elevators, floors) {
        elevators.forEach(function(elevator) {
            elevator.goingTo = function(floorNum) {
                return elevator.destinationQueue.some(function(f) { return f == floorNum;})
            };
        });
 
        elevators.goingTo = function(floorNum) {
            return elevators.some(function(elevator) {return elevator.goingTo(floorNum); });
        }
    
        elevators.leastActiveElevator = function() {
            e = elevators[0];
            elevators.forEach(function(elevator) {
                if (elevator.destinationQueue.length < e.destinationQueue.length) {
                    e = elevator;
                }
            });
            return e;
        }
 
        elevators.forEach(function(elevator) {
            elevator.on("idle", function() {
                elevator.goToFloor(0);
            });
    
            elevator.on("floor_button_pressed", function(floorNum) {
                if (!elevator.goingTo(floorNum)) {
                    elevator.goToFloor(floorNum);
                }
             });

            elevator.on("passing_floor", function(floorNum, direction) {
                if (elevator.goingTo(floorNum)) {
                    elevator.destinationQueue = elevator.destinationQueue.filter(function(f) {return f != floorNum;});
                    elevator.goToFloor(floorNum, true);
                }
            });
        });
 
        floors.forEach(function (floor, index, array) {
            floor.on("up_button_pressed", function() {
                if (!elevators.goingTo(floor.floorNum)) {
                    elevators.leastActiveElevator().goToFloor(floor.floorNum());
                }
            });
            floor.on("down_button_pressed", function() {
                if (!elevators.goingTo(floor.floorNum)) {
                    elevators.leastActiveElevator().goToFloor(floor.floorNum());
                }
            });
        });
    },
    update: function(dt, elevators, floors) {}
}
