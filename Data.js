






export const items = {
    type:{
        tool:{
            bed:[
                {
                    id:0,
                    name:"ground",
                    gain:{stat:['HP','MP','Stam'],value:[2,2,2]}
                },
                {
                    id:1,
                    name:"old mat",
                    gain:{stat:['HP','MP','Stam'],value:[2,2,2]}
                }
            ]
        },
        weapon:[
            {
                id:0,
                name:"Wood Sword",
                slot:"MainHand"
            }
        ]
    }

}
export const actions = {
    nothing:function(player){
        //do nothing
        console.log("doing nothing");
    },
    sleep:function(player){//sleep from location menu
        let location_name = player.Current_location;
        let action_info = locations.Areas[location_name].actions.sleep.item;
        player.Restore_Resource(action_info.stat,action_info.value);
    },
    rest:function(player){//sleep from action menu

    },
    run:function(player){

    }

}

export const locations = {
    MoveTo:function(player, location, action){
        //disable current action
        player.Current_Location = location;
        player.Current_Action = action ? action : 'nothing';
    },
    EnterCombat:function(){

    },
    OpenShop:function(){

    },
    Areas:{
        "spawn_starting_building":{
            top_text:"Unknown: Oh! you finally woke up.",
            get_unlocked_options:function(){
                //use later for locked options
                return this.options
            },
            options:[
                {
                    text:'<span style="color: red;">[Area]</span> Leave the building',
                    id:0,
                    click:(player) => locations.MoveTo(player,"spawn_outdoors")
                },
                {
                    text:'<span style="color: green;">[Action]</span> Rest',
                    id:1,
                    click:(player) => locations.MoveTo(player,"spawn_starting_building_bed", "sleep")
                }

            ]
        },
        "spawn_starting_building_bed":{
            top_text:"You are Resting",
            get_unlocked_options:function(){
                return this.options
            },
            actions:{
                sleep:{item:items.type.tool.bed[1]}
            },
            options:[
                {
                    text:'<span style="color: green;">[Action]</span> Get up',
                    id:0,
                    click:(player) => locations.MoveTo(player,"spawn_starting_building")
                }

            ]
        },
        "spawn_outdoors":{
            top_text:"You can see a large mountain, there are a few buildings, and a large wall connecting to the mountain",
            get_unlocked_options:function(){
                return this.options
            },
            options:[
                {
                    text:'<span style="color: red;">[Area]</span> Enter the building',
                    id:0,
                    click:(player) => locations.MoveTo(player,"spawn_starting_building")
                }
            ]            
        }
    }
}