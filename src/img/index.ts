import gift from "./gift.png";
import santa from "./santa.png";
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

const giftImg = new Image();
giftImg.src = gift;

const santaImg = new Image();
santaImg.src = santa;

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
    giftImg,
    santaImg,
    santaDeadImg,
    backgroundImg,
    roofLeft,
    roofRight,
    roofMiddle,
    roofLeftChimney,
    roofRightChimney,
    roofMiddleChimney,
};