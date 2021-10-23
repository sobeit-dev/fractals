RENDER_WIN = SVG().addTo('#main-render-win');
RENDER_BOX = document.getElementById("main-render-win");
RENDER_WIN_CANVAS = document.createElement('canvas');
RENDER_WIN_CANVAS.style.display = "none";
RENDER_WIN_SVG = RENDER_BOX.childNodes[0];
RENDER_BOX.append(RENDER_WIN_CANVAS);

// ---------- ZOOM AND MOVE ----------

function SetViewBox() 
{
    const box = RENDER_WIN_SVG.getBBox();
    RENDER_WIN_SVG.setAttribute('viewBox', `${box.x - 10} ${box.y - 10} ${box.width + 20} ${box.height + 20}`);
}

let 
    panning = false,
    pointX = 0,
    pointY = 0,
    scale = 1,
    start = { x: 0, y: 0 },
    is_double_t = false;
    t_dist = 0;

function setTransform() 
{
    RENDER_WIN_SVG.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
    RENDER_WIN_CANVAS.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

RENDER_BOX.onmousedown = function (e) 
{
    e.preventDefault();
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    panning = true;
}

RENDER_BOX.onmouseup = function (e) {panning = false;}

RENDER_BOX.onmousemove = function (e) 
{
    e.preventDefault();
    if (!panning) return;
    
    pointX = (e.clientX - start.x);
    pointY = (e.clientY - start.y);
    setTransform();
}

RENDER_BOX.onwheel = function (e) 
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

SenseInit();

function SenseInit() 
{
    RENDER_BOX.addEventListener("touchstart", SenseStart, false);
    RENDER_BOX.addEventListener("touchend", SenseEnd, false);
    RENDER_BOX.addEventListener("touchmove", SenseMove, false);
}

function SenseStart(evt) 
{
    evt.preventDefault();
    let touches = evt.changedTouches;
    switch(evt.touches.length) 
    {
        case 1:
        {
            start = { x: touches[0].pageX - pointX, y: touches[0].pageY - pointY };
            panning = true;
            break;
        }
        case 2:
        {
            is_double_t = true;
            break;
        } 
        default: break;
    }
}

function SenseEnd(evt)
{
    evt.preventDefault();
    switch (evt.touches.length) 
    {
        case 1:
        {
            panning = false;
            break;
        }
        default: break;
    }
}

function SenseMove(evt)
{
    evt.preventDefault();
    let touches = evt.changedTouches;
    switch (evt.touches.length) 
    {
        case 1:
        {
            if (!panning) return;
            pointX = (touches[0].pageX - start.x);
            pointY = (touches[0].pageY - start.y);
            setTransform();
            break;
        }
        case 2:
        {
            if(is_double_t)
            {
                t_dist = Math.sqrt(Math.pow((touches[1].pageX - touches[0].pageX), 2) + Math.pow((touches[1].pageY - touches[0].pageY), 2));
                is_double_t = false;
            }
            let l_t_dist = Math.sqrt(Math.pow((touches[1].pageX - touches[0].pageX), 2) + Math.pow((touches[1].pageY - touches[0].pageY), 2));

            let 
                xs = ((touches[1].pageX + touches[0].pageX) / 2 - pointX) / scale,
                ys = ((touches[1].pageY + touches[0].pageY) / 2 - pointY) / scale;

            if(t_dist < l_t_dist) scale *= 1.03;
            if(t_dist > l_t_dist)
                if(scale < 0.5) return;
                else scale /= 1.03;

            pointX = ((touches[1].pageX + touches[0].pageX) / 2) - xs * scale;
            pointY = ((touches[1].pageY + touches[0].pageY) / 2) - ys * scale;

            setTransform();
            break;
        }
        default: break;
    }
}