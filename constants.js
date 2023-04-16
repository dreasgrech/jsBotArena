export const BULLET_SIZE = 5;
export const BULLET_SPEED = 1;
export const BULLET_DAMAGE = 10;

export const ROBOT_SIZE = 50;
export const ROBOT_RADIUS = ROBOT_SIZE / 2;

export const SHOOTING_RANGE = 100;
export const SHOT_COOLDOWN = 25;
export const TARGET_SWITCH_COOLDOWN = 1000; // in milliseconds


// ---------
export const robots = [];
export const bullets = [];
// ---------

export function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export function moveToTarget(robot, target, speed, timeDelta) {
    const targetAngle = Math.atan2(target.y - robot.y, target.x - robot.x);

    robot.angle = targetAngle;
    robot.x += Math.cos(robot.angle) * speed * timeDelta;
    robot.y += Math.sin(robot.angle) * speed * timeDelta;
}

export function moveAwayFromTarget(robot, target, speed, timeDelta) {
    const targetAngle = Math.atan2(robot.y - target.y, robot.x - target.x);

    robot.angle = targetAngle;
    robot.x += Math.cos(robot.angle) * speed * timeDelta;
    robot.y += Math.sin(robot.angle) * speed * timeDelta;
}

