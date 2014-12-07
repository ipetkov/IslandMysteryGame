var Texture = (function() {
	var defaultTexture = null;

	// If no texture is specified, use a white texture,
	// thus only the object's material colors will dominate
	var defaultTextureData = [
		255, 255, 255, 255,  255, 255, 255, 255,
		255, 255, 255, 255,  255, 255, 255, 255,
	];
	//If no bump data will be provided should be a bump map
	//with zero 
	var defaultBumpTextureData = [
		128, 128, 128, 128,  128 ,128, 128, 128,
		128, 128, 128, 128,  128 ,128, 128, 128,
	];
	

	function init(TextureData) {
//		if(defaultTexture) {
//			return;
//		}

		if(!gl) {
			throw "Unable to init texture data, gl not defined";
		}

		// Make sure textures are properly flipped
		// BUT make sure this runs only once, otherwise it would toggle
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

		defaultTexture = textureFromData(
			new Uint8Array(TextureData),
			gl.UNSIGNED_BYTE,
			2, 2,
			gl.REPEAT, gl.REPEAT,
			gl.NEAREST, gl.NEAREST
		);
	}

	function textureFromImageSrc(src, wrapS, wrapT, magFilter, minFilter) {
		if(!src) {
			throw "Invalid parameters for loading texture from image";
		}

		var texture = gl.createTexture();
		var img = new Image();
		img.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS || gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT || gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter || gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter || gl.NEAREST);
			gl.generateMipmap(gl.TEXTURE_2D);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}

		img.src = src;
		return texture;
	}

	function textureFromData(data, type, width, height, wrapS, wrapT, magFilter, minFilter) {
		if(!data || !type) {
			throw "Invalid parameters for loading texture from data";
		}

		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			width,
			height,
			0,
			gl.RGBA,
			type,
			data
		);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS || gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT || gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter || gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter || gl.NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);

		return texture;
	}

	var constructor = function() {
		init(defaultTextureData);
		return defaultTexture;
	}

	constructor.fromImageSrc = function(src, wrapS, wrapT, magFilter, minFilter) {
		init(defaultTextureData);
		return textureFromImageSrc(src, wrapS, wrapT, magFilter, minFilter);
	}

	constructor.fromData = function(data, type, width, height, wrapS, wrapT, magFilter, minFilter) {
		init(defaultTextureData);
		return textureFromData(data, type, width, height, wrapS, wrapT, magFilter, minFilter);
	}

	constructor.defaultBump = function() {
		init(defaultTextureData);
		return defaultTexture;
	}

	return constructor;
})();
