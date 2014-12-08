"use strict"

var baySize = Math.trunc(islandSize*.5);
var tempSize = baySize;
var bayQuarterSize = Math.trunc(baySize*.5);
var steepness = .2;



//ur
/*
for(var x=islandSize-1; x>=quarterSize; x--) {
    for(var z=1; z<quarterSize; z++) {
        var rand=Math.random();
        if(rand<=0.55) {
            heights[x][z]=urAvg(x,z)+(steepness*Math.random());
        }
        else {
            heights[x][z]=urAvg(x,z)-(steepness*Math.random());
        }
    }
}
*/

for(var x=quarterSize; x<islandSize; x++) {
    for(var z=quarterSize; z>0; z--) {
        var rand=Math.random();
        if(rand<=0.3) {
            heights[x][z]=llAvg(x,z)+(.2*steepness*Math.random());
        }
        else {
            heights[x][z]=llAvg(x,z)-(steepness*Math.random());
        }
    }
}




//clean up

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



