function Element(element) {
    this.el = element;
    this.isRect = false;
    return this;
}

var el = Element.prototype,
    selectedElement = 0,
    oldX = 0,
    currX = 0,
    currY = 0,
    currentMatrix = 0;

/**
 * DRAG OBJECT EVENT METHOD
 */
el.selectToDragElement = function(e) {
    var selectedElement = e.target,
        currX = e.clientX,
        currY = e.clientY,
        moveElement = _moveElement,
        deselectElement = _deselectElement,
        currentMatrix = selectedElement.getAttributeNS(null, "transform").slice(7, -1).split(' ');

    for (var i = 0; i < currentMatrix.length; i++) {
        currentMatrix[i] = parseFloat(currentMatrix[i]);
    }

    //method that moves the selected element to the mouse position
    function _moveElement(event) {
        var dx = event.clientX - currX,
            dy = event.clientY - currY;
        currentMatrix[4] += dx;
        currentMatrix[5] += dy;
        var newMatrix = 'matrix(' + currentMatrix.join(" ") + ')';

        selectedElement.setAttributeNS(null, "transform", newMatrix);
        currX = event.clientX;
        currY = event.clientY;
    }

    //deselect event method used to remove events from the selected element
    function _deselectElement(event) {
        if (selectedElement != 0) {
            selectedElement.removeAttributeNS(null, 'onmousemove');
            selectedElement.removeAttributeNS(null, 'onmouseout');
            selectedElement.removeAttributeNS(null, 'onmouseup');
            selectedElement = 0;
        }
    }

    selectedElement.addEventListener('mousemove', moveElement);
    selectedElement.addEventListener('mouseout', deselectElement);
    selectedElement.addEventListener('mouseup', deselectElement);
}

/**
 * SCALE OBJECT EVENT METHOD
 */
el.selectToScaleElement = function(e) {
    var selectedElement = e.target,
        currentWidth = selectedElement.getAttributeNS(null, 'width'),
        currentHeight = selectedElement.getAttributeNS(null, 'height'),
        resize = _resize,
        rescale = _rescale,
        deselectElement = _deselectElement,
        currentRadius = selectedElement.getAttributeNS(null, 'r');

    /**
     * Scaling for Rects
     */
    //method to scale element up
    function _upsize() {
        selectedElement.setAttributeNS(null, 'width', currentWidth);
        selectedElement.setAttributeNS(null, 'height', currentHeight);
        currentWidth = Number(currentWidth) + 1.8;
        currentHeight = Number(currentHeight) + 1.8;
    }

    //method to scale element down
    function _downsize() {
        selectedElement.setAttributeNS(null, 'width', currentWidth);
        selectedElement.setAttributeNS(null, 'height', currentHeight);
        currentWidth = Number(currentWidth) - 1.8;
        currentHeight = Number(currentHeight) - 1.8;
    }
    /**
     * Scaling for Circles
     */
    function _upScale(e) {
        selectedElement.setAttributeNS(null, 'r', currentRadius);
        currentRadius = Number(currentRadius) + 1.8;
    }

    function _downScale(e) {
        selectedElement.setAttributeNS(null, 'r', currentRadius);
        currentRadius = Number(currentRadius) - 1.8;
    }

    //RECT - method to resize element depending on the direction the mouse is pursuing
    function _resize(e) {

        if (e.pageX > oldX) {
            _upsize();
        } else if (e.pageX < oldX) {
            _downsize();
        }
        oldX = e.pageX;
    }
    //CIRCLE - method to resize element depending on the direction the mouse is pursuing
    function _rescale(e) {
        if (e.pageX > oldX) {
            _upScale(e);
        } else if (e.pageX < oldX) {
            _downScale(e);
        }
        oldX = e.pageX;
    }

    //deselect event method used to remove events from the selected element
    function _deselectElement() {
        if (selectedElement != 0) {
            selectedElement.removeAttributeNS(null, 'onmousemove');
            selectedElement.removeAttributeNS(null, 'onmouseout');
            selectedElement.removeAttributeNS(null, 'onmouseup');
            selectedElement = 0;
        }
    }
    if (selectedElement.isRect) {
        selectedElement.addEventListener('mousemove', resize);
    } else {
        selectedElement.addEventListener('mousemove', rescale);
    }
    selectedElement.addEventListener('mouseout', deselectElement);
    selectedElement.addEventListener('mouseup', deselectElement);
}

/**
 * TODO
 */
// el.selectToDragControlPoint = function(e) {
//     var selectedElement = element,
//         controlPoint,
//         dx = event.clientX - positionX,
//         dy = event.clientY - positionY,
//         movementX = parseInt(element.getLineX()) + dx,
//         movementY = parseInt(element.getLineY()) + dy,
//         translate = 'translate(' + movementX + ', ' + movementY + ')';

//     if(e.target.tagName === 'circle') {
//         controlPoint = e.target;
//     }
//     controlPoint.attr('cx', movementX)
//         .attr('cy', movementY);

//     selectedElement.attr('x2', movementX)
//         .attr('y2', movementY);

//     positionX = event.clientX;
//     positionY = event.clientY;
// }

//add attribute and return the element for method chaining
el.attr = function(key, value) {
    this.el.setAttributeNS(null, key, value);
    return this;
}

//append an element and return the parent element for method chaining
el.append = function(element) {
    if (element.el) {
        this.el.appendChild(element.el);
    } else {
        this.el.appendChild(element);
    }
    return this;
}
el.addEvent = function(event, cb) {
    this.el.addEventListener(event, cb);
    return this;
}

el.removeEvent = function(event, fn) {
    this.el.removeEventListener(event, fn);
    return this;
}

el.getX = function(element) {
    return this.el.getAttributeNS(null, 'x');
}
el.getLineX = function(element) {
    return this.el.getAttributeNS(null, 'x2');
}

el.getY = function(element) {
    return this.el.getAttributeNS(null, 'y');
}
el.getLineY = function(element) {
    return this.el.getAttributeNS(null, 'y2');
}