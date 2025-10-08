


export const items = {
    usage:{
        Eat:function(Player){
            //gain stats
            //remove 1 item
        }
    },
    type:{
        tool:[//all equipable tools go here
            {
                id:0,
                name:"old pickaxe",
                class:"Pickaxe",
                slot:"Tool",
                usage:"Equip",
                tier: 0
            },
            {
                id:1,
                name:"new pickaxe",
                class:"Pickaxe",
                slot:"Tool",
                usage:"Equip",
                tier: 1
            },
            {
                id:2,
                name:"old mat",
                class:"Bed",
                slot:"Tool",
                usage:"Equip",
                tier: 0,
                action_stats:[["HP",2],["MP",2],["Stam",2]]
            }
        ],
        bed:[
            {
                id:0,
                name:"ground",
                tier: 0,
                action_stats:[["HP",1],["MP",1],["Stam",1]]
            }
        ],
        accessory:[
            {
                id:0,
                name:"Magic Rock",
                slot:"Accessory",
                class:"Artifact",
                desc:"A Magic Rock",
                statdesc:"[MP+1]",
                usage:"Equip",
                tier: 0,
                stats:[["MP_Max",1]]
            },
            {
                id:1,
                name:"Wood Ring",
                slot:"Accessory",
                class:"Ring",
                desc:"A ring craved from wood",
                statdesc:"[Def+0.01]",
                usage:"Equip",
                tier: 0,
                stats:[["Defense",0.01]]
            },
            {
                id:2,
                name:"Goblin's Necklace",
                slot:"Accessory",
                class:"Necklace",
                desc:"The enchantment still holds",
                statdesc:"[Str+1]",
                usage:"Equip",
                tier: 0,
                stats:[["Strength",1]]
            },
            {
                id:3,
                name:"Swift Feather",
                slot:"Accessory",
                class:"Artifact",
                desc:"The feather seems to make you faster",
                statdesc:"[Agi+1][Dex+1]",
                usage:"Equip",
                tier: 0,
                stats:[["Agility",1],["Dexterity",1]]
            }
        ],
        weapon:[
            {
                id:0,
                name:"Wood Sword",
                slot:"Main Hand",
                class:"Sword",
                desc:"A sword made from low quality wood",
                statdesc:"[Str+1]",
                usage:"Equip",
                tier: 0,
                stats:[["Strength",1]]
            },
            {
                id:1,
                name:"Iron Sword",
                slot:"Main Hand",
                class:"Sword",
                desc:"A quality sword forged from iron",
                statdesc:"[Str+10]",
                usage:"Equip",
                tier: 1,
                stats:[["Strength",10]]
            }
        ],
        consumable:[
            {
                id:0,
                name:"Stale Bread",
                class:"food",
                tier: 0,
                usage:"Eat",
                useitem:(player)=>items.usage.Eat(player),
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
        player.Restore_Resource(action_info.action_stats);
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
                sleep:{item:items.type.tool[2]}
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