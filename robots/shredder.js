import {
    moveToTarget
} from './../constants.js';

function findClosestRobot(robot, robots) {
    let closestRobot = null;
    let closestDistance = Infinity;

    for (const otherRobot of robots) {
        if (otherRobot === robot) {
            continue;
        }

        const distance = Math.sqrt((robot.x - otherRobot.x) ** 2 + (robot.y - otherRobot.y) ** 2);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestRobot = otherRobot;
        }
    }

    return { closestRobot, closestDistance };
}

export function shredderBehavior(robot, robots, arenaWidth, arenaHeight, timeDelta, allowSwitch = true) {
    const speed = 100;
    const rammingDistance = 10;

    const { closestRobot, closestDistance } = findClosestRobot(robot, robots);

    if (closestRobot) {
        if (closestDistance > rammingDistance) {
            moveToTarget(robot, closestRobot, speed, timeDelta);
        } else {
            // Ram the target
            robot.angle += Math.PI;
            robot.x += Math.cos(robot.angle) * speed * timeDelta;
            robot.y += Math.sin(robot.angle) * speed * timeDelta;
        }
    }
}
