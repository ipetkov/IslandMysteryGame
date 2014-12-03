
var canvas;
var gl;
var length = 0.5;
var deg = 30;

var radio_scale = [
    vec3( 0.05, 2.0, 0.05 ), //Antenna
    vec3( 3.0 , 1.0, 1.0  )  //Body
];

var radio_position = [
    vec3( -1.95, 1.3, 0.0 ), //Antenna
    vec3( -1.0 , 0.0, 0.0 )  //Body
];

var pig_scale = [
    vec3( )
];

var vertices;
var points;
var viewMatrix;
var projectionMatrix;

var eye = vec3( 2.0, 5.0, 10.0 );
var at = vec3( 0, 0, 0 );
var up = vec3( 0, 1, 0 );

function Cube( vertices, points )
{
    Quad( vertices, points, 0, 1, 2, 3 );
    Quad( vertices, points, 4, 0, 6, 2 );
    Quad( vertices, points, 4, 5, 0, 1 );
    Quad( vertices, points, 2, 3, 6, 7 );
    Quad( vertices, points, 1, 5, 3, 7 );
    Quad( vertices, points, 6, 7, 4, 5 );
}

function Quad( vertices, points, v1, v2, v3, v4 )
{
    points.push( vertices[ v1 ] );
    points.push( vertices[ v3 ] );
    points.push( vertices[ v4 ] );
    points.push( vertices[ v1 ] );
    points.push( vertices[ v4 ] );
    points.push( vertices[ v2 ] );
}

window.onload = function init()
{

    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable( gl.DEPTH_TEST );

    vertices = [
        vec3(  length,   length,  length ), //vertex 0
        vec3(  length,  -length,  length ), //vertex 1
        vec3( -length,   length,  length ), //vertex 2
        vec3( -length,  -length,  length ), //vertex 3 
        vec3(  length,   length, -length ), //vertex 4
        vec3(  length,  -length, -length ), //vertex 5
        vec3( -length,   length, -length ), //vertex 6
        vec3( -length,  -length, -length )  //vertex 7   
    ];

    points = [];
    Cube( vertices, points );


    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten( points ), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    modelViewMatrix = gl.getUniformLocation( program, "modelViewMatrix" );


    viewMatrix = lookAt( eye, at, up );
    projectionMatrix = perspective( 90, 1, -1, 1 );

    render();

}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    var ctm = mat4();
    var scale_anatenna = radio_scale[ 0 ];
    var translate_anatenna = radio_position[ 0 ];
    ctm = mult( ctm, projectionMatrix );
    ctm = mult( ctm, viewMatrix );
    ctm = mult( ctm, translate( translate_anatenna ) );
    ctm = mult( ctm, rotate( -30, [ 0, 0, 1 ] ) );
    ctm = mult( ctm, scale( scale_anatenna ) );
    gl.uniformMatrix4fv( modelViewMatrix, false, flatten( ctm ) );
    gl.drawArrays( gl.TRIANGLES, 0, 36 );

    var scale_body = radio_scale[ 1 ];
    var translate_body = radio_position[ 1 ];
    ctm = mat4();
    ctm = mult( ctm, projectionMatrix );
    ctm = mult( ctm, viewMatrix );
    ctm = mult( ctm, translate( translate_body ) );
    ctm = mult( ctm, scale( scale_body ) );
    gl.uniformMatrix4fv( modelViewMatrix, false, flatten( ctm ) );
    gl.drawArrays( gl.TRIANGLES, 0, 36 );

    window.requestAnimFrame( render );
}

