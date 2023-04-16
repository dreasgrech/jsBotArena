import {
    distance,
	bullets,
	moveToTarget
} from './../constants.js';

function findLowestHealthRobot(robot, robots) {
    let lowestHealthRobot = null;
    let lowestHealth = Infinity;

    for (const otherRobot of robots) {
        if (otherRobot === robot) {
            continue;
        }

        if (otherRobot.health < lowestHealth) {
            lowestHealth = otherRobot.health;
            lowestHealthRobot = otherRobot;
        }
    }

    return lowestHealthRobot;
}

export function medicBehavior(robot, robots, arenaWidth, arenaHeight, timeDelta, bullets, allowSwitch = true) {
    const targetRobot = findLowestHealthRobot(robot, robots);

    if (targetRobot) {
        moveToTarget(robot, targetRobot, robot.speed, timeDelta);

        const healingDistance = 50;
        if (distance(robot.x, robot.y, targetRobot.x, targetRobot.y) <= healingDistance) {
            targetRobot.health += robot.healingRate * timeDelta;
        }
    }
}

