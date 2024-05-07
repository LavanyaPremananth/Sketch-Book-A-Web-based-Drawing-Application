//global variables that will store the toolbox colour palette
//amnd the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var canvas = null;
var stencils = null;

    var sprayCanSlider;
    var sprayCanText;

//spray can object literal
sprayCan = {
    name: "sprayCanTool",
    icon: "assets/sprayCan.jpg",
    points: 13,
    spread: 10,
    
    draw: function(){
        if(!mouseOnCanvas(canvas)){
            return;
        }

        //if the mouse is pressed paint on the canvas
        //spread describes how far to spread the paint from the mouse pointer
        //points holds how many pixels of paint for each mouse press.
        
        this.spread = sprayCanSlider.value();
        
        if(mouseIsPressed){
            for(var i = 0; i < this.points; i++){
                point(random(mouseX-this.spread, mouseX + this.spread), 
                    random(mouseY-this.spread, mouseY+this.spread));
            }
        }
    },
    
    populateOptions: function(){
        sprayCanSlider.style("display","block");
        sprayCanText.style("display","block");
    },
    
    unselectTool: function(){
        sprayCanSlider.style("display","none");
        sprayCanText.style("display","none");
        
        strokeWeight(1);
    }
    

};

function setup() {
                
    //to chage the size of the pencil line
    //pencil size text
    sprayCanText = createP("Spray Can Size");
    sprayCanText.parent("#helpTools");
    sprayCanText.id("text");

    //pencil size slider
    sprayCanSlider = createSlider(5,35,15);
    sprayCanSlider.parent("#helpTools");
    sprayCanSlider.id("sizeSlider"); 
    
    sprayCanSlider.style("display","none");
    sprayCanText.style("display","none");

	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	c.parent("content");
    canvas = c;
    
	//create helper functions and the colour palette
	helpers = new HelperFunctions();
    stencils = helpers.loadStencils();
	colourP = new ColourPalette();

	//create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(sprayCan);
	toolbox.addTool(new mirrorDrawTool());
    toolbox.addTool(new EditableShape());
    toolbox.addTool(new scissorTool());
    toolbox.addTool(new AutoDrawTool(stencils));
	background(255);
}

function draw() {
	//call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
    
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	} else {
		alert("it doesn't look like your tool has a draw method!");
	}
}

function mousePressed(){
    //call mousePressed from the selected tool if 
    //the selected tool has a mousePressed() method
    if (toolbox.selectedTool.hasOwnProperty("mousePressed")) {
		toolbox.selectedTool.mousePressed();
	}
}

function mouseReleased(){
    //call mouseReleased from the selected tool if 
    //the selected tool has a mouseReleased() method
    if (toolbox.selectedTool.hasOwnProperty("mouseReleased")) {
		toolbox.selectedTool.mouseReleased();
	}
}

function mouseDragged(){
    //call mouseDragged from the selected tool if 
    //the selected tool has a mouseDragged() method
    if (toolbox.selectedTool.hasOwnProperty("mouseDragged")) {
		toolbox.selectedTool.mouseDragged();
	}
}
//Note: you can add other similar standard methods e.g. mouseReleased()
//and call mouseReleased() in each selected tool
