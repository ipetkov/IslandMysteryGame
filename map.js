var heightOf = function(xPos, zPos)
{
	// EDIT when we add varying elevation
    if(heights[Math.trunc(xPos)]!=null && heights[Math.trunc(xPos)][Math.trunc(zPos)]!=null) {
        return heights[Math.trunc(xPos)][Math.trunc(zPos)];
    }
    else {
        return 0.0;
    }
}