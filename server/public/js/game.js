var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'THE DEFENDERS',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
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
    pixelArt: false,
    roundPixels: true
};

var game = new Phaser.Game(config);