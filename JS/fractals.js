let EInputs = {};

// ---------- ELEMENTS ----------

let C_SETTINGS = document.getElementById("const-settings");
let E_SETTINGS = document.getElementById("extra-settings");
let B_BUTTON = document.getElementById("build");

// ---------- MENU ----------

// C_SETTINGS
let fract_list = ListBoxInit("Тип:",C_SETTINGS);
let p_color_i = AddColorInput("#e66465", "Цвет:", C_SETTINGS);
// E_SETTINGS
RenderESettings(E_SETTINGS);
// ---------- MENU FUNCTION ----------
function AddIntInput(min, max, def, text, parent)
{
    let div = document.createElement("div");
    div.classList.add("setting");

    let p = document.createElement("p");
    p.innerText = text

    let input = document.createElement("input");
    input.type = "number";
    input.max = max;
    input.min = min;
    input.value = def;
    input.required = true;

    div.append(p);
    div.append(input);
    parent.append(div);
    return input;
}

function AddColorInput(def, text, parent)
{
    let div = document.createElement("div");
    div.classList.add("setting");

    let p = document.createElement("p");
    p.innerText = text

    let input = document.createElement("input");
    input.type = "color";
    input.value = def;

    div.append(p);
    div.append(input);
    parent.append(div);
    return input;
}

function ListBoxInit(text, parent)
{
    let div = document.createElement("div");
    div.classList.add("setting");

    let p = document.createElement("p");
    p.innerText = text;

    let select = document.createElement("select");

    //
        AddInListBox(select, "Дерево",  0);
        AddInListBox(select, "Мандельброт",  1);
    //

    div.append(p);
    div.append(select);
    parent.append(div);
    return select;
}

function AddInListBox(box, text, id)
{
    let opt = document.createElement("option");
    opt.value = id;
    opt.text = text;
    box.add(opt, null);
}

function RenderESettings(parent)
{
    parent.innerText = "";
    switch(Number(fract_list.value))
    {
        case 0: // tree
        {
            EInputs.p_width_i = AddIntInput(1, 5, 2, "Толщина линии:", parent);
            EInputs.level = AddIntInput(1, 16, 10, "Глубина:", parent);
            EInputs.angle = AddIntInput(1, 180, 15, "Угол:", parent);
            break;
        }
        case 1: // mandelbrot
        {
            EInputs.level = AddIntInput(5, 3000, 100, "Глубина:", parent);
            EInputs.size = AddIntInput(200, 6000, 2000, "Разрешение:", parent);
            // EInputs.bX = AddIntInput(-3000, 3000, 0, "X:", parent);
            // EInputs.bY = AddIntInput(-3000, 3000, 0, "Y:", parent);
            // EInputs.bZ = AddIntInput(-3000, 3, 2, "Масштаб:", parent);
            break;
        }
        default:
        {
            E_SETTINGS.innerText = "UNKNOW";
            return;
        }
             
    }
}

// ---------- MENU EVENTS ----------

B_BUTTON.onclick = function()
{
    RENDER_WIN.clear();
    switch(Number(fract_list.value))
    {
        case 0: // tree
        {
            RENDER_WIN_SVG.style.display = "";
            RENDER_WIN_CANVAS.style.display = "none";
            DrawTree(0, 0, -90, Number(EInputs.level.value));
            break;
        }
        case 1: // mandelbrot
        {
            RENDER_WIN_SVG.style.display = "none";
            RENDER_WIN_CANVAS.style.display = "";
            RENDER_WIN_CANVAS.width = EInputs.size.value;
            RENDER_WIN_CANVAS.height = EInputs.size.value;

            // mandelbrot( RENDER_WIN_CANVAS,
            //             EInputs.bY.value-EInputs.bZ.value,
            //             EInputs.bX.value+EInputs.bZ.value,
            //             EInputs.bX.value-EInputs.bZ.value,
            //             EInputs.bY.value+EInputs.bZ.value,
            //             EInputs.level.value, p_color_i.value);

            mandelbrot( RENDER_WIN_CANVAS,
                        -2,
                        2,
                        -2,
                        2,
                        EInputs.level.value, p_color_i.value);

            break;
        }
        default:
        {
            RENDER_WIN.text("UNKNOW");
            RENDER_WIN.font({ fill: '#f06', family: 'Inconsolata' })
        }  
    }
    SetViewBox();
}

