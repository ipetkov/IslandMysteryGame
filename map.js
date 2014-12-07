var heightOf = function(xPos, zPos)
{
	// EDIT when we add varying elevation
    var truncX = Math.trunc(xPos);
    var truncZ = Math.trunc(zPos);

    var mixX = xPos - truncX;
	var mixZ = zPos - truncZ;
	var a = vec2(truncX, truncZ);
	var b = vec2(truncX + 1, truncZ);
	var c = vec2(truncX, truncZ + 1);
	var d = vec2(truncX + 1, truncZ + 1);

    if(		heights[truncX]!=null
    	&& 	heights[truncX][truncZ]!=null
    	&&	heights[truncX + 1]!=null
    	&&	heights[truncX + 1][truncZ + 1]!=null)
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

