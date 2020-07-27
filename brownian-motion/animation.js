const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

//basic animation function syntax:
// function animate(){
//     console.log('hello world');
//     //content; eg above
//     requestAnimationFrame(animate);
// }
// animate();

//random function generator
//checked
function random(min, max){
    return Math.floor((min + (max-min)*Math.random()));
}

//compute magnitude
//checked
function magnitudeOf(v){
    return (Math.sqrt(v[0]*v[0] + v[1]*v[1]))
}
//dot product of two vectors
//checked
function dotProduct(v1, v2){
    return (v1[0]*v2[0] + v1[1]*v2[1]);
}

//get unit vector in the direction of the given vector
//checked
function getUnitVector(v){
    let unit = [v[0]/magnitudeOf(v), v[1]/magnitudeOf(v)];
    return unit;
}

//get the projected vector when v1 is projected onto v2
//checked
function projectionOnto(v1, v2){
    let projectedMagnitude = dotProduct(v1,v2) / magnitudeOf(v2);
    let floorVector = getUnitVector(v2);
    let result = multiplyByScalar(floorVector, projectedMagnitude);
    return result;
}

//adds two vectors v1 and v2
//checked
function addVectors(v1,v2){
    let result = [v1[0]+v2[0], v1[1]+v2[1]];
    return result;
}

//multiplies vector 'v' by scalar 'k'
//checked
function multiplyByScalar(v,k){
    let result = [v[0]*k, v[1]*k];
    return result;
}

//get a vector that is normal to given vector 'v'
//checked
function getNormalTo(v){
    let result = [-v[1], v[0]];
    return result;
}

function OneDCollision(m1, m2, v1, v2){
    result = [];
    let scalarDenominator = 1/(m1+m2);
    //for v1New:
    let firstNumer1 = multiplyByScalar(v1,m1-m2);
    let firstNumer2 = multiplyByScalar(v2, 2*m2);
    let numerator1 = addVectors(firstNumer1, firstNumer2);
    let v1New = multiplyByScalar(numerator1,scalarDenominator);

    //for v2New:
    let secondNumer1 = multiplyByScalar(v2,m2-m1);
    let secondNumer2 = multiplyByScalar(v1, 2*m1);
    let numerator2 = addVectors(secondNumer1,secondNumer2);
    let v2New = multiplyByScalar(numerator2, scalarDenominator);

    result.push(v1New);
    result.push(v2New);
    
    return result;
}


//Class:Ball
function Ball(xPos, yPos,velX, velY, radius, color){
    this.x = xPos;
    this.y = yPos;
    this.velX = velX;
    this.velY = velY;
    this.radius = radius;
    this.color = color;
    this.mass = Math.PI * radius * radius;
}

Ball.prototype.move = function(){
    if ((this.x + this.radius) >= width){
        this.velX = -(this.velX);
    }
    if ((this.y + this.radius) >= height){
        this.velY = -(this.velY);
    }
    if ((this.y - this.radius) <= 0){
        this.velY = -(this.velY);
    }
    if ((this.x - this.radius) <= 0){
        this.velX = -(this.velX);
    }
    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.draw = function(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
    ctx.fill();
}


Ball.prototype.collisionDetect = function(){
    for (let x=0; x<balls.length; ++x){
        if (!(this === balls[x])){
            let distance = Math.sqrt( Math.pow(this.x-balls[x].x,2) + Math.pow(this.y-balls[x].y,2))
            let radiusSum = this.radius + balls[x].radius;
            if (distance < radiusSum){
                //Collision mechanism
                let normalVector = [balls[x].x-this.x, balls[x].y-this.y];
                let tangentVector = getNormalTo(normalVector);
                let v1 = [this.velX, this.velY];
                let v2 = [balls[x].velX, balls[x].velY];
                let v1Normal = projectionOnto(v1, normalVector);
                let v2Normal = projectionOnto(v2, normalVector);
                let v1Tangent = projectionOnto(v1, tangentVector);
                let v2Tangent = projectionOnto(v2, tangentVector);
                
                //Tangential component remains same because no force is applied in that direction
                let normalVelocities = OneDCollision(this.mass, balls[x].mass, v1Normal, v2Normal);
                let v1NormalNew = normalVelocities[0];
                let v2NormalNew = normalVelocities[1];

                this.velX = v1NormalNew[0] + v1Tangent[0];
                this.velY = v1NormalNew[1] + v1Tangent[1];

                balls[x].velX = v2NormalNew[0] + v2Tangent[0];
                balls[x].velY = v2NormalNew[1] + v2Tangent[1];
            }
        }
    }
}

//Make balls
let balls = [];
while(balls.length < 7){
    let xCoor = random(0+60,width-60);
    let yCoor = random(0+60,height-60);
    let xVel = random(3,10);
    let yVel = random(3,10);
    let size = random(15,30);
    let color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
    let thisBall = new Ball(xCoor, yCoor, xVel, yVel, size, color); 
    balls.push(thisBall);
}

//animate

function animate(){
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillRect(0,0,width,height);
    for (let i=0; i<balls.length; ++i){
        balls[i].draw();
        balls[i].move();
        balls[i].collisionDetect();
    }
    requestAnimationFrame(animate);
}

animate();

//Make framerate constant ~ 60 fps
