"use strict";

const RobotQueries = (function() {
    const robotQueries = {
        isRobotMoving: robotIndex => {
            const robotSpeedSqr = RobotsData_CurrentData_currentRobotSpeedSqr[robotIndex];
            return robotSpeedSqr > 0.001;
        }
    };
    return robotQueries;
}());
