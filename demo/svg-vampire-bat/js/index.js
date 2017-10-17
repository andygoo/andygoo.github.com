"use strict";
console.clear();
var STATES = {
    bat: 'BAT',
    vampire: 'VAMPIRE'
};
var blinkTimeout;
var wiggleTimeout;
var state = STATES.bat;
var transformColors = ['#684756', '#1A1423', '#222222', '#555555']; //, '#890620'
var smokeColorsDark = ['#333', '#444', '#555', '#ccc', '#bbb', '#ddd']; //, '#890620'
var smokeColors = ['#ccc', '#bbb', '#ddd']; //, '#890620'
var SVG = document.getElementById('svg');
//=================
// SETUP
//=================
var transformLength = 100;
// Snap.svg isn't really necessary for this.
// I had bigger plans originally then forgot
// to remove it.
var bat = Snap.select('#bat');
var wingLeft = Snap.select('#wing-left');
var wingRight = Snap.select('#wing-right');
var wingFlaps = Snap.select('#wing-flaps');
var vampire = Snap.select('#vampire');
var lines = Snap.select('#transform-lines');
var head = Snap.select('#head');
var arm = Snap.select('#arm');
var cloak = Snap.select('#cloak');
var cloakMaterial = Snap.select('#material');
var cloakBack = Snap.select('#cloak-back');
var collar = Snap.select('#collar');
var brow = Snap.select('#brow');
var mouth = Snap.select('#mouth');
var shadow = Snap.select('#shadow');
var fingers = [];
for (var i = 1; i <= 4; i++)
    fingers.push(Snap.select('#finger-' + i));
var eyes = {
    left: {
        white: Snap.select('#left-eye-white'),
        pupil: Snap.select('#left-eye-pupil')
    },
    right: {
        white: Snap.select('#right-eye-white'),
        pupil: Snap.select('#right-eye-pupil')
    }
};
var smokeContainer = Snap.select('#smoke');
var smokes = [];
for (var i = 0; i < 3; i++) {
    var smoke = Snap.select('#smoke-' + i);
    for (var j = 0; j < 6; j++) {
        var s = smoke.clone().appendTo(smokeContainer);
        TweenMax.set(s.node, { transformOrigin: (Math.random() * 100) + '% ' + (Math.random() * 100) + '%', css: { x: 110 + Math.random() * 30, opacity: 0, fill: smokeColors[Math.floor(Math.random() * smokeColors.length)] } }); //rotation: Math.random() * 180, 
        smokes.push(s);
    }
}
var transformLines = [];
for (var i = 0; i < 10; i++) {
    var line = Snap.select('#line-' + i);
    transformLines.push(line);
    TweenMax.set(line.node, { css: { strokeWidth: 20, stroke: transformColors[Math.floor(Math.random() * transformColors.length)], strokeDasharray: transformLength + ' ' + line.getTotalLength(), strokeDashoffset: transformLength } });
}
TweenMax.set(bat.node, { y: -60, transformOrigin: '50% 50%' });
TweenMax.set(wingLeft.node, { transformOrigin: '100% 90%', scaleY: 1, scaleX: 0.2 });
TweenMax.set(wingRight.node, { transformOrigin: '0% 90%', scaleY: 1, scaleX: 0.2 });
TweenMax.set(wingFlaps.node, { y: '+=30' });
TweenMax.set(vampire.node, { css: { opacity: 0, transformOrigin: '35% 100%' } });
TweenMax.set(lines.node, { y: '+=20', opacity: 0.8 });
TweenMax.set(head.node, { y: '+=50' });
TweenMax.set(arm.node, { css: { transformOrigin: '10% 70%' } });
TweenMax.set(cloak.node, { css: { transformOrigin: '0% 0%' } });
TweenMax.set(cloakMaterial.node, { x: 90, y: 75 });
TweenMax.set(cloakBack.node, { css: { transformOrigin: '50% -20%' } });
TweenMax.set(collar.node, { css: { transformOrigin: '50% 50%' } });
TweenMax.set(shadow.node, { css: { x: 145, y: 265, opacity: 0.3, transformOrigin: '50% 50%' } });
//=================
// Bat Loop
//=================
var flapSpeed = 0.4;
var batLoop = new TimelineMax({ onComplete: function (d) {
        if (state == STATES.bat) {
            batLoop.play(0);
        }
        else {
            toVampire.play(0);
        }
    } });
