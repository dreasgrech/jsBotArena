import {
    distance,
	moveToTarget,
	moveAwayFromTarget
} from './../constants.js';

function findClosestRobot(robot, robots) {
    let closestRobot = null;
    let closestDistance = Infinity;

    for (const otherRobot of robots) {
        if (otherRobot === robot) {
            continue;
        }

        const currentDistance = distance(robot.x, robot.y, otherRobot.x, otherRobot.y);

        if (currentDistance < closestDistance) {
            closestDistance = currentDistance;
            closestRobot = otherRobot;
        }
    }

    return { closestRobot, closestDistance };
}

export function distractorBehavior(robot, robots, arenaWidth, arenaHeight, timeDelta, allowSwitch = true) {
    const distractionDistance = 100;
    const { closestRobot, closestDistance } = findClosestRobot(robot, robots);

    if (closestRobot) {
        if (closestDistance > distractionDistance) {
            moveToTarget(robot, closestRobot, robot.speed, timeDelta);
        } else {
            moveAwayFromTarget(robot, closestRobot, robot.speed, timeDelta);
        }
    }
}

