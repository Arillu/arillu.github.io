

const char_buttons = ["stats","equipment","tools"];
const action_buttons = ["action","skill","combat","travel","crafting"];


function statholder(show) {
    let hide =  Object.assign([], char_buttons);
    hide.splice(hide.indexOf(show),1);

    hide.forEach((name)=>{
        document.getElementById("char_" + name).setAttribute("hidden",'');
    });

    document.getElementById("char_" + show).removeAttribute("hidden");
}


function actionmenu(show) {
    let hide =  Object.assign([], action_buttons);
    hide.splice(hide.indexOf(show),1);

    hide.forEach((name)=>{
        document.getElementById(name + "_list_holder").setAttribute("hidden",'');
    });

    document.getElementById(show + "_list_holder").removeAttribute("hidden");

}


function EnableButtons() {
    char_buttons.forEach((name)=>{
        document.getElementById("character_button_" + name).addEventListener("click", () => statholder(name));
    });
    action_buttons.forEach((name)=>{
        document.getElementById(name + "_list_button").addEventListener("click", () => actionmenu(name));
    });
}

window.addEventListener('load', EnableButtons, {once:true});

