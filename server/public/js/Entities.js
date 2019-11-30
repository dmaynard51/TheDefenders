class Entity extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, key, type) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enableBody(this, 0);
        this.setData('type', type);
        this.setData('isDead', false);
    }

    explode(canDestroy) {
        if (!this.getData('isDead')) {
            // Set the texture to the explosion image, then play the animation
            this.setTexture('sprExplosion');  // this refers to the same animation key we used when we added this.anims.create previously
            this.play('sprExplosion'); // play the animation
            // pick a random explosion sound within the array we defined in this.sfx in SceneMain
            this.scene.sfx.explosions[Phaser.Math.Between(0, this.scene.sfx.explosions.length - 1)].play();
            if (this.shootTimer !== undefined) {
                if (this.shootTimer) {
                 this.shootTimer.remove(false);
                }
            }
            this.setAngle(0);
            this.body.setVelocity(0, 0);
            this.on('animationcomplete', function() {
                if (canDestroy) {
                    this.destroy();
                }
                else {
                    this.setVisible(false);
                }
            }, this);
            this.setData('isDead', true);
        }
    }
}

class Player extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, 'Player');
        this.setData('speed', 200);
        this.setData('isShooting', false);
        this.setData('timerShootDelay', 10);
        this.setData('timerShootTick', this.getData('timerShootDelay') - 1);
    }

    // player movement
    moveLeft() {
        this.body.velocity.x = -this.getData('speed');
    }
    moveRight() {
        this.body.velocity.x = this.getData('speed');
    }

    onDestroy() {
        this.scene.time.addEvent({ // go to game over scene
            delay: 1000,
            callback: function() {
                this.scene.scene.start('SceneGameOver');
            },
            callbackScope: this,
            loop: false
        });
    }

    update() {
        this.body.setVelocity(0, 0);  //

        //
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);

        if (this.getData('isShooting')) {
            if (this.getData('timerShootTick') < this.getData('timerShootDelay')) {
                this.setData('timerShootTick', this.getData('timerShootTick') + 1); // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
            }
            else { // when the 'manual timer' is triggered:
                var laser = new PlayerLaser(this.scene, this.x, this.y);
                this.scene.playerLasers.add(laser);
                this.scene.sfx.laser.play(); // play the laser sound effect
                this.setData('timerShootTick', 0);
            }
        }
    }
}

class PlayerLaser extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprLaserPlayer');
        this.body.velocity.y = -200;
    }
}

class EnemyLaser extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprLaserEnemy0');
        this.body.velocity.y = 200;
    }
}

class BasicShip extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprEnemy2', 'BasicShip');
        this.play('sprEnemy2');

        this.body.velocity.y = 100;
    }
}

class SpeederShip extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprEnemy1', 'SpeederShip');
        this.play('sprEnemy1');

        this.body.velocity.y = 200;
    }
}

class GunnerShip extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'sprEnemy0', 'GunnerShip');
        this.play('sprEnemy0');

        this.body.velocity.y = 75;

        this.shootTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: function() {
                var laser = new EnemyLaser(
                    this.scene,
                    this.x,
                    this.y
                );
                laser.setScale(this.scaleX);
                this.scene.enemyLasers.add(laser);
            },
            callbackScope: this,
            loop: true
        });
    }

    onDestroy() {
        if (this.shootTimer !== undefined) {
            if (this.shootTimer) {
                this.shootTimer.remove(false);
            }
        }
    }
}

