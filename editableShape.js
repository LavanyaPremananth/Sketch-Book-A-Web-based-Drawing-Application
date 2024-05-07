function EditableShape(){
    this.icon = "assets/editableShape.jpg";
    this.name = "editableShape";
    
    var shapeButton;
    var shapeMode = false;
    var shapeSelect;
    let shapes = ["Rectangle", "Triangle", "Circle"];//available shapes 
    
    //the current shape changes via the dropbox DOM event handler 
    let selectedShape = shapes[0];
    
    //stores the box of based on user interaction
    //type: {x:0, y:0, w:0, h:0}
    
    let state = null; 
    
    var editMode = false;
    
    var currentShape = [];
    
    this.draw = function(){
        updatePixels();
        //draw shapes e.g Rectangle, Triangle, Circle 
        if(shapeMode && mouseIsPressed ){
            // 1. starts drawing the shape
            if (state.x == -1 && state.y == -1) {
                state.x = mouseX;
                state.y = mouseY;
            } else{
                //2. dragging the mouse
                state.w = mouseX - state.x;
                state.h = mouseY - state.y;
                //reset the canvas and draw the new shape
                updatePixels();
                if(selectedShape == "Rectangle") {
                    rect(state.x, state.y, state.w, state.h);
                } else if (selectedShape == "Triangle") {
                    // equiateral triangle around the initial point
                    // x1, y1 = state.x, state.y - state.h
                    // y2, y3 = state.h + state.y
                    // x2 = state.x - state.w
                    // x3 = state.x + state.w
                    triangle(state.x, state.y - state.h, 
                             state.x - state.w, state.y + state.h, 
                             state.x + state.w, state.y + state.h);
                } else if (selectedShape == "Circle") {
                    // circle around x, y with radius = max(width, height)
                    ellipse(state.x, state.y, Math.max(state.w, state.h) * 2.0);
                }
            }
        } else {
            // 3. let go mouse so stop drawing
            if (state.x != -1) {
                resetState();
                // save the copy of image in memory permenantly
                loadPixels();
            }//end if
        }//end else

        //draw free hand & edit vertices 
        if(mouseOnCanvas(canvas) && !shapeMode &&  mouseIsPressed){
            if(!editMode){//not in edit mode
                //in drawing mode
                //save all the mouse position as vertices 
                currentShape.push({x:mouseX,
                                   y:mouseY});
            }else{//in edit mode
                //look for the nearest vertecx and move it 
                //with the mouse positions
                for(var i=0; i < currentShape.length; i++){
                    var d = dist(currentShape[i].x,
                                 currentShape[i].y,
                                 mouseX,
                                 mouseY);
                    if(d<15){
                        currentShape[i].x = mouseX;
                        currentShape[i].y = mouseY;
                    }
                }//end for
            }//end if else
        }//end if

        //redraw the drawing using vertices in currentShape Array
        beginShape();
        for(var i = 0; i < currentShape.length; i++){
            vertex(currentShape[i].x, currentShape[i].y);
            
            if(editMode){
                //if in edit mode,
                //draw each vertex as a small red circle
                fill("red");
                ellipse(currentShape[i].x, currentShape[i].y, 10);
                noFill();
            }//end if
        }//end for
        endShape();
    }//End Draw 
    
    this.unselectTool = function(){
        this.finishButtonPressed();
        updatePixels();
        //clear options
        select(".options").html("");
    }//End Unselect
    
    this.populateOptions = function(){
        noFill();
        //when user clicks on the Editable Shape
        //load all the pixels on the convas to memory
        loadPixels();
        
        //Cereate Shape Button
        shapeButton = createButton("Shapes");
        shapeButton.mousePressed(this.shapeButtonPressed);
        shapeButton.id("myButton");
        shapeButton.parent("#options");
        
        //Create Edit Button
        editButton = createButton("Edit Line");
        editButton.mousePressed(this.editButtonPressed);
        editButton.id("myButton")
        editButton.parent("#options");
        
        //Create FinishButton
        finishButton = createButton("Final Line");
        finishButton.mousePressed(this.finishButtonPressed);
        finishButton.id("myButton");
        finishButton.parent("#options");
        
        editButton.style("display","none");
        finishButton.style("display","none");
    }//End Populate Options
    
    this.shapeButtonPressed = function(){
        if(shapeMode){
            shapeMode = false;
            shapeButton.html("Shapes");
            shapeSelect.style("display","none");
        } else{
            shapeMode = true;
            shapeButton.html("End Shapes"); 
            
            //Create Shape Select
            shapeSelect = createSelect();
            for(let i = 0; i < shapes.length; i++){
                shapeSelect.option(shapes[i]);
            }
            shapeSelect.id("myButton");
            shapeSelect.parent("#options");
            shapeSelect.changed(()=> {
                selectedShape = shapeSelect.value();
            });
        }
    }//End shapeButtonPressed
    
    this.editButtonPressed = function(){
        if(editMode){
            editMode = false;
            editButton.html("Edit Shape");
        } else{
            editMode = true;
            editButton.html("Add Vertices");
        }
    }//End editButtonPressed
    
    this.finishButtonPressed = function(){
        editMode = false;
        editButton.html("Edit Shape");
        
        draw();
        loadPixels();
        currentShape = [];
        
        editButton.style("display","none");
        finishButton.style("display","none");
    }//End finishButtonPressed
    
    this.mouseReleased = function(){
        if(mouseOnCanvas(canvas) && !editMode){
            editButton.style("display","block");
            finishButton.style("display","block");
        }
        if(shapeMode){
            loadPixels();
            editButton.style("display","none");
            finishButton.style("display","none");           
        }
    }//End mouseReleased
    
    //restate
    let resetState = function() {
        state = {
            x: -1, 
            y: -1,
            w: -1,
            h: -1
        }
    }
    resetState();
}

