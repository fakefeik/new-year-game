import gift1 from "./gift1.png";
import gift2 from "./gift2.png";
import gift3 from "./gift3.png";
import gift4 from "./gift4.png";
import gift5 from "./gift5.png";
import gift6 from "./gift6.png";
import santaWalk1 from "./santa_walk1.png";
import santaWalk2 from "./santa_walk2.png";
import santaJump from "./santa_jump.png";
import santaDead from "./santa_dead.png";
import background from "./background.png";
import roofLeftImg from "./roof_left.png";
import roofRightImg from "./roof_right.png";
import roofMiddleImg from "./roof_middle.png";
import roofLeftChimneyImg from "./roof_left_chimney.png";
import roofRightChimneyImg from "./roof_right_chimney.png";
import roofMiddleChimneyImg from "./roof_middle_chimney.png";

export type RoofType = "start" | "middle" | "end";

export const CHIMNEY_WIDTH = 105;
export const CHIMNEY_HEIGHT = 100

export interface Roof {
    img: HTMLImageElement,
    type: RoofType,
    chimney?: null | number;
}

const gift1Img = new Image();
gift1Img.src = gift1;

const gift2Img = new Image();
gift2Img.src = gift2;

const gift3Img = new Image();
gift3Img.src = gift3;

const gift4Img = new Image();
gift4Img.src = gift4;

const gift5Img = new Image();
gift5Img.src = gift5;

const gift6Img = new Image();
gift6Img.src = gift6;

const gifts = [gift1Img, gift2Img, gift3Img, gift4Img, gift5Img, gift6Img];

const santaJumpImg = new Image();
santaJumpImg.src = santaJump;

const santaWalk1Img = new Image();
santaWalk1Img.src = santaWalk1;

const santaWalk2Img = new Image();
santaWalk2Img.src = santaWalk2;

const santaDeadImg = new Image();
santaDeadImg.src = santaDead;

const backgroundImg = new Image();
backgroundImg.src = background;

const roofLeftImage = new Image();
roofLeftImage.src = roofLeftImg;

const roofLeft: Roof = {
    img: roofLeftImage,
    type: "start",
};

const roofRightImage = new Image();
roofRightImage.src = roofRightImg;

const roofRight: Roof = {
    img: roofRightImage,
    type: "end",
};

const roofMiddleImage = new Image();
roofMiddleImage.src = roofMiddleImg;

const roofMiddle: Roof = {
    img: roofMiddleImage,
    type: "middle",
};

const roofLeftChimneyImage = new Image();
roofLeftChimneyImage.src = roofLeftChimneyImg;

const roofLeftChimney: Roof = {
    img: roofLeftChimneyImage,
    type: "start",
    chimney: 362,
};

const roofRightChimneyImage = new Image();
roofRightChimneyImage.src = roofRightChimneyImg;

const roofRightChimney: Roof = {
    img: roofRightChimneyImage,
    type: "end",
    chimney: 48,
};

const roofMiddleChimneyImage = new Image();
roofMiddleChimneyImage.src = roofMiddleChimneyImg;

const roofMiddleChimney: Roof = {
    img: roofMiddleChimneyImage,
    type: "middle",
    chimney: 185,
};

export {
    gifts,
    santaJumpImg,
    santaWalk1Img,
    santaWalk2Img,
    santaDeadImg,
    backgroundImg,
    roofLeft,
    roofRight,
    roofMiddle,
    roofLeftChimney,
    roofRightChimney,
    roofMiddleChimney,
};