function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var boxSpacing = 2;
var numBoxes = 10;
var boxWidth = 10;
var topX = 70;
var topY = 40;
var boxPositions = new Array(numBoxes);
var palette = ['#C46FFF', '#8A6FE8', '#8797FF', '#6FAAE8', '#7AE9FF']


function setup() {
	createCanvas(800, 600);
	
	for(var i=0;i<numBoxes;i++){
		boxPositions[i] = new Array(numBoxes);
		for(var j=0;j<numBoxes;j++){
			spacing = boxWidth + boxSpacing;
			randomMultiplierX = getRandomArbitrary(0, 10);
			randomMultipliery = getRandomArbitrary(0, 10);
			colourIndex = getRandomInt(0, 4);
			point = {x: topX + i*spacing, y: topY + j*spacing, xMul: randomMultiplierX, yMul: randomMultipliery, colour: palette[colourIndex]};
			boxPositions[i][j] = point
		}
	}
}


function draw() {
	blendMode(BLEND);
	background(0, 0, 0);
	fill('#ffffff');
	textStyle(NORMAL);
	textSize(120);
	text('convol.io', topX + numBoxes * boxWidth + 40, topY + numBoxes * boxWidth + 12);
	
	blendMode(HARD_LIGHT );
	for(var i=0;i<numBoxes;i++){
		for(var j=0;j<numBoxes;j++){
			point = boxPositions[i][j];
			distance = Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2))
			force = 4000/Math.pow(distance, 2);

			heading = {x: force * point.xMul * (point.x - mouseX)/distance, y: force * point.yMul * (point.y - mouseY)/distance};
			
			newPoint = {x: point.x + heading.x, y: point.y + heading.y};
			
			boxTopCorner = {x: newPoint.x - boxWidth/2, y: newPoint.y - boxWidth/2};
			
			fill(point.colour);
			strokeWeight(0);
			rect(boxTopCorner.x, boxTopCorner.y, boxWidth, boxWidth);
		}
	}

}