'use strict';

// ELEMENTS
const title = {
    container: document.querySelector("#title")
};
title.name = title.container.querySelector("h1");
title.vitalsContainer = title.container.querySelector("dl");
title.underline = title.container.querySelector("#underline");

// CONSTANTS
const phases = new Map();
phases.set("a", [
        [{keyframe: "flare", timing: 1}, null],
        [{keyframe: "fadeIn", timing: 2}, {keyframe: "fadeOutTranslucent", timing: 6}],
        [{keyframe: "fadeIn", timing: 3}, {keyframe: "fadeOut", timing: 6}],
        [{keyframe: "fadeIn", timing: 4}, {keyframe: "fadeOut", timing: 6}],
    ])
    .set("b", [
        [{keyframe: "flare", timing: 1}, null],
        [{keyframe: "fadeIn", timing: 2}, {keyframe: "fadeOutTranslucent", timing: 6}],
        [{keyframe: "fadeIn", timing: 3}, {keyframe: "fadeOut", timing: 6}],
        [{keyframe: "fadeIn", timing: 4}, {keyframe: "fadeOut", timing: 6}],
    ])
    .set("c", [
        [{keyframe: "flare", timing: 1}, null],
        [{keyframe: "fadeIn", timing: 2}, {keyframe: "fadeOutTranslucent", timing: 6}],
        [{keyframe: "fadeIn", timing: 3}, {keyframe: "fadeOut", timing: 6}],
        [{keyframe: "fadeIn", timing: 4}, {keyframe: "fadeOut", timing: 6}],
    ])
    .set("d", [
        [{keyframe: "fadeIn", timing: 5}, null],
        [{keyframe: "fadeIn", timing: 5}, null],
        [{keyframe: "fadeIn", timing: 5}, null],
    ],
);

const keyframes = {
    fadeIn: [
        {opacity: 0},
        {opacity: 1},
    ],
    flare: [
        {opacity: 0},
        {opacity: 0.66, offset: 0.1},
        {opacity: 0.8, offset: 0.2},
        {opacity: 0.7, offset: 0.4},
        {opacity: 0.3, offset: 0.66},
        {opacity: 0},
    ],
    fadeOut: [
        {opacity: 1},
        {opacity: 0},
    ],    
    fadeOutTranslucent: [
        {opacity: 1},
        {opacity: 0.15},
    ],
};

const BWEndOpacity = 0.15;

const groupDelay = 750;
const groupFourPhase = 300;
const groupFourDelayMultiplier = 3;
const phaseDelays = [
    0,
    100,
    500,
    750,
];
const secondPartDelay = 100;
const secondPartPhaseDelay = 90;

// ELEMENTS
const playButton = document.querySelector("#play-anim");

const timings = [
    (delay = 0) => ({
            delay,
            duration: 800,
            fill: "forwards",
            easing: "ease-out",
        }),
    (delay = 0) => ({
            duration: 200,
            // delay: delay + 100,
            delay,
            fill: "forwards",
            easing: "ease-in-out",
        }),
    (delay = 0) => ({
            duration: 500,
            // delay: delay + 500,
            delay,
            fill: "forwards",
            easing: "ease-in-out",
        }),
    (delay = 0) => ({
            duration: 500,
            // delay: delay + 750,
            delay,
            fill: "forwards",
            easing: "ease-out",
        }),
    (delay = 0) => ({
        duration: 750,
        delay,
        fill: "forwards",
        easing: "ease-out",
    }),
    (delay = 0) => ({
        delay,
        duration: 1000,
        fill: "forwards",
        easing: "ease-out",
    }),
];

let anims = [];
let anim = {};
let gn = 0;
let secondDelay = secondPartDelay;
phases.forEach((group, g) => {
    group.forEach((phase, i) => {
        anim = {
            el: document.querySelector(`#saki${g + (i+1)}`),
            group: g,
            phase: i,
            animations: []
        };
        for (let j = 0; j < phase.length; ++j) {
            if (phase[j]) {
                let timing = 0;
                if (g === "d") {
                    timing = timings[gn+1](groupDelay * 
                        groupFourDelayMultiplier + ((i+1) * groupFourPhase));
                } else if (j === 1) {
                    secondDelay = secondDelay - secondPartPhaseDelay;
                    timing = timings[phase[j].timing-1](secondDelay);
                } else {
                    timing = timings[phase[j].timing-1](groupDelay * gn + phaseDelays[i]);
                }
                anim.animations.push(
                    new Animation(new KeyframeEffect(
                        anim.el,
                        keyframes[phase[j].keyframe],
                        timing
                    ))
                );
            }
        }
        anims.push(anim);
    });
    ++gn;
});

let setStartState = (anims) => {
    anims.forEach((anim) => {
        anim.el.style.opacity = 0;
    });
    title.name.style.opacity = 0;
    // title.vitalsContainer.style.opacity = 0;
    title.underline.style.opacity = 0;
};

// ANIMATION PHASES
let playAnimationPartOne = () => {
    anims.forEach((anim) => {
        anim.animations[0].play();
        anim.animations[0].finished.then((a) => {
            a.commitStyles();
            a.cancel();
        });
    });
    return anims[anims.length-1].animations[0];
};

let playAnimationPartTwo = () => {
    for (let i = anims.length-1; i >= 0; --i) {
        if (anims[i].animations[1]) {
            anims[i].animations[1].play();
            anims[i].animations[1].finished.then((a) => {
                a.commitStyles();
                a.cancel();
            });
        }
    }
    return anims[1].animations[1];
};

let playTextAnimations = () => {
    let titleAnim = title.name.animate([
        {filter: "blur(20px)", opacity: 1},
        {filter: "blur(0px)", opacity: 1},
    ],{
        duration: 750,
        fill: "forwards",
    }).finished.then((a) => {
        a.commitStyles();
        a.cancel();
    });
    let underlineAnim = title.underline.animate([
        {opacity: 0},
        {opacity: 1},
    ], {
        duration: 700,
        delay: 300,
        easing: "ease-out",
        fill: "forwards",
    }).finished.then((a) => {
        a.commitStyles();
        a.cancel();
    });
    let vitalsAnim = title.vitalsContainer.animate([
        {transform: "translateY(25%)"},
        {transform: "translateY(0%)"},
    ], {
        duration: 1000,
        delay: 200,
        easing: "ease-out",
        fill: "forwards",
    }).finished.then((a) => {
        a.commitStyles();
        a.cancel();
    });
};

let playFullAnimations = () => playAnimationPartOne().finished.then(() => playAnimationPartTwo().finished);

// ANIMATION SEQUENCE
setStartState(anims);
playButton.setAttribute("disabled", true);
playFullAnimations().then(() => {
    playButton.removeAttribute("disabled");
    playTextAnimations();
});

// PLAY BUTTON EVENTS
playButton.addEventListener("click", () => {
    setStartState(anims);
    playButton.setAttribute("disabled", true);
    playFullAnimations().then(() => {
        playButton.removeAttribute("disabled");
        playTextAnimations();
    });
});