

const char_buttons = ["stats","equipment","tools"];
const action_buttons = ["action","skill","combat","travel","crafting"];


function statholder(show) {
    let hide =  Object.assign([], char_buttons);
    hide.splice(hide.indexOf(show),1);

    for (let i = 0; i < hide.length; i++) {
        document.getElementById("char_" + hide[i]).setAttribute("hidden",'');
    }

    document.getElementById("char_" + show).removeAttribute("hidden");
}


function actionmenu(show) {
    let hide =  Object.assign([], action_buttons);
    hide.splice(hide.indexOf(show),1);

    for (let i = 0; i < hide.length; i++) {
        document.getElementById(hide[i] + "_list_holder").setAttribute("hidden",'');
    }

    document.getElementById(show + "_list_holder").removeAttribute("hidden");

}


function EnableButtons() {
    for (let i = 0; i < char_buttons.length; i++) {
        document.getElementById("character_button_" + char_buttons[i]).addEventListener("click", () => statholder(char_buttons[i]));
    }
    for (let i = 0; i < action_buttons.length; i++) {
        document.getElementById(action_buttons[i] + "_list_button").addEventListener("click", () => actionmenu(action_buttons[i]));
    }
}

window.addEventListener('load', EnableButtons, {once:true});

