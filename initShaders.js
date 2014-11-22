function initShaders(gl, vertexShaderId, fragmentShaderId) {
	var vertexSource = document.getElementById(vertexShaderId).text;
	var fragmentSource = document.getElementById(fragmentShaderId).text;

	if(!vertexSource) {
		throw "Unable to load vertex shader \"" + vertexShaderId + "\"";
	}

	if (!fragmentSource) {
		throw "Unable to load fragment shader \"" + fragmentShaderId + "\"";
	}

	var checkShaderStatus = function(shader) {
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			var msg;
			switch(gl.getShaderParameter(shader, gl.SHADER_TYPE)) {
				case gl.VERTEX_SHADER:
					msg = "vertex shader";
					break;
				case gl.FRAGMENT_SHADER:
					msg = "fragment shader";
					break;
				default:
					msg = "unknown shader";
					break;
			}
			msg = "Unable to compile " + msg + ". Error log is: " + gl.getShaderInfoLog(shader);
			throw msg;
		}
	}

	var compileShader = function(source, shaderType) {
		var shader = gl.createShader(shaderType);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		checkShaderStatus(shader);
		return shader;
	}

	var vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
	var fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw "Shader program failed to link. Error log is: " + gl.getProgramInfoLog(program);
	}

	return program;
}
