function scissorTool(){
    this.icon = "assets/scissor.png"
    this.name = "scissor"
    
    var selectMode = false;
    //0 - do nothing - free hand tool 
    //1 - select area to cut
    //2 - paste
    var selectedArea;
    var selectedPixels; //store the cut pixels
    
    var selectButton;
    var angleSlider;
    var rotateAngle = 0;
    
    this.previousMouseX = -1;
    this.previousMouseY = -1;
    
    var freeFormButton;
    var freeFormMode = false;
    var drawing = false; 
    var pointArray = [];
    
    this.draw = function(){
        if(mouseIsPressed){
            if(!mouseOnCanvas(canvas)){
                return;
            }
            //Sissor Tool
            if(!freeFormMode && selectMode == 0){//user do nothing, free hand tool
                if(this.previousMouseX == -1){
                    this.previousMouseX = mouseX;
                    this.previousMouseY = mouseY;
                }else{
                    stroke(0);
                    noFill();
                    line(this.previousMouseX,
                         this.previousMouseY,
                         mouseX,
                         mouseY);
                    this.previousMouseX = mouseX;
                    this.previousMouseY = mouseY; 
                }
            }else if(!freeFormMode && selectMode == 1){
                updatePixels();
                noStroke();
                fill(255,0,0,100);
                rect(selectedArea.x,
                     selectedArea.y,
                     selectedArea.w,
                     selectedArea.h);
            } else{
           if(!freeFormMode && selectMode == 2){//paste mode
               updatePixels();//save the current canvas
               fill(0,0,125,100);
               push();
               translate(mouseX, mouseY);
               rotateAngle = radians(angleSlider.value());
               rotate(rotateAngle);
               rect(-selectedArea.w/2 + 10,
                    -selectedArea.h/2 + 10,
                    selectedArea.w - 20,
                    selectedArea.h - 20);
               pop();
           }
           //if the user has released the mouse, set both 
           //previous mouse value to -1
           this.previousMouseX = -1;
           this.previousMouseY = -1;
       }
    }
        //Free Form Select
        if(freeFormMode && !selectMode && mouseIsPressed){
			//check if they previousX and Y are -1. set them to the current
			//mouse X and Y if they are.
			if (previousMouseX == -1){
				previousMouseX = mouseX;
				previousMouseY = mouseY;
                drawing = true;
            }
			else{
                //draw line from previous mouse position to current mouse position then add current mouse position to the position array
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;
                pointArray.push([mouseX, mouseY]);
			}
		} else{
            //reset tool once the mouse is let go
			previousMouseX = -1;
			previousMouseY = -1;
            if(drawing){
                //clears all pixels within the designated area
                beginShape();
                for(var i = 0; i < pointArray.length; i++){
                    vertex(pointArray[i][0], pointArray[i][1]);
                }
                endShape(CLOSE);
                pointArray = [];
                drawing = false;
            }
		}
    }//End Draw
    
    this.selectButtonClicked = function (){        
        if(selectMode == 0){
            selectMode+=1;
            selectButton.html("Cut");//next mode
            loadPixels();//store the current frame
        }else if(selectMode == 1){
            selectMode+=1;
            selectButton.html("End Paste");//next mode
            //refresh the screen
            updatePixels();
            //store the cut pixels
            selectedPixels = get(selectedArea.x,
                                 selectedArea.y,
                                 selectedArea.w,
                                 selectedArea.h);
            //draw a white rectangle over the selectd area
            fill(255);
            noStroke();
            rect(selectedArea.x,
                 selectedArea.y,
                 selectedArea.w,
                 selectedArea.h)
            //display angle slider when select mode is 2
            angleSlider.style("display","block");
            angleText.style("display","block");
        }else if(selectMode == 2){
            selectMode = 0;
            updatePixels();
            selectedArea = {x:0,y:0,w:100,h:100};
            selectButton.html("Select Area");//next Mode
            //remove angle slider when select mode is 0
            angleText.style("display","none");
            angleSlider.style("display","none");
        }     
    } //End Select Button Clicked
    
    this.unselectTool = function(){  
        updatePixels();
        //clear options
        select(".options").html("");
            
        fill(colourP.selectedColour);
        stroke(colourP.selectedColour);
    }//End Unselect Tool
    
    this.populateOptions = function(){       
        fill(255);
        stroke(255);
        
        //create Free Seelct Button
        freeFormButton = createButton("Free Select");
        freeFormButton.parent("#options");
        freeFormButton.id("myButton");
        freeFormButton.mousePressed(this.freeFormButtonPressed);

        //Create Select Button
        selectMode = 0;
        selectedArea = {x:0,y:0,w:100,h:100};
        
        selectButton = createButton("Select Area");
        selectButton.parent("#options");
        selectButton.id("myButton");
        selectButton.mousePressed(this.selectButtonClicked);
        
        angleText = createP("Angle");
        angleText.parent("#helpTools");
        angleText.id("text");
        
        angleSlider = createSlider(0,360,0);
        angleSlider.parent("#helpTools");
        angleSlider.id("sizeSlider");
        
        angleText.style("display","none");
        angleSlider.style("display","none");

    }//End Populate Options
    
    this.freeFormButtonPressed = function(){
        if(freeFormMode){
            freeFormMode = false;
            freeFormButton.html("Free Select");
        }else{
            freeFormMode = true;
            freeFormButton.html("End Free Select")
        }
        loadPixels();
    }
        
    this.mousePressed = function(){
        if(!mouseOnCanvas(canvas)){
            return;
        }
        if(selectMode == 1){//selection area to cut
            selectedArea.x = mouseX;
            selectedArea.y = mouseY;
        }
        else if(selectMode == 2){//paste
            push();
            translate(mouseX, mouseY);
            rotateAngle = radians(angleSlider.value());
            rotate(rotateAngle);
            image(selectedPixels,
                  -selectedArea.w/2,
                  -selectedArea.h/2);
            pop();
            loadPixels();
        }
    }//End Mouse Pressed
    
    this.mouseDragged = function(){
        if(selectMode == 1){
            var w = mouseX - selectedArea.x;
            var h = mouseY - selectedArea.y;
            
            selectedArea.w = w;
            selectedArea.h = h;
        }//End Mouse Dragged
    }
}
