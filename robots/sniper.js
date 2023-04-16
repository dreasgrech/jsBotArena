import {
    distance,
    moveToTarget,
    moveAwayFromTarget,
    bullets
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

export function sniperBehavior(robot, robots, arenaWidth, arenaHeight, timeDelta, allowSwitch = true) {
    const minShootingDistance = 250;
    const maxShootingDistance = 500;

    const { closestRobot, closestDistance } = findClosestRobot(robot, robots);

    if (closestRobot) {
        if (closestDistance < minShootingDistance) {
            moveAwayFromTarget(robot, closestRobot, robot.speed, timeDelta);
        } else if (closestDistance > maxShootingDistance) {
            moveToTarget(robot, closestRobot, robot.speed, timeDelta);
        } else {
            robot.shoot(bullets);
        }
    }
}
