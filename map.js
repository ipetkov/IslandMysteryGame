var heightOf = function(xPos, zPos)
{
	// EDIT when we add varying elevation
    var mixX = xPos - Math.trunc(xPos);
	var mixZ = zPos - Math.trunc(zPos);
	var a = vec2(Math.trunc(xPos), Math.trunc(zPos));
	var b = vec2(Math.trunc(xPos) + 1, Math.trunc(zPos));
	var c = vec2(Math.trunc(xPos), Math.trunc(zPos) + 1);
	var d = vec2(Math.trunc(xPos) + 1, Math.trunc(zPos) + 1);

    if(		heights[Math.trunc(xPos)]!=null
    	&& 	heights[Math.trunc(xPos)][Math.trunc(zPos)]!=null
    	&&	heights[Math.trunc(xPos) + 1]!=null
    	&&	heights[Math.trunc(xPos) + 1][Math.trunc(zPos) + 1]!=null)
    {
        return 		heights[a[0]][a[1]] * (1.0 - mixX) * (1.0 - mixZ)
				+	heights[b[0]][b[1]] * mixX * (1.0 - mixZ)
				+	heights[c[0]][c[1]] * (1.0 - mixX) * mixZ
				+	heights[d[0]][d[1]] * mixX * mixZ;
    }
    else {
        return 0.0;
    }
}

