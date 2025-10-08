import * as Data from './Data.js?v=22';


let Game_Paused = false;

const LevelExpReq = [100,400,1600]

let GameDate = {"Year":1000,"Month":4,"Day":15,"Hour":7,"Minute":30}
let Current_Location = "spawn_starting_building";
let Current_Action = "nothing"
let Item_Currently_Viewing = null;

let Player = {
    "Stats":{"Strength":1,"Endurance":1,"Agility":1,"Defense":1,"Intelligence":1,"Wisdom":1,"Dexterity":1,"Resistance":1,"HP":5,"HP_Max":10,"MP":5,"MP_Max":10,"Stam":5,"Stam_Max":10,"Exp":0,"Level":0},
    
    TotalStats:GetTotalStats,

    get Current_Action(){ 
        return Current_Action;
    },
    set Current_Action(value){
        Current_Action = value;

    },

    get Current_Location(){ 
        return Current_Location;
    },
    set Current_Location(value){
        Current_Location = value;

        UpdateDialougeUI();
    },
    Restore_Resource:function(resource_list){
        for (let i = 0; i < resource_list.length; i++) {
            let stat = this.Stats[resource_list[i][0]];
            let stat_max = this.Stats[resource_list[i][0] + "_Max"];
            let total = stat + resource_list[i][1];
            this.Stats[resource_list[i][0]] = (total > stat_max) ? stat_max : total;
        }
        UpdateCharacterBars();
    },
    AddItem:(Id, Type, Amount, enchant)=>AddInventoryItem(Id, Type, Amount, enchant),//Data.items.type[Type][Id]
    DeleteItem:(Key, Num, Amount, enchant)=>DeleteInventoryItem(Key, Num, Amount, enchant),//Inventory[Key][Num]
    //i= id, a=amount, e=enchant, div=item slot div(delete from save), event=item slot click function(delete from save)
    Inventory:{
        weapon:[{i:0,a:1},{i:1,a:5}],
        tool:[{i:0,a:1},{i:1,a:7},{i:2,a:1}],
        accessory:[{i:0,a:1},{i:1,a:7},{i:2,a:1},{i:3,a:1}],
        consumable:[{i:0,a:5}]
    },
    Equipped:{//t= type
        Armor:{
            "Main Hand":{},
            "Off Hand":{},
            "2Hand":{},
            "Head":{},
            "Chest":{},
            "Feet":{},
            "Hands":{},
            "Legs":{},
            "Accessory":[]
        },
        Tools:[],//only 1 per type (cant equip two pickaxes)
    }
}



function UpdateTime(){
    const string_minutes = (GameDate.Minute < 10) ? "0" + GameDate.Minute : GameDate.Minute
    const new_date = GameDate.Year + "/" + GameDate.Month + "/" + GameDate.Day + "&nbsp;&nbsp;" + GameDate.Hour + ":" + string_minutes;
    document.getElementById("current_date_time").innerHTML = new_date;
}

function GetTotalStats(){//add buffs here later
    let armor = Player.Equipped.Armor;
    let total_stats;
    try {
        total_stats = structuredClone(Player.Stats);
    }catch(error){
        total_stats = JSON.parse(JSON.stringify(Player.Stats));
    }

    function addstats(item){
        let item_stats = Data.items.type[item.t][item.i].stats;
        item_stats.forEach((stat)=>{ //itemstat= [[HP_Max,1],[Strength,1]]
            total_stats[stat[0]] = total_stats[stat[0]] + stat[1];
        });
        if (item.e){

        }
    }
    Object.keys(armor).slice(0,8).forEach((key)=>{
        let item = armor[key];
        if (item.i !== undefined){
            addstats(item);
        }
    });
    armor.Accessory.forEach((item)=>{
        addstats(item);
    });
    
    return total_stats;
}

function UpdateStats(){
    let stats = GetTotalStats();
    document.getElementById("stat_str").innerHTML = "Strength: " + stats.Strength;
    document.getElementById("stat_end").innerHTML = "Endurance: " + stats.Endurance;
    document.getElementById("stat_agi").innerHTML = "Agility: " + stats.Agility;
    document.getElementById("stat_def").innerHTML = "Defense: " + stats.Defense;
    document.getElementById("stat_int").innerHTML = "Intelligence: " + stats.Intelligence;
    document.getElementById("stat_wis").innerHTML = "Wisdom: " + stats.Wisdom;
    document.getElementById("stat_dex").innerHTML = "Dexterity: " + stats.Dexterity;
    document.getElementById("stat_res").innerHTML = "Resistance: " + stats.Resistance;
}
function UpdateCharacterBars(){
    let stats = GetTotalStats();
    function Trim(number){
        return ((number*100).toString().substring(0, 5)+"%");
    }
    document.getElementById("char_level").innerHTML = ("Level " + Player.Stats.Level);
    document.getElementById("char_exp").innerHTML = (Player.Stats.Exp + "/" + LevelExpReq[Player.Stats.Level]);
    document.getElementById("exp_bar").style.setProperty('width', Trim(Player.Stats.Exp/LevelExpReq[Player.Stats.Level]));

    document.getElementById("char_hp").innerHTML = (Player.Stats.HP + "/" + stats.HP_Max);
    document.getElementById("hp_bar").style.setProperty('width', Trim(Player.Stats.HP/stats.HP_Max));

    document.getElementById("char_stamina").innerHTML = (Player.Stats.Stam + "/" + stats.Stam_Max);
    document.getElementById("stamina_bar").style.setProperty('width', Trim(Player.Stats.Stam/stats.Stam_Max));

    document.getElementById("char_mp").innerHTML = (Player.Stats.MP + "/" + stats.MP_Max);
    document.getElementById("mana_bar").style.setProperty('width', Trim(Player.Stats.MP/stats.MP_Max));

    return;
}



