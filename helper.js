var plane = function(a, b, c)
{
    var ab = subtract(b,a);
    var ac = subtract(c,a);
    var normalDir = cross(ab, ac);
    return normalize(normalDir);
}

function inheritPrototype(subType, superType)
{
	var proto = Object.create(superType.prototype);
	proto.constructor = subType;
	subType.prototype = proto;
}