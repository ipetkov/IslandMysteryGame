"use strict"

var baySize = Math.trunc(islandSize*.5);
var tempSize = baySize;
var bayQuarterSize = Math.trunc(baySize*.5);
var steepness = .3;




//ur
for(var x=islandSize-1; x>=quarterSize; x--) {
    for(var z=1; z<quarterSize; z++) {
        var rand=Math.random();
        if(rand<=0.6) {
            heights[x][z]=urAvg(x,z)+(steepness*Math.random());
        }
        else {
            heights[x][z]=urAvg(x,z)-(steepness*Math.random());
        }
    }
}


//smooth everything
for(var x=1; x<islandSize; x++) {
    for(var z=1; z<islandSize; z++) {
        heights[x][z]=findAvg(x,z);
    }
}

//smooth everything
for(var x=1; x<islandSize; x++) {
    for(var z=1; z<islandSize; z++) {
        heights[x][z]=findAvg(x,z);
    }
}