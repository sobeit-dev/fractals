RENDER_WIN = SVG().addTo('#main-render-win');
let RENDER_BOX = document.getElementById("main-render-win");
let RENDER_WIN_ELEMENT = RENDER_BOX.childNodes[0];

// ---------- ZOOM AND MOVE ----------

function SetViewBox() 
{
    const box = RENDER_WIN_ELEMENT.getBBox();
    RENDER_WIN_ELEMENT.setAttribute('viewBox', `${box.x - 10} ${box.y - 10} ${box.width + 20} ${box.height + 20}`);
}

let 
    panning = false,
    pointX = 0,
    pointY = 0,
    scale = 1,
    start = { x: 0, y: 0 };

function setTransform() 
{
    RENDER_WIN_ELEMENT.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

RENDER_WIN_ELEMENT.onmousedown = function (e) 
{
    e.preventDefault();
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    panning = true;
}

RENDER_WIN_ELEMENT.onmouseup = function (e) {panning = false;}

RENDER_WIN_ELEMENT.onmousemove = function (e) 
{
    e.preventDefault();
    if (!panning) return;
    
    pointX = (e.clientX - start.x);
    pointY = (e.clientY - start.y);
    setTransform();
}

RENDER_WIN_ELEMENT.onwheel = function (e) 
{
    e.preventDefault();
    let 
        xs = (e.clientX - pointX) / scale,
        ys = (e.clientY - pointY) / scale,
        delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
    
    if(delta > 0)
        scale *= 1.2;
    else
    {
        if(scale < 0.25) return;
        scale /= 1.2;
    }

    pointX = e.clientX - xs * scale;
    pointY = e.clientY - ys * scale;
    setTransform();
}