function UpdateActionUI(){

}


let current_dialouge_options = [];//used to remove event listeners
function UpdateDialougeUI(){
    let Option_Holder = document.getElementById("game_dialouge_options_holder");
    //delete old options
    current_dialouge_options.forEach((option)=>{
        option.element.removeEventListener("click", option.eventfunction);
        option.element.remove();
    });
    current_dialouge_options = [];
    
    //create new options
    let current_location = Data.locations.Areas[Player.Current_Location];
    let dialouge_options = current_location.get_unlocked_options();
    function CreateDialougeOption(option_data){
        let option = document.createElement("div");
        option.innerHTML = option_data.text;
        option.setAttribute("class", "game_dialouge_option");
        option.setAttribute("id", "dialouge-" + Player.Current_Location + "-" + option_data.id);
        Option_Holder.appendChild(option);

        let eventfunction = function(){
            option_data.click(Player)
        }
        current_dialouge_options.push({"element":option,"eventfunction":eventfunction})
        option.addEventListener("click", eventfunction);
    }

    document.getElementById("game_dialouge_spoken").innerHTML = current_location.top_text;
    dialouge_options.forEach((option)=>{
        CreateDialougeOption(option);
    });
}


function UpdateEquipmentUI(){

    function updateslot(div, div_text, has_item){
        div.innerHTML = div_text;
        if (has_item){
            div.removeAttribute("style");
        }else{
            div.setAttribute("style","color: rgb(161, 161, 161);");
        }
    }

    let j = 1;
    for (; j < Player.Equipped.Tools.length+1; j++) {
        let div = document.getElementById("tool" + j)
        updateslot(div, Data.items.type[(Player.Equipped.Tools[j-1].t)][(Player.Equipped.Tools[j-1].i)].name, true)
    }
    for (; j < 11; j++){
        updateslot(document.getElementById("tool" + j), "no tool", false)
    }


    Object.keys(Player.Equipped.Armor).forEach((key)=>{
        let div = document.getElementById("eq_" + key.replace(" ","_"))
        let len = Object.keys(Player.Equipped.Armor[key]).length;
        if (key == "2Hand"){
            if (len > 0){
                //2Hand comes after Mainhand and offhand in the loop
                updateslot(document.getElementById("eq_Main_Hand"), Data.items.type[(Player.Equipped.Armor[key].t)][(Player.Equipped.Armor[key].i)].name, true);
                updateslot(document.getElementById("eq_Off_Hand"), "-", true);
            }
        }
        else if (key=="Accessory") {
            let i = 1;
            Player.Equipped.Armor[key].forEach((item)=>{
                updateslot(document.getElementById("eq_Acs"+(i)), Data.items.type[item.t][item.i].name, true);
                i++;
            });
            for (; i < 4; i++){
                updateslot(document.getElementById("eq_Acs"+(i)), "Accessory", false);
            }
        }
        else if (len > 0) {
            updateslot(div, Data.items.type[(Player.Equipped.Armor[key].t)][(Player.Equipped.Armor[key].i)].name, true)
        }else{
            updateslot(div, key, false)
        }
    });
    UpdateStats();
    UpdateCharacterBars();
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


function TrimInventoryData(){//for saving the data
    let Trimed_Inventory = {}
    Object.keys(Player.Inventory).forEach((Item_Type)=>{
        Trimed_Inventory[Item_Type] = [];
        Player.Inventory[Item_Type].forEach((Item)=>{
            let slot = {"i":Item.i,"a":Item.a};
            if (Item.e){
                slot["e"] = Item.e;
            }
            Trimed_Inventory[Item_Type].push(slot);
        });
    });
    return Trimed_Inventory
}

function DeleteInventoryItem(Key, Num, Amount){
    let Item = Player.Inventory[Key][Num]
    let newAmount = Amount ? ((Item.a-Amount)< 1 ? 0 : (Item.a-Amount)): 0
    if (newAmount===0){
        if (Item.event){
            Item.div.removeEventListener("click", Item.event);
            Item.div.remove();
        }
        Player.Inventory[Key].splice(Num,1)
    }
    else{
        Item.a = newAmount;
        Item.div.getElementsByClassName("inventory_slot_amount")[0].innerHTML = "x" + Item.a
    }
    document.getElementById("inventory_item_info").setAttribute("hidden","");
    Item_Currently_Viewing = null;
}

function CreateInventorySlot(Type, SlotId){
    let Item = Player.Inventory[Type][SlotId];

    Item.div = document.createElement("div");
    Item.div.innerHTML = Data.items.type[Type][Item.i].name + '<div class="inventory_slot_amount">x' + Item.a + '</div>'
    Item.div.setAttribute("class", "inventory_slot");
    document.getElementById("inventory_top").appendChild(Item.div);


    let Item_Info_Div = document.getElementById("inventory_item_info");
    let Item_click_spam_debounce = false;
    Item.event = function click_item(){
        if (!Item_click_spam_debounce){
            Item_click_spam_debounce = true;
            function change_info(){
                let ItemData = Data.items.type[Type][Item.i];
                document.getElementById("item_info_type").innerHTML = (ItemData.class ? ItemData.class : "") + (ItemData.slot ? "/" + ItemData.slot : "");
                document.getElementById("item_info_rarity").innerHTML = "Tier " + (ItemData.tier ? ItemData.tier : "0");
                document.getElementById("item_info_stats").innerHTML = ItemData.statdesc ? ItemData.statdesc : "";
                document.getElementById("item_info_description").innerHTML = ItemData.desc ? ItemData.desc : "";
                if (ItemData.usage){
                    document.getElementById("item_info_use").innerHTML = ItemData.usage;
                    document.getElementById("item_info_use").removeAttribute("hidden");
                }
                else{
                    document.getElementById("item_info_use").setAttribute("hidden","");
                }
            }
            
            if (Item_Info_Div.hasAttribute("hidden")){
                Item.div.after(Item_Info_Div)
                Item_Currently_Viewing = [Item, Type];
                change_info()
                Item_Info_Div.removeAttribute("hidden");
            }
            else if(Item_Currently_Viewing[0] === Item){
                Item_Info_Div.setAttribute("hidden","");
                Item_Currently_Viewing = null;
            }
            else{
                Item.div.after(Item_Info_Div)
                Item_Currently_Viewing = [Item, Type];
                change_info()
            }
            Item_click_spam_debounce = false;
        }
    }
    Item.div.addEventListener("click", Item.event);
}

function AddInventoryItem(Id, Type, amount, enchant){
    let ItemData = Data.items.type[Type][Id];
    let location = Player.Inventory[Type];
    if (!location){
        location = [];
    }
   if (location.every((item)=>{
        if (item.i === Id){
            item.a = item.a + 1
            item.div.getElementsByClassName("inventory_slot_amount")[0].innerHTML = "x" + item.a;
            return false;
        }
        return true;
    })){
        let NewItem = JSON.parse(JSON.stringify({i:ItemData.id,a:amount}));
        location.push(NewItem);
        let Slotnum = location.length - 1;
    
        CreateInventorySlot(Type, Slotnum);
    }
}

function UnEquipItem(slot, location_id){
    let armor = Player.Equipped.Armor;
    let tools = Player.Equipped.Tools;
    if (slot == "Tool"){
        AddInventoryItem(tools[location_id].i, tools[location_id].t, 1);
        tools.splice(location_id,1);
    }
    else if(slot == "Accessory"){
        AddInventoryItem(armor[slot][location_id].i, armor[slot][location_id].t, 1);
        armor[slot].splice(location_id,1);        
    }
    else{
        AddInventoryItem(armor[slot].i, armor[slot].t, 1);
        armor[slot] = {};
    }
    UpdateEquipmentUI();
}

function EquipItem(Type,SlotId){
    let Item = Item_Currently_Viewing[0];
    let Item_Data = Data.items.type[Type][Item.i];
    let slot = Item_Data.slot;
    let armor = Player.Equipped.Armor;
    let tools = Player.Equipped.Tools;
    //need too add stats
    let newitem = JSON.parse(JSON.stringify({i:Item_Data.id,t:Type}));
    if (slot == "Tool"){
        tools.every((item, location)=>{
            if (Data.items.type.tool[item.i].class == Item_Data.class){
                UnEquipItem(slot, location);
                return false
            }
            return true;
        });
        if (tools.length < 10){
            tools.push(newitem);
            DeleteInventoryItem(Type,SlotId,1);
        }else{
            console.log("too many tools equipped")
        }
    }
    else if (slot == "Accessory"){
        if(armor[slot].length > 2){
            UnEquipItem(slot,0);
        }
        armor[slot].push(newitem);
        DeleteInventoryItem(Type,SlotId,1);
    }
    else if (slot){
        if (armor[slot].i !== undefined){//item currently equipped
            UnEquipItem(slot);
        }
        armor[slot] = newitem;
        DeleteInventoryItem(Type,SlotId,1);
    }
    else{
        console.log("cant equip this item")
    }
    UpdateEquipmentUI();
}

function SetupInventoryItemInfo(){
    let debounce = false;
    function getslotid(){
        let slot = null;
        let inv = Player.Inventory[Item_Currently_Viewing[1]]
        inv.every((item, slotnum)=>{
            if (item === Item_Currently_Viewing[0]){
                slot = slotnum;
                return false;
            }
            return true;
        });
        return slot;
    }
    document.getElementById("item_info_use").addEventListener("click", function(){
        if (!debounce){
            debounce = true;
            let SlotId = getslotid();
            if (SlotId !== null){
                let item = Data.items.type[Item_Currently_Viewing[1]][Item_Currently_Viewing[0].i];
                if(item.usage === "Equip"){
                    EquipItem(Item_Currently_Viewing[1], SlotId);
                }
                else{
                    item.useitem(Player);
                }
            }
            else{
                console.log("failed to equip/use item");
            }          

            debounce = false;
        }
    });
    document.getElementById("item_info_sell").addEventListener("click", function(){
        if (!debounce){
            debounce = true;
            

            debounce = false;
        }
    });
    document.getElementById("item_info_delete").addEventListener("click", function(){
        if (!debounce){
            debounce = true;
            let SlotId = getslotid();
            if (SlotId !== null){
                DeleteInventoryItem(Item_Currently_Viewing[1], SlotId);
            }
            else{
                console.log("failed to delete item");
            }
            debounce = false;
        }
    });
}

function SetupCharacterEquipmentButtons(){
    let debounce = false;
    for (let i=1; i < 11; i++){
        document.getElementById("tool" + i).addEventListener("click", function(){
            if ((!debounce) && (Player.Equipped.Tools.length >= i)){
                debounce = true;
                UnEquipItem("Tool",(i-1));
                debounce = false;
            }
        });
    }
    Object.keys(Player.Equipped.Armor).forEach((key)=>{
        if ((key !== "2Hand")&& (key !== "Accessory")){
            document.getElementById("eq_" + key.replace(" ","_")).addEventListener("click", function(){
                if ((!debounce) && (Object.keys(Player.Equipped.Armor[key]).length > 0)){
                    debounce = true;
                    UnEquipItem(key);
                    debounce = false;
                }
            });
        }
    });
    for (let i=1; i < 4; i++){
        document.getElementById("eq_Acs" + i).addEventListener("click", function(){
            if ((!debounce) && (Player.Equipped.Armor.Accessory.length >= i)){
                debounce = true;
                UnEquipItem("Accessory",(i-1));
                debounce = false;
            }
        });
    }
}
let TimeSinceSaved = 0;

function Save_Game() {
    let savedata = {
        "GameDate":GameDate,
        "CharacterStats":Player.Stats,
        "Current_Location":Current_Location,
        "Current_Action":Current_Action,
        "Inventory":TrimInventoryData(),
        "Equipped":Player.Equipped
    }
    localStorage.setItem("test_data2", JSON.stringify(savedata));
    console.log("Game Saved");
    return 0; //used to set TimeSinceSaved
}


async function Game_Loop() {
    while (!Game_Paused){
        Increase_Time_Date(1);
        Data.actions[Player.Current_Action](Player);
        TimeSinceSaved = TimeSinceSaved >= 20 ? Save_Game() : TimeSinceSaved+1;
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}


function Load_Game() {
    let retrive_data = localStorage.getItem("test_data2");
    if (retrive_data) {
        retrive_data = JSON.parse(retrive_data);

        GameDate = retrive_data.GameDate;

        Player.Stats = retrive_data.CharacterStats;
        Current_Action = retrive_data.Current_Action;
        Current_Location = retrive_data.Current_Location;
        Player.Inventory = retrive_data.Inventory;
        Player.Equipped = retrive_data.Equipped;
    }
    Object.keys(Player.Inventory).forEach((Item_Type)=>{
        Player.Inventory[Item_Type].forEach((a, SlotId)=>{
            CreateInventorySlot(Item_Type, SlotId);
        });
    })

    UpdateTime();
    UpdateStats();
    UpdateCharacterBars();
    UpdateActionUI();
    UpdateDialougeUI();
    SetupInventoryItemInfo();
    SetupCharacterEquipmentButtons()
    UpdateEquipmentUI();
    Game_Loop();
}
window.addEventListener('load', Load_Game, {once:true})
