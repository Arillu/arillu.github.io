import * as Data from './Data.js?v=9';


let Game_Paused = false;

const LevelExpReq = [100,400,1600]

let GameDate = {"Year":1000,"Month":4,"Day":15,"Hour":7,"Minute":30}

let Current_Location = "spawn_starting_building";

let Player = {
    "Stats":{"Strength":1,"Endurance":1,"Agility":1,"Defense":1,"Intelligence":1,"Wisdom":1,"Dexterity":1,"Resistance":1,"HP":5,"HP_Max":10,"MP":5,"MP_Max":10,"Stam":5,"Stam_Max":10,"Exp":0,"Level":0},
    
    "Current_Action":"nothing",//For loading/saving

    get Current_Location(){ 
        return Current_Location;
    },
    set Current_Location(value){
        Current_Location = value;

        UpdateDialougeUI();
    },

    "Restore_Resource":function(resource_list, amount_list){
        for (let i = 0; i < resource_list.length; i++) {
            let stat = this.Stats[resource_list[i]];
            let stat_max = this.Stats[resource_list[i] + "_Max"];
            const total = stat + amount_list[i];
            stat = (total > stat_max) ? stat_max : total;
        }
        UpdateCharacterBars();
    },
    "Inventory":{}
}



function UpdateTime(){
    const string_minutes = (GameDate.Minute < 10) ? "0" + GameDate.Minute : GameDate.Minute
    const new_date = GameDate.Year + "/" + GameDate.Month + "/" + GameDate.Day + "&nbsp;&nbsp;" + GameDate.Hour + ":" + string_minutes;
    document.getElementById("current_date_time").innerHTML = new_date;
}

function UpdateStats(){
    document.getElementById("stat_str").innerHTML = "Strength: " + Player.Stats.Strength;
    document.getElementById("stat_end").innerHTML = "Endurance: " + Player.Stats.Endurance;
    document.getElementById("stat_agi").innerHTML = "Agility: " + Player.Stats.Agility;
    document.getElementById("stat_def").innerHTML = "Defense: " + Player.Stats.Defense;
    document.getElementById("stat_int").innerHTML = "Intelligence: " + Player.Stats.Intelligence;
    document.getElementById("stat_wis").innerHTML = "Wisdom: " + Player.Stats.Wisdom;
    document.getElementById("stat_dex").innerHTML = "Dexterity: " + Player.Stats.Dexterity;
    document.getElementById("stat_res").innerHTML = "Resistance: " + Player.Stats.Resistance;
}
function UpdateCharacterBars(){
    function Trim(number){
        return ((number*100).toString().substring(0, 5)+"%");
    }
    document.getElementById("char_level").innerHTML = ("Level " + Player.Stats.Level);
    document.getElementById("char_exp").innerHTML = (Player.Stats.Exp + "/" + LevelExpReq[Player.Stats.Level]);
    document.getElementById("exp_bar").style.setProperty('width', Trim(Player.Stats.Exp/LevelExpReq[Player.Stats.Level]));

    document.getElementById("char_hp").innerHTML = (Player.Stats.HP + "/" + Player.Stats.HP_Max);
    document.getElementById("hp_bar").style.setProperty('width', Trim(Player.Stats.HP/Player.Stats.HP_Max));

    document.getElementById("char_stamina").innerHTML = (Player.Stats.Stam + "/" + Player.Stats.Stam_Max);
    document.getElementById("stamina_bar").style.setProperty('width', Trim(Player.Stats.Stam/Player.Stats.Stam_Max));

    document.getElementById("char_mp").innerHTML = (Player.Stats.MP + "/" + Player.Stats.MP_Max);
    document.getElementById("mana_bar").style.setProperty('width', Trim(Player.Stats.MP/Player.Stats.MP_Max));

    return;
}
function UpdateActionUI(){

}
function UpdateDialougeUI(){
    let Option_Holder = document.getElementById("game_dialouge_options_holder");


//clear old options
    let previous_options = Option_Holder.getElementsByClassName("game_dialouge_option");
    for (let i = 0; i < previous_options.length; i++) {
        let div_id_split = previous_options[i].getAttribute("id").split("_");
        let past_location = div_id_split[1];
        previous_options[i].removeEventListener("click", Data.locations.Areas[past_location].options[div_id_split[2]].click);
    }
    Option_Holder.innerHtml = "";
    



//create new options
    let current_location = Data.locations.Areas[Player.Current_Location];
    let dialouge_options = current_location.get_unlocked_options();
    function CreateDialougeOption(option_data){
        let text = option_data.text;
        let id = option_data.id;
        let option = document.createElement("div");
        option.innerHTML = text;
        option.setAttribute("class", "game_dialouge_option");
        option.setAttribute("id", "dialouge_" + Player.Current_Location + "_" + id);
        Option_Holder.appendChild(option);
        option.addEventListener("click", () => option_data.click(Player));
    }

    document.getElementById("game_dialouge_spoken").innerHTML = current_location.top_text;

    for (let i = 0; i < dialouge_options.length; i++) {
        CreateDialougeOption(dialouge_options[i]);
    }
}