fract_list.onchange = function()
{
    RenderESettings(E_SETTINGS);
}

for(let input in EInputs)
{
    if (EInputs.hasOwnProperty(input)) 
    {
        if(EInputs[input].max === undefined || EInputs[input].min === undefined) continue;
        EInputs[input].onchange = function()
        {
            if(Number(EInputs[input].value) > Number(EInputs[input].max)) EInputs[input].value = EInputs[input].max;
            if(Number(EInputs[input].value) < Number(EInputs[input].min)) EInputs[input].value = EInputs[input].min;
        }
    }
}

// ---------- SVG FUNCTION ----------

function DrawLine(x1, y1, x2, y2)
{
    let line = RENDER_WIN.line(x1, y1, x2, y2);
    line.stroke({ color: p_color_i.value, width: EInputs.p_width_i.value, linecap: 'round' });
}

function hexToRgb(hex) 
{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

// ---------- FRACTALS FUNCTION ----------

// tree
const deg2rad = Math.PI / 180.0;
function DrawTree(x1, y1, angle, level) 
{ 
    if (level) 
    {
        let x2 = x1 + (Math.cos(angle * deg2rad) * level * 8.);
        let y2 = y1 + (Math.sin(angle * deg2rad) * level * 8.);
        DrawLine(x1, y1, x2, y2);
        DrawTree(x2, y2, angle - Number(EInputs.angle.value), level - 1);
        DrawTree(x2, y2, angle + Number(EInputs.angle.value), level - 1);
    }
}

window.onload = function() 
{
    //костыльная инициализация первого фрактала
    DrawTree(0, 0, -90, Number(EInputs.level.value));
    SetViewBox();
    RENDER_WIN.clear();
    DrawTree(0, 0, -90, Number(EInputs.level.value));
};

// mandelbrot
function mandelbrotIteration (cx, cy, maxIter) {
    var x = 0.0;
    var y = 0.0;
    var xx = 0;
    var yy = 0;
    var xy = 0;
    var i = maxIter;
    while (i-- && xx + yy <= 4) {
     xy = x * y;
     xx = x * x;
     yy = y * y;
     x = xx - yy + cx;
     y = xy + xy + cy;
    }
    return maxIter - i;
   }
    
   function mandelbrot (canvas, xmin, xmax, ymin, ymax, iterations, color_s) {
    var width = canvas.width;
    var height = canvas.height;
    var context = canvas.getContext('2d');
    var image = context.getImageData(0, 0, width, height);
    var pixels = image.data;
   
    for (var ix = 0; ix < width; ++ix) {
     for (var iy = 0; iy < height; ++iy) {
      var x = xmin + (xmax - xmin) * ix / (width - 1);
      var y = ymin + (ymax - ymin) * iy / (height - 1);
      var i = mandelbrotIteration(x, y, iterations);
      var pixels_position = 4 * (width * iy + ix);
      if (i > iterations) {
       pixels[pixels_position] = 0;
       pixels[pixels_position + 1] = 0;
       pixels[pixels_position + 2] = 0;
      } 
      else {
       var color = 2 * Math.log(i) / Math.log(iterations - 1.0);
       if (color < 1) {
        pixels[pixels_position] = hexToRgb(color_s).r * color;
        pixels[pixels_position + 1] = hexToRgb(color_s).g;
        pixels[pixels_position + 2] = hexToRgb(color_s).b;
       }
       else if ( color < 2 ) {
        pixels[pixels_position] = hexToRgb(color_s).r;
        pixels[pixels_position + 1] = hexToRgb(color_s).g * (color - 1);
        pixels[pixels_position + 2] = hexToRgb(color_s).b;
       } 
       else {
        pixels[pixels_position] = hexToRgb(color_s).r;
        pixels[pixels_position + 1] = hexToRgb(color_s).g;
        pixels[pixels_position + 2] = hexToRgb(color_s).b * (color - 2);
       }
      }
      pixels[pixels_position + 3] = 255;
     }
    }
    context.putImageData(image, 0, 0);
   }
