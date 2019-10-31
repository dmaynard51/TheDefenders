var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 576,
    physics: {
        default: 'arcade',
    },
    scene: [
        SceneMainMenu,
        SceneMain,
        SceneGameOver
    ],
    pixelArt: true,
    roundPixels: true
};

var game = new Phaser.Game(config);