function Increase_Time_Date(Minutes) {
    let total_mins = GameDate.Minute + Minutes;

    if (total_mins < 60){
        GameDate.Minute = total_mins;
    }
    else{
        let added_hours = Math.floor(total_mins/60);
        let total_hours = GameDate.Hour + added_hours;
        total_mins = total_mins-(60*added_hours);

        if (total_hours < 24) {
            GameDate.Minute = total_mins;
            GameDate.Hour = total_hours;
        }
        else{
            let added_days = Math.floor(total_hours/24);
            let total_days = GameDate.Day + added_days ;
            total_hours = total_hours - (24*added_days );

            if (total_days < 31){
                GameDate.Minute = total_mins;
                GameDate.Hour = total_hours;
                GameDate.Day = total_days;
            }
            else{
                let added_months = Math.floor(total_days/30);
                let total_months = GameDate.Month + added_months;
                total_days = total_days - (30*added_months);

                if (total_months < 13){
                    GameDate.Minute = total_mins;
                    GameDate.Hour = total_hours;
                    GameDate.Day = total_days;
                    GameDate.Month = total_months;
                }
                else{
                    let added_years = Math.floor(total_months/12);
                    let total_years = GameDate.Year + added_years;
                    total_months = total_months - (12*added_years);

                    GameDate.Minute = total_mins;
                    GameDate.Hour = total_hours;
                    GameDate.Day = total_days;
                    GameDate.Month = total_months;
                    GameDate.Year = total_years
                }
            }
        }
    }

    UpdateTime();
    return
}


let Action = {
    Available:{},
    InAction:false,
    Current:{},
    Start:function(){

    },
    Stop:function(){

    }
}
/*
start game
load actions
-get current action when last saved
-get unlocked actions
-verify usable at location
-create buttons

*/
function Move_Location(){

}



function Add_Item(Item) {
    let Inventory = document.getElementById("inventory_top");
    let Inventory_Count = Inventory.childElementCount;
    let New_Inventory_Slot = document.createElement("div");
    New_Inventory_Slot.setAttribute("class","inventory_slot");
    New_Inventory_Slot.setAttribute("id","inventory_item_"+(Inventory_Count+1));
    New_Inventory_Slot.innerHTML = Item;
    Inventory.appendChild(New_Inventory_Slot);
}













let TimeSinceSaved = 0;

function Save_Game() {
    let savedata = {"GameDate":GameDate, "CharacterStats":Player.Stats,"Current_Location":Current_Location}
    localStorage.setItem("test_data", JSON.stringify(savedata));
    console.log("Game Saved");
    return 0; //used to set TimeSinceSaved
}


async function Game_Loop() {
    
    if (!Game_Paused){
        Increase_Time_Date(1);
        Data.actions[Player.Current_Action]();
    }
    else{
       console.log("game paused");
    }
    TimeSinceSaved = TimeSinceSaved >= 20 ? Save_Game() : TimeSinceSaved+1;
}


function Load_Game() {
    let retrive_data = localStorage.getItem("test_data");
    if (retrive_data) {
        retrive_data = JSON.parse(retrive_data);

        GameDate = retrive_data.GameDate;

        Player.Stats = retrive_data.CharacterStats;
        Player.Current_Action = retrive_data.Current_Action;
        Current_Location = retrive_data.Current_Location;
    }

        UpdateTime();
        UpdateStats();
        UpdateCharacterBars();

        UpdateActionUI();
        UpdateDialougeUI();

    setInterval(Game_Loop, 1000);
}
window.addEventListener('load', Load_Game, {once:true})