class Turret1 extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'probe1', 'Turret');

        this.setData('isShooting', false);
        this.setData('timerShootDelay', 10);
        this.setData('timerShootTick', this.getData('timerShootDelay') - 1);
    }

    place(i, j) {
        this.y = i * 64 + 64/2;
        this.x = j * 64 + 64/2;
        map[i][j] = 1;
    }

    onDestroy() {
        this.setData('isShooting', false);
    }    
    
    update() {
        this.body.setVelocity(0, 0);

        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);

        if (this.getData('isShooting')) {
            if (this.getData('timerShootTick') < this.getData('timerShootDelay')) {
                this.setData('timerShootTick', this.getData('timerShootTick') + 1);
            }
            else {
                var rotateleft = -30;
                var rotateright = 30;
                var laser = new PlayerLaser(this.scene, this.x, this.y);
                this.scene.playerLasers.add(laser);
                
                if (this.scene.axis ==0) {
                    this.scene.axisIncrease += 10;
                    
                    if (this.scene.axisIncrease == 30) {
                        this.scene.axis = 1;
                    }
                }
                else {
                    this.scene.axisIncrease -= 10;
                    
                    if (this.scene.axisIncrease == -30) {
                        this.scene.axis = 0;
                    }
                } 

                laser.body.velocity.x = this.scene.axisIncrease;
                this.scene.sfx.laser.play();
                this.setData('timerShootTick', 0);
            }
        }
    }
}


class Turret2 extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'probe2', 'Turret');

        this.setData('isShooting', false);
        this.setData('timerShootDelay', 10);
        this.setData('timerShootTick', this.getData('timerShootDelay') - 1);
    }

    place(i, j) {
        this.y = i * 64 + 64/2;
        this.x = j * 64 + 64/2;
        map[i][j] = 1;
    }

    onDestroy() {
        this.setData('isShooting', false);
    }    
    
    update() {
        this.body.setVelocity(0, 0);

        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);

        if (this.getData('isShooting')) {
            if (this.getData('timerShootTick') < this.getData('timerShootDelay')) {
                this.setData('timerShootTick', this.getData('timerShootTick') + 1);
            }
            else {
                var rotateleft = -30;
                var rotateright = 30;
                var laser = new PlayerLaser(this.scene, this.x, this.y);
                this.scene.playerLasers.add(laser);
                
                if (this.scene.axis ==0) {
                    this.scene.axisIncrease += 10;
                    
                    if (this.scene.axisIncrease == 30) {
                        this.scene.axis = 1;
                    }
                }
                else {
                    this.scene.axisIncrease -= 10;
                    
                    if (this.scene.axisIncrease == -30) {
                        this.scene.axis = 0;
                    }
                } 

                laser.body.velocity.x = this.scene.axisIncrease;
                this.scene.sfx.laser.play();
                this.setData('timerShootTick', 0);
            }
        }
    }
}


class Turret3 extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'probe3', 'Turret');

        this.setData('isShooting', false);
        this.setData('timerShootDelay', 10);
        this.setData('timerShootTick', this.getData('timerShootDelay') - 1);
    }

    place(i, j) {
        this.y = i * 64 + 64/2;
        this.x = j * 64 + 64/2;
        map[i][j] = 1;
    }

    onDestroy() {
        this.setData('isShooting', false);
    }    
    
    update() {
        this.body.setVelocity(0, 0);

        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);

        if (this.getData('isShooting')) {
            if (this.getData('timerShootTick') < this.getData('timerShootDelay')) {
                this.setData('timerShootTick', this.getData('timerShootTick') + 1);
            }
            else {
                var rotateleft = -30;
                var rotateright = 30;
                var laser = new PlayerLaser(this.scene, this.x, this.y);
                this.scene.playerLasers.add(laser);
                
                if (this.scene.axis ==0) {
                    this.scene.axisIncrease += 10;
                    
                    if (this.scene.axisIncrease == 30) {
                        this.scene.axis = 1;
                    }
                }
                else {
                    this.scene.axisIncrease -= 10;
                    
                    if (this.scene.axisIncrease == -30) {
                        this.scene.axis = 0;
                    }
                } 

                laser.body.velocity.x = this.scene.axisIncrease;
                this.scene.sfx.laser.play();
                this.setData('timerShootTick', 0);
            }
        }
    }
}

class Tower extends Entity {
    constructor(scene, x, y, key) {
        super(scene, x, y, key, 'Tower');
    }
}