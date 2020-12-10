const $ = id => document.getElementById(id);
const canvas = $('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
/**@type {CanvasRenderingContext2D} */
const Renderer = canvas.getContext('2d');

class Point {
    constructor(x, y, radius, sinValue){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sinValue = sinValue;
        this.baseY = 300;
        this.sinAddDeno = 2;
    }
    updateY(){
        this.sinValue += Math.random() / this.sinAddDeno;
        this.y = this.baseY + Math.sin(this.sinValue) * 100;
    }
    draw(Renderer){
        Renderer.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        Renderer.fill()
    }
}

class Rect {
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    /**
     * @param {CanvasRenderingContext2D} Renderer 
     */
    draw(Renderer){
        Renderer.globalCompositeOperation = 'xor'
        Renderer.fillRect(this.x, this.y, this.w, this.h)
    }
}
class CollisionRect extends Rect {
    constructor(x, y, w, h){
        super(x, y, w, h)
    }

}
const points = [];
const objects = [];
for(let i=0; i<16; i++){
    points.push(new Point(i * 120, 300, 10, i))
}
for(let i=0; i<1; i++){
    objects.push(new Rect(600, 200, 300, 300))
}
function update(){
    points.forEach(p => p.updateY())
    draw()
    window.requestAnimationFrame(update)
}
function drawWater(){
    if(points.length != 16){
        points.forEach(p => {
            Renderer.beginPath()
            p.draw(Renderer)
            Renderer.closePath()
        })
    } else {
        
        Renderer.save()
        Renderer.beginPath()
        Renderer.moveTo(points[0].x, points[0].y)
        let prevPoint = points[0];
        points.forEach((p, i) => {
            Renderer.quadraticCurveTo(prevPoint.x, prevPoint.y, (p.x + prevPoint.x) / 2, (p.y + prevPoint.y) / 2)
            prevPoint = p;
        })
        Renderer.lineTo(prevPoint.x, prevPoint.y)
        Renderer.lineTo(window.innerWidth, window.innerHeight)
        Renderer.lineTo(0, window.innerHeight)
        Renderer.lineTo(points[0].x, points[0].y)
        Renderer.globalAlpha = 0.4;
        Renderer.fillStyle = 'blue'
        Renderer.fill()
        Renderer.closePath()
        Renderer.restore()
    }
}
let pixels;
function drawObjects(){
    objects.forEach(o => {
        Renderer.save()
        Renderer.beginPath()
        o.draw(Renderer)
        pixels = getAreaPixel(o.x, o.y, o.w, o.h);
        
        Renderer.closePath()
        Renderer.restore()
    })
}
function getAreaPixel(x, y, w, h){
    return Renderer.getImageData(x, y, w, h).data;
}
function draw(){
    Renderer.clearRect(0, 0, window.innerWidth, window.innerHeight)
    drawWater()
    drawObjects()
}
function getDistance(x, y, x1, y1){
    return Math.sqrt((x1 - x) ** 2 + (y1 - y) ** 2);
}
function getNearestPoint(x, y){
   return points.reduce((res, p) => getDistance(x, y, p.x, p.y) > getDistance(x, y, res.x, res.y) ? res : p, )
}
/*
canvas.addEventListener('mousedown', e => {
    const nearest = getNearestPoint(e.pageX, e.pageY);
})
*/
setTimeout(() => console.log(pixels), 1000)
requestAnimationFrame(update)