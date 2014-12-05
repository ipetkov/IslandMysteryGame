
var canvas;
var gl;
//size of pig body
var length = 1.5;
var deg = 180.0; //rotate triangle to form legs
var time = 0.0;
var timer = new Timer();
var omega = 40;

var pig_body = vec3( 1.0, 1.0, 1.5 );
var pig_legs = vec3( 1.0, 1.7, 1.0 );
var pig_scaleNose = vec3( 0.2, 0.2, 0.3 );
var pig_translateNose = vec3( 0.0, 0.0, 2.3 );
var pig_move1 = [
    vec3( 0.0, 0.0,  0.0  ),
    vec3( 0.0, 0.0,  0.0  ),
    vec3( 0.0, 0.0, -0.03 ),
    vec3( 0.0, 0.0, -0.03 ),
    vec3( 0.0, 0.0, -0.03 ),
    vec3( 0.0, 0.0, -0.03 ),
    vec3( 0.0, 0.0,  0.03 ),
    vec3( 0.0, 0.0,  0.03 ),
    vec3( 0.0, 0.0,  0.03 ),
    vec3( 0.0, 0.0,  0.03 )
];

var pig_move2 = [
    vec3( 0.0, 0.0,  0.0  ),
    vec3( 0.0, 0.0,  0.0  ),
    vec3( 0.0, 0.0,  0.03 ),
    vec3( 0.0, 0.0,  0.03 ),
    vec3( 0.0, 0.0,  0.03 ),
    vec3( 0.0, 0.0,  0.03 ),
    vec3( 0.0, 0.0, -0.03 ),
    vec3( 0.0, 0.0, -0.03 ),
    vec3( 0.0, 0.0, -0.03 ),
    vec3( 0.0, 0.0, -0.03 )
];

var pig_legMove = false;
var pig_distant = 5;

var pig_translate = [
    vec3( -0.9,  1.5,  1.5 ), //[0] right ear
    vec3(  0.9,  1.5,  1.5 ), //[1] left ear
    vec3( -0.7, -1.5,  1.3 ), //[2] right front leg
    vec3( -0.6, -1.5,  1.3 ), //[3] right front leg
    vec3(  0.7, -1.5, -1.2 ), //[4] left front leg
    vec3(  0.6, -1.5, -1.2 ), //[5] left front leg
    vec3( -0.7, -1.5, -1.3 ), //[6] right rear leg
    vec3( -0.6, -1.5, -1.3 ), //[7] right rear leg
    vec3(  0.7, -1.5,  1.1 ), //[8] left rear leg
    vec3(  0.6, -1.5,  1.1 )  //[9] left rear leg
];

var modelViewMatrix;
var viewMatrix;
var projectionMatrix;
var trianglar;
var vertices;
var points;
var normals = [];

var eye = vec3(0.0, 0.0, 10.0);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

//generate trianglar
function tri( trianglar, points, normals )
{
    trip( trianglar, points, normals, 0, 2, 1, vec3( 0, 0, 1 ) ); //front face
    trip( trianglar, points, normals, 0, 3, 5, vec3( 1, 1, 0 ) ); //left face
    trip( trianglar, points, normals, 0, 5, 2, vec3( 1, 1, 0 ) ); //left face
    trip( trianglar, points, normals, 3, 4, 5, vec3( 0, 0, 1 ) ); //back face
    trip( trianglar, points, normals, 0, 1, 4, vec3( 1, 1, 0 ) ); //right face
    trip( trianglar, points, normals, 0, 4, 3, vec3( 1, 1, 0 ) ); //right face
    trip( trianglar, points, normals, 2, 5, 4, vec3( 0, 1, 0 ) ); //button face
    trip( trianglar, points, normals, 2, 4, 1, vec3( 0, 1, 0 ) ); //button face
}

function trip( trianglar, points, normals, v1, v2, v3, normal )
{
    normals.push( normal );
    normals.push( normal );
    normals.push( normal );

    points.push( trianglar[ v1 ] );
    points.push( trianglar[ v2 ] );
    points.push( trianglar[ v3 ] );
}

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

    //trianglar for ears and legs
    trianglar = [
        vec3(  0.0,   0.5,  0.0 ), //vertex 0
        vec3(  0.4,   0.0,  0.0 ), //vertex 1
        vec3( -0.4,   0.0,  0.0 ), //vertex 2
        vec3(  0.0,   0.5, -0.3 ), //vertex 3 
        vec3(  0.4,   0.0, -0.3 ), //vertex 4
        vec3( -0.4,   0.0, -0.3 ), //vertex 5
    ];

    //vertices of cube for body and nose
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
    tri(trianglar, points, normals);
    Cube(vertices, points);

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");


    viewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(90, 1, 0.001, 1000);

    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var ctm;
    time += timer.getElapsedTime() / 1000;

    for( var i = 0; i < 10; i++ )
    {
        var temp_leg = vec3( pig_translate[ i ] );
        if ( pig_legMove === false )
        {
            var temp_move = vec3( pig_move1[ i ] );
            pig_translate[ i ] = vec3( add( temp_leg, temp_move ) );
        }
        else
        {
            var temp_move = vec3( pig_move2[ i ] );
            pig_translate[ i ] = vec3( add( temp_leg, temp_move ) );
        }
    }

    if( pig_distant > 24 )
    {
        if( pig_legMove === false )
        pig_legMove = true;
    else
        pig_legMove = false;
    pig_distant = -10;
    }
    pig_distant += 1;

    //generating ears and legs
    for( var i = 0; i < 10; i++ )
    {
        ctm = mat4();
        var translatePig = vec3( pig_translate[ i ] );
        ctm = mult( ctm, projectionMatrix );
        ctm = mult( ctm, viewMatrix );
        ctm = mult( ctm, rotate( time * omega, [ 0, 1, 0 ] ) );
        ctm = mult( ctm, translate( translatePig ) );
        //rotate and scale if generating legs, each leg is combination of two trianglar
        if( i > 1 )
        {
            ctm = mult( ctm, rotate( deg, [ 0, 0, 1 ] ) );
            ctm = mult( ctm, scale( pig_legs ) );
        }
        gl.uniformMatrix4fv( modelViewMatrix, false, flatten( ctm ) );
        gl.drawArrays( gl.TRIANGLES, 0, 24 );
    }

    //pig body
    ctm = mat4();
    ctm = mult( ctm, projectionMatrix );
    ctm = mult( ctm, viewMatrix );
    ctm = mult( ctm, rotate( time * omega, [ 0, 1, 0 ] ) );
    ctm = mult( ctm, scale( pig_body ) );
    gl.uniformMatrix4fv( modelViewMatrix, false, flatten( ctm ) );
    gl.drawArrays( gl.TRIANGLES, 24, 36 );

    //pig nose
    ctm = mat4();
    ctm = mult( ctm, projectionMatrix );
    ctm = mult( ctm, viewMatrix );
    ctm = mult( ctm, rotate( time * omega, [ 0, 1, 0 ] ) );
    ctm = mult( ctm, translate( pig_translateNose ) );
    ctm = mult( ctm, scale( pig_scaleNose ) );
    gl.uniformMatrix4fv( modelViewMatrix, false, flatten( ctm ) );
    gl.drawArrays( gl.TRIANGLES, 24, 36 );

    window.requestAnimFrame( render );
}



