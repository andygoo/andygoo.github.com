function Point3d(a, c, b) {
    this.x = (a === undefined) ? 0 : a;
    this.y = (c === undefined) ? 0 : c;
    this.z = (b === undefined) ? 0 : b;
    this.fl = 400;
    this.vpX = 0;
    this.vpY = 0;
    this.cX = 0;
    this.cY = 0;
    this.cZ = 0
}
Point3d.prototype = {
    setVanishingPoint: function (b, a) {
        this.vpX = b;
        this.vpY = a
    },
    setCenter: function (c, b, a) {
        this.cX = c;
        this.cY = b;
        this.cZ = a
    },
    rotateX: function (a) {
        var d = Math.cos(a),
            b = Math.sin(a),
            c = this.y * d - this.z * b,
            e = this.z * d + this.y * b;
        this.y = c;
        this.z = e;
        return this
    },
    rotateY: function (a) {
        var d = Math.cos(a),
            c = Math.sin(a),
            b = this.x * d - this.z * c,
            e = this.z * d + this.x * c;
        this.x = b;
        this.z = e;
        return this
    },
    rotateZ: function (a) {
        var d = Math.cos(a),
            b = Math.sin(a),
            c = this.x * d - this.y * b,
            e = this.y * d + this.x * b;
        this.x = c;
        this.y = e;
        return this
    },
    getScreenX: function () {
        var a = this.fl / (this.fl + this.z + this.cZ);
        return this.vpX + (this.cX + this.x) * a
    },
    getScreenY: function () {
        var a = this.fl / (this.fl + this.z + this.cZ);
        return this.vpY + (this.cY + this.y) * a
    }
};
var points = [];


/*//////////////////////////////////////////////////////////////////*/
///*this is where it calculates all of the point information*////
/*//////////////////////////////////////////////////////////////////*/

function makepoints() {
    points = [];
   
    var byv = data.split('v').filter(Boolean);
    points = byv.map(function (e) {
        var cp = '';
        var byspace = e.split(' ').filter(Boolean).map(function(g){if(!/\d+/.test(g)){cp += g;return "";}else {var p = cp; cp = ""; return p+g;}}).filter(Boolean); 
        return new Point3d(parseFloat(byspace[0]), parseFloat(byspace[1]), parseFloat(byspace[2]));
    });
    var x=0,y=0,z=0;
    points.forEach(function(e){x+=e.x;y+=e.y;z+=e.z;});
    x=x/points.length;
y=y/points.length;
    z=z/points.length;
    points = points.map(function(e){return new Point3d((x-e.x)*10,(y-e.y)*10,(z-e.z)*10);});
    
    
}

/*//////////////////////////////////////////////////////////////////*/
///*ends here*////
/*//////////////////////////////////////////////////////////////////*/


var last;

function displaypoints(b) {
    var p = (((b.z + 250) / 800 * -1) + 0.5).toFixed(2);
    if (last !== p) {
        context.fillStyle = "rgba(0,0,0,255)";
        last = p;
    }
    context.fillRect(b.getScreenX(), b.getScreenY(), 2, 2);

}
var can = document.createElement("canvas");
can.width = parseInt(getComputedStyle(document.body).width);
can.height = parseInt(getComputedStyle(document.body).height);
var context = can.getContext("2d");
document.body.appendChild(can);
var mousex = 250,
    mousey = 250;

function displayer() {

    context.clearRect(0, 0, can.width, can.height);
    points.forEach(function (a) {
        a.rotateX((mousey - a.vpY) * 0.0001).rotateY((mousex - a.vpX) * 0.0001);
        a.setVanishingPoint(parseInt(can.width/2), parseInt(can.height/2));
        a.setCenter(a.x, a.y, 100);
    });
    points.sort(function (a, b) {
        return a.z - b.z;
    }).forEach(displaypoints);
    requestAnimationFrame(displayer);
}
requestAnimationFrame(displayer);
document.body.onmousemove = function (a) {
    mousex = a.pageX;
    mousey = a.pageY;
};
makepoints();