


let Game_Paused = false;



const LevelExpReq = [100,400,1600]

let GameDate = {"Year":1000,"Month":4,"Day":15,"Hour":7,"Minute":30}
let CharacterStats = {"Strength":1,"Endurance":1,"Agility":1,"Defense":1,"Intelligence":1,"Wisdom":1,"Dexterity":1,"Resistance":1,
    "HP":10,"HP_Max":10,"MP":10,"MP_Max":10,"Stam":10,"Stam_Max":10,"Exp":0,"Level":0}




function UpdateTime(){
    const string_minutes = (GameDate.Minute < 10) ? "0" + GameDate.Minute : GameDate.Minute
    const new_date = GameDate.Year + "/" + GameDate.Month + "/" + GameDate.Day + "&nbsp;&nbsp;" + GameDate.Hour + ":" + string_minutes;
    document.getElementById("current_date_time").innerHTML = new_date;
}

function UpdateStats(){
    document.getElementById("stat_str").innerHTML = "Strength: " + CharacterStats.Strength;
    document.getElementById("stat_end").innerHTML = "Endurance: " + CharacterStats.Endurance;
    document.getElementById("stat_agi").innerHTML = "Agility: " + CharacterStats.Agility;
    document.getElementById("stat_def").innerHTML = "Defense: " + CharacterStats.Defense;
    document.getElementById("stat_int").innerHTML = "Intelligence: " + CharacterStats.Intelligence;
    document.getElementById("stat_wis").innerHTML = "Wisdom: " + CharacterStats.Wisdom;
    document.getElementById("stat_dex").innerHTML = "Dexterity: " + CharacterStats.Dexterity;
    document.getElementById("stat_res").innerHTML = "Resistance: " + CharacterStats.Resistance;
}
function UpdateCharacterBars(){
    function Trim(number){
        return ((number*100).toString().substring(0, 5)+"%");
    }
    document.getElementById("char_level").innerHTML = ("Level " + CharacterStats.Level);
    document.getElementById("char_exp").innerHTML = (CharacterStats.Exp + "/" + LevelExpReq[CharacterStats.Level]);
    document.getElementById("exp_bar").style.setProperty('width', Trim(CharacterStats.Exp/LevelExpReq[CharacterStats.Level]));

    document.getElementById("char_hp").innerHTML = (CharacterStats.HP + "/" + CharacterStats.HP_Max);
    document.getElementById("hp_bar").style.setProperty('width', Trim(CharacterStats.HP/CharacterStats.HP_Max));

    document.getElementById("char_stamina").innerHTML = (CharacterStats.Stam + "/" + CharacterStats.Stam_Max);
    document.getElementById("stamina_bar").style.setProperty('width', Trim(CharacterStats.Stam/CharacterStats.Stam_Max));

    document.getElementById("char_mp").innerHTML = (CharacterStats.MP + "/" + CharacterStats.MP_Max);
    document.getElementById("mana_bar").style.setProperty('width', Trim(CharacterStats.MP/CharacterStats.MP_Max));

    return;
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
    let data = {"GameDate":GameDate, "CharacterStats":CharacterStats}
    localStorage.setItem("test_data", JSON.stringify(data));
    console.log("Game Saved");
    return 0; //used to set TimeSinceSaved
}


async function Game_Loop() {
    
    if (!Game_Paused){
        Increase_Time_Date(1);
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

        CharacterStats = retrive_data.CharacterStats;
    }

        UpdateTime();
        UpdateStats();
        UpdateCharacterBars();


    setInterval(Game_Loop, 1000);
}
window.addEventListener('load', Load_Game, {once:true})
