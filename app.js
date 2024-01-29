let phase = "waiting";
let lasTimestamp;
let CharacterX;
let CharacterY;
let sceneOffset;
let GamePlatform = []
let bridges = [];
let tree = [];
let score = 0;
const canvaWidth = 375;
const canvaHeight = 375;
const GamePlatformHeight = 100;
const CharacterDistanceEdge = 10;
const paddingX = 100;
const perfectAreaSize = 10;
const backgroundSpeedMultiplier = 0.2;
const hill1BaseHeight = 100;
const hill1Amplitude = 10;
const hill1Stretch = 1;
const hill2BaseHeight = 70;
const hill2Amplitude = 20;
const  hill2Stretch = 0.5;
const stretchingSpeed = 4;
const turningSpeed = 4;
const walkingSpeed = 4;
const transitioningSpeed = 2;
const fallingSpeed = 1;
const CharacterWidth = 17;
const CharacterHeight = 30;
const canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('game');
const introductionElement = document.getElementById('introduction');
const perfectElement = document.getElementById('perfect');
const restartButton = document.getElementById('restart');
const scoreElement = document.getElementById('score');
Array.prototype.last = function(){
    return this[this.length - 1];
};

Math.sinus = function(degree){
    return Math.sin((degree / 180) * Math.PI);
}
resetGame();
function resetGame(){
    phase  = 'waiting';
    lasTimestamp = undefined;
    sceneOffset = 0;
    score = 0;
    introductionElement.style.opacity = 1;
    perfectElement.style.opacity = 1;
    restartButton.style.display = 'none';
    scoreElement.innerText = score;
    GamePlatform = [{x: 50, w: 50}];
    generatePlatform();
    generatePlatform();
    generatePlatform();
    generatePlatform();
    bridges = [{x: GamePlatform[0].x + GamePlatform[0].w, length: 0, rotation: 0 }]
    tree = [];
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    generateTree();
    CharacterX = GamePlatform[0].x + GamePlatform[0].w - CharacterDistanceEdge;
    CharacterY = 0;
    draw();
}
function generateTree(){
    const minimumGap = 50;
    const maximumGap = 170;

    const lastTree = tree[tree.length - 1];
    let furthestX = lastTree ? lastTree.x : 0;

    const x = 
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));


    const treColors = ["#558b2f", "#43a04", '#76ff03'];
    const color = treColors[Math.floor(Math.random() * 3)];

} 

function generatePlatform(){
    const minimumGap = 40;
    const maximumGap = 200;
    const minimumWidth = 20;
    const maximumWidth = 100;

    const lastPlatform = GamePlatform[GamePlatform.length - 1];
    let furthestX = lastPlatform.x + lastPlatform.w;

    const x = 
    furthestX + 
    minimumGap + 
    Math.floor(Math.random() * (maximumGap - minimumGap));
    const w = 
    minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

    GamePlatform.push({x, w});
}

resetGame();


window.addEventListener('keydown', function(event){
    if(event.key == " "){
        event.preventDefault();
        resetGame();
        return;
    };
});

window.addEventListener('mousedown', function(event){
    if(phase == "waiting"){
        lasTimestamp = undefined;
        introductionElement.style.opacity = 0;
        phase = 'streching';
        this.window.requestAnimationFrame(animate)
    }
});

window.addEventListener('mousedown', function(event){
    if(phase == 'streching'){
        phase = "turning";
    };
});

window.addEventListener('resize', function(){
    canvas.width = this.window.innerWidth;
    canvas.height = this.window.innerHeight;
    draw();

});


window.requestAnimationFrame(animate);

function animate(timestamp){
    if(!lasTimestamp){
        lasTimestamp = timestamp;
        window.requestAnimationFrame(animate);
        return;
    }
    switch (phase){
        case 'waiting':
            return;
        case 'stretching':{
            bridges.last().length += (timestamp - lasTimestamp) / stretchingSpeed;
            break;
        }
        case 'turning': {
            bridges.last().rotation += (timestamp - lasTimestamp) / turningSpeed;

            if(bridges.last().rotation > 90){
                bridges.last().rotation = 90;

                const [nextPLatform, perfectHit] = thePlatformTheStickhHits();
                if(nextPLatform){
                    score += perfectHit ? 2: 1;
                    scoreElement.innerText = score;

                    if(perfectHit){
                        perfectElement.style.opacity = 1;
                        setTimeout(()=>(perfectElement.style.opacity = 0), 1000);
                    }
                    generatePlatform();
                    generateTree();
                    generateTree();

                }
                phase = 'walking';
            }
            break;
        }
        case 'walking': {
            CharacterX += (timestamp - lasTimestamp) / walkingSpeed;
            const [nextPLatform]  = thePlatformTheStickhHits();
            if(nextPLatform){
                const maxHeroX = nextPLatform.x + nextPLatform.w - CharacterDistanceEdge;
                if(CharacterX > maxHeroX){
                    CharacterX = maxHeroX;
                    phase = 'transitioning';
                }else{
                    const maxHeroX = bridges.last().x + bridges.last().length + CharacterWidth;
                    if(CharacterX > maxHeroX){
                        CharacterX = maxHeroX;
                        phase = 'failaing';
                    }
                }
            }
            break;
        }
        case 'transitioning' :{
            sceneOffset += (timestamp = lasTimestamp) / transitioningSpeed;
            const [nextPLatform] = thePlatformTheStickhHits();
            if(sceneOffset > nextPLatform.x + nextPLatform.w - paddingX){
                bridges.push({
                    x: nextPLatform.x + nextPLatform.w,
                    length: 0,
                    rotation: 0
                });
                phase = "waiting";
            }
            break;
        }
        case 'falling': {
            if(bridges.last().rotation < 100)
            bridges.last().rotation += (timestamp - lasTimestamp) / turningSpeed;
            CharacterY += (timestamp - lasTimestamp) / fallingSpeed;
            const maxHeroY = 
            GamePlatformHeight + 100 + (window.innerHeight - canvaHeight) / 2;
            if(CharacterY > maxHeroY){
                restartButton.style.display = "black";
                return;
            }
            break;
        }
        default:
            throw Error("Wrong phase");
    }
    draw();
    window.requestAnimationFrame(animate);
    lasTimestamp = timestamp;
};

function thePlatformTheStickhHits(){
    
};