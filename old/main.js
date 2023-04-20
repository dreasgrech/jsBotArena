import {
    ROBOT_SIZE,
    SHOOTING_RANGE,
    ROBOT_RADIUS,
    BULLET_DAMAGE,
    BULLET_SIZE,
    SHOT_COOLDOWN,
    TARGET_SWITCH_COOLDOWN,	
    distance,
	robots,
	bullets
} from './constants.js';
import {
    Robot,
    Bullet,
    wander
} from './robot.js';
import { shredderBehavior } from './robots/shredder.js';
import { rangerBehavior } from './robots/ranger.js';
import { sniperBehavior } from './robots/sniper.js';
import { medicBehavior } from './robots/medic.js';
import { distractorBehavior } from './robots/distractor.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let currentRobotIndex = 0;
let lastShotTime = Date.now() + SHOT_COOLDOWN;

const ARENA_WIDTH = canvas.width;
const ARENA_HEIGHT = canvas.height;

function drawArena() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const canvasX = centerX - ARENA_WIDTH / 2;
    const canvasY = centerY - ARENA_HEIGHT / 2;
    canvas.style.left = canvasX + 'px';
    canvas.style.top = canvasY + 'px';
}

for (let i = 0; i < 10; i++) {
    let x, y;
    let overlapping = true;
    while (overlapping) {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
        overlapping = false;
        for (let j = 0; j < robots.length; j++) {
            const otherRobot = robots[j];
            if (distance(x, y, otherRobot.x, otherRobot.y) < ROBOT_SIZE * 2) {
                overlapping = true;
                break;
            }
        }
    }
    let color = `rgb(${Math.random() * 256},${Math.random() * 256},${Math.random() * 256})`;
    // let behavior = i < 5 ? shredderBehavior : rangerBehavior;
	let robotSpeed = 10
    let behavior = rangerBehavior;
    let robot = new Robot(x, y, color, behavior, robotSpeed);
    robots.push(robot);
}

let lastUpdateTime = Date.now();

function update() {
    // Calculate time since last update
    const currentTime = Date.now();
    const timeDelta = (currentTime - lastUpdateTime) / 1000;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the arena
    drawArena();

    // Update and draw the robots
    for (let i = 0; i < robots.length; i++) {
        const robot = robots[i];
        if (Date.now() - robot.lastTargetSwitchTime >= TARGET_SWITCH_COOLDOWN) {
            robot.behavior(robot, robots, ARENA_WIDTH, ARENA_HEIGHT, timeDelta);
            robot.lastTargetSwitchTime = Date.now();
        } else {
            robot.behavior(robot, robots, ARENA_WIDTH, ARENA_HEIGHT, timeDelta, false);
        }
        robot.draw(ctx);
        if (robot.health <= 0) {
            robots.splice(i, 1);
            i--;
        }

        // Check for collision with other robots
        for (let j = i + 1; j < robots.length; j++) {
            const otherRobot = robots[j];
            if (distance(robot.x, robot.y, otherRobot.x, otherRobot.y) < ROBOT_SIZE) {
                // Collision detected, reverse direction
                robot.angle += Math.PI;
                otherRobot.angle += Math.PI;
            }
        }

        // Check for collision with walls
        if (robot.x < ROBOT_SIZE / 2) {
            robot.x = ROBOT_SIZE / 2;
            robot.angle += Math.PI;
        } else if (robot.x > ARENA_WIDTH - ROBOT_SIZE / 2) {
            robot.x = ARENA_WIDTH - ROBOT_SIZE / 2;
            robot.angle += Math.PI;
        }
        if (robot.y < ROBOT_SIZE / 2) {
            robot.y = ROBOT_SIZE / 2;
            robot.angle += Math.PI;
        } else if (robot.y > ARENA_HEIGHT - ROBOT_SIZE / 2) {
            robot.y = ARENA_HEIGHT - ROBOT_SIZE / 2;
            robot.angle += Math.PI;
        }
    }

    // Update and draw the bullets
    let i = -1;
    for (let bullet of bullets) {
        i++;
        bullet.move();
        bullet.draw(ctx);
        if (bullet.x < 0 || bullet.x > ARENA_WIDTH || bullet.y < 0 || bullet.y > ARENA_HEIGHT) {
            bullets.splice(i, 1);
            continue;
        }
        for (let robot of robots) {
            // Skip the current robot that fired the bullet
            if (robot === bullet.firedBy) {
                continue;
            }
            if (distance(robot.x, robot.y, bullet.x, bullet.y) < ROBOT_RADIUS) {
                robot.hit(BULLET_DAMAGE);
                bullets.splice(i, 1);
                break;
            }
        }
    }

    // Increment the current robot index
    currentRobotIndex++;
    if (currentRobotIndex >= robots.length) {
        currentRobotIndex = 0;
    }

    // Update the last update time
    lastUpdateTime = currentTime;

    // Call update function again using requestAnimationFrame
    requestAnimationFrame(update);
}

function shootCurrentRobot() {
    if (Date.now() - lastShotTime > SHOT_COOLDOWN) {
        const robot = robots[currentRobotIndex];
        const bullet = new Bullet(robot.x, robot.y, robot.angle, robot);
        bullets.push(bullet);
        lastShotTime = Date.now();
    }
}

update();
