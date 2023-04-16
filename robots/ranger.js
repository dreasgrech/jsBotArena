import {
    distance,
    moveToTarget,
	bullets
} from './../constants.js';

function findFurthestRobot(robot, robots) {
    let furthestRobot = null;
    let furthestDistance = 0;

    for (const otherRobot of robots) {
        if (otherRobot === robot) {
            continue;
        }

        const currentDistance = distance(robot.x, robot.y, otherRobot.x, otherRobot.y);

        if (currentDistance > furthestDistance) {
            furthestDistance = currentDistance;
            furthestRobot = otherRobot;
        }
    }

    return { furthestRobot, furthestDistance };
}

export function rangerBehavior(robot, robots, arenaWidth, arenaHeight, timeDelta, allowSwitch = true) {
    const speed = 50;
    const minShootingDistance = 150;
    const maxShootingDistance = 300;

    if (!robot.target || allowSwitch) {
        const { furthestRobot } = findFurthestRobot(robot, robots);
        if (furthestRobot) {
            robot.target = furthestRobot;
        }
    }

    if (robot.target) {
        const targetDistance = distance(robot.x, robot.y, robot.target.x, robot.target.y);
        if (targetDistance > maxShootingDistance) {
            moveToTarget(robot, robot.target, speed, timeDelta);
        } else if (targetDistance < minShootingDistance) {
            moveAwayFromTarget(robot, robot.target, speed, timeDelta);
        }
    }
}
