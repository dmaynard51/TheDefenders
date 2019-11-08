var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 576,
    physics: {
        default: 'arcade',
    },
    scene: [
        SceneMainMenu,
        SceneLevel1,
        level1Trans,
        SceneLevel2,
        level2Trans,
        SceneLevel3,
        SceneVictory,
        SceneGameOver
    ],
    pixelArt: true,
    roundPixels: true
};

var game = new Phaser.Game(config);