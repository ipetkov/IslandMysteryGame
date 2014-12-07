"use strict"

var islandSize = 50;
var heights = [];

//init height map, all values to zero
for(var x=0; x<islandSize+1; x++) {
    heights[x]=[];
    for(var z=0; z<islandSize+1; z++) {
        heights[x][z]=0;
    }
}

for(var x=1; x<islandSize; x++) {
    for(var z=1; z<islandSize; z++) {
        var rand=Math.random();
        if(rand>=0.3) {
            heights[x][z]=((heights[x-1][z-1]+heights[x][z-1]+heights[x-1][z])/3)+(0.5*Math.random());
        }
        else {
            heights[x][z]=((heights[x-1][z-1]+heights[x][z-1]+heights[x-1][z])/3)-(0.5*Math.random());
        }
    }
}


