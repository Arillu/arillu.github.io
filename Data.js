


export const items = {
    type:{
        tool:[
            

        ],
        bed:[
            {
                id:0,
                name:"ground",
                tier: 0,
                stats:[["HP",1],["MP",1],["Stam",1]]
            },
            {
                id:1,
                name:"old mat",
                class:"tool",
                tier: 0,
                stats:[["HP",2],["MP",2],["Stam",2]]
            }
        ],
        weapon:[
            {
                id:0,
                name:"Wood Sword",
                slot:"Main Hand",
                class:"Sword",
                desc:"A sword made from low quality wood",
                statdesc:"Strength +1",
                usage:"equip",
                tier: 0,
                stats:[["Strength",1]]
            }
        ],
        consumable:[
            {
                id:0,
                name:"Stale Bread",
                class:"food",
                tier: 0,
                usage:"Eat",
                buffs:[["Food",150]],
                stats:[]
            }
        ]
    }

}
export const actions = {
    nothing:function(player){
        //do nothing
    },
    sleep:function(player,a){//sleep from location menu
        let location_name = player.Current_Location;
        let action_info = locations.Areas[location_name].actions.sleep.item;
        player.Restore_Resource(action_info.stats);
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
                sleep:{item:items.type.bed[1]}
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