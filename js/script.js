var homediv = document.getElementById("home");
var eSpan = document.getElementById("editable");
var visitor_name = document.getElementsByClassName("visitor_name");


var workdiv = document.getElementsByClassName("work_single")
//var hoverImg = document.getElementById('x');

for (var i = 0; i < workdiv.length; i++) {
    workdiv[i].addEventListener('mousemove', getPos);

}


function getPos(e) {
    var hoverImg = e.target.firstElementChild;
    var rect = this.getBoundingClientRect();
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    hoverImg.style.left = (x + 20) + 'px';
    hoverImg.style.top = (y + 40) + 'px';

}


// function nightMode() {
//     var d = new Date();
//     var n = d.getHours();
//     if (n >= 19 || n <= 6) {
//         document.body.className = "night";
//     }
// }

// nightMode();

function selectElementContents(el) {
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}


eSpan.addEventListener("click", function(event) {
    //selectElementContents(this);
    if (this.innerText === 'friend') {
        this.innerText = '';
    }
});

eSpan.addEventListener("blur", function(event) {
    //selectElementContents(this);
    var contentStored = localStorage.getItem('visitor');
    if (contentStored) {
        this.innerText = contentStored;
    } else {
        this.innerText = 'friend';
    }
});

window.onload = function() {

    localStore.loadLocalStorage();
    localStore.updateVistorName();

    eSpan.focus();
    // var temp_value = eSpan.innerHTML; 
    // eSpan.innerHTML = ''; 
    // eSpan.innerHTML = temp_value;

    var arr = new Array()
    var start = 0;
    var end = start + 1;
    arr[0] = eSpan.innerText;
    eSpan.innerText = '';

    function write() {
        setTimeout(function() {
            eSpan.innerText = eSpan.innerText + arr[0].slice(start, end);
            start++;
            end = start + 1;
            if (arr[0].slice(start, end) !== '') {
                write();
                setEndOfContenteditable(eSpan);
            }
            setEndOfContenteditable(eSpan);
        }, 200);
    }
    write();
    setEndOfContenteditable(eSpan);


};
// end on load


eSpan.addEventListener("keyup", function(event) {
    localStore.saveLocalStorage();
    if (event.which == 13 || event.keyCode == 13) {
        eSpan.classList.add("highlight");
        document.activeElement.blur();
        setTimeout(function() {
            eSpan.classList.remove("highlight");
        }, 500);
    }
    localStore.updateVistorName();
});


var localStore = {
    saveLocalStorage: function() {
        localStorage.setItem('visitor', eSpan.innerText);
    },
    loadLocalStorage: function() {
        var contentStored = localStorage.getItem('visitor');
        if (contentStored) {
            eSpan.innerText = contentStored;
        }
    },
    updateVistorName: function() {
        var contentStored = localStorage.getItem('visitor');
        Array.prototype.forEach.call(visitor_name, function(element, index, array) {
            var commapos = element.getAttribute("data-comma");
            if (contentStored) {
                if (commapos === 'after') {
                    element.innerText = contentStored + ', ';
                }

                if (commapos === 'before') {
                    element.innerText = ', ' + contentStored;
                }

                if (commapos === 'none') {
                    element.innerText = contentStored;
                }
            }
        });

    }
}

function setEndOfContenteditable(contentEditableElement) {
    var range, selection;
    if (document.createRange) //Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange(); //Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection(); //get the selection object (allows you to change selection)
        selection.removeAllRanges(); //remove any selections already made
        selection.addRange(range); //make the range you have just created the visible selection
    } else if (document.selection) //IE 8 and lower
    {
        range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        range.select(); //Select the range (make it the visible selection
    }
}