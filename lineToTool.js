function LineToTool(){
	this.icon = "assets/lineTo.jpg";
	this.name = "LineTo";

	var startMouseX = -1;
	var startMouseY = -1;
	var drawing = false;
    
    var lineSlider;
    var lineText;
    
    //to chage the size of the line
    //line size text
    lineText = createP("Line Size");
    lineText.parent("#helpTools");
    lineText.id("text");

        
    //pencil size slider
    lineSlider = createSlider(1,10,1);
    lineSlider.parent("#helpTools");
    lineSlider.id("sizeSlider"); 
    
    lineText.style("display","none");
    lineSlider.style("display","none");
    
	this.draw = function(){
   
        if(!mouseOnCanvas(canvas)){
            return;
        }
        
		if(mouseIsPressed){
			
            if(startMouseX == -1){
				startMouseX = mouseX;
				startMouseY = mouseY;
				drawing = true;
				loadPixels();
			}

			else{
				updatePixels();
                strokeWeight(lineSlider.value());
				line(startMouseX, startMouseY, mouseX, mouseY);
			}

		}
        
		else if(drawing){
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}

	};
    
    //This method will be called by this.selectTool() in toolbox.js
    //when this tool is selected
    //It is useful to setup the GUI control for this tool
    this.populateOptions = function(){
        lineText.style("display","block");
        lineSlider.style("display","block");
    }
    
    //This method will be called by this.selectTool() in toolbox.js
    //when this tool is unselected
    //It is useful to remove the GUI control for this tool
    this.unselectTool = function(){
        lineText.style("display","none");
        lineSlider.style("display","none");
        strokeWeight(1);
    }
}
