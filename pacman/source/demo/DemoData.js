export default {

    /** The list of animations */
    animations : [ "title", "chase", "frighten", "present" ],

    /** The title data */
    title : {
        endTime    : 700,
        endTile    : 11,
        leftText   : { x:  9, y: 5 },
        rightText  : { x: 13, y: 5 },
        blobY      : 4.5,
        blobDir    : { x: 1, y: 0 },
        blobMouth  : 5,
        blobRadius : 2.5,
    },

    /** The chase data */
    chase : {
        endTile    : 26.5,
        playersY   : 15,
        playersDir : { x: 1, y: 0 },
        scoreInc   : 500,
        scoreTime  : 1000,
        enerX      : 26,
        enerY      : 14.5,
    },

    /** The frighten data */
    frighten : {
        endTile    : -4,
        playersDir : { x: -1, y: 0 },
        speedMult  : 0.9,
        textTile   : 15,
    },

    /** The present data */
    present : {
        dir     : { x: 1, y: 0 },
        tile    : 20,
        namePos : { x: 14, y: 15 },
        timer   : 1000,
    },
};
