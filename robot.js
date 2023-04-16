import { ROBOT_SIZE, ROBOT_RADIUS, BULLET_SPEED, BULLET_SIZE } from './constants.js';

export class Robot {
    constructor(x, y, color, behavior, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = 0;
        this.health = 100;
        this.turretLength = ROBOT_SIZE / 2;
        this.behavior = behavior;
        this.speed = speed;
        this.lastTargetSwitchTime = Date.now();
        this.target = null;
    }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillStyle = this.color;
    ctx.fillRect(-ROBOT_SIZE / 2, -ROBOT_SIZE / 2, ROBOT_SIZE, ROBOT_SIZE);
    ctx.fillStyle = 'black';
    ctx.fillRect(ROBOT_SIZE / 4, -ROBOT_SIZE / 4, this.turretLength, ROBOT_SIZE / 2);
    ctx.restore();
  }

  hit(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      console.log('Robot destroyed!');
    }
  }

  shoot(bullets) {
    const bullet = new Bullet(this.x, this.y, this.angle);
    bullets.push(bullet);
  }
}

export function wander(robot, robots, arenaWidth, arenaHeight, timeDelta) {
  const angleDelta = Math.PI / 64;
  robot.angle += (Math.random() - 0.5) * angleDelta;
  robot.x += Math.cos(robot.angle) * speed * timeDelta;
  robot.y += Math.sin(robot.angle) * speed * timeDelta;

  // Check for collision with arena boundaries
  if (robot.x < ROBOT_RADIUS) {
    robot.x = ROBOT_RADIUS;
    robot.angle += Math.PI;
  } else if (robot.x > arenaWidth - ROBOT_RADIUS) {
    robot.x = arenaWidth - ROBOT_RADIUS;
    robot.angle += Math.PI;
  }
  if (robot.y < ROBOT_RADIUS) {
    robot.y = ROBOT_RADIUS;
    robot.angle += Math.PI;
  } else if (robot.y > arenaHeight - ROBOT_RADIUS) {
    robot.y = arenaHeight - ROBOT_RADIUS;
    robot.angle += Math.PI;
  }

  // Check for collision with other robots
  for (let otherRobot of robots) {
    if (otherRobot === robot) {
      continue;
    }
    const distance = Math.sqrt((robot.x - otherRobot.x) ** 2 + (robot.y - otherRobot.y) ** 2);
    if (distance < ROBOT_RADIUS * 2) {
      const angleToOtherRobot = Math.atan2(otherRobot.y - robot.y, otherRobot.x - robot.x);
      const angleDiff = angleToOtherRobot - robot.angle;
      if (angleDiff > Math.PI) {
        robot.angle += angleDelta;
      } else {
        robot.angle -= angleDelta;
      }
    }
  }
}

export class Bullet {
    constructor(x, y, angle, firedBy) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.firedBy = firedBy;
  }

  move() {
    this.x += Math.cos(this.angle) * BULLET_SPEED;
    this.y += Math.sin(this.angle) * BULLET_SPEED;
  }

  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.x, this.y, BULLET_SIZE, 0, 2 * Math.PI);
    ctx.fill();
  }
}
