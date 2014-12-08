"use strict"

var islandSize = 150;
var tempSize = islandSize;
var quarterSize = Math.trunc(islandSize*.5);
var heights = [];
var steepness = .2;

function findAvg(x, z) {
    var avg = (heights[x-1][z-1] + heights[x  ][z-1] + heights[x+1][z-1] +
               heights[x-1][z  ] + heights[x  ][z  ] + heights[x+1][z  ] +
               heights[x-1][z+1] + heights[x  ][z+1] + heights[x+1][z+1]) / 9;
    return avg;
}

function ulAvg(x, z) {
    var avg = (heights[x-1][z-1] + heights[x][z-1] + heights[x-1][z]) / 3;
    return avg;
}

function urAvg(x, z) {
    var avg = (heights[x][z-1] + heights[x+1][z-1] + heights[x+1][z]) / 3;
    return avg;
}

function llAvg(x, z) {
    var avg = (heights[x-1][z] + heights[x-1][z+1] + heights[x][z+1]) / 3;
    return avg;
}

function lrAvg(x, z) {
    var avg = (heights[x][z+1] + heights[x+1][z+1] + heights[x+1][z]) / 3;
    return avg;
}

//init height map, all values to zero
for(var x=0; x<islandSize+1; x++) {
    heights[x]=[];
    for(var z=0; z<islandSize+1; z++) {
        heights[x][z]=-0.15;
    }
}


//ul forest
for(var x=1; x<quarterSize; x++) {
    for(var z=1; z<quarterSize; z++) {
        var rand=Math.random();
        if(rand<=0.6) {
            heights[x][z]=ulAvg(x,z)+(steepness*Math.random());
        }
        else {
            heights[x][z]=ulAvg(x,z)-(steepness*Math.random());
        }
    }
}

//lr rolling hills
for(var x=islandSize-1; x>quarterSize; x--) {
    for(var z=islandSize-1; z>=quarterSize; z--) {
        var rand=Math.random();
        if(rand<=0.55) {
            heights[x][z]=lrAvg(x,z)+(steepness*Math.random());
        }
        else {
            heights[x][z]=lrAvg(x,z)-(steepness*Math.random());
        }
    }
}


for(var x=islandSize-21; x>quarterSize; x--) {
    for(var z=islandSize-21; z>=quarterSize; z--) {
        var rand=Math.random();
        if(rand<=0.6) {
            heights[x][z]=lrAvg(x,z)+(1*Math.random());
        }
        else {
            heights[x][z]=findAvg(x,z)-(0*Math.random());
        }
    }
}



