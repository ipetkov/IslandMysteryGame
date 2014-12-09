# Island Mystery Game
Team #5

## Created by Kyle Kodani, Kevin Lu, Ivan Petkov, Xiaosong Shi, David Vasko for CS 174A at UCLA, in Fall of 2014

Welcome to Mystery Island!

To start the game run `python -m SimpleHTTPServer` from a terminal in this directory. Then open your browser and navigate to http://localhost:8000. (Or just open index.html using Firefox.)  after a short scene of you (the player) waking up on the island, the game will begin.  There controls are listed at the bottom of the webpage.

The object of the game is to enjoy the island. Things you can do: 
-pick up branches from trees to start a fire (hint: find the firepit!)
-relax and listen to the soothing sounds of nature
-throw rocks
-climb the mountain
-explore!


Our advanced topics are: collision, physics, bump mapping.

Other cool stuff:
-The island is partially randomly generated.  There are 4 regions: rolling hills, forest, bay, and mountain.  Each has randomly generated terrain by using a height map.  The trees and other objects are also randomly placed.
-There are lots of sound effects, and there is spooky music at night!
-A fire can be made from sticks found on the island 
-A lit fire will light up the rocks that make up the fire pit
-Bumpmapping is only implemented on the trunks of the trees but an example cube is commeneted out in scene.js that shows a gloriously bumped texture
-If there are no branches within jumpable height you can knock them off the trees with rocks found on the island!
-Thrown rocks will reflect off trees in realistic ways.

Who did what:
Ivan
-Grandmaster of the project. Taught us all how to use git. Main feature worked on was collisions. Collisions was also used to pick up sticks and stones for thin inventory. Implemented the original skeleton code we all followed. Implemented simple lighting.
Kevin
-Physics king. In charge of player movements and object movements. Ex throwing rocks, bouncing rocks falling sticks. Jumping. All that jazz.
Kyle
-Mountain and Music maker. He was in charge of the height map which is what gives our island its beautiful appearance. He also implemented all the sound features which add alot to the game. 
David
-Bump Man and Fire Man. Worked with lighting. Made the campfire object, and stick objetcs. 
Ray
-Pig Man. In charge of animating and moving the pig and various other tasks along the way.


Works best on current versions of firefox for mac or windows.
Should work on current versions of chrome.
Safari untested.
