let EInputs = {};

// ---------- ELEMENTS ----------

let C_SETTINGS = document.getElementById("const-settings");
let E_SETTINGS = document.getElementById("extra-settings");
let B_BUTTON = document.getElementById("build");

// ---------- MENU ----------

// C_SETTINGS
let fract_list = ListBoxInit("Тип:",C_SETTINGS);
let p_width_i = AddIntInput(1, 5, 2, "Толщина линии:", C_SETTINGS);
let p_color_i = AddColorInput("#e66465", "Цвет линии:", C_SETTINGS);
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
        AddInListBox(select, "NULL TEST",  1);
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
            EInputs.level = AddIntInput(1, 16, 10, "Глубина:", parent);
            EInputs.angle = AddIntInput(1, 180, 15, "Угол:", parent);
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
            DrawTree(0, 0, -90, Number(EInputs.level.value) | 2);
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
    line.stroke({ color: p_color_i.value, width: p_width_i.value, linecap: 'round' });
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
DrawTree(0, 0, -90, Number(EInputs.level.value)); SetViewBox();