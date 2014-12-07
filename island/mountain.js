"use strict"

var mtnSize = Math.trunc(islandSize*.5);
var tempSize = mtnSize;
var mtnQuarterSize = Math.trunc(mtnSize*.5);
var steepness = 1;


//ul
for(var x=1; x<mtnQuarterSize; x++) {
    for(var z=quarterSize; z<mtnQuarterSize+quarterSize; z++) {
        var rand=Math.random();
        if(rand<=0.9) {
            heights[x][z]=ulAvg(x,z)+(steepness*Math.random());
        }
        else {
            heights[x][z]=ulAvg(x,z)-(steepness*Math.random());
        }
    }
}

//ur
for(var x=mtnSize+1; x>=mtnQuarterSize; x--) {
    for(var z=quarterSize; z<mtnQuarterSize+quarterSize; z++) {
        var rand=Math.random();
        if(rand<=0.9) {
            heights[x][z]=urAvg(x,z)+(steepness*Math.random());
        }
        else {
            heights[x][z]=urAvg(x,z)-(steepness*Math.random());
        }
    }
}

//lr
for(var x=mtnSize; x>mtnQuarterSize; x--) {
    for(var z=mtnSize-1+quarterSize; z>=mtnQuarterSize+quarterSize; z--) {
        var rand=Math.random();
        if(rand<=0.9) {
            heights[x][z]=lrAvg(x,z)+(steepness*Math.random());
        }
        else {
            heights[x][z]=lrAvg(x,z)-(steepness*Math.random());
        }
    }
}

//ll
for(var x=1; x<mtnQuarterSize; x++) {
    for(var z=mtnSize-1+quarterSize; z>mtnQuarterSize+quarterSize; z--) {
        var rand=Math.random();
        if(rand<=0.5) {
            heights[x][z]=findAvg(x,z)+(5*Math.random());
        }
        else {
            heights[x][z]=findAvg(x,z)-(5*Math.random());
        }
    }
}

for(var x=mtnQuarterSize; x>0; x--) {
    for(var z=mtnQuarterSize+quarterSize; z<tempSize+quarterSize; z++) {
        var rand=Math.random();
        if(rand<=0.95) {
            heights[x][z]=urAvg(x,z)+(2*steepness*Math.random());
        }
        else {
            heights[x][z]=urAvg(x,z)-(2*steepness*Math.random());
        }
    }
    if(x<=0.25*mtnSize) {
        tempSize--;
    }
}


for(var x=mtnQuarterSize+1; x>mtnQuarterSize-3; x--) {
    for(var z=quarterSize; z<1.5*quarterSize; z++) {
        heights[x][z]=findAvg(x,z);
    }
}

for(var z=(1.5*quarterSize)-2; z<(1.5*quarterSize)+2; z++) {
    for(var x=mtnQuarterSize; x<quarterSize; x++) {
        //heights[x][z]=20;
        heights[x][z]=findAvg(x,z);
    }
}