batLoop.set(bat.node, { opacity: 1 });
batLoop.add(TweenMax.to(bat.node, flapSpeed / 2, { y: "+=20", ease: Power1.easeInOut }), 0);
batLoop.add(TweenMax.to(bat.node, flapSpeed / 2, { y: "-=20", ease: Power1.easeInOut }), flapSpeed / 2);
batLoop.add(TweenMax.to(wingFlaps.node, flapSpeed / 4, { opacity: "0.5", ease: Power4.easeIn }), 0);
batLoop.add(TweenMax.to(wingFlaps.node, flapSpeed / 4, { opacity: "0", ease: Power4.easeOut }), flapSpeed / 4);
batLoop.add(TweenMax.to(wingLeft.node, flapSpeed / 2, { rotation: "-100deg", scale: 1, ease: Power1.easeInOut }), 0);
batLoop.add(TweenMax.to(wingLeft.node, flapSpeed / 2, { rotation: "0deg", scaleY: 1, scaleX: 0.2, ease: Power1.easeInOut }), flapSpeed / 2);
batLoop.add(TweenMax.to(wingRight.node, flapSpeed / 2, { rotation: "100deg", scale: 1, ease: Power1.easeInOut }), 0);
batLoop.add(TweenMax.to(wingRight.node, flapSpeed / 2, { rotation: "0deg", scaleY: 1, scaleX: 0.2, ease: Power1.easeInOut }), flapSpeed / 2);
batLoop.set(shadow.node, { scale: 0.5, opacity: 0.1 }, 0);
batLoop.to(shadow.node, flapSpeed / 2, { scale: 0.48, opacity: 0.09, ease: Power1.easeInOut }, 0);
batLoop.to(shadow.node, flapSpeed / 2, { scale: 0.5, opacity: 0.1, ease: Power1.easeInOut }, flapSpeed / 2);
//=================
// Bat To Vampire
//=================
var toVampire = new TimelineMax({ onComplete: function () { blink(); wiggleFingers(); } });
var batSpeed = 0.3;
for (var i = 0; i < 10; i++) {
    var duration = 2.5;
    var delay = batSpeed * (1.5 + (Math.random() / 2));
    toVampire.fromTo(transformLines[i].node, duration, { css: { strokeWidth: 1 } }, { css: { strokeWidth: 1, strokeDashoffset: -transformLines[i].getTotalLength() }, ease: Power4.easeOut }, delay);
    toVampire.fromTo(transformLines[i].node, duration / 3, { css: { opacity: 0 } }, { css: { opacity: 1 }, ease: Power4.easeIn }, delay);
    toVampire.to(transformLines[i].node, (duration / 3) * 2, { css: { opacity: 0 }, ease: Power4.easeOut }, delay + duration / 3);
}
for (var i = 0; i < smokes.length; i++) {
    var delay = (batSpeed * 2) + Math.random() / 5;
    toVampire.set(smokes[i].node, { opacity: 0.5 + Math.random() * 0.5, scale: 0.35 + Math.random(), y: 80 + (delay * 10), fill: smokeColorsDark[Math.floor(Math.random() * smokeColorsDark.length)] }, delay);
    toVampire.to(smokes[i].node, batSpeed * 4, { y: 250, scale: 2.5, rotation: -180 + Math.random() * 360, opacity: 0, ease: Power3.easeOut }, delay);
}
toVampire.to(shadow.node, batSpeed * 1.5, { scale: 0.3, opacity: 0.05, ease: Power1.easeOut }, 0);
toVampire.to('.info', 0.3, { opacity: 0 }, 0);
toVampire.to(bat.node, batSpeed, { y: -130, rotation: -10, ease: Power1.easeOut }, 0);
toVampire.to(wingLeft.node, batSpeed * 0.8, { rotation: "-50deg", scale: 1, ease: Power2.easeOut }, 0);
toVampire.to(wingRight.node, batSpeed * 0.8, { rotation: "50deg", scale: 1, ease: Power2.easeOut }, 0);
toVampire.to(bat.node, batSpeed * 1.5, { y: 40, rotation: 0, x: "-=10", scaleY: 2, ease: Power1.easeIn }, batSpeed);
toVampire.to(wingLeft.node, batSpeed * 1.2, { rotation: "0deg", scaleY: 0.6, scaleX: 0.2, ease: Power4.easeIn }, batSpeed);
toVampire.to(wingRight.node, batSpeed * 1.2, { rotation: "0deg", scaleY: 0.6, scaleX: 0.2, ease: Power4.easeIn }, batSpeed);
toVampire.set(vampire.node, { y: -150, rotation: 10, scaleX: 0.4, scaleY: 0.1 }, batSpeed * 2.3);
toVampire.set(bat.node, { opacity: 0 }, batSpeed * 2.3);
toVampire.to(shadow.node, 0.3, { scale: 0.9, opacity: 0.3, ease: Power3.easeIn }, batSpeed * 1.5);
toVampire.to(vampire.node, 0.2, { opacity: 1, rotation: 0, scale: 1, y: 0, ease: Linear.ease }, batSpeed * 2.3 + 0.01);
toVampire.fromTo(head.node, 0.4, { y: -60 }, { y: 40, x: 5, ease: Power4.easeOut }, batSpeed * 2.3);
toVampire.to(head.node, 1, { y: 0, x: 0, ease: Power2.easeInOut }, batSpeed * 2.4 + 0.6);
toVampire.fromTo(arm.node, 0.4, { rotation: 80 }, { rotation: 0, ease: Power4.easeOut }, batSpeed * 2.3);
toVampire.to(arm.node, 1, { rotation: 80, ease: Power2.easeInOut }, batSpeed * 2.3 + 0.5);
toVampire.fromTo(cloak.node, 2.5, { rotation: -10 }, { rotation: 0, ease: Elastic.easeOut }, batSpeed * 2.3);
toVampire.fromTo(cloak.node, 0.2, { y: 0, scaleY: 0.6, scaleX: 1, x: -5 }, { y: 0, x: 0, scale: 1, ease: Linear.ease }, batSpeed * 2.3);
toVampire.fromTo(cloakBack.node, 2, { rotation: -10 }, { rotation: 0, ease: Elastic.easeOut }, batSpeed * 2.3);
toVampire.fromTo(cloakBack.node, 0.5, { y: -20, x: -20 }, { y: 0, x: 0, ease: Power2.easeOut }, batSpeed * 2.3);
toVampire.fromTo(collar.node, 0.4, { scaleY: 1, y: -10 }, { y: 20, scale: 1, ease: Power1.easeOut }, batSpeed * 2.3);
toVampire.to(collar.node, 1, { y: 0, ease: Power2.easeInOut }, batSpeed * 2.3 + 0.6);
toVampire.fromTo(brow.node, 2.2, { y: 5 }, { y: 0, ease: Power2.easeInOut }, batSpeed * 2.3);
toVampire.fromTo(mouth.node, 2, { scaleY: 0.2 }, { scale: 1, ease: Power1.easeInOut }, batSpeed * 2.5);
toVampire.pause();
//=================
// Vampire Loop
//=================
var blink = function () {
    blinkTimeout = setTimeout(function (d) { if (state == STATES.vampire)
        vampireBlink.play(0); }, Math.random() * 5000);
};
var vampireBlink = new TimelineMax({ onComplete: blink });
var blinkSpeed = 0.3;
vampireBlink.set([eyes.left.white.node, eyes.right.white.node], { css: { fill: '#f3e8c3' } }, 0.1);
vampireBlink.set([eyes.left.white.node, eyes.right.white.node], { css: { fill: 'white' } }, blinkSpeed);
vampireBlink.set([eyes.left.pupil.node, eyes.right.pupil.node], { css: { opacity: 0 } }, 0.1);
vampireBlink.set([eyes.left.pupil.node, eyes.right.pupil.node], { css: { opacity: 1 } }, blinkSpeed);
vampireBlink.pause();
var wiggleFingers = function () {
    wiggleTimeout = setTimeout(function (d) { if (state == STATES.vampire)
        vampireWiggle.play(0); }, Math.random() * 20000);
};
var vampireWiggle = new TimelineMax({ repeat: 2, onComplete: wiggleFingers });
for (var i = 0; i < fingers.length; i++) {
    vampireWiggle.to(fingers[i].node, 0.5, { rotation: 20 }, i * 0.1);
    vampireWiggle.to(fingers[i].node, 0.5, { rotation: 0 }, 0.5 + i * 0.1);
}
vampireWiggle.pause();
//=================
// Click toggle
//=================
document.addEventListener('click', function () {
    if (blinkTimeout)
        clearTimeout(blinkTimeout);
    if (wiggleTimeout)
        clearTimeout(wiggleTimeout);
    switch (state) {
        case STATES.bat:
            state = STATES.vampire;
            break;
        case STATES.vampire:
            state = STATES.bat;
            batLoop.play(0);
            toVampire.time(0).pause();
            break;
    }